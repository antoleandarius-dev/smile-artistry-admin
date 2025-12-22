/**
 * AppointmentList Component
 * Displays appointments in a table with filtering and actions
 */

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
  TextField,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import type { Appointment, AppointmentType, AppointmentStatus } from '../types';
import { format, parseISO } from 'date-fns';

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onDateFilterChange: (date: string) => void;
  dateFilter: string;
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
const getStatusColor = (status: AppointmentStatus): 'default' | 'success' | 'error' | 'warning' => {
  switch (status) {
    case 'scheduled':
      return 'default';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'no-show':
      return 'warning';
    default:
      return 'default';
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
      label="In-Clinic"
      size="small"
      variant="outlined"
    />
  );
};

// Helper to get tele session status badge
const getTeleSessionBadge = (appointment: Appointment) => {
  if (appointment.appointment_type !== 'tele' || !appointment.tele_session) {
    return null;
  }

  const { status } = appointment.tele_session;
  let color: 'default' | 'success' | 'info' = 'default';
  
  switch (status) {
    case 'pending':
      color = 'default';
      break;
    case 'active':
      color = 'success';
      break;
    case 'completed':
      color = 'info';
      break;
  }

  return (
    <Chip
      label={`Session: ${status}`}
      size="small"
      color={color}
      sx={{ ml: 1 }}
    />
  );
};

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  isLoading,
  error,
  onReschedule,
  onCancel,
  onDateFilterChange,
  dateFilter,
}) => {
  if (isLoading) {
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
      {/* Date Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Filter by Date"
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* Table */}
      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No appointments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {dateFilter ? 'Try adjusting your filter or create a new appointment' : 'Create your first appointment to get started'}
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.appointment_date);
                const canModify = appointment.status === 'scheduled';

                return (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      {appointment.patient?.name || `Patient #${appointment.patient_id}`}
                    </TableCell>
                    <TableCell>
                      {appointment.doctor?.name || `Doctor #${appointment.doctor_id}`}
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getAppointmentTypeBadge(appointment.appointment_type)}
                        {getTeleSessionBadge(appointment)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        size="small"
                        color={getStatusColor(appointment.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
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
