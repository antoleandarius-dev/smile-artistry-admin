/**
 * DoctorAvailability Component
 * Displays doctor working days and time slots (read-only)
 */

import { CircularProgress, Alert, Box, Card, CardContent, Stack, Typography, Chip } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import type { Availability, DayOfWeek } from '../types';

interface DoctorAvailabilityProps {
  availability: Availability | null | undefined;
  isLoading: boolean;
  error: Error | null;
}

const DAYS_OF_WEEK: Array<{ key: DayOfWeek; label: string }> = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DoctorAvailability = ({ availability, isLoading, error }: DoctorAvailabilityProps) => {
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
        <Typography variant="body2">Failed to load availability: {error.message}</Typography>
      </Alert>
    );
  }

  if (!availability || !availability.working_days || availability.working_days.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No availability information available.
        </Typography>
      </Box>
    );
  }

  // Create a map of working days for quick lookup
  const workingDaysMap = new Map(
    availability.working_days.map((day) => [day.day, day])
  );

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Working Days & Hours
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const workingDay = workingDaysMap.get(key);

              return (
                <Box
                  key={key}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: workingDay?.is_working ? '#f5f5f5' : '#fafafa',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {label}
                    </Typography>
                    {workingDay?.is_working ? (
                      <CheckIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                    ) : (
                      <CloseIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    )}
                  </Box>

                  {workingDay?.is_working && workingDay.start_time && workingDay.end_time && (
                    <Typography variant="caption" color="text.secondary">
                      {workingDay.start_time} - {workingDay.end_time}
                    </Typography>
                  )}

                  {!workingDay?.is_working && (
                    <Typography variant="caption" color="text.secondary">
                      Not available
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          {availability.time_slots && availability.time_slots.length > 0 && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Available Time Slots
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availability.time_slots.map((slot, index) => (
                  <Chip
                    key={index}
                    label={`${slot.date} ${slot.start_time}-${slot.end_time}`}
                    color={slot.is_available ? 'success' : 'default'}
                    variant={slot.is_available ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DoctorAvailability;
