/**
 * Branches Service
 * Handles all branch-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';

export interface Branch {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  is_active: boolean;
}

export const branchService = {
  /**
   * Get all branches
   */
  getBranches: async (): Promise<Branch[]> => {
    const response = await apiClient.get<Branch[]>(API_ENDPOINTS.BRANCHES.LIST);
    return response.data;
  },

  /**
   * Get a single branch
   */
  getBranch: async (id: number): Promise<Branch> => {
    const response = await apiClient.get<Branch>(API_ENDPOINTS.BRANCHES.GET(id));
    return response.data;
  },
};
