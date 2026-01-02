import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  LocalHospital as DoctorIcon,
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchService, type BranchDetail } from '../api/branches.service';
import AddBranchDialog from '../features/branches/AddBranchDialog';
import EditBranchDialog from '../features/branches/EditBranchDialog';
import AssignUsersDialog from '../features/branches/AssignUsersDialog';
import AssignDoctorsDialog from '../features/branches/AssignDoctorsDialog';
import DeactivateBranchDialog from '../features/branches/DeactivateBranchDialog';

const AdminBranchesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // State for dialogs
  const [addBranchOpen, setAddBranchOpen] = useState(false);
  const [editBranchOpen, setEditBranchOpen] = useState(false);
  const [assignUsersOpen, setAssignUsersOpen] = useState(false);
  const [assignDoctorsOpen, setAssignDoctorsOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [confirmActivateOpen, setConfirmActivateOpen] = useState(false);

  // State for selected branch
  const [selectedBranch, setSelectedBranch] = useState<BranchDetail | null>(null);

  // Fetch branches
  const {
    data: branches,
    isLoading: branchesLoading,
    error: branchesError,
  } = useQuery({
    queryKey: ['branches'],
    queryFn: () => branchService.getBranches(),
  });

  // Mutation for activating branch
  const activateBranchMutation = useMutation({
    mutationFn: (branchId: number) => branchService.activateBranch(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });

  // Mutation for deactivating branch
  const deactivateBranchMutation = useMutation({
    mutationFn: (branchId: number) => branchService.deactivateBranch(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });

  const handleAddBranchClick = () => {
    setAddBranchOpen(true);
  };

  const handleEditClick = (branch: BranchDetail) => {
    setSelectedBranch(branch);
    setEditBranchOpen(true);
  };

  const handleAssignUsersClick = (branch: BranchDetail) => {
    setSelectedBranch(branch);
    setAssignUsersOpen(true);
  };

  const handleAssignDoctorsClick = (branch: BranchDetail) => {
    setSelectedBranch(branch);
    setAssignDoctorsOpen(true);
  };

  const handleDeactivateClick = (branch: BranchDetail) => {
    setSelectedBranch(branch);
    setDeactivateOpen(true);
  };

  const handleActivateClick = (branch: BranchDetail) => {
    setSelectedBranch(branch);
    setConfirmActivateOpen(true);
  };

  const handleConfirmActivate = async () => {
    if (selectedBranch) {
      await activateBranchMutation.mutateAsync(selectedBranch.id);
      setConfirmActivateOpen(false);
    }
  };

  const handleDialogClose = () => {
    setSelectedBranch(null);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['branches'] });
  };

  if (branchesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Branch Management</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBranchClick}
        >
          Add Branch
        </Button>
      </Box>

      {branchesError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load branches. Please try again.
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Branch Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Doctors</strong></TableCell>
                  <TableCell align="center"><strong>Users</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branches && branches.length > 0 ? (
                  branches.map((branch) => (
                    <TableRow key={branch.id} hover>
                      <TableCell>
                        <strong>{branch.name}</strong>
                      </TableCell>
                      <TableCell>{branch.address || 'N/A'}</TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={branch.is_active ? <CheckCircleIcon /> : <BlockIcon />}
                          label={branch.is_active ? 'Active' : 'Inactive'}
                          color={branch.is_active ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<DoctorIcon />}
                          label={branch.doctors_count}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<PersonAddIcon />}
                          label={branch.users_count}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(branch)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Assign Users">
                          <IconButton
                            size="small"
                            onClick={() => handleAssignUsersClick(branch)}
                          >
                            <PersonAddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Assign Doctors">
                          <IconButton
                            size="small"
                            onClick={() => handleAssignDoctorsClick(branch)}
                          >
                            <DoctorIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {branch.is_active ? (
                          <Tooltip title="Deactivate">
                            <IconButton
                              size="small"
                              onClick={() => handleDeactivateClick(branch)}
                              color="error"
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Activate">
                            <IconButton
                              size="small"
                              onClick={() => handleActivateClick(branch)}
                              color="success"
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 3 }}>
                        No branches found. <Button onClick={handleAddBranchClick}>Create one</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddBranchDialog
        open={addBranchOpen}
        onClose={() => setAddBranchOpen(false)}
        onSuccess={handleRefresh}
      />

      <EditBranchDialog
        open={editBranchOpen}
        onClose={() => {
          setEditBranchOpen(false);
          handleDialogClose();
        }}
        onSuccess={handleRefresh}
        branch={selectedBranch}
      />

      <AssignUsersDialog
        open={assignUsersOpen}
        onClose={() => {
          setAssignUsersOpen(false);
          handleDialogClose();
        }}
        onSuccess={handleRefresh}
        branch={selectedBranch}
      />

      <AssignDoctorsDialog
        open={assignDoctorsOpen}
        onClose={() => {
          setAssignDoctorsOpen(false);
          handleDialogClose();
        }}
        onSuccess={handleRefresh}
        branch={selectedBranch}
      />

      <DeactivateBranchDialog
        open={deactivateOpen}
        onClose={() => {
          setDeactivateOpen(false);
          handleDialogClose();
        }}
        onSuccess={handleRefresh}
        branch={selectedBranch}
      />

      {/* Activate confirmation dialog */}
      <Dialog open={confirmActivateOpen} onClose={() => setConfirmActivateOpen(false)}>
        <DialogTitle>Activate Branch</DialogTitle>
        <DialogContent>
          Are you sure you want to activate <strong>{selectedBranch?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmActivateOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmActivate}
            variant="contained"
            color="success"
            disabled={activateBranchMutation.isPending}
          >
            Activate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBranchesPage;
