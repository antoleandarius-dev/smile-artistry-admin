import React, { useState } from 'react';
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
} from '@mui/material';
import { usersService } from '../../api/users.service';

interface AssignRoleDialogProps {
  open: boolean;
  userName: string;
  userId: number;
  currentRoleId: number;
  onClose: () => void;
  onSuccess: () => void;
  roles: Array<{ id: number; name: string }>;
}

const AssignRoleDialog: React.FC<AssignRoleDialogProps> = ({
  open,
  userName,
  userId,
  currentRoleId,
  onClose,
  onSuccess,
  roles,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);

  const handleSubmit = async () => {
    setError(null);

    if (selectedRoleId === currentRoleId) {
      setError('Please select a different role');
      return;
    }

    try {
      setLoading(true);
      await usersService.assignRole(userId, selectedRoleId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to assign role. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter out doctor role
  // Doctor assignment is handled separately in the doctor management section
  const availableRoles = roles.filter((role) => role.name !== 'doctor' && role.name !== 'patient');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Role to {userName}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              label="Role"
            >
              {availableRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || selectedRoleId === currentRoleId}
        >
          Assign Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignRoleDialog;
