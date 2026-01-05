/**
 * Patient Feature Index
 * Exports all patient-related components, hooks, and types
 */

// Components
export { default as PatientList } from './components/PatientList';
export { default as CreatePatientDialog } from './components/CreatePatientDialog';
export { default as RecordUploadDialog } from './components/RecordUploadDialog';

// Hooks
export {
  usePatients,
  usePatient,
  useCreatePatient,
  useUpdatePatient,
  usePatientTimeline,
  useMigratedRecords,
  useUploadMigratedRecord,
  patientKeys,
} from './hooks';

// Types
export type {
  Patient,
  PatientDetail,
  PatientGender,
  PatientAppointment,
  PatientTimeline,
  Consultation,
  Prescription,
  MigratedRecord,
  RecordSource,
  TimelineEvent,
  TimelineEventType,
  CreatePatientRequest,
  CreateMigratedRecordRequest,
  PatientFilters,
} from './types';

// Service
export { patientService } from './patient.service';
