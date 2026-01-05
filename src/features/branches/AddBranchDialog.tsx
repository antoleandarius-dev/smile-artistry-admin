import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { RESPONSIVE_PATTERNS } from '../../styles/responsive';
import { branchService } from '../../api/branches.service';

interface AddBranchDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddBranchDialog: React.FC<AddBranchDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Branch name is required');
      return;
    }

    try {
      setLoading(true);
      await branchService.createBranch({
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        is_active: true,
      });
      setFormData({
        name: '',
        address: '',
        phone: '',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to create branch. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
        Add New Branch
      </DialogTitle>
      <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: 1.5 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Branch Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., Main Branch, Downtown Clinic"
            slotProps={{
              input: {
                sx: {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              },
            }}
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            placeholder="Street address"
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
            placeholder="+1 (555) 123-4567"
            slotProps={{
              input: {
                sx: {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 } }}>
        <Button onClick={onClose} sx={{ minWidth: { xs: 'auto', sm: '80px' } }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: { xs: 'auto', sm: '100px' } }}
        >
          {loading ? 'Creating...' : 'Create Branch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBranchDialog;
