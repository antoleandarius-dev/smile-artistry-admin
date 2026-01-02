import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type {
  TeleSessionAdminResponse,
  TeleSessionListParams,
} from '../api/tele-sessions.service';
import { teleSessionsService } from '../api/tele-sessions.service';
import { branchService } from '../api/branches.service';
import { usersService, type User } from '../api/users.service';
import TeleConsultFilters, {
  type TeleConsultFiltersState,
} from '../features/tele-consults/components/TeleConsultFilters';
import TeleConsultTable from '../features/tele-consults/components/TeleConsultTable';
import TeleConsultDetailView from '../features/tele-consults/components/TeleConsultDetailView';

const AdminTeleConsultsPage: React.FC = () => {
  const [filters, setFilters] = useState<TeleConsultFiltersState>({
    startDate: '',
    endDate: '',
    doctorId: undefined,
    branchId: undefined,
    status: undefined,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSession, setSelectedSession] =
    useState<TeleSessionAdminResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch tele-sessions
  const { data: sessions = [], isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: [
      'tele-sessions-admin',
      page,
      rowsPerPage,
      filters,
    ],
    queryFn: async () => {
      return await teleSessionsService.listSessions({
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        branch_id: filters.branchId,
        doctor_id: filters.doctorId,
        status: filters.status as TeleSessionListParams['status'],
      });
    },
  });

  // Fetch branches for filter
  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ['branches-for-filter'],
    queryFn: async () => {
      const result = await branchService.getBranches();
      return result;
    },
  });

  // Fetch doctors for filter
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors-for-filter'],
    queryFn: async () => {
      // Assuming usersService can list doctors
      const users = await usersService.getUsers();
      // Filter for doctors by checking if they have a related doctor record
      // For now, we'll just return users with role_id for doctors
      // You may need to adjust this based on your actual data structure
      return users
        .filter((u: User) => u.role_name === 'doctor')
        .map((u: User) => ({
          id: u.id,
          name: u.name,
        }));
    },
  });

  const handleFilterChange = (newFilters: TeleConsultFiltersState) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const handleViewDetails = (session: TeleSessionAdminResponse) => {
    setSelectedSession(session);
    setDetailsOpen(true);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isFilterLoading = branchesLoading || doctorsLoading;

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <h1>Tele-Consultation Sessions</h1>
          <p>View and monitor all tele-consultation sessions across branches and doctors.</p>
        </CardContent>
      </Card>

      {sessionsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(sessionsError as Error)?.message || 'Failed to load tele-consultation sessions'}
        </Alert>
      )}

      <TeleConsultFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        doctors={doctors}
        branches={branches}
        isLoading={isFilterLoading || sessionsLoading}
      />

      <TeleConsultTable
        sessions={sessions}
        isLoading={sessionsLoading || isFilterLoading}
        onViewDetails={handleViewDetails}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={sessions.length} // In a real app, you'd get this from a separate count endpoint
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <TeleConsultDetailView
        session={selectedSession}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedSession(null);
        }}
      />
    </Box>
  );
};

export default AdminTeleConsultsPage;
