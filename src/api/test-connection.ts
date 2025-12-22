/**
 * Backend Connection Test Utility
 * Use this to verify backend connectivity during development
 */

import { apiConfig } from './config';
import { healthService } from './health.service';

export const testBackendConnection = async (): Promise<void> => {
  console.group('🔍 Backend Connection Test');
  console.log('API Base URL:', apiConfig.baseURL);
  
  try {
    console.log('Testing health endpoint...');
    const health = await healthService.checkHealth();
    console.log('✅ Health check passed:', health);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    throw new Error('Backend connection failed. Ensure backend is running at ' + apiConfig.baseURL);
  }
  
  console.groupEnd();
};

// For development console testing
if (import.meta.env.DEV) {
  (window as any).testBackendConnection = testBackendConnection;
}
