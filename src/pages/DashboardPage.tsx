import { Typography, Box, Paper } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Welcome to Smile Artistry Admin Portal
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
