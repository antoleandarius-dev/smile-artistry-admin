/**
 * API Configuration Module
 * Centralized configuration for API base URLs and settings
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL is not defined in environment variables');
}

export const apiConfig = {
  baseURL: API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000, // 30 seconds
} as const;
