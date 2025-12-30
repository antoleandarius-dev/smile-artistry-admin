/**
 * Appointment Service
 * Handles all appointment-related API calls
 */

import { apiClient, API_ENDPOINTS } from '../../api';
import type {
  Appointment,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  AppointmentFilters,
  Patient,
  Doctor,
  User,
} from './types';

export const appointmentService = {
  /**
   * Get all appointments with optional filters
   */
  getAppointments: async (filters?: AppointmentFilters): Promise<Appointment[]> => {
    const params = new URLSearchParams();
    
    if (filters?.branch_id) {
      params.append('branch_id', filters.branch_id.toString());
    }
    if (filters?.doctor_id) {
      params.append('doctor_id', filters.doctor_id.toString());
    }
    if (filters?.patient_id) {
      params.append('patient_id', filters.patient_id.toString());
    }
    if (filters?.status_filter) {
      params.append('status_filter', filters.status_filter);
    }

    const url = params.toString() 
      ? `${API_ENDPOINTS.APPOINTMENTS.LIST}?${params.toString()}`
      : API_ENDPOINTS.APPOINTMENTS.LIST;

    const response = await apiClient.get<Appointment[]>(url);
    
    return response.data;
  },

  /**
   * Get a single appointment by ID
   */
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(API_ENDPOINTS.APPOINTMENTS.GET(id));
    return response.data;
  },

  /**
   * Create a new appointment
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CREATE, data);
    return response.data;
  },

  /**
   * Reschedule an appointment
   */
  rescheduleAppointment: async (
    id: number,
    data: RescheduleAppointmentRequest
  ): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(
      API_ENDPOINTS.APPOINTMENTS.RESCHEDULE(id),
      data
    );
    return response.data;
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (id: number): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(
      API_ENDPOINTS.APPOINTMENTS.CANCEL(id),
      {}
    );
    return response.data;
  },

  /**
   * Get all patients (for appointment creation)
   */
  getPatients: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>(API_ENDPOINTS.PATIENTS.LIST);
    return response.data;
  },

  /**
   * Get all doctors (for appointment creation)
   */
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>(API_ENDPOINTS.DOCTORS.LIST);
    return response.data;
  },

  /**
   * Get all users (for mapping doctor/patient names)
   */
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
    return response.data;
  },
};
