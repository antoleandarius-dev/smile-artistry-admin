/**
 * DoctorDetail Component
 * Displays detailed information about a selected doctor (read-only)
 */

import { CircularProgress, Alert, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import type { DoctorDetail } from '../types';

interface DoctorDetailProps {
  doctor: DoctorDetail | null;
  isLoading: boolean;
  error: Error | null;
}

const DoctorDetail = ({ doctor, isLoading, error }: DoctorDetailProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <Typography variant="body2">Failed to load doctor details: {error.message}</Typography>
      </Alert>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select a doctor to view details.
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Doctor Information
          </Typography>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Name
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {doctor.name}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Specialization
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {doctor.specialization || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Registration Number
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {doctor.registration_number || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Branch
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {doctor.branch_name || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {doctor.is_active ? (
                <>
                  <CheckIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Active
                  </Typography>
                </>
              ) : (
                <>
                  <CloseIcon sx={{ fontSize: 18, color: '#f44336' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Inactive
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {doctor.email && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Email
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {doctor.email}
              </Typography>
            </Box>
          )}

          {doctor.phone && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Phone
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {doctor.phone}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DoctorDetail;
