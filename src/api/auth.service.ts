import apiClient from './client';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserInfo {
  email: string;
  full_name: string;
  role: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: UserInfo }> => {
    // FastAPI typically expects form data for OAuth2 password flow
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = response.data.access_token;

    // Get user info after login
    const userResponse = await apiClient.get<UserInfo>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      token,
      user: userResponse.data,
    };
  },

  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>('/auth/me');
    return response.data;
  },
};
