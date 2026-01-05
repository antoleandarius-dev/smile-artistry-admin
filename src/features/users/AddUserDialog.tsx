import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { RESPONSIVE_PATTERNS } from '../../styles/responsive';
import { usersService, type CreateUserRequest } from '../../api/users.service';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roles: Array<{ id: number; name: string }>;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onClose,
  onSuccess,
  roles,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role_id: 0,
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      role_id: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }
    if (formData.role_id === 0) {
      setError('Role is required');
      return;
    }

    try {
      setLoading(true);
      await usersService.createUser(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role_id: 0,
        is_active: true,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to create user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter out doctor role
  const availableRoles = roles.filter((role) => role.name !== 'doctor');

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
        Add New User
      </DialogTitle>
      <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: 1.5 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            slotProps={{
              input: {
                sx: {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              },
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            slotProps={{
              input: {
                sx: {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              },
            }}
          />

          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            slotProps={{
              input: {
                sx: {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            slotProps={{
              input: {
                sx: {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              },
            }}
          />

          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role_id}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value={0} disabled>
                Select a role
              </MenuItem>
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
          disabled={loading}
          sx={{ minWidth: { xs: 'auto', sm: '100px' } }}
        >
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
