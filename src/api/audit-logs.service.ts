import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface AuditLog {
  id: number;
  user_id?: number;
  user_name?: string;
  user_role?: string;
  action: string;
  entity_type: string;
  entity_id?: number;
  timestamp: string;
}

export interface AuditLogFilterParams {
  skip?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  user_id?: number;
  action?: string;
  entity_type?: string;
}

export interface AuditLogListResponse {
  items: AuditLog[];
  total: number;
  skip: number;
  limit: number;
}

export const auditLogsService = {
  /**
   * Get audit logs with optional filtering
   */
  getAuditLogs: async (params?: AuditLogFilterParams): Promise<AuditLogListResponse> => {
    const response = await apiClient.get<AuditLogListResponse>(
      API_ENDPOINTS.AUDIT_LOGS.LIST,
      { params }
    );
    return response.data;
  },

  /**
   * Get a specific audit log entry
   */
  getAuditLogDetail: async (logId: number): Promise<AuditLog> => {
    const response = await apiClient.get<AuditLog>(
      API_ENDPOINTS.AUDIT_LOGS.GET(logId)
    );
    return response.data;
  },

  /**
   * Get available action types for filtering
   */
  getAvailableActions: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      API_ENDPOINTS.AUDIT_LOGS.ACTIONS
    );
    return response.data;
  },

  /**
   * Get available entity types for filtering
   */
  getAvailableEntityTypes: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      API_ENDPOINTS.AUDIT_LOGS.ENTITY_TYPES
    );
    return response.data;
  },
};
