import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DoctorList, DoctorDetail, DoctorAvailability, useDoctors, useDoctor, useDoctorAvailability } from '../features/doctors';
import type { Doctor } from '../features/doctors';
import { RESPONSIVE_PATTERNS } from '../styles/responsive';

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
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
        }}
      >
        Doctors Directory
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 1.5, sm: 2, md: 3 },
      }}>
        {/* Doctors List */}
        <Box>
          <Paper sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Available Doctors
            </Typography>
            <DoctorList
              doctors={doctors}
              isLoading={doctorsLoading}
              error={doctorsError}
              onSelectDoctor={handleSelectDoctor}
            />
          </Paper>
        </Box>

        {/* Doctor Details and Availability */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: { xs: 1.5, sm: 2 },
        }}>
          {/* Doctor Details */}
          <Box>
              <Paper sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                  }}
                >
                  Doctor Information
                </Typography>
                {selectedDoctorId ? (
                  <DoctorDetail
                    doctor={selectedDoctor || null}
                    isLoading={doctorLoading}
                    error={doctorError}
                  />
                ) : (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Select a doctor from the list to view details.
                  </Typography>
                )}
              </Paper>
          </Box>

          {/* Availability */}
          <Box>
              <Paper sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                  }}
                >
                  Availability
                </Typography>
                {selectedDoctorId ? (
                  <DoctorAvailability
                    availability={availability || null}
                    isLoading={availabilityLoading}
                    error={availabilityError}
                  />
                ) : (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Select a doctor to view availability.
                  </Typography>
                )}
              </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorsPage;
