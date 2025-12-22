import { Typography, Paper, Box } from '@mui/material';

const DoctorsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Doctors
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Doctor management will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DoctorsPage;
