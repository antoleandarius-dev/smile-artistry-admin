/**
 * Doctor Service
 * Handles all doctor-related API calls
 */

import { apiClient, API_ENDPOINTS } from '../../api';
import type { Doctor, DoctorDetail, DoctorFilters, Availability } from './types';

export interface CreateDoctorRequest {
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  registration_no: string;
  password: string;
  branch_ids?: number[];
}

export interface UpdateDoctorStatusRequest {
  is_active: boolean;
}

export interface AssignDoctorBranchesRequest {
  branch_ids: number[];
}

export const doctorService = {
  /**
   * Get all doctors with optional filters
   */
  getDoctors: async (filters?: DoctorFilters): Promise<Doctor[]> => {
    const params = new URLSearchParams();

    if (filters?.branch_id) {
      params.append('branch_id', filters.branch_id.toString());
    }
    if (filters?.specialization) {
      params.append('specialization', filters.specialization);
    }
    if (filters?.is_active !== undefined) {
      params.append('is_active', filters.is_active.toString());
    }

    const url = params.toString()
      ? `${API_ENDPOINTS.DOCTORS.LIST}?${params.toString()}`
      : API_ENDPOINTS.DOCTORS.LIST;

    const response = await apiClient.get<Doctor[]>(url);

    return response.data;
  },

  /**
   * Get a single doctor by ID
   */
  getDoctor: async (id: number): Promise<DoctorDetail> => {
    const response = await apiClient.get<DoctorDetail>(API_ENDPOINTS.DOCTORS.GET(id));

    return response.data;
  },

  /**
   * Get doctor availability
   */
  getDoctorAvailability: async (id: number): Promise<Availability> => {
    // Assuming availability endpoint, adjust if needed
    const response = await apiClient.get<Availability>(`${API_ENDPOINTS.DOCTORS.GET(id)}/availability`);

    return response.data;
  },

  /**
   * Search doctors by name or specialization
   */
  searchDoctors: async (query: string): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>(`${API_ENDPOINTS.DOCTORS.LIST}?search=${query}`);

    return response.data;
  },

  /**
   * Admin: Create a new doctor with user account
   */
  createDoctor: async (doctorData: CreateDoctorRequest): Promise<Doctor> => {
    const response = await apiClient.post<Doctor>(
      API_ENDPOINTS.DOCTORS.CREATE,
      doctorData
    );

    return response.data;
  },

  /**
   * Admin: Update doctor status (activate/deactivate)
   */
  updateDoctorStatus: async (
    doctorId: number,
    statusUpdate: UpdateDoctorStatusRequest
  ): Promise<Doctor> => {
    const response = await apiClient.patch<Doctor>(
      `${API_ENDPOINTS.DOCTORS.GET(doctorId)}/status`,
      statusUpdate
    );

    return response.data;
  },

  /**
   * Admin: Assign branches to doctor
   */
  assignDoctorBranches: async (
    doctorId: number,
    branchesData: AssignDoctorBranchesRequest
  ): Promise<Doctor> => {
    const response = await apiClient.post<Doctor>(
      `${API_ENDPOINTS.DOCTORS.GET(doctorId)}/branches`,
      branchesData
    );

    return response.data;
  },
};
