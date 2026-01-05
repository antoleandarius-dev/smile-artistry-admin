import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { branchService, type BranchDetail } from '../../api/branches.service';
import { RESPONSIVE_PATTERNS } from '../../styles/responsive';

interface Doctor {
  id: number;
  user_id: number;
  name: string;
  email: string;
  specialization?: string;
}

interface AssignDoctorsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  branch: BranchDetail | null;
}

const AssignDoctorsDialog: React.FC<AssignDoctorsDialogProps> = ({
  open,
  onClose,
  onSuccess,
  branch,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);
  const [assignedDoctors, setAssignedDoctors] = useState<Doctor[]>([]);

  const {
    data: allDoctors,
    isLoading: doctorsLoading,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      // Import doctorsService to get list
      const response = await fetch('/api/v1/doctors/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch doctors');
      return response.json() as Promise<Doctor[]>;
    },
    enabled: open,
  });

  useEffect(() => {
    if (branch && open && allDoctors) {
      setAssignedDoctors([]);
    }
  }, [branch, open, allDoctors]);

  const handleAssign = async () => {
    if (!branch || selectedDoctorId === 0) {
      setError('Please select a doctor');
      return;
    }

    try {
      setLoading(true);
      await branchService.assignDoctorToBranch(branch.id, selectedDoctorId);
      
      // Add to assigned doctors list
      const selectedDoctor = allDoctors?.find((d) => d.id === selectedDoctorId);
      if (selectedDoctor) {
        setAssignedDoctors((prev) => [...prev, selectedDoctor]);
      }
      
      setSelectedDoctorId(0);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to assign doctor. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (doctorId: number) => {
    if (!branch) return;

    try {
      setLoading(true);
      await branchService.unassignDoctorFromBranch(branch.id, doctorId);
      setAssignedDoctors((prev) => prev.filter((d) => d.id !== doctorId));
      setError(null);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to unassign doctor. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!branch) return null;

  // Filter out already assigned doctors
  const assignedDoctorIds = new Set(assignedDoctors.map((d) => d.id));
  const availableDoctors = allDoctors?.filter((d) => !assignedDoctorIds.has(d.id)) || [];

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
      <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Assign Doctors to Branch</DialogTitle>
      <DialogContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: { xs: 1.5, sm: 2 } }}>
          {error && <Alert severity="error">{error}</Alert>}

          {doctorsLoading ? (
            <CircularProgress />
          ) : (
            <>
              <FormControl fullWidth>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value as number)}
                  label="Select Doctor"
                  disabled={availableDoctors.length === 0}
                >
                  {availableDoctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} {doctor.specialization && `(${doctor.specialization})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                onClick={handleAssign}
                variant="contained"
                disabled={selectedDoctorId === 0 || loading}
              >
                {loading ? 'Assigning...' : 'Add Doctor'}
              </Button>

              {assignedDoctors.length > 0 && (
                <Paper sx={{ mt: 2 }}>
                  <Box sx={{ p: 2 }}>
                    <strong>Assigned Doctors ({assignedDoctors.length}):</strong>
                  </Box>
                  <List>
                    {assignedDoctors.map((doctor) => (
                      <ListItem key={doctor.id}>
                        <ListItemText
                          primary={`Dr. ${doctor.name}`}
                          secondary={
                            doctor.specialization
                              ? `${doctor.specialization} - ${doctor.email}`
                              : doctor.email
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleUnassign(doctor.id)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 1.5 } }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDoctorsDialog;
