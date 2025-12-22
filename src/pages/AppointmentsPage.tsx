import { Typography, Paper, Box } from '@mui/material';

const AppointmentsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Appointment management will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AppointmentsPage;
