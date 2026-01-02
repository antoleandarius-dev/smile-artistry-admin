import apiClient from './client';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role_id: number;
  role_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role_id: number;
  is_active?: boolean;
}

export interface ActivateUserRequest {
  is_active: boolean;
}

export interface AssignRoleRequest {
  role_id: number;
}

export interface ResetPasswordRequest {
  new_password: string;
}

export const usersService = {
  /**
   * Get all users with role information
   */
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  /**
   * Get a single user by ID
   */
  async getUser(userId: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Create a new user (admin only)
   * Cannot create doctor users
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  /**
   * Activate or deactivate a user
   */
  async toggleUserStatus(userId: number, isActive: boolean): Promise<User> {
    const response = await apiClient.post<User>(
      `/users/${userId}/activate`,
      { is_active: isActive } as ActivateUserRequest
    );
    return response.data;
  },

  /**
   * Assign a role to a user
   * Cannot assign doctor role
   */
  async assignRole(userId: number, roleId: number): Promise<User> {
    const response = await apiClient.post<User>(
      `/users/${userId}/assign-role`,
      { role_id: roleId } as AssignRoleRequest
    );
    return response.data;
  },

  /**
   * Reset a user's password (admin only)
   */
  async resetPassword(userId: number, newPassword: string): Promise<User> {
    const response = await apiClient.post<User>(
      `/users/${userId}/reset-password`,
      { new_password: newPassword } as ResetPasswordRequest
    );
    return response.data;
  },
};
