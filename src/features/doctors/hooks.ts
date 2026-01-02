/**
 * Doctor Hooks
 * React Query hooks for doctor data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from './doctor.service';
import type { DoctorFilters } from './types';
import type { CreateDoctorRequest, UpdateDoctorStatusRequest, AssignDoctorBranchesRequest } from './doctor.service';

// Query keys
export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (filters?: DoctorFilters) => [...doctorKeys.lists(), filters] as const,
  search: (query: string) => [...doctorKeys.all, 'search', query] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: number) => [...doctorKeys.details(), id] as const,
  availability: (id: number) => [...doctorKeys.all, 'availability', id] as const,
};

/**
 * Hook to fetch all doctors with optional filters
 */
export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: () => doctorService.getDoctors(filters),
  });
};

/**
 * Hook to fetch a single doctor
 */
export const useDoctor = (id: number) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorService.getDoctor(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch doctor availability
 */
export const useDoctorAvailability = (id: number) => {
  return useQuery({
    queryKey: doctorKeys.availability(id),
    queryFn: () => doctorService.getDoctorAvailability(id),
    enabled: !!id,
  });
};

/**
 * Hook to search doctors by name or specialization
 */
export const useSearchDoctors = (query: string) => {
  return useQuery({
    queryKey: doctorKeys.search(query),
    queryFn: () => doctorService.searchDoctors(query),
    enabled: !!query && query.length > 0,
  });
};

/**
 * Hook to create a new doctor (admin only)
 */
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorData: CreateDoctorRequest) => doctorService.createDoctor(doctorData),
    onSuccess: () => {
      // Invalidate doctor list to refetch
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
  });
};

/**
 * Hook to update doctor status (admin only)
 */
export const useUpdateDoctorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, statusUpdate }: { doctorId: number; statusUpdate: UpdateDoctorStatusRequest }) =>
      doctorService.updateDoctorStatus(doctorId, statusUpdate),
    onSuccess: (data) => {
      // Invalidate doctor queries
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(data.id) });
    },
  });
};

/**
 * Hook to assign branches to doctor (admin only)
 */
export const useAssignDoctorBranches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, branchesData }: { doctorId: number; branchesData: AssignDoctorBranchesRequest }) =>
      doctorService.assignDoctorBranches(doctorId, branchesData),
    onSuccess: (data) => {
      // Invalidate doctor queries
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(data.id) });
    },
  });
};
