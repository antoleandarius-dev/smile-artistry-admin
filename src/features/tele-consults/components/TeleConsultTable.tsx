import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import type { TeleSessionAdminResponse } from '../../../api/tele-sessions.service';

interface TeleConsultTableProps {
  sessions: TeleSessionAdminResponse[];
  isLoading?: boolean;
  onViewDetails?: (session: TeleSessionAdminResponse) => void;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const getStatusColor = (status: string) => {
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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const TeleConsultTable: React.FC<TeleConsultTableProps> = ({
  sessions,
  isLoading = false,
  onViewDetails,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Appointment ID</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>Duration (mins)</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                No tele-consultation sessions found
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((session) => (
              <TableRow key={session.id} hover>
                <TableCell>#{session.appointment_id}</TableCell>
                <TableCell>{session.doctor_name}</TableCell>
                <TableCell>{session.patient_name}</TableCell>
                <TableCell>{session.branch_name}</TableCell>
                <TableCell>
                  <Chip
                    label={session.status.replace('_', ' ').toUpperCase()}
                    size="small"
                    color={
                      (getStatusColor(session.status) as 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success')
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatDate(session.start_time)}</TableCell>
                <TableCell>
                  {session.duration_minutes || '-'}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() =>
                        onViewDetails && onViewDetails(session)
                      }
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalCount > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange || (() => {})}
          onRowsPerPageChange={onRowsPerPageChange || (() => {})}
        />
      )}
    </TableContainer>
  );
};

export default TeleConsultTable;
