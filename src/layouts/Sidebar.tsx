import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import FolderIcon from '@mui/icons-material/Folder';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../shared/utils/auth';
import { DRAWER_CONFIG, TOUCH_SPACING } from '../styles/responsive';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isSmallScreen?: boolean;
}

const Sidebar = ({ open, onClose, isSmallScreen = false }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Appointments', icon: <CalendarMonthIcon />, path: '/appointments' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
    { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors' },
    { text: 'Records', icon: <FolderIcon />, path: '/records' },
  ];

  const adminMenuItems = [
    { text: 'Doctor Management', icon: <ManageAccountsIcon />, path: '/admin/doctors' },
    { text: 'Users & Roles', icon: <SecurityIcon />, path: '/admin/users' },
    { text: 'Branch Management', icon: <BusinessIcon />, path: '/admin/branches' },
    { text: 'Tele-Consultations', icon: <VideoCallIcon />, path: '/admin/tele-consults' },
    { text: 'Audit Logs', icon: <AssignmentIcon />, path: '/admin/audit-logs' },
  ];

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin';

  // Determine drawer width based on screen size
  const drawerWidth = isMobile ? DRAWER_CONFIG.widthMobile : DRAWER_CONFIG.widthDesktop;

  const sidebarContent = (
    <>
      <Toolbar />
      {/* Main Menu */}
      <List sx={{ px: { xs: 1, sm: 0 } }}>
        {mainMenuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            sx={{ mb: { xs: 0.5, sm: 0 } }}
          >
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: { xs: TOUCH_SPACING.minTouchSize, sm: 40 },
                px: { xs: 1.5, sm: 1 },
                py: { xs: 1, sm: 0.5 },
                borderRadius: { xs: 1, sm: 0 },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: { xs: 40, sm: 40 },
                  fontSize: { xs: '1.5rem', sm: '1.25rem' },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: { xs: '0.95rem', sm: '0.875rem' },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Admin Section */}
      {isAdmin && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ px: { xs: 2, sm: 1.5 }, py: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                color: 'text.secondary',
                fontSize: { xs: '0.7rem', sm: '0.65rem' },
              }}
            >
              Admin
            </Typography>
          </Box>
          <List sx={{ px: { xs: 1, sm: 0 } }}>
            {adminMenuItems.map((item) => (
              <ListItem 
                key={item.text} 
                disablePadding
                sx={{ mb: { xs: 0.5, sm: 0 } }}
              >
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: { xs: TOUCH_SPACING.minTouchSize, sm: 40 },
                    px: { xs: 1.5, sm: 1 },
                    py: { xs: 1, sm: 0.5 },
                    borderRadius: { xs: 1, sm: 0 },
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: { xs: 40, sm: 40 },
                      fontSize: { xs: '1.5rem', sm: '1.25rem' },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: { xs: '0.95rem', sm: '0.875rem' },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Logout */}
      <Divider sx={{ mt: 1 }} />
      <List sx={{ px: { xs: 1, sm: 0 } }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              minHeight: { xs: TOUCH_SPACING.minTouchSize, sm: 40 },
              px: { xs: 1.5, sm: 1 },
              py: { xs: 1, sm: 0.5 },
              borderRadius: { xs: 1, sm: 0 },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: { xs: 40, sm: 40 },
                fontSize: { xs: '1.5rem', sm: '1.25rem' },
              }}
            >
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              sx={{
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.95rem', sm: '0.875rem' },
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'temporary'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowY: 'auto',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
