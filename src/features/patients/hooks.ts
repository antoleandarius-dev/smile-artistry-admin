/**
 * Patient Hooks
 * React Query hooks for patient data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from './patient.service';
import type { PatientFilters, CreatePatientRequest } from './types';

// Query keys
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (filters?: PatientFilters) => [...patientKeys.lists(), filters] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: number) => [...patientKeys.details(), id] as const,
  timelines: () => [...patientKeys.all, 'timeline'] as const,
  timeline: (id: number) => [...patientKeys.timelines(), id] as const,
  records: () => [...patientKeys.all, 'records'] as const,
  recordsByPatient: (patientId: number) => [...patientKeys.records(), patientId] as const,
};

/**
 * Hook to fetch all patients with optional filters
 */
export const usePatients = (filters?: PatientFilters) => {
  return useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: () => patientService.getPatients(filters),
  });
};

/**
 * Hook to fetch a single patient with appointments
 */
export const usePatient = (id: number | null) => {
  return useQuery({
    queryKey: patientKeys.detail(id ?? 0),
    queryFn: () => patientService.getPatientDetail(id!),
    enabled: !!id,
  });
};

/**
 * Hook to create a new patient
 */
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientRequest) =>
      patientService.createPatient(data),
    onSuccess: () => {
      // Invalidate patient lists to refetch
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};

/**
 * Hook to update a patient
 */
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePatientRequest> }) =>
      patientService.updatePatient(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific patient and all lists
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};

/**
 * Hook to fetch patient's timeline (appointments, consultations, prescriptions, records)
 */
export const usePatientTimeline = (patientId: number | null) => {
  return useQuery({
    queryKey: patientKeys.timeline(patientId ?? 0),
    queryFn: () => patientService.getPatientTimeline(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook to fetch migrated records for a patient
 */
export const useMigratedRecords = (patientId: number | null) => {
  return useQuery({
    queryKey: patientKeys.recordsByPatient(patientId ?? 0),
    queryFn: () => patientService.getMigratedRecords(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook to upload a migrated record (old record/scan)
 */
export const useUploadMigratedRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      file,
      source,
      notes,
    }: {
      patientId: number;
      file: File;
      source: 'scan' | 'photo';
      notes?: string;
    }) => patientService.uploadMigratedRecord(patientId, file, source, notes),
    onSuccess: (_, variables) => {
      // Invalidate timeline and records for this patient
      queryClient.invalidateQueries({ queryKey: patientKeys.timeline(variables.patientId) });
      queryClient.invalidateQueries({
        queryKey: patientKeys.recordsByPatient(variables.patientId),
      });
    },
  });
};
