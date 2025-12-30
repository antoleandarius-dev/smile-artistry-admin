/**
 * Doctor Hooks
 * React Query hooks for doctor data management
 */

import { useQuery } from '@tanstack/react-query';
import { doctorService } from './doctor.service';
import type { DoctorFilters } from './types';

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
