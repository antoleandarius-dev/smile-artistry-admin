/**
 * Toast Notification Hook
 * Simple toast notification using MUI Snackbar
 */

import { useState, useCallback } from 'react';
import type { AlertColor } from '@mui/material';

export interface Toast {
  message: string;
  severity?: AlertColor;
  duration?: number;
}

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast>({
    message: '',
    severity: 'info',
    duration: 4000,
  });

  const showToast = useCallback(
    (message: string, severity: AlertColor = 'info', duration = 4000) => {
      setToast({ message, severity, duration });
      setOpen(true);
    },
    []
  );

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return {
    showToast,
    open,
    toast,
    handleClose,
    setOpen,
  };
};
