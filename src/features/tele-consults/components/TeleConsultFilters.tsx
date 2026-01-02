import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

export interface TeleConsultFiltersState {
  startDate: string;
  endDate: string;
  doctorId?: number;
  branchId?: number;
  status?: string;
}

interface TeleConsultFiltersProps {
  filters: TeleConsultFiltersState;
  onFiltersChange: (filters: TeleConsultFiltersState) => void;
  doctors: Array<{ id: number; name: string }>;
  branches: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

const statuses = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_call', label: 'In Call' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TeleConsultFilters: React.FC<TeleConsultFiltersProps> = ({
  filters,
  onFiltersChange,
  doctors,
  branches,
  isLoading,
}) => {
  const handleDateChange = (
    field: 'startDate' | 'endDate',
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSelectChange = (
    field: string,
    value: string | number | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      startDate: '',
      endDate: '',
      doctorId: undefined,
      branchId: undefined,
      status: undefined,
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
            gap: 2,
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={isLoading}
            size="small"
          />

          <TextField
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={isLoading}
            size="small"
          />

          <TextField
            select
            label="Doctor"
            value={filters.doctorId || ''}
            onChange={(e) =>
              handleSelectChange(
                'doctorId',
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            disabled={isLoading}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Branch"
            value={filters.branchId || ''}
            onChange={(e) =>
              handleSelectChange(
                'branchId',
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            disabled={isLoading}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            value={filters.status || ''}
            onChange={(e) =>
              handleSelectChange('status', e.target.value || undefined)
            }
            disabled={isLoading}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            disabled={isLoading}
            size="small"
          >
            Clear Filters
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TeleConsultFilters;
