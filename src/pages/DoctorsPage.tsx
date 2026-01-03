import { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { DoctorList, type DoctorDetail, DoctorAvailability, useDoctors, useDoctor, useDoctorAvailability } from '../features/doctors';
import type { Doctor } from '../features/doctors';

const DoctorsPage = () => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  // Fetch all doctors
  const { data: doctors = [], isLoading: doctorsLoading, error: doctorsError } = useDoctors();

  // Fetch selected doctor details
  const { data: selectedDoctor, isLoading: doctorLoading, error: doctorError } = useDoctor(selectedDoctorId || 0);

  // Fetch selected doctor availability
  const { data: availability, isLoading: availabilityLoading, error: availabilityError } = useDoctorAvailability(selectedDoctorId || 0);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctorId(doctor.id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Doctors Directory
      </Typography>

      <Grid container spacing={3}>
        {/* Doctors List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Available Doctors
            </Typography>
            <DoctorList
              doctors={doctors}
              isLoading={doctorsLoading}
              error={doctorsError}
              onSelectDoctor={handleSelectDoctor}
            />
          </Paper>
        </Grid>

        {/* Doctor Details and Availability */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {/* Doctor Details */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Doctor Information
                </Typography>
                {selectedDoctorId ? (
                  <DoctorDetail
                    doctor={selectedDoctor || null}
                    isLoading={doctorLoading}
                    error={doctorError}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Select a doctor from the list to view details.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Availability */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Availability
                </Typography>
                {selectedDoctorId ? (
                  <DoctorAvailability
                    availability={availability || null}
                    isLoading={availabilityLoading}
                    error={availabilityError}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Select a doctor to view availability.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorsPage;
