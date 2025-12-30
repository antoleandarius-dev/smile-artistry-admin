/**
 * Appointment Types
 * Type definitions for appointments, patients, and doctors
 */

export type AppointmentType = 'in_person' | 'tele';
export type AppointmentStatus = 'scheduled' | 'in_call' | 'completed' | 'cancelled';
export type TeleSessionStatus = 'pending' | 'active' | 'completed';

export interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface Doctor {
  id: number;
  user_id: number;
  specialization?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  branch_id: number;
  appointment_type: AppointmentType;
  scheduled_at: string; // ISO date-time string
  status: AppointmentStatus;
  created_at: string;
}

export interface CreateAppointmentRequest {
  patient_id: number;
  doctor_id: number;
  branch_id: number;
  appointment_type: AppointmentType;
  scheduled_at: string; // ISO date-time string
}

export interface RescheduleAppointmentRequest {
  scheduled_at: string; // ISO date-time string
}

export interface AppointmentFilters {
  branch_id?: number;
  doctor_id?: number;
  patient_id?: number;
  status_filter?: AppointmentStatus;
}
