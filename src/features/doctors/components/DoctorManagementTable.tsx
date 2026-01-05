/**
 * DoctorManagementTable Component
 * Admin table for managing doctors with status and branch actions
 */

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  ToggleOn as ActivateIcon,
  ToggleOff as DeactivateIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useUpdateDoctorStatus, useAssignDoctorBranches } from '../hooks';
import type { Doctor } from '../types';

interface DoctorManagementTableProps {
  doctors: Doctor[];
  branches: Array<{ id: number; name: string }>;
  isLoading: boolean;
  error: Error | null;
}

const DoctorManagementTable = ({
  doctors,
  branches,
  isLoading,
  error,
}: DoctorManagementTableProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);

  const updateStatusMutation = useUpdateDoctorStatus();
  const assignBranchesMutation = useAssignDoctorBranches();

  const handleStatusToggle = async (doctor: Doctor) => {
    try {
      await updateStatusMutation.mutateAsync({
        doctorId: doctor.id,
        statusUpdate: { is_active: !doctor.is_active },
      });
    } catch (error) {
      console.error('Failed to update doctor status:', error);
    }
  };

  const handleOpenBranchDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedBranches(doctor.branches?.map((b) => b.id) || []);
    setShowBranchDialog(true);
  };

  const handleCloseBranchDialog = () => {
    setShowBranchDialog(false);
    setSelectedDoctor(null);
    setSelectedBranches([]);
  };

  const handleBranchToggle = (branchId: number) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  const handleSaveBranches = async () => {
    if (!selectedDoctor) return;

    try {
      await assignBranchesMutation.mutateAsync({
        doctorId: selectedDoctor.id,
        branchesData: { branch_ids: selectedBranches },
      });
      handleCloseBranchDialog();
    } catch (error) {
      console.error('Failed to update branches:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error.message || 'Failed to load doctors'}
      </Alert>
    );
  }

  if (doctors.length === 0) {
    return (
      <Alert severity="info">
        No doctors found. Create a new doctor to get started.
      </Alert>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
        <Table sx={{ minWidth: { xs: 800, md: 'auto' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Registration No.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Branches</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialization || '-'}</TableCell>
                <TableCell>{doctor.registration_no || '-'}</TableCell>
                <TableCell>
                  {doctor.branches && doctor.branches.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {doctor.branches.map((branch) => (
                        <Chip key={branch.id} label={branch.name} size="small" />
                      ))}
                    </Box>
                  ) : (
                    <span style={{ color: '#999' }}>No branches assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={doctor.is_active ? 'Active' : 'Inactive'}
                    color={doctor.is_active ? 'success' : 'default'}
                    variant={doctor.is_active ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton
                    size="small"
                    title="Edit branches"
                    onClick={() => handleOpenBranchDialog(doctor)}
                    disabled={assignBranchesMutation.isPending}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    title={doctor.is_active ? 'Deactivate' : 'Activate'}
                    onClick={() => handleStatusToggle(doctor)}
                    disabled={updateStatusMutation.isPending}
                    color={doctor.is_active ? 'error' : 'success'}
                  >
                    {doctor.is_active ? (
                      <DeactivateIcon fontSize="small" />
                    ) : (
                      <ActivateIcon fontSize="small" />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Branch Assignment Dialog */}
      <Dialog open={showBranchDialog} onClose={handleCloseBranchDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Branches to {selectedDoctor?.name}</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {branches.length === 0 ? (
            <Alert severity="warning">No branches available</Alert>
          ) : (
            <Box sx={{ display: 'grid', gap: 1 }}>
              {branches.map((branch) => (
                <FormControlLabel
                  key={branch.id}
                  control={
                    <Checkbox
                      checked={selectedBranches.includes(branch.id)}
                      onChange={() => handleBranchToggle(branch.id)}
                    />
                  }
                  label={branch.name}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBranchDialog}>Cancel</Button>
          <Button
            onClick={handleSaveBranches}
            variant="contained"
            disabled={assignBranchesMutation.isPending}
          >
            {assignBranchesMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DoctorManagementTable;
