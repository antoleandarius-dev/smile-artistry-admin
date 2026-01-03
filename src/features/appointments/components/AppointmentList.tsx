/**
 * AppointmentList Component
 * Displays appointments in a table with filtering and actions
 */

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import type { Appointment, AppointmentType, AppointmentStatus } from '../types';
import { useUsers } from '../hooks';
import TeleConsultActions from './TeleConsultActions';
import SessionStatus from './SessionStatus';
import { format, parseISO } from 'date-fns';
import { usePatients } from '../../patients';
import { useDoctors } from '../../doctors';

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

// Helper to format date and time
const formatDateTime = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return {
      date: format(date, 'MMM dd, yyyy'),
      time: format(date, 'hh:mm a'),
    };
  } catch {
    return { date: dateString, time: '' };
  }
};

// Helper to get status chip color
const getStatusColor = (status: AppointmentStatus): 'default' | 'success' | 'error' | 'warning' | 'info' => {
  switch (status) {
    case 'scheduled':
      return 'info';
    case 'in_call':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

// Helper to get status display label
const getStatusLabel = (status: AppointmentStatus): string => {
  switch (status) {
    case 'scheduled':
      return 'Scheduled';
    case 'in_call':
      return 'In Call';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

// Helper to get appointment type badge
const getAppointmentTypeBadge = (type: AppointmentType) => {
  if (type === 'tele') {
    return (
      <Chip
        icon={<VideoCallIcon />}
        label="Tele-Consult"
        size="small"
        color="primary"
        variant="outlined"
      />
    );
  }
  return (
    <Chip
      label="In-Person"
      size="small"
      variant="outlined"
    />
  );
};

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  isLoading,
  error,
  onReschedule,
  onCancel,
}) => {
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const { data: users = [], isLoading: usersLoading } = useUsers();

  // Create lookup maps for efficient name resolution
  const patientMap = useMemo(() => {
    return new Map(patients.map(p => [p.id, p.name]));
  }, [patients]);

  const doctorUserMap = useMemo(() => {
    return new Map(doctors.map(d => [d.id, d.user_id]));
  }, [doctors]);

  const userMap = useMemo(() => {
    return new Map(users.map(u => [u.id, u.name]));
  }, [users]);

  const getDoctorName = (doctorId: number): string => {
    const userId = doctorUserMap.get(doctorId);
    if (userId) {
      return userMap.get(userId) || `Doctor #${doctorId}`;
    }
    return `Doctor #${doctorId}`;
  };

  const loading = isLoading || patientsLoading || doctorsLoading || usersLoading;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load appointments: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Table */}
      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No appointments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create your first appointment to get started
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Session Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.scheduled_at);
                const canModify = appointment.status === 'scheduled';

                return (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      {patientMap.get(appointment.patient_id) || `Patient #${appointment.patient_id}`}
                    </TableCell>
                    <TableCell>
                      {getDoctorName(appointment.doctor_id)}
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell>
                      {getAppointmentTypeBadge(appointment.appointment_type)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(appointment.status)}
                        size="small"
                        color={getStatusColor(appointment.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <SessionStatus appointment={appointment} />
                    </TableCell>
                    <TableCell align="right">
                      {/* Tele-consult actions for tele appointments */}
                      {appointment.appointment_type === 'tele' && (
                        <Box sx={{ mb: 1 }}>
                          <TeleConsultActions appointment={appointment} />
                        </Box>
                      )}
                      {/* Standard appointment actions */}
                      <Box>
                        <Tooltip title={canModify ? "Reschedule" : "Cannot reschedule"}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onReschedule(appointment)}
                              disabled={!canModify}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={canModify ? "Cancel appointment" : "Cannot cancel"}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onCancel(appointment)}
                              disabled={!canModify}
                              color="error"
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AppointmentList;
