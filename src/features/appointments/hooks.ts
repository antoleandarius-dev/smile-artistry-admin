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
} from './types';

// Query keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters?: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
  patients: ['patients'] as const,
  doctors: ['doctors'] as const,
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
 * Hook to fetch all patients
 */
export const usePatients = () => {
  return useQuery({
    queryKey: appointmentKeys.patients,
    queryFn: () => appointmentService.getPatients(),
  });
};

/**
 * Hook to fetch all doctors
 */
export const useDoctors = () => {
  return useQuery({
    queryKey: appointmentKeys.doctors,
    queryFn: () => appointmentService.getDoctors(),
  });
};
