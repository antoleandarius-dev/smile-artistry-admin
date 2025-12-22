# API Layer Documentation

## Overview
This directory contains all API-related logic for communicating with the FastAPI backend.

## Structure

```
api/
├── config.ts           # API configuration (base URL, timeout)
├── client.ts           # Axios client with interceptors
├── auth.service.ts     # Authentication API endpoints
├── health.service.ts   # Health check endpoints
└── index.ts            # Central exports
```

## Configuration

### Environment Variables
The API base URL is configured via environment variables:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

**Files:**
- `.env` - Local development configuration (not committed)
- `.env.example` - Template for environment variables

### API Client (`client.ts`)
Centralized Axios instance with:
- **Auto-attached JWT tokens**: Every request includes `Authorization: Bearer <token>`
- **401 Error Handling**: Automatically redirects to `/login` on unauthorized access
- **Timeout**: 30 seconds default
- **Base URL**: From `VITE_API_BASE_URL` environment variable

## Usage

### In Components
```typescript
import { authService, healthService } from '../api';

// Login
const { token, user } = await authService.login(email, password);

// Get current user
const user = await authService.getCurrentUser();

// Health check
const health = await healthService.checkHealth();
```

### Creating New Services
```typescript
import apiClient from './client';

export const exampleService = {
  getItems: async () => {
    const response = await apiClient.get('/items');
    return response.data;
  },
  
  createItem: async (data: ItemData) => {
    const response = await apiClient.post('/items', data);
    return response.data;
  },
};
```

## Authentication Flow

1. User logs in via `authService.login()`
2. JWT token is stored in localStorage
3. All subsequent API calls automatically include the token
4. If token expires (401), user is redirected to login

## Error Handling

- **401 Unauthorized**: Auto-redirect to `/login`, token cleared
- **Other errors**: Propagated to calling code for handling

## Security Notes

- Tokens are stored in localStorage
- No hardcoded URLs or tokens in source code
- CORS must be configured on backend to allow frontend origin
- All authenticated endpoints use Bearer token authentication
