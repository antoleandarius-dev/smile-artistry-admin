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
} from '@mui/material';
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Branch</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Branch Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Branch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBranchDialog;
