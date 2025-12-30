import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: UserInfo }> => {
    // Backend expects JSON with email and password fields
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    return {
      token: response.data.access_token,
      user: response.data.user,
    };
  },

  getCurrentUser: async (): Promise<UserInfo> => {
    // Note: backend doesn't have /auth/me endpoint
    // User info is stored in localStorage after login
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('No user data found');
    }
    return JSON.parse(userData);
  },
};
