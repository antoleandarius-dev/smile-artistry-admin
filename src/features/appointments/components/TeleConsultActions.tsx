/**
 * TeleConsultActions Component
 * Handles Start and Join tele-consultation actions
 */

import { useState } from 'react';
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
import type { Appointment } from '../types';
import { useStartTeleSession, useJoinTeleSession } from '../hooks';
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
  const { showToast, open, toast, handleClose } = useToast();

  const startSessionMutation = useStartTeleSession();
  const joinSessionMutation = useJoinTeleSession();

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
      
      // Construct join URL from Zoom session data
      const { session, join_token } = response;
      
      if (!session || !join_token) {
        throw new Error('Invalid session response from server');
      }

      // Construct the Zoom join URL with the token
      // Format: https://your-domain.zoom.us/wc/join/MEETING_ID?t=TOKEN
      const joinUrl = `https://zoom.us/wc/join/${encodeURIComponent(session.meeting_id)}?pwd=${encodeURIComponent(join_token.token)}`;

      console.log('Opening tele session URL:', joinUrl);

      setSessionStarted(true);
      onSessionStarted?.(joinUrl);
      showToast('Consultation session started successfully', 'success');
      
      // Open session in new tab/window with error handling
      const newWindow = window.open(joinUrl, '_blank', 'width=1280,height=720');
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
      // Assuming session_id is stored or can be derived from appointment
      // For now, we'll pass the appointment_id as session_id
      // Backend should handle the mapping
      const response = await joinSessionMutation.mutateAsync(appointment.id);
      
      // Construct join URL from Zoom session data
      const { session, join_token } = response;
      
      if (!session || !join_token) {
        throw new Error('Invalid session response from server');
      }

      // Construct the Zoom join URL with the token
      const joinUrl = `https://zoom.us/wc/join/${encodeURIComponent(session.meeting_id)}?pwd=${encodeURIComponent(join_token.token)}`;

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

  const isLoading = startSessionMutation.isPending || joinSessionMutation.isPending;

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
