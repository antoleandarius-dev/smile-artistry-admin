/**
 * CancelConfirmationDialog Component
 * Confirmation dialog for canceling an appointment
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { useCancelAppointment } from '../hooks';
import type { Appointment } from '../types';
import { format, parseISO } from 'date-fns';

interface CancelConfirmationDialogProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

const CancelConfirmationDialog: React.FC<CancelConfirmationDialogProps> = ({
  open,
  appointment,
  onClose,
}) => {
  const cancelMutation = useCancelAppointment();

  const handleConfirm = async () => {
    if (!appointment) return;

    try {
      await cancelMutation.mutateAsync(appointment.id);
      onClose();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const handleClose = () => {
    if (!cancelMutation.isPending) {
      cancelMutation.reset();
      onClose();
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMMM dd, yyyy \'at\' hh:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cancel Appointment</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cancelMutation.isError && (
            <Alert severity="error">
              Failed to cancel appointment. Please try again.
            </Alert>
          )}

          <Typography variant="body1">
            Are you sure you want to cancel this appointment?
          </Typography>

          {appointment && (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Patient ID:</strong> {appointment.patient_id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Doctor ID:</strong> {appointment.doctor_id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Date & Time:</strong> {formatDateTime(appointment.scheduled_at)}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {appointment.appointment_type === 'tele' ? 'Tele-Consult' : 'In-Person'}
              </Typography>
            </Box>
          )}

          <Alert severity="warning">
            This action cannot be undone. The appointment status will be changed to "cancelled".
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={cancelMutation.isPending}>
          Keep Appointment
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={cancelMutation.isPending}
          startIcon={cancelMutation.isPending ? <CircularProgress size={16} /> : null}
        >
          {cancelMutation.isPending ? 'Canceling...' : 'Cancel Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelConfirmationDialog;
