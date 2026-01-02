/**
 * Doctors Feature Index
 * Exports components, hooks, and types for the doctors feature
 */

// Components
export { default as DoctorList } from './components/DoctorList';
export { default as DoctorDetail } from './components/DoctorDetail';
export { default as DoctorAvailability } from './components/DoctorAvailability';
export { default as AddDoctorForm } from './components/AddDoctorForm';
export { default as DoctorManagementTable } from './components/DoctorManagementTable';

// Hooks
export {
  useDoctors,
  useDoctor,
  useDoctorAvailability,
  useSearchDoctors,
  useCreateDoctor,
  useUpdateDoctorStatus,
  useAssignDoctorBranches,
  doctorKeys,
} from './hooks';

// Service
export { doctorService } from './doctor.service';
export type { CreateDoctorRequest, UpdateDoctorStatusRequest, AssignDoctorBranchesRequest } from './doctor.service';

// Types
export type {
  Doctor,
  DoctorDetail as DoctorDetailType,
  Availability,
  WorkingDay,
  TimeSlot,
  DoctorFilters,
  DayOfWeek,
  Branch,
} from './types';
