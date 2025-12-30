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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
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
