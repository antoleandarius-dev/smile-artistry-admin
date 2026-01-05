/**
 * CreatePatientDialog
 * Dialog form to create a new patient
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { RESPONSIVE_PATTERNS } from '../../../styles/responsive';
import type { CreatePatientRequest } from '../types';
import { useCreatePatient } from '../hooks';

interface CreatePatientDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreatePatientDialog = ({ open, onClose }: CreatePatientDialogProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState<CreatePatientRequest>({
    name: '',
    phone: '',
    gender: undefined,
    date_of_birth: undefined,
    email: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const createPatient = useCreatePatient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
    setValidationError(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectChange = (e: any): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setValidationError('Name is required');
      return false;
    }
    if (formData.phone && !/^[\d\s\-+()]*$/.test(formData.phone)) {
      setValidationError('Phone must contain only numbers and valid phone characters');
      return false;
    }
    if (formData.date_of_birth) {
      const dob = new Date(formData.date_of_birth);
      if (dob > new Date()) {
        setValidationError('Date of birth cannot be in the future');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createPatient.mutateAsync(formData);
      handleReset();
      onClose();
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Failed to create patient'
      );
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      gender: undefined,
      date_of_birth: undefined,
      email: '',
    });
    setValidationError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
        Create New Patient
      </DialogTitle>
      <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, pt: 1.5 }}>
          {validationError && (
            <Alert severity="error" onClose={() => setValidationError(null)}>
              {validationError}
            </Alert>
          )}

          {createPatient.error && (
            <Alert severity="error">
              {createPatient.error instanceof Error
                ? createPatient.error.message
                : 'An error occurred while creating the patient'}
            </Alert>
          )}

          {/* Name Field */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            placeholder="Enter patient name"
          />

          {/* Phone Field */}
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            placeholder="Enter phone number"
            type="tel"
          />

          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            placeholder="Enter email address"
            type="email"
          />

          {/* Gender Select */}
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender || ''}
              onChange={handleSelectChange}
              label="Gender"
            >
              <MenuItem value="">
                <em>Not specified</em>
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Date of Birth Field */}
          <TextField
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth || ''}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 } }}>
        <Button onClick={handleClose} disabled={createPatient.isPending} sx={{ minWidth: { xs: 'auto', sm: '80px' } }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createPatient.isPending}
          sx={{ minWidth: { xs: 'auto', sm: '100px' } }}
        >
          {createPatient.isPending ? 'Creating...' : 'Create Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePatientDialog;
