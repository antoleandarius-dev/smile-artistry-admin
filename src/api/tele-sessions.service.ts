import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface TeleSessionAdminResponse {
  id: number;
  appointment_id: number;
  provider: 'zoom' | 'google_meet';
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  doctor_name: string;
  patient_name: string;
  branch_name: string;
  status: 'scheduled' | 'in_call' | 'completed' | 'cancelled';
  appointment_scheduled_at: string | null;
}

export interface TeleSessionListParams {
  skip?: number;
  limit?: number;
  branch_id?: number;
  doctor_id?: number;
  status?: 'scheduled' | 'in_call' | 'completed' | 'cancelled';
}

export const teleSessionsService = {
  /**
   * List all tele-consultation sessions (admin only)
   */
  async listSessions(
    params?: TeleSessionListParams
  ): Promise<TeleSessionAdminResponse[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) {
      queryParams.append('skip', params.skip.toString());
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.branch_id !== undefined) {
      queryParams.append('branch_id', params.branch_id.toString());
    }
    if (params?.doctor_id !== undefined) {
      queryParams.append('doctor_id', params.doctor_id.toString());
    }
    if (params?.status !== undefined) {
      queryParams.append('status', params.status);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.TELE_SESSIONS.ADMIN_LIST}?${queryString}`
      : API_ENDPOINTS.TELE_SESSIONS.ADMIN_LIST;

    const response = await apiClient.get<TeleSessionAdminResponse[]>(url);
    return response.data;
  },

  /**
   * Get tele-session details for a specific appointment (admin only)
   */
  async getSessionByAppointment(
    appointmentId: number
  ): Promise<TeleSessionAdminResponse | null> {
    const response = await apiClient.get<TeleSessionAdminResponse | null>(
      API_ENDPOINTS.TELE_SESSIONS.ADMIN_BY_APPOINTMENT(appointmentId)
    );
    return response.data;
  },
};
