import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { usersService, type User } from '../../api/users.service';
import { branchService, type BranchDetail } from '../../api/branches.service';

interface AssignUsersDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  branch: BranchDetail | null;
}

const AssignUsersDialog: React.FC<AssignUsersDialogProps> = ({
  open,
  onClose,
  onSuccess,
  branch,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  const {
    data: allUsers,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
    enabled: open,
  });

  useEffect(() => {
    if (branch && open && allUsers) {
      // Load assigned users for this branch
      const branchUserIds = new Set<number>();
      // We would need to fetch branch's assigned users from backend
      // For now, this is a simplification - ideally we'd have an endpoint
      setAssignedUsers([]);
    }
  }, [branch, open, allUsers]);

  const handleAssign = async () => {
    if (!branch || selectedUserId === 0) {
      setError('Please select a user');
      return;
    }

    try {
      setLoading(true);
      await branchService.assignUserToBranch(branch.id, selectedUserId);
      
      // Add to assigned users list
      const selectedUser = allUsers?.find((u) => u.id === selectedUserId);
      if (selectedUser) {
        setAssignedUsers((prev) => [...prev, selectedUser]);
      }
      
      setSelectedUserId(0);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to assign user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (userId: number) => {
    if (!branch) return;

    try {
      setLoading(true);
      await branchService.unassignUserFromBranch(branch.id, userId);
      setAssignedUsers((prev) => prev.filter((u) => u.id !== userId));
      setError(null);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to unassign user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!branch) return null;

  // Filter out already assigned users
  const assignedUserIds = new Set(assignedUsers.map((u) => u.id));
  const availableUsers = allUsers?.filter((u) => !assignedUserIds.has(u.id)) || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Users to Branch</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {usersLoading ? (
            <CircularProgress />
          ) : (
            <>
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value as number)}
                  label="Select User"
                  disabled={availableUsers.length === 0}
                >
                  {availableUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                onClick={handleAssign}
                variant="contained"
                disabled={selectedUserId === 0 || loading}
              >
                {loading ? 'Assigning...' : 'Add User'}
              </Button>

              {assignedUsers.length > 0 && (
                <Paper sx={{ mt: 2 }}>
                  <Box sx={{ p: 2 }}>
                    <strong>Assigned Users ({assignedUsers.length}):</strong>
                  </Box>
                  <List>
                    {assignedUsers.map((user) => (
                      <ListItem key={user.id}>
                        <ListItemText
                          primary={user.name}
                          secondary={user.email}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleUnassign(user.id)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUsersDialog;
