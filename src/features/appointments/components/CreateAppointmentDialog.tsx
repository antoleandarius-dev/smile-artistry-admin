/**
 * CreateAppointmentDialog Component
 * Dialog for creating a new appointment
 */

import { useState, useMemo } from 'react';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useCreateAppointment, useUsers } from '../hooks';
import type { AppointmentType } from '../types';
import { usePatients } from '../../patients';
import { useDoctors } from '../../doctors';
import { RESPONSIVE_PATTERNS } from '../../../styles/responsive';

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    branch_id: '1', // Default branch - in real app would come from user context
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'in_person' as AppointmentType,
  });

  const createMutation = useCreateAppointment();
  const { data: patients, isLoading: loadingPatients } = usePatients();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { data: users, isLoading: loadingUsers } = useUsers();

  // Create lookup map for doctor names
  const doctorUserMap = useMemo(() => {
    return new Map(doctors?.map(d => [d.id, d.user_id]) || []);
  }, [doctors]);

  const userMap = useMemo(() => {
    return new Map(users?.map(u => [u.id, u.name]) || []);
  }, [users]);

  const getDoctorName = (doctorId: number): string => {
    const userId = doctorUserMap.get(doctorId);
    if (userId) {
      return userMap.get(userId) || `Doctor #${doctorId}`;
    }
    return `Doctor #${doctorId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time into ISO string
    const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;

    try {
      await createMutation.mutateAsync({
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        branch_id: Number(formData.branch_id),
        appointment_type: formData.appointment_type,
        scheduled_at: appointmentDateTime,
      });

      // Reset form and close dialog
      setFormData({
        patient_id: '',
        doctor_id: '',
        branch_id: '1',
        appointment_date: '',
        appointment_time: '',
        appointment_type: 'in_person',
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
        branch_id: '1',
        appointment_date: '',
        appointment_time: '',
        appointment_type: 'in_person',
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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth={isSmallScreen ? 'xs' : 'sm'}
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: '100%' },
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Create New Appointment</DialogTitle>
        <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: 1.5 }}>
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
                  {patient.name}
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
              disabled={loadingDoctors || loadingUsers}
              helperText={loadingDoctors || loadingUsers ? 'Loading doctors...' : ''}
            >
              {doctors?.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {getDoctorName(doctor.id)}
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
              <MenuItem value="in_person">In-Person</MenuItem>
              <MenuItem value="tele">Tele-Consult</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 } }}>
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
