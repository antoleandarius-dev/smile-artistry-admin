/**
 * RescheduleDialog Component
 * Dialog for rescheduling an existing appointment
 */

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useRescheduleAppointment } from '../hooks';
import type { Appointment } from '../types';
import { format, parseISO } from 'date-fns';

interface RescheduleDialogProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
  open,
  appointment,
  onClose,
}) => {
  // Parse initial date/time from appointment
  const initialDateTime = useMemo(() => {
    if (!appointment) return { date: '', time: '' };
    try {
      const appointmentDate = parseISO(appointment.appointment_date);
      return {
        date: format(appointmentDate, 'yyyy-MM-dd'),
        time: format(appointmentDate, 'HH:mm'),
      };
    } catch (error) {
      console.error('Error parsing appointment date:', error);
      return { date: '', time: '' };
    }
  }, [appointment]);

  const [newDate, setNewDate] = useState(initialDateTime.date);
  const [newTime, setNewTime] = useState(initialDateTime.time);

  const rescheduleMutation = useRescheduleAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointment) return;

    // Combine date and time into ISO string
    const newDateTime = `${newDate}T${newTime}:00`;

    try {
      await rescheduleMutation.mutateAsync({
        id: appointment.id,
        data: { appointment_date: newDateTime },
      });

      // Reset and close
      setNewDate('');
      setNewTime('');
      onClose();
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
    }
  };

  const handleClose = () => {
    if (!rescheduleMutation.isPending) {
      setNewDate('');
      setNewTime('');
      rescheduleMutation.reset();
      onClose();
    }
  };

  const isFormValid = newDate && newTime;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {rescheduleMutation.isError && (
              <Alert severity="error">
                Failed to reschedule appointment. Please try again.
              </Alert>
            )}

            {appointment && (
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Patient: <strong>{appointment.patient?.name || `#${appointment.patient_id}`}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Doctor: <strong>{appointment.doctor?.name || `#${appointment.doctor_id}`}</strong>
                </Typography>
              </Box>
            )}

            {/* New Date */}
            <TextField
              type="date"
              label="New Appointment Date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0], // Prevent past dates
              }}
            />

            {/* New Time */}
            <TextField
              type="time"
              label="New Appointment Time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={rescheduleMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || rescheduleMutation.isPending}
            startIcon={rescheduleMutation.isPending ? <CircularProgress size={16} /> : null}
          >
            {rescheduleMutation.isPending ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RescheduleDialog;
