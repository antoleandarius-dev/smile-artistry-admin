import apiClient from './client';

export interface Role {
  id: number;
  name: string;
}

export const rolesService = {
  /**
   * Get all available roles
   */
  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>('/roles');
    return response.data;
  },

  /**
   * Get a specific role by ID
   */
  async getRole(roleId: number): Promise<Role> {
    const response = await apiClient.get<Role>(`/roles/${roleId}`);
    return response.data;
  },
};
