import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { TeleSessionAdminResponse } from '../../../api/tele-sessions.service';
import { teleSessionsService } from '../../../api/tele-sessions.service';

interface TeleConsultDetailViewProps {
  session: TeleSessionAdminResponse | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdated?: (updatedSession: TeleSessionAdminResponse) => void;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString();
};

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

const TeleConsultDetailView: React.FC<TeleConsultDetailViewProps> = ({
  session,
  open,
  onClose,
  onStatusUpdated,
}) => {
  const [statusCheckMessage, setStatusCheckMessage] = useState<string | null>(null);

  // Mutation for checking status
  const checkStatusMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error('No session selected');
      return await teleSessionsService.checkSessionStatus(session.id);
    },
    onSuccess: (updatedSession) => {
      setStatusCheckMessage('Status checked successfully!');
      if (onStatusUpdated) {
        onStatusUpdated(updatedSession);
      }
      // Clear message after 3 seconds
      setTimeout(() => setStatusCheckMessage(null), 3000);
    },
    onError: (error) => {
      setStatusCheckMessage(
        `Error checking status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setTimeout(() => setStatusCheckMessage(null), 5000);
    },
  });

  if (!session) return null;

  const calculateDuration = () => {
    if (!session.start_time || !session.end_time) {
      return '-';
    }
    const start = new Date(session.start_time);
    const end = new Date(session.end_time);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} minutes`;
  };

  const isCompleted = session.status === 'completed';
  const isLoading = checkStatusMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tele-Consultation Session Details</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Session Identification */}
          <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Session Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Session ID
                </Typography>
                <Typography variant="body2">#{session.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Appointment ID
                </Typography>
                <Typography variant="body2">#{session.appointment_id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Provider
                </Typography>
                <Typography variant="body2">
                  {session.provider.replace('_', ' ').toUpperCase()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={session.status.replace('_', ' ').toUpperCase()}
                    size="small"
                    color={
                      (getStatusColor(session.status) as 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success')
                    }
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          <Divider />

          {/* Participants */}
          <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Participants
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Doctor
                </Typography>
                <Typography variant="body2">{session.doctor_name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Patient
                </Typography>
                <Typography variant="body2">{session.patient_name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Branch
                </Typography>
                <Typography variant="body2">{session.branch_name}</Typography>
              </Box>
            </Box>
          </Paper>

          <Divider />

          {/* Timing Information */}
          <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Timing
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Scheduled Time
                </Typography>
                <Typography variant="body2">
                  {formatDate(session.appointment_scheduled_at)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Session Start
                </Typography>
                <Typography variant="body2">
                  {formatDate(session.start_time)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Session End
                </Typography>
                <Typography variant="body2">
                  {formatDate(session.end_time)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Duration
                </Typography>
                <Typography variant="body2">{calculateDuration()}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Notice */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: '#f0f7ff',
              border: '1px solid #b3e5fc',
            }}
          >
            <Typography variant="caption" color="textSecondary">
              Note: This is a read-only view for oversight purposes only. You cannot
              join or modify sessions from here.
            </Typography>
          </Paper>

          {/* Status Check Message */}
          {statusCheckMessage && (
            <Paper
              sx={{
                p: 2,
                backgroundColor: statusCheckMessage.includes('Error') ? '#ffebee' : '#e8f5e9',
                border: `1px solid ${statusCheckMessage.includes('Error') ? '#ef5350' : '#4caf50'}`,
              }}
            >
              <Typography variant="caption" color={statusCheckMessage.includes('Error') ? 'error' : 'success'}>
                {statusCheckMessage}
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ gap: 1, p: 2 }}>
        <Button
          onClick={() => checkStatusMutation.mutate()}
          variant="contained"
          color="primary"
          disabled={isLoading || isCompleted}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
        >
          {isLoading ? 'Checking...' : 'Check Status'}
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeleConsultDetailView;
