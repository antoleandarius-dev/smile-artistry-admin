/**
 * PatientsPage
 * Main page for managing patients and viewing medical records
 */

import { useState } from 'react';
import { Typography, Box, Button, Paper, Tabs, Tab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  PatientList,
  CreatePatientDialog,
  RecordUploadDialog,
  usePatients,
} from '../features/patients';
import { default as PatientDetail } from '../features/patients/components/PatientDetail';
import { default as PatientTimeline } from '../features/patients/components/PatientTimeline';
import type { Patient } from '../features/patients';
import { RESPONSIVE_PATTERNS } from '../styles/responsive';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          py: { xs: 1.5, sm: 2 },
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [recordUploadOpen, setRecordUploadOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Fetch patients
  const { data: patients = [], isLoading, error } = usePatients();

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setTabValue(1); // Switch to detail tab
  };

  const handleCloseDetail = () => {
    setSelectedPatient(null);
    setTabValue(0); // Switch back to list tab
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={RESPONSIVE_PATTERNS.headerLayout}>
        <Typography 
          variant="h4"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Patients
        </Typography>
        <Box sx={RESPONSIVE_PATTERNS.buttonGroup}>
          {selectedPatient && (
            <Button
              variant="outlined"
              onClick={() => setRecordUploadOpen(true)}
              sx={{ minHeight: { xs: 44, md: 40 } }}
            >
              Upload Record
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ minHeight: { xs: 44, md: 40 } }}
          >
            New Patient
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          overflowX: { xs: 'auto', md: 'visible' },
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="patient tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minHeight: { xs: 44, md: 48 },
              px: { xs: 1, sm: 2 },
            },
          }}
        >
          <Tab label="Patient List" id="patient-tab-0" aria-controls="patient-tabpanel-0" />
          <Tab
            label={selectedPatient ? `Details - ${selectedPatient.name}` : 'Patient Details'}
            id="patient-tab-1"
            aria-controls="patient-tabpanel-1"
            disabled={!selectedPatient}
          />
          <Tab
            label="Medical Records"
            id="patient-tab-2"
            aria-controls="patient-tabpanel-2"
            disabled={!selectedPatient}
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
          {/* Patient List Tab */}
          <TabPanel value={tabValue} index={0}>
            <PatientList
              patients={patients}
              isLoading={isLoading}
              error={error}
              onSelectPatient={handleSelectPatient}
            />
          </TabPanel>

          {/* Patient Detail Tab */}
          <TabPanel value={tabValue} index={1}>
            {selectedPatient && (
              <PatientDetail
                patientId={selectedPatient.id}
                onClose={handleCloseDetail}
              />
            )}
          </TabPanel>

          {/* Medical Records (Timeline) Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 2 },
                mb: { xs: 1.5, sm: 2 },
              }}>
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
                >
                  Patient Timeline
                </Typography>
                <Button
                  size="small"
                  onClick={() => setRecordUploadOpen(true)}
                  sx={{ 
                    minHeight: { xs: 40, md: 36 },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Upload Record
                </Button>
              </Box>
              {selectedPatient && (
                <PatientTimeline patientId={selectedPatient.id} />
              )}
            </Box>
          </TabPanel>
        </Box>
      </Paper>

      {/* Create Patient Dialog */}
      <CreatePatientDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      {/* Record Upload Dialog */}
      <RecordUploadDialog
        open={recordUploadOpen}
        patientId={selectedPatient?.id || null}
        onClose={() => setRecordUploadOpen(false)}
      />
    </Box>
  );
};

export default PatientsPage;
