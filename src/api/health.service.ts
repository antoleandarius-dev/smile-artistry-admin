import axios from 'axios';
import { apiConfig } from './config';

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
      // Health endpoint is at /health/, not under /api/v1
      const baseUrl = apiConfig.baseURL.replace('/api/v1', '');
      const response = await axios.get(`${baseUrl}/health/`);
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
      // Check if we have a valid token in localStorage
      const token = localStorage.getItem('token');
      return !!token;
    } catch {
      return false;
    }
  },
};
