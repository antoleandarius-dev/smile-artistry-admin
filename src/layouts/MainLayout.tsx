import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { RESPONSIVE_PATTERNS } from '../styles/responsive';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar onMenuClick={handleSidebarToggle} />
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose}
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          ...RESPONSIVE_PATTERNS.responsivePadding,
          minHeight: '100vh',
          backgroundColor: { xs: '#fafafa', md: 'transparent' },
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
