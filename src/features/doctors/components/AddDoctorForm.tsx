/**
 * AddDoctorForm Component
 * Form for admin to create a new doctor account
 */

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useCreateDoctor } from '../hooks';
import type { CreateDoctorRequest } from '../doctor.service';

interface AddDoctorFormProps {
  branches: Array<{ id: number; name: string }>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const AddDoctorForm = ({ branches, onSuccess, onError }: AddDoctorFormProps) => {
  const [formData, setFormData] = useState<CreateDoctorRequest>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    registration_no: '',
    password: '',
    branch_ids: [],
  });

  const [showPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createDoctorMutation = useCreateDoctor();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.specialization?.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    if (!formData.registration_no?.trim()) {
      newErrors.registration_no = 'Registration number is required';
    }
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createDoctorMutation.mutateAsync(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        registration_no: '',
        password: '',
        branch_ids: [],
      });
      setErrors({});
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create doctor';
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBranchToggle = (branchId: number) => {
    setFormData((prev) => ({
      ...prev,
      branch_ids: prev.branch_ids?.includes(branchId)
        ? prev.branch_ids.filter((id) => id !== branchId)
        : [...(prev.branch_ids || []), branchId],
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      {createDoctorMutation.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {createDoctorMutation.error.message || 'Failed to create doctor'}
        </Alert>
      )}

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
      }}>
        {/* Name */}
        <Box>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Box>

        {/* Email */}
        <Box>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Box>

        {/* Phone */}
        <Box>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </Box>

        {/* Specialization */}
        <Box>
          <TextField
            fullWidth
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            error={!!errors.specialization}
            helperText={errors.specialization}
            required
          />
        </Box>

        {/* Registration Number */}
        <Box>
          <TextField
            fullWidth
            label="Registration Number"
            name="registration_no"
            value={formData.registration_no}
            onChange={handleInputChange}
            error={!!errors.registration_no}
            helperText={errors.registration_no}
            required
          />
        </Box>

        {/* Password */}
        <Box>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            required
          />
        </Box>

        {/* Branches */}
        <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
          <Box sx={{ mb: 2 }}>
            <p style={{ marginBottom: '12px', fontWeight: 500 }}>
              Assign Branches (optional)
            </p>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 1,
              }}
            >
              {branches.map((branch) => (
                <FormControlLabel
                  key={branch.id}
                  control={
                    <Checkbox
                      checked={formData.branch_ids?.includes(branch.id) || false}
                      onChange={() => handleBranchToggle(branch.id)}
                    />
                  }
                  label={branch.name}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Submit Button */}
        <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createDoctorMutation.isPending}
            sx={{ mr: 2 }}
          >
            {createDoctorMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              'Add Doctor'
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddDoctorForm;
