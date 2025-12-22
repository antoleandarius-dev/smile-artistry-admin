/**
 * Appointment Service
 * Handles all appointment-related API calls
 */

import apiClient from '../../api/client';
import type {
  Appointment,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  AppointmentFilters,
  Patient,
  Doctor,
} from './types';

export const appointmentService = {
  /**
   * Get all appointments with optional filters
   */
  getAppointments: async (filters?: AppointmentFilters): Promise<Appointment[]> => {
    const params = new URLSearchParams();
    
    if (filters?.date) {
      params.append('date', filters.date);
    }
    if (filters?.doctor_id) {
      params.append('doctor_id', filters.doctor_id.toString());
    }
    if (filters?.patient_id) {
      params.append('patient_id', filters.patient_id.toString());
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }

    const response = await apiClient.get<Appointment[]>(
      `/appointments${params.toString() ? `?${params.toString()}` : ''}`
    );
    
    return response.data;
  },

  /**
   * Get a single appointment by ID
   */
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  /**
   * Create a new appointment
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  },

  /**
   * Reschedule an appointment
   */
  rescheduleAppointment: async (
    id: number,
    data: RescheduleAppointmentRequest
  ): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (id: number): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, {
      status: 'cancelled',
    });
    return response.data;
  },

  /**
   * Get all patients (for appointment creation)
   */
  getPatients: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/patients');
    return response.data;
  },

  /**
   * Get all doctors (for appointment creation)
   */
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/doctors');
    return response.data;
  },
};
