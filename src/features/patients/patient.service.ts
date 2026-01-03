/**
 * Patient Service
 * Handles all patient-related API calls
 */

import { apiClient, API_ENDPOINTS } from '../../api';
import type {
  Patient,
  PatientDetail,
  PatientTimeline,
  MigratedRecord,
  CreatePatientRequest,
  PatientFilters,
} from './types';

export const patientService = {
  /**
   * Get all patients with optional filters
   */
  getPatients: async (filters?: PatientFilters): Promise<Patient[]> => {
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.branch_id) {
      params.append('branch_id', filters.branch_id.toString());
    }

    const url = params.toString() 
      ? `${API_ENDPOINTS.PATIENTS.LIST}?${params.toString()}`
      : API_ENDPOINTS.PATIENTS.LIST;

    const response = await apiClient.get<{ patients: Patient[]; total: number; skip: number; limit: number }>(url);
    return response.data.patients;
  },

  /**
   * Get a single patient by ID with appointments
   */
  getPatientDetail: async (id: number): Promise<PatientDetail> => {
    const response = await apiClient.get<PatientDetail>(API_ENDPOINTS.PATIENTS.GET(id));
    return response.data;
  },

  /**
   * Create a new patient
   */
  createPatient: async (data: CreatePatientRequest): Promise<Patient> => {
    const response = await apiClient.post<Patient>(API_ENDPOINTS.PATIENTS.CREATE, data);
    return response.data;
  },

  /**
   * Update a patient
   */
  updatePatient: async (id: number, data: Partial<CreatePatientRequest>): Promise<Patient> => {
    const response = await apiClient.patch<Patient>(
      API_ENDPOINTS.PATIENTS.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Get patient's timeline (appointments, consultations, prescriptions, migrated records)
   * Chronologically sorted from newest to oldest
   */
  getPatientTimeline: async (patientId: number): Promise<PatientTimeline> => {
    const response = await apiClient.get<PatientTimeline>(
      API_ENDPOINTS.PATIENTS.TIMELINE(patientId)
    );
    return response.data;
  },

  /**
   * Get migrated records for a patient
   */
  getMigratedRecords: async (patientId: number): Promise<MigratedRecord[]> => {
    const response = await apiClient.get<MigratedRecord[]>(
      API_ENDPOINTS.MIGRATED_RECORDS.BY_PATIENT(patientId)
    );
    return response.data;
  },

  /**
   * Upload a migrated record (old record/scan)
   * Handles file upload with FormData
   */
  uploadMigratedRecord: async (
    patientId: number,
    file: File,
    source: 'scan' | 'photo',
    notes?: string
  ): Promise<MigratedRecord> => {
    const formData = new FormData();
    formData.append('patient_id', patientId.toString());
    formData.append('file', file);
    formData.append('source', source);
    if (notes) {
      formData.append('notes', notes);
    }

    // Use axios directly to avoid JSON serialization of FormData
    const response = await apiClient.post<MigratedRecord>(
      API_ENDPOINTS.MIGRATED_RECORDS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
