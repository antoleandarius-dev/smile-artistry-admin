/**
 * TeleConsultActions Component
 * Handles Start and Join tele-consultation actions
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
import { VideoCall as VideoCallIcon } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import type { Appointment, TeleSessionJoinToken } from '../types';
import { useStartTeleSession, useJoinTeleSession, useTeleSessionByAppointment } from '../hooks';
import { getUserData } from '../../../shared/utils/auth';
import { useToast } from '../../../shared/hooks/useToast';

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
  const { showToast, open, toast, handleClose } = useToast();

  const startSessionMutation = useStartTeleSession();
  const joinSessionMutation = useJoinTeleSession();
  
  // Fetch tele session for this appointment to check if one already exists
  const { data: existingSession, isLoading: isCheckingSession } = useTeleSessionByAppointment(
    appointment.id
  );

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
      const { start_url, session } = response;
      
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

  const isLoading = startSessionMutation.isPending || joinSessionMutation.isPending || isCheckingSession;

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
                onClick={handleStartConsultation}
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
      </Box>
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
