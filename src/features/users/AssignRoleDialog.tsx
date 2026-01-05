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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { RESPONSIVE_PATTERNS } from '../../styles/responsive';
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={isSmallScreen ? 'xs' : 'sm'}
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: '100%' },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Assign Role to {userName}
      </DialogTitle>
      <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: 1.5 }}>
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
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 } }}>
        <Button onClick={onClose} disabled={loading} sx={{ minWidth: { xs: 'auto', sm: '80px' } }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || selectedRoleId === currentRoleId}
          sx={{ minWidth: { xs: 'auto', sm: '100px' } }}
        >
          Assign Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignRoleDialog;
