/**
 * DoctorList Component
 * Displays doctors in a table with filtering and search
 */

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { Doctor } from '../types';

interface DoctorListProps {
  doctors: Doctor[];
  isLoading: boolean;
  error: Error | null;
  onSelectDoctor?: (doctor: Doctor) => void;
}

const DoctorList = ({ doctors, isLoading, error, onSelectDoctor }: DoctorListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter doctors based on search query
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const query = searchQuery.toLowerCase();
      return (
        (doctor.name?.toLowerCase().includes(query) ?? false) ||
        (doctor.specialization?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [doctors, searchQuery]);

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
        <Typography variant="body2">Failed to load doctors: {error.message}</Typography>
      </Alert>
    );
  }

  if (doctors.length === 0) {
    return (
      <Alert severity="info">
        <Typography variant="body2">No doctors available.</Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <TextField
        placeholder="Search by name or specialization..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow
                key={doctor.id}
                onClick={() => onSelectDoctor?.(doctor)}
                sx={{
                  cursor: onSelectDoctor ? 'pointer' : 'default',
                  '&:hover': onSelectDoctor
                    ? { backgroundColor: '#f9f9f9' }
                    : {},
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {doctor.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.specialization || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.branch_name || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={doctor.is_active ? 'Active' : 'Inactive'}
                    color={doctor.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredDoctors.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No doctors match your search.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DoctorList;
