/**
 * PatientDetail
 * Displays detailed information about a patient with appointments
 */

import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { PatientAppointment } from '../types';
import { usePatient } from '../hooks';

interface PatientDetailProps {
  patientId: number | null;
  onClose: () => void;
}

const PatientDetail = ({ patientId, onClose }: PatientDetailProps) => {
  const { data: patient, isLoading, error } = usePatient(patientId);

  if (!patientId) return null;

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error || !patient) {
    return (
      <Alert severity="error">
        Failed to load patient details: {error?.message || 'Patient not found'}
      </Alert>
    );
  }

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'error' => {
    const statusMap: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
      scheduled: 'primary',
      in_call: 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return statusMap[status] || 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      {/* Header with Close Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Patient Details</Typography>
        <Button
          size="small"
          onClick={onClose}
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
      </Box>

      {/* Patient Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Name
            </Typography>
            <Typography variant="h6">{patient.name}</Typography>
          </Box>

          {patient.phone && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="h6">{patient.phone}</Typography>
            </Box>
          )}

          {patient.email && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body2">{patient.email}</Typography>
            </Box>
          )}

          {patient.gender && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body2">
                {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
              </Typography>
            </Box>
          )}

          {patient.date_of_birth && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body2">{formatDate(patient.date_of_birth)}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="overline" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="body2">{formatDate(patient.created_at)}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Appointments Section */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Appointments ({patient.appointments?.length || 0})
        </Typography>

        {!patient.appointments || patient.appointments.length === 0 ? (
          <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            No appointments recorded
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {patient.appointments.map((appointment: PatientAppointment) => (
              <Card key={appointment.id}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {appointment.appointment_type === 'in_person'
                          ? 'In-Person Appointment'
                          : 'Telehealth'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {formatDateTime(appointment.scheduled_at)}
                      </Typography>
                    </Box>
                    <Chip
                      label={appointment.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="caption" color="text.secondary">
        Last updated: {formatDateTime(patient.updated_at)}
      </Typography>
    </Box>
  );
};

export default PatientDetail;
