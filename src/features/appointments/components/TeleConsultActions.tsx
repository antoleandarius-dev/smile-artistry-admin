/**
 * TeleConsultActions Component
 * Handles Start, Join, and Check Status tele-consultation actions
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import { VideoCall as VideoCallIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import { useMutation } from '@tanstack/react-query';
import type { Appointment, TeleSessionJoinToken } from '../types';
import { useStartTeleSession, useJoinTeleSession, useTeleSessionByAppointment } from '../hooks';
import { getUserData } from '../../../shared/utils/auth';
import { useToast } from '../../../shared/hooks/useToast';
import { teleSessionsService } from '../../../api/tele-sessions.service';

interface TeleConsultActionsProps {
  appointment: Appointment;
  onSessionStarted?: (joinUrl: string) => void;
  onError?: (error: string) => void;
}

const TeleConsultActions: React.FC<TeleConsultActionsProps> = ({
  appointment,
  onSessionStarted,
  onError,
}) => {
  const userData = getUserData();
  const [error, setError] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showConfirmStartDialog, setShowConfirmStartDialog] = useState(false);
  const { showToast, open, toast, handleClose } = useToast();

  const startSessionMutation = useStartTeleSession();
  const joinSessionMutation = useJoinTeleSession();
  
  // Fetch tele session for this appointment to check if one already exists
  const { data: existingSession, isLoading: isCheckingSession, refetch: refetchSession } = useTeleSessionByAppointment(
    appointment.id
  );

  // Mutation for checking status
  const checkStatusMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error('No session to check');
      return await teleSessionsService.checkSessionStatus(sessionId);
    },
    onSuccess: () => {
      showToast('Status checked successfully!', 'success');
      // Refetch session data to update UI
      refetchSession();
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check status';
      showToast(errorMessage, 'error');
    },
  });

  // Update session state when fetching existing session data
  // Must be called before early returns to follow React Hook rules
  useEffect(() => {
    if (existingSession) {
      setSessionId(existingSession.id);
      // Consider session as "started" if it exists and is not pending
      setSessionStarted(existingSession.status !== 'pending');
    }
  }, [existingSession]);

  const userRole = userData?.role || '';
  const isDoctor = userRole === 'doctor' || userRole === 'admin';

  // Check if appointment is tele-type
  if (appointment.appointment_type !== 'tele') {
    return null;
  }

  // Check if appointment status allows tele-consult actions
  if (appointment.status === 'cancelled' || appointment.status === 'completed') {
    return null;
  }

  const handleStartConsultation = async () => {
    try {
      setError(null);
      const response = await startSessionMutation.mutateAsync({
        appointment_id: appointment.id,
      });
      
      console.log('Start session response:', response);
      
      // Get the start_url from the backend response
      const { start_url } = response;
      
      if (!start_url) {
        throw new Error('No start URL provided - unable to initialize consultation');
      }

      console.log('Opening tele session URL:', start_url);

      setSessionStarted(true);
      onSessionStarted?.(start_url);
      showToast('Consultation session started successfully', 'success');
      
      // Open session in new tab/window with error handling
      // The start_url is a Zoom-signed URL that identifies the doctor as the host
      const newWindow = window.open(start_url, '_blank', 'width=1280,height=720');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        showToast('Unable to open session window. Please check browser popup settings.', 'warning');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start consultation';
      setError(errorMessage);
      onError?.(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const handleConfirmStartConsultation = () => {
    setShowConfirmStartDialog(false);
    handleStartConsultation();
  };

  const handleJoinConsultation = async () => {
    try {
      setError(null);
      
      // If we have an existing session ID, use it; otherwise use appointment ID
      const idToUse = sessionId || appointment.id;
      const joinToken: TeleSessionJoinToken = await joinSessionMutation.mutateAsync(idToUse);
      
      if (!joinToken.token || !joinToken.meeting_id) {
        throw new Error('Invalid session response from server');
      }

      // Construct the Zoom join URL with the token
      const joinUrl = `https://zoom.us/wc/join/${encodeURIComponent(joinToken.meeting_id)}?pwd=${encodeURIComponent(joinToken.token)}`;

      console.log('Opening tele session URL:', joinUrl);

      onSessionStarted?.(joinUrl);
      showToast('Joining consultation session', 'info');
      
      // Open session in new tab/window with error handling
      const newWindow = window.open(joinUrl, '_blank', 'width=1280,height=720');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        showToast('Unable to open session window. Please check browser popup settings.', 'warning');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to join consultation';
      setError(errorMessage);
      onError?.(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const isLoading = startSessionMutation.isPending || joinSessionMutation.isPending || isCheckingSession || checkStatusMutation.isPending;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {/* Start Consultation button (for doctor/admin) */}
        {isDoctor && !sessionStarted && (
          <Tooltip title="Start tele-consultation session">
            <span>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<VideoCallIcon />}
                onClick={() => setShowConfirmStartDialog(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 0.5 }} />
                    Starting...
                  </>
                ) : (
                  'Start Consultation'
                )}
              </Button>
            </span>
          </Tooltip>
        )}

        {/* Join Consultation button (if session exists) */}
        {sessionStarted && (
          <Tooltip title="Join tele-consultation session">
            <span>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<VideoCallIcon />}
                onClick={handleJoinConsultation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 0.5 }} />
                    Joining...
                  </>
                ) : (
                  'Join Consultation'
                )}
              </Button>
            </span>
          </Tooltip>
        )}

        {/* Check Status button (for admin, if session exists) */}
        {isDoctor && sessionStarted && (
          <Tooltip title="Check Zoom meeting status and update if ended">
            <span>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={checkStatusMutation.isPending ? <CircularProgress size={16} /> : <RefreshIcon />}
                onClick={() => checkStatusMutation.mutate()}
                disabled={isLoading}
              >
                {checkStatusMutation.isPending ? 'Checking...' : 'Check Status'}
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>
      
      {/* Confirmation Dialog for Starting Consultation */}
      {showConfirmStartDialog && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '16px',
          }}
          onClick={() => setShowConfirmStartDialog(false)}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              maxWidth: '500px',
              width: '100%',
              animation: 'slideUp 0.3s ease',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <Box sx={{ fontSize: '18px', fontWeight: 600, color: '#333' }}>
                Start Consultation?
              </Box>
              <Button
                onClick={() => setShowConfirmStartDialog(false)}
                sx={{
                  minWidth: 'auto',
                  padding: '0',
                  color: '#999',
                  '&:hover': { backgroundColor: '#f5f5f5', color: '#333' },
                }}
              >
                ✕
              </Button>
            </Box>

            {/* Body */}
            <Box sx={{ padding: '20px' }}>
              <Box sx={{ fontSize: '14px', fontWeight: 500, color: '#555', marginBottom: '12px' }}>
                Before starting the consultation, please ensure:
              </Box>
              <Box component="ul" sx={{ margin: '8px 0 0 0', paddingLeft: '20px', listStyle: 'none' }}>
                {[
                  'Your camera and microphone are working properly',
                  'You have a stable internet connection',
                  'You are in a private location suitable for patient consultation',
                  'You have appropriate lighting for the video call',
                  'Your patient has been informed about the consultation timing',
                ].map((item, idx) => (
                  <Box
                    component="li"
                    key={idx}
                    sx={{
                      fontSize: '13px',
                      color: '#666',
                      lineHeight: '1.6',
                      margin: '6px 0',
                      position: 'relative',
                      paddingLeft: '20px',
                      '&:before': {
                        content: '"✓"',
                        position: 'absolute',
                        left: '0',
                        color: '#1976d2',
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                padding: '16px 20px',
                borderTop: '1px solid #e0e0e0',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                onClick={() => setShowConfirmStartDialog(false)}
                variant="outlined"
                sx={{
                  color: '#333',
                  borderColor: '#d0d0d0',
                  '&:hover': { backgroundColor: '#e0e0e0', borderColor: '#999' },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmStartConsultation}
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Consultation'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <Snackbar
        open={open}
        autoHideDuration={toast.duration || 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleClose}
          severity={toast.severity || 'info'}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default TeleConsultActions;
