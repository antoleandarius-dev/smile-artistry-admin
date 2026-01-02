/**
 * Doctor Types
 * Type definitions for doctors and their availability
 */

export interface Branch {
  id: number;
  name: string;
}

export interface Doctor {
  id: number;
  user_id: number;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  registration_no?: string;
  registration_number?: string;
  branch_id?: number;
  branch_name?: string;
  branches?: Branch[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Doctor Detail (extended information)
 */
export interface DoctorDetail extends Doctor {
  availability?: Availability;
}

/**
 * Doctor Availability
 */
export interface Availability {
  id?: number;
  doctor_id: number;
  working_days: WorkingDay[];
  time_slots?: TimeSlot[];
}

/**
 * Working Day (e.g., Monday, Tuesday)
 */
export interface WorkingDay {
  day: DayOfWeek;
  is_working: boolean;
  start_time?: string; // HH:MM format
  end_time?: string; // HH:MM format
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Time Slot for appointments
 */
export interface TimeSlot {
  id?: number;
  doctor_id: number;
  date: string; // ISO date string (YYYY-MM-DD)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
}

/**
 * Filters for doctor list
 */
export interface DoctorFilters {
  branch_id?: number;
  specialization?: string;
  is_active?: boolean;
}
