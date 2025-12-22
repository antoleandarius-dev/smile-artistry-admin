import { Typography, Paper, Box } from '@mui/material';

const RecordsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Records
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Medical records management will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RecordsPage;
