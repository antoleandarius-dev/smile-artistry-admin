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
} from '@mui/material';
import type { CreatePatientRequest } from '../types';
import { useCreatePatient } from '../hooks';

interface CreatePatientDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreatePatientDialog = ({ open, onClose }: CreatePatientDialogProps) => {
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Patient</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
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
      <DialogActions>
        <Button onClick={handleClose} disabled={createPatient.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createPatient.isPending}
        >
          {createPatient.isPending ? 'Creating...' : 'Create Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePatientDialog;
