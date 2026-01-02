/**
 * SessionStatus Component
 * Displays tele-consultation session state
 */

import { Chip, Box } from '@mui/material';
import { VideoCall as VideoCallIcon } from '@mui/icons-material';
import type { Appointment } from '../types';

interface SessionStatusProps {
  appointment: Appointment;
}

const SessionStatus: React.FC<SessionStatusProps> = ({ appointment }) => {
  // Only show for tele appointments
  if (appointment.appointment_type !== 'tele') {
    return null;
  }

  // Determine session status based on appointment status
  let sessionStatus = 'Not Started';
  let color: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' = 'default';

  if (appointment.status === 'scheduled') {
    sessionStatus = 'Not Started';
    color = 'default';
  } else if (appointment.status === 'in_call') {
    sessionStatus = 'In Progress';
    color = 'warning';
  } else if (appointment.status === 'completed') {
    sessionStatus = 'Completed';
    color = 'success';
  } else if (appointment.status === 'cancelled') {
    sessionStatus = 'Cancelled';
    color = 'error';
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <VideoCallIcon fontSize="small" />
      <Chip
        label={sessionStatus}
        size="small"
        color={color}
        variant="outlined"
      />
    </Box>
  );
};

export default SessionStatus;
