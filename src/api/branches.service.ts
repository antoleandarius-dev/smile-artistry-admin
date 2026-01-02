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

export interface BranchDetail extends Branch {
  doctors_count: number;
  users_count: number;
}

export const branchService = {
  /**
   * Get all branches
   */
  getBranches: async (): Promise<BranchDetail[]> => {
    const response = await apiClient.get<BranchDetail[]>(API_ENDPOINTS.BRANCHES.LIST);
    return response.data;
  },

  /**
   * Get a single branch
   */
  getBranch: async (id: number): Promise<BranchDetail> => {
    const response = await apiClient.get<BranchDetail>(API_ENDPOINTS.BRANCHES.GET(id));
    return response.data;
  },

  /**
   * Create a new branch
   */
  createBranch: async (data: {
    name: string;
    address?: string;
    phone?: string;
    is_active?: boolean;
  }): Promise<Branch> => {
    const response = await apiClient.post<Branch>(
      API_ENDPOINTS.BRANCHES.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Update branch details
   */
  updateBranch: async (
    id: number,
    data: {
      name?: string;
      address?: string;
      phone?: string;
      is_active?: boolean;
    }
  ): Promise<Branch> => {
    const response = await apiClient.patch<Branch>(
      API_ENDPOINTS.BRANCHES.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Activate a branch
   */
  activateBranch: async (id: number): Promise<Branch> => {
    const response = await apiClient.post<Branch>(
      API_ENDPOINTS.BRANCHES.ACTIVATE(id)
    );
    return response.data;
  },

  /**
   * Deactivate a branch
   */
  deactivateBranch: async (id: number): Promise<Branch> => {
    const response = await apiClient.post<Branch>(
      API_ENDPOINTS.BRANCHES.DEACTIVATE(id)
    );
    return response.data;
  },

  /**
   * Assign user to branch
   */
  assignUserToBranch: async (
    branchId: number,
    userId: number
  ): Promise<BranchDetail> => {
    const response = await apiClient.post<BranchDetail>(
      API_ENDPOINTS.BRANCHES.ASSIGN_USER(branchId),
      { user_id: userId }
    );
    return response.data;
  },

  /**
   * Unassign user from branch
   */
  unassignUserFromBranch: async (
    branchId: number,
    userId: number
  ): Promise<BranchDetail> => {
    const response = await apiClient.post<BranchDetail>(
      API_ENDPOINTS.BRANCHES.UNASSIGN_USER(branchId),
      { user_id: userId }
    );
    return response.data;
  },

  /**
   * Assign doctor to branch
   */
  assignDoctorToBranch: async (
    branchId: number,
    doctorId: number
  ): Promise<BranchDetail> => {
    const response = await apiClient.post<BranchDetail>(
      API_ENDPOINTS.BRANCHES.ASSIGN_DOCTOR(branchId),
      { doctor_id: doctorId }
    );
    return response.data;
  },

  /**
   * Unassign doctor from branch
   */
  unassignDoctorFromBranch: async (
    branchId: number,
    doctorId: number
  ): Promise<BranchDetail> => {
    const response = await apiClient.post<BranchDetail>(
      API_ENDPOINTS.BRANCHES.UNASSIGN_DOCTOR(branchId),
      { doctor_id: doctorId }
    );
    return response.data;
  },
};
