/**
 * API Endpoint Definitions
 * Centralized paths for all API endpoints
 * All paths are relative to the base URL (/api/v1)
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
  },

  // Users
  USERS: {
    LIST: '/users/',
    CREATE: '/users/',
    GET: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
  },

  // Roles
  ROLES: {
    LIST: '/roles/',
    CREATE: '/roles/',
    GET: (id: number) => `/roles/${id}`,
  },

  // Branches
  BRANCHES: {
    LIST: '/branches/',
    CREATE: '/branches/',
    GET: (id: number) => `/branches/${id}`,
    UPDATE: (id: number) => `/branches/${id}`,
  },

  // User Branches
  USER_BRANCHES: {
    LIST: '/user-branches/',
    CREATE: '/user-branches/',
    GET: (id: number) => `/user-branches/${id}`,
    DELETE: (id: number) => `/user-branches/${id}`,
  },

  // Doctors
  DOCTORS: {
    LIST: '/doctors/',
    CREATE: '/doctors/',
    GET: (id: number) => `/doctors/${id}`,
    UPDATE: (id: number) => `/doctors/${id}`,
  },

  // Patients
  PATIENTS: {
    LIST: '/patients/',
    CREATE: '/patients/',
    GET: (id: number) => `/patients/${id}`,
    UPDATE: (id: number) => `/patients/${id}`,
    TIMELINE: (id: number) => `/patients/${id}/timeline`,
    MY_TIMELINE: '/patients/my-timeline',
  },

  // Appointments
  APPOINTMENTS: {
    LIST: '/appointments/',
    CREATE: '/appointments/',
    GET: (id: number) => `/appointments/${id}`,
    UPDATE: (id: number) => `/appointments/${id}`,
    RESCHEDULE: (id: number) => `/appointments/${id}/reschedule`,
    CANCEL: (id: number) => `/appointments/${id}/cancel`,
  },

  // Consultations
  CONSULTATIONS: {
    CREATE: '/consultations/',
    GET: (id: number) => `/consultations/${id}`,
    BY_APPOINTMENT: (appointmentId: number) => `/consultations/appointment/${appointmentId}`,
    DENTAL_CHARTS: (id: number) => `/consultations/${id}/dental-charts`,
  },

  // Prescriptions
  PRESCRIPTIONS: {
    CREATE: '/prescriptions/',
    GET: (id: number) => `/prescriptions/${id}`,
    BY_CONSULTATION: (consultationId: number) => `/prescriptions/consultation/${consultationId}`,
    MY_PRESCRIPTIONS: '/prescriptions/patient/my-prescriptions',
  },

  // Tele Sessions
  TELE_SESSIONS: {
    START: '/tele-sessions/start',
    GET: (id: number) => `/tele-sessions/${id}`,
    JOIN: (id: number) => `/tele-sessions/${id}/join`,
    END: (id: number) => `/tele-sessions/${id}/end`,
  },

  // Migrated Records
  MIGRATED_RECORDS: {
    LIST: '/migrated-records/',
    CREATE: '/migrated-records/',
    GET: (id: number) => `/migrated-records/${id}`,
    BY_PATIENT: (patientId: number) => `/migrated-records/patient/${patientId}`,
    UPLOAD_URL: '/migrated-records/upload-url',
  },

  // Webhooks
  WEBHOOKS: {
    TELE_SESSION_END: '/webhooks/tele-session/end',
  },
} as const;
