import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import AdminProtectedRoute from './shared/components/AdminProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AdminDoctorsPage from './pages/AdminDoctorsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminBranchesPage from './pages/AdminBranchesPage';
import AdminTeleConsultsPage from './pages/AdminTeleConsultsPage';
import RecordsPage from './pages/RecordsPage';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AppointmentsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PatientsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DoctorsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <AdminProtectedRoute>
                  <MainLayout>
                    <AdminDoctorsPage />
                  </MainLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <MainLayout>
                    <AdminUsersPage />
                  </MainLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/branches"
              element={
                <AdminProtectedRoute>
                  <MainLayout>
                    <AdminBranchesPage />
                  </MainLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/tele-consults"
              element={
                <AdminProtectedRoute>
                  <MainLayout>
                    <AdminTeleConsultsPage />
                  </MainLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RecordsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
