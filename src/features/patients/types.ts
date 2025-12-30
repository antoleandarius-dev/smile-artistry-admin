/**
 * Patient Types
 * Type definitions for patients, medical records, and timeline data
 */

export type PatientGender = 'male' | 'female' | 'other';
export type RecordSource = 'scan' | 'photo';
export type TimelineEventType = 'appointment' | 'consultation' | 'prescription' | 'migrated_record';

/**
 * Patient Info
 */
export interface Patient {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  gender?: PatientGender;
  date_of_birth?: string; // ISO date string (YYYY-MM-DD)
  created_at: string; // ISO date-time string
  updated_at: string; // ISO date-time string
}

/**
 * Create/Update Patient Request
 */
export interface CreatePatientRequest {
  name: string;
  phone?: string;
  email?: string;
  gender?: PatientGender;
  date_of_birth?: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Patient with appointments (detail view)
 */
export interface PatientDetail extends Patient {
  appointments?: PatientAppointment[];
}

/**
 * Simplified appointment data in patient context
 */
export interface PatientAppointment {
  id: number;
  appointment_type: 'in_person' | 'tele';
  scheduled_at: string; // ISO date-time string
  status: 'scheduled' | 'in_call' | 'completed' | 'cancelled';
  created_at: string;
}

/**
 * Consultation record
 */
export interface Consultation {
  id: number;
  appointment_id: number;
  doctor_id: number;
  notes?: string;
  chief_complaint?: string;
  diagnosis?: string;
  created_at: string;
}

/**
 * Prescription record
 */
export interface Prescription {
  id: number;
  consultation_id: number;
  medication: string;
  dosage?: string;
  duration?: string;
  instructions?: string;
  created_at: string;
}

/**
 * Migrated/Old Record
 */
export interface MigratedRecord {
  id: number;
  patient_id: number;
  file_url: string;
  file_name: string;
  source: RecordSource; // 'scan' or 'photo'
  notes?: string;
  uploaded_at: string; // ISO date-time string
  uploaded_by_user_id: number;
}

/**
 * Create Migrated Record Request
 */
export interface CreateMigratedRecordRequest {
  patient_id: number;
  source: RecordSource;
  notes?: string;
  // File data is handled separately via FormData
}

/**
 * Timeline Event (union of all event types)
 */
export type TimelineEvent = 
  | { type: 'appointment'; data: PatientAppointment }
  | { type: 'consultation'; data: Consultation }
  | { type: 'prescription'; data: Prescription }
  | { type: 'migrated_record'; data: MigratedRecord };

/**
 * Patient Timeline Response
 */
export interface PatientTimeline {
  patient_id: number;
  events: TimelineEvent[];
}

/**
 * Patient List Filters
 */
export interface PatientFilters {
  search?: string; // Search by name or phone
  branch_id?: number;
}
