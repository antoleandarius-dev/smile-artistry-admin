import { AppBar, Toolbar, Typography, IconButton, Box, Chip, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getUserData } from '../shared/utils/auth';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const userData = getUserData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: { xs: '#1976d2', md: 'inherit' },
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {/* Menu Icon */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: { xs: 1, sm: 2 },
            p: { xs: 1, sm: 1.25 },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
        </IconButton>

        {/* Title */}
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            fontWeight: { xs: 600, md: 500 },
            letterSpacing: { xs: 0, md: 0.5 },
          }}
        >
          {isMobile ? 'Admin' : 'Smile Artistry Admin'}
        </Typography>

        {/* User Info */}
        {userData && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              ml: { xs: 1, sm: 2 },
            }}
          >
            {/* User Details - Hidden on very small screens */}
            <Box 
              sx={{ 
                textAlign: 'right',
                mr: { xs: 0.5, sm: 1 },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                }}
              >
                {userData.name}
              </Typography>
              <Chip 
                label={userData.role} 
                size="small" 
                sx={{ 
                  height: { xs: 18, md: 20 },
                  fontSize: { xs: '0.6rem', md: '0.7rem' },
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '& .MuiChip-label': {
                    px: { xs: 0.5, sm: 1 },
                  },
                }} 
              />
            </Box>

            {/* Account Icon */}
            <IconButton 
              color="inherit"
              sx={{
                p: { xs: 0.75, sm: 1 },
                minWidth: { xs: 44, md: 40 },
                minHeight: { xs: 44, md: 40 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <AccountCircle sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }} />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
