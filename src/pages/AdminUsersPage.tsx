import React, { useState, useEffect } from 'react';
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
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Delete as DeleteIcon,
  VpnKey as ResetIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, type User } from '../api/users.service';
import { rolesService } from '../api/roles.service';
import AddUserDialog from '../features/users/AddUserDialog';
import ResetPasswordDialog from '../features/users/ResetPasswordDialog';
import AssignRoleDialog from '../features/users/AssignRoleDialog';
import { getCurrentUser } from '../shared/utils/auth';

const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  // State for dialogs
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false);

  // State for selected user
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  });

  // Fetch roles
  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles(),
  });

  // Mutation for toggling user status
  const toggleUserMutation = useMutation({
    mutationFn: (data: { userId: number; isActive: boolean }) =>
      usersService.toggleUserStatus(data.userId, data.isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleAddUserClick = () => {
    setAddUserOpen(true);
  };

  const handleResetPasswordClick = (user: User) => {
    setSelectedUser(user);
    setResetPasswordOpen(true);
  };

  const handleAssignRoleClick = (user: User) => {
    setSelectedUser(user);
    setAssignRoleOpen(true);
  };

  const handleToggleStatusClick = (user: User) => {
    if (currentUser?.id === user.id) {
      alert('You cannot change your own status');
      return;
    }
    setSelectedUser(user);
    setConfirmDeactivateOpen(true);
  };

  const handleConfirmToggleStatus = () => {
    if (selectedUser) {
      toggleUserMutation.mutate(
        {
          userId: selectedUser.id,
          isActive: !selectedUser.is_active,
        },
        {
          onSuccess: () => {
            setConfirmDeactivateOpen(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const getRoleNameById = (roleId: number): string => {
    const role = roles?.find((r) => r.id === roleId);
    return role?.name
      ? role.name.charAt(0).toUpperCase() + role.name.slice(1)
      : 'Unknown';
  };

  const isLoading = usersLoading || rolesLoading;
  const error = usersError || rolesError;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <div>
          <h1>Users & Roles</h1>
          <p>Manage system users and their roles</p>
        </div>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddUserClick}
        >
          Add User
        </Button>
      </Box>

      {error && <Alert severity="error">Failed to load users. Please try again.</Alert>}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleNameById(user.role_id)}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? 'Active' : 'Inactive'}
                          color={user.is_active ? 'success' : 'default'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Assign Role">
                          <IconButton
                            size="small"
                            onClick={() => handleAssignRoleClick(user)}
                            disabled={currentUser?.id === user.id}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            user.is_active ? 'Deactivate User' : 'Activate User'
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatusClick(user)}
                            disabled={currentUser?.id === user.id}
                          >
                            {user.is_active ? (
                              <LockIcon />
                            ) : (
                              <LockOpenIcon />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Reset Password">
                          <IconButton
                            size="small"
                            onClick={() => handleResetPasswordClick(user)}
                            disabled={currentUser?.id === user.id}
                          >
                            <ResetIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddUserDialog
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
        }}
        roles={roles || []}
      />

      {selectedUser && (
        <>
          <ResetPasswordDialog
            open={resetPasswordOpen}
            userName={selectedUser.name}
            userId={selectedUser.id}
            onClose={() => {
              setResetPasswordOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['users'] });
            }}
          />

          <AssignRoleDialog
            open={assignRoleOpen}
            userName={selectedUser.name}
            userId={selectedUser.id}
            currentRoleId={selectedUser.role_id}
            onClose={() => {
              setAssignRoleOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['users'] });
            }}
            roles={roles || []}
          />
        </>
      )}

      {/* Confirm toggle status dialog */}
      <Dialog
        open={confirmDeactivateOpen}
        onClose={() => setConfirmDeactivateOpen(false)}
      >
        <DialogTitle>
          {selectedUser?.is_active ? 'Deactivate User' : 'Activate User'}
        </DialogTitle>
        <DialogContent>
          {selectedUser?.is_active
            ? `Are you sure you want to deactivate ${selectedUser.name}? They will not be able to log in.`
            : `Are you sure you want to activate ${selectedUser?.name}?`}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeactivateOpen(false)}
            disabled={toggleUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmToggleStatus}
            variant="contained"
            disabled={toggleUserMutation.isPending}
          >
            {selectedUser?.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;
