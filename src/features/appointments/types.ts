/**
 * Appointment Types
 * Type definitions for appointments, patients, and doctors
 */

export type AppointmentType = 'in-clinic' | 'tele';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';
export type TeleSessionStatus = 'pending' | 'active' | 'completed';

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization?: string;
  email?: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string; // ISO date string
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  patient?: Patient;
  doctor?: Doctor;
  tele_session?: {
    id: number;
    status: TeleSessionStatus;
    session_url?: string;
  };
}

export interface CreateAppointmentRequest {
  patient_id: number;
  doctor_id: number;
  appointment_date: string; // ISO date string
  appointment_type: AppointmentType;
  notes?: string;
}

export interface RescheduleAppointmentRequest {
  appointment_date: string; // ISO date string
}

export interface AppointmentFilters {
  date?: string; // ISO date string (YYYY-MM-DD)
  doctor_id?: number;
  patient_id?: number;
  status?: AppointmentStatus;
}
