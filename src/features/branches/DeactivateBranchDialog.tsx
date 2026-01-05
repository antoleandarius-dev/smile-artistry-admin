import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { branchService, type BranchDetail } from '../../api/branches.service';
import { RESPONSIVE_PATTERNS } from '../../styles/responsive';

interface DeactivateBranchDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  branch: BranchDetail | null;
}

const DeactivateBranchDialog: React.FC<DeactivateBranchDialogProps> = ({
  open,
  onClose,
  onSuccess,
  branch,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeactivate = async () => {
    if (!branch) return;

    try {
      setLoading(true);
      await branchService.deactivateBranch(branch.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to deactivate branch. Please try again.'
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
      <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Deactivate Branch</DialogTitle>
      <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: { xs: 1.5, sm: 2 } }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Alert severity="warning">
            <strong>Warning:</strong> This action cannot be undone. Make sure all appointments
            are completed or cancelled before deactivating.
          </Alert>

          <Typography>
            Are you sure you want to deactivate <strong>{branch.name}</strong>?
          </Typography>

          <Typography variant="body2" color="textSecondary">
            Deactivated branches cannot accept new appointments and will be hidden from most views.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 } }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleDeactivate}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? 'Deactivating...' : 'Deactivate Branch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeactivateBranchDialog;
