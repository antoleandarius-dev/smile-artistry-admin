/**
 * Doctors Feature Index
 * Exports components, hooks, and types for the doctors feature
 */

// Components
export { default as DoctorList } from './components/DoctorList';
export { default as DoctorDetail } from './components/DoctorDetail';
export { default as DoctorAvailability } from './components/DoctorAvailability';

// Hooks
export { useDoctors, useDoctor, useDoctorAvailability, useSearchDoctors, doctorKeys } from './hooks';

// Service
export { doctorService } from './doctor.service';

// Types
export type { Doctor, DoctorDetail as DoctorDetailType, Availability, WorkingDay, TimeSlot, DoctorFilters, DayOfWeek } from './types';
