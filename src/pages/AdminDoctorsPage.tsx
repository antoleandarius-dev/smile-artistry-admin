/**
 * AdminDoctorsPage Component
 * Admin panel for managing doctors (create, activate/deactivate, assign branches)
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { useDoctors } from '../features/doctors';
import { AddDoctorForm, DoctorManagementTable } from '../features/doctors';
import { branchService, type Branch } from '../api/branches.service';
import { RESPONSIVE_PATTERNS } from '../styles/responsive';

const AdminDoctorsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<Error | null>(null);

  // Fetch doctors
  const { data: doctors = [], isLoading: doctorsLoading, error: doctorsError } = useDoctors();

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const data = await branchService.getBranches();
        setBranches(data.filter((b) => b.is_active));
      } catch (error) {
        setBranchesError(error instanceof Error ? error : new Error('Failed to load branches'));
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleAddDoctorSuccess = () => {
    setTabValue(1); // Switch to management tab
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Doctor Management
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          Create, manage, and assign doctors to branches
        </Typography>
      </Box>

      {doctorsError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
        >
          {doctorsError.message || 'Failed to load doctors'}
        </Alert>
      )}

      {branchesError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
        >
          {branchesError.message || 'Failed to load branches'}
        </Alert>
      )}

      <Paper sx={{ mb: { xs: 2, sm: 3 } }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minHeight: { xs: 44, md: 48 },
            },
          }}
        >
          <Tab label="Add Doctor" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Manage Doctors" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Paper 
          id="tabpanel-0" 
          role="tabpanel" 
          aria-labelledby="tab-0"
          sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}
        >
          {branchesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, sm: 3 } }}>
              <CircularProgress />
            </Box>
          ) : (
            <AddDoctorForm
              branches={branches}
              onSuccess={handleAddDoctorSuccess}
              onError={(error) => {
                console.error('Error creating doctor:', error);
              }}
            />
          )}
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper 
          id="tabpanel-1" 
          role="tabpanel" 
          aria-labelledby="tab-1" 
          sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}
        >
          {branchesLoading || doctorsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, sm: 3 } }}>
              <CircularProgress />
            </Box>
          ) : (
            <DoctorManagementTable
              doctors={doctors}
              branches={branches}
              isLoading={doctorsLoading}
              error={doctorsError}
            />
          )}
        </Paper>
      )}
    </Container>
  );
};

export default AdminDoctorsPage;
