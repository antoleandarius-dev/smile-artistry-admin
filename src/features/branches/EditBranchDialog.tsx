import React, { useState, useEffect } from 'react';
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
import { branchService, type BranchDetail } from '../../api/branches.service';

interface EditBranchDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  branch: BranchDetail | null;
}

const EditBranchDialog: React.FC<EditBranchDialogProps> = ({
  open,
  onClose,
  onSuccess,
  branch,
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

  useEffect(() => {
    if (branch && open) {
      setFormData({
        name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || '',
      });
      setError(null);
    }
  }, [branch, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!branch) return;

    // Validation
    if (!formData.name.trim()) {
      setError('Branch name is required');
      return;
    }

    try {
      setLoading(true);
      await branchService.updateBranch(branch.id, {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to update branch. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!branch) return null;

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
        Edit Branch
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
          {loading ? 'Updating...' : 'Update Branch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBranchDialog;
