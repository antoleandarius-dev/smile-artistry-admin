import { Typography, Paper, Box } from '@mui/material';

const PatientsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Patient management will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PatientsPage;
