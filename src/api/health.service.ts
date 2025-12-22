import apiClient from './client';

/**
 * Health Check Service
 * Verifies backend connectivity and API health
 */
export const healthService = {
  /**
   * Check if backend API is reachable and healthy
   * @returns Promise with health status
   */
  checkHealth: async (): Promise<{ status: string; message?: string }> => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  /**
   * Check authenticated endpoint (requires valid token)
   * @returns Promise with user info or throws error
   */
  checkAuth: async (): Promise<boolean> => {
    try {
      await apiClient.get('/auth/me');
      return true;
    } catch {
      return false;
    }
  },
};
