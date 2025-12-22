/**
 * CreateAppointmentDialog Component
 * Dialog for creating a new appointment
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCreateAppointment, usePatients, useDoctors } from '../hooks';
import type { AppointmentType } from '../types';

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'in-clinic' as AppointmentType,
    notes: '',
  });

  const createMutation = useCreateAppointment();
  const { data: patients, isLoading: loadingPatients } = usePatients();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time into ISO string
    const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;

    try {
      await createMutation.mutateAsync({
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        appointment_date: appointmentDateTime,
        appointment_type: formData.appointment_type,
        notes: formData.notes || undefined,
      });

      // Reset form and close dialog
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        appointment_type: 'in-clinic',
        notes: '',
      });
      onClose();
    } catch (error) {
      // Error is handled by mutation
      console.error('Failed to create appointment:', error);
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        appointment_type: 'in-clinic',
        notes: '',
      });
      createMutation.reset();
      onClose();
    }
  };

  const isFormValid =
    formData.patient_id &&
    formData.doctor_id &&
    formData.appointment_date &&
    formData.appointment_time;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {createMutation.isError && (
              <Alert severity="error">
                Failed to create appointment. Please try again.
              </Alert>
            )}

            {/* Patient Selection */}
            <TextField
              select
              label="Patient"
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
              required
              disabled={loadingPatients}
              helperText={loadingPatients ? 'Loading patients...' : ''}
            >
              {patients?.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name} {patient.email && `(${patient.email})`}
                </MenuItem>
              ))}
            </TextField>

            {/* Doctor Selection */}
            <TextField
              select
              label="Doctor"
              value={formData.doctor_id}
              onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
              required
              disabled={loadingDoctors}
              helperText={loadingDoctors ? 'Loading doctors...' : ''}
            >
              {doctors?.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                  {doctor.specialization && ` - ${doctor.specialization}`}
                </MenuItem>
              ))}
            </TextField>

            {/* Date */}
            <TextField
              type="date"
              label="Appointment Date"
              value={formData.appointment_date}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0], // Prevent past dates
              }}
            />

            {/* Time */}
            <TextField
              type="time"
              label="Appointment Time"
              value={formData.appointment_time}
              onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />

            {/* Appointment Type */}
            <TextField
              select
              label="Appointment Type"
              value={formData.appointment_type}
              onChange={(e) =>
                setFormData({ ...formData, appointment_type: e.target.value as AppointmentType })
              }
              required
            >
              <MenuItem value="in-clinic">In-Clinic</MenuItem>
              <MenuItem value="tele">Tele-Consult</MenuItem>
            </TextField>

            {/* Notes */}
            <TextField
              label="Notes (Optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || createMutation.isPending}
            startIcon={createMutation.isPending ? <CircularProgress size={16} /> : null}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Appointment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
