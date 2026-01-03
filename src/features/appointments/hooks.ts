/**
 * Appointment Hooks
 * React Query hooks for appointment data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from './appointment.service';
import type {
  AppointmentFilters,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  StartTeleSessionRequest,
} from './types';

// Query keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters?: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
  patients: ['patients'] as const,
  users: ['users'] as const,
  teleSessions: () => [...appointmentKeys.all, 'tele-session'] as const,
  teleSession: (id: number) => [...appointmentKeys.teleSessions(), id] as const,
};

/**
 * Hook to fetch appointments with optional filters
 */
export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentService.getAppointments(filters),
  });
};

/**
 * Hook to fetch a single appointment
 */
export const useAppointment = (id: number) => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentService.getAppointment(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new appointment
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.createAppointment(data),
    onSuccess: () => {
      // Invalidate all appointment lists to refetch
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
};

/**
 * Hook to reschedule an appointment
 */
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RescheduleAppointmentRequest }) =>
      appointmentService.rescheduleAppointment(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific appointment and all lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
};

/**
 * Hook to cancel an appointment
 */
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentService.cancelAppointment(id),
    onSuccess: (_, id) => {
      // Invalidate the specific appointment and all lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
};

/**
 * Hook to fetch all users
 */
export const useUsers = () => {
  return useQuery({
    queryKey: appointmentKeys.users,
    queryFn: () => appointmentService.getUsers(),
  });
};

/**
 * Hook to start a tele-consultation session
 */
export const useStartTeleSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartTeleSessionRequest) =>
      appointmentService.startTeleSession(data),
    onSuccess: (_, variables) => {
      // Invalidate appointment lists to refetch with updated session status
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(variables.appointment_id) });
    },
  });
};

/**
 * Hook to fetch tele-session details
 */
export const useTeleSession = (sessionId: number | null) => {
  return useQuery({
    queryKey: appointmentKeys.teleSession(sessionId || 0),
    queryFn: () => appointmentService.getTeleSession(sessionId!),
    enabled: !!sessionId,
  });
};

/**
 * Hook to join a tele-consultation session
 */
export const useJoinTeleSession = () => {
  return useMutation({
    mutationFn: (sessionId: number) =>
      appointmentService.joinTeleSession(sessionId),
  });
};

/**
 * Hook to fetch tele-session by appointment ID
 * Useful for checking if a session has already been started
 */
export const useTeleSessionByAppointment = (appointmentId: number | null) => {
  return useQuery({
    queryKey: appointmentKeys.teleSession(appointmentId || 0),
    queryFn: () => appointmentService.getTeleSessionByAppointment(appointmentId!),
    enabled: !!appointmentId,
  });
};
