interface UserData {
  email: string;
  full_name: string;
  role: string;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const setUserData = (userData: UserData): void => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = (): UserData | null => {
  const data = localStorage.getItem('userData');
  if (!data) return null;
  try {
    return JSON.parse(data) as UserData;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  removeAuthToken();
};
