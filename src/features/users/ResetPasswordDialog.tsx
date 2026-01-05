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
import { usersService } from '../../api/users.service';

interface ResetPasswordDialogProps {
  open: boolean;
  userName: string;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  open,
  userName,
  userId,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async () => {
    setError(null);

    if (!newPassword.trim()) {
      setError('Password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await usersService.resetPassword(userId, newPassword);
      setNewPassword('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to reset password. Please try again.'
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
        Reset Password for {userName}
      </DialogTitle>
      <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: 1.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Alert severity="info" sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
            Enter a new password for this user. They will need to use this
            password to log in.
          </Alert>

          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            autoFocus
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
        <Button onClick={onClose} disabled={loading} sx={{ minWidth: { xs: 'auto', sm: '80px' } }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: { xs: 'auto', sm: '100px' } }}
        >
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;
