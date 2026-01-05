import { Typography, Paper, Box } from '@mui/material';
import { RESPONSIVE_PATTERNS } from '../styles/responsive';

const RecordsPage = () => {
  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          mb: { xs: 2, sm: 3 },
        }}
      >
        Records
      </Typography>
      <Paper 
        sx={{ 
          ...RESPONSIVE_PATTERNS.responsivePadding,
          mt: { xs: 1.5, sm: 2, md: 2.5 },
        }}
      >
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Medical records management will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RecordsPage;
