/**
 * AppointmentsPage
 * Main page for managing appointments
 */

import { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  AppointmentList,
  CreateAppointmentDialog,
  RescheduleDialog,
  CancelConfirmationDialog,
  useAppointments,
} from '../features/appointments';
import type { Appointment } from '../features/appointments';
import { RESPONSIVE_PATTERNS } from '../styles/responsive';

const AppointmentsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Fetch appointments
  const { data: appointments = [], isLoading, error } = useAppointments();

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDialogOpen(true);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCloseReschedule = () => {
    setRescheduleDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseCancel = () => {
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box 
        sx={{
          ...RESPONSIVE_PATTERNS.headerLayout,
        }}
      >
        <Typography 
          variant="h4"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minHeight: { xs: 44, md: 40 },
          }}
        >
          New Appointment
        </Button>
      </Box>

      {/* Appointment List */}
      <AppointmentList
        appointments={appointments}
        isLoading={isLoading}
        error={error}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />

      {/* Create Dialog */}
      <CreateAppointmentDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      {/* Reschedule Dialog */}
      <RescheduleDialog
        key={selectedAppointment?.id || 'no-appointment'}
        open={rescheduleDialogOpen}
        appointment={selectedAppointment}
        onClose={handleCloseReschedule}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmationDialog
        open={cancelDialogOpen}
        appointment={selectedAppointment}
        onClose={handleCloseCancel}
      />
    </Box>
  );
};

export default AppointmentsPage;
