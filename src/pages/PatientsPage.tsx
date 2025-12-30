/**
 * PatientsPage
 * Main page for managing patients and viewing medical records
 */

import { useState } from 'react';
import { Typography, Box, Button, Grid, Paper, Tabs, Tab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  PatientList,
  CreatePatientDialog,
  PatientDetail,
  PatientTimeline,
  RecordUploadDialog,
  usePatients,
} from '../features/patients';
import type { Patient } from '../features/patients';

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
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Patients</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedPatient && (
            <Button
              variant="outlined"
              onClick={() => setRecordUploadOpen(true)}
            >
              Upload Record
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            New Patient
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="patient tabs"
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
        <Box sx={{ p: 3 }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Patient Timeline</Typography>
                <Button
                  size="small"
                  onClick={() => setRecordUploadOpen(true)}
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
