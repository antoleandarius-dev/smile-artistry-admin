import { AppBar, Toolbar, Typography, IconButton, Box, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getUserData } from '../shared/utils/auth';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const userData = getUserData();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Smile Artistry Admin
        </Typography>
        {userData && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {userData.name}
              </Typography>
              <Chip 
                label={userData.role} 
                size="small" 
                sx={{ 
                  height: 20, 
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }} 
              />
            </Box>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
