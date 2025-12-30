/**
 * Doctor Service
 * Handles all doctor-related API calls
 */

import { apiClient, API_ENDPOINTS } from '../../api';
import type { Doctor, DoctorDetail, DoctorFilters, Availability } from './types';

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
};
