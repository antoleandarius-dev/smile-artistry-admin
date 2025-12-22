# Frontend-Backend Connection Setup

## ✅ Implementation Summary

### 1. API Base URL Configuration
**Location:** [src/api/config.ts](src/api/config.ts)
- Reads `VITE_API_BASE_URL` from environment variables
- Falls back to `http://localhost:8000` if not set
- No hardcoded URLs anywhere in the application

**Environment Files:**
- [.env](.env) - Active configuration (not in git)
- [.env.example](.env.example) - Template for new developers

### 2. JWT Token Attachment
**Location:** [src/api/client.ts](src/api/client.ts)
- **Request Interceptor**: Automatically reads token from localStorage via `getAuthToken()`
- Attaches as `Authorization: Bearer <token>` header
- Applied to ALL requests automatically
- No manual token handling needed in components

### 3. Error Handling
**Location:** [src/api/client.ts](src/api/client.ts) - Response Interceptor
- **401 Unauthorized**: 
  - Clears token using `removeAuthToken()`
  - Redirects to `/login` (only if not already there)
  - Prevents redirect loops

### 4. API Services
All services use the centralized `apiClient`:
- [auth.service.ts](src/api/auth.service.ts) - Login, user info
- [health.service.ts](src/api/health.service.ts) - Backend health checks
- All use the same client → all have auth + error handling

### 5. Testing Backend Connection
**In Browser Console (Dev Mode):**
```javascript
await window.testBackendConnection()
```

**In Code:**
```typescript
import { testBackendConnection } from '../api';
await testBackendConnection();
```

## 🔒 Security
- ✅ No hardcoded URLs or tokens
- ✅ Tokens in localStorage (existing auth mechanism)
- ✅ Auto token cleanup on 401
- ✅ Bearer token authentication
- ⚠️ Backend must enable CORS for `http://localhost:5173` (Vite dev server)

## 📦 Project Structure
```
src/api/
├── config.ts              # Environment-based API config
├── client.ts              # Axios with interceptors (auth + errors)
├── auth.service.ts        # Authentication endpoints
├── health.service.ts      # Health check endpoints
├── test-connection.ts     # Dev utility to test backend
├── index.ts               # Central exports
└── README.md              # Detailed API documentation
```

## 🚀 Usage Example
```typescript
import { authService, apiClient } from '../api';

// Login (token handled automatically)
const { token, user } = await authService.login(email, password);

// Any authenticated request (token attached automatically)
const patients = await apiClient.get('/patients');

// If 401 happens, user redirected to login automatically
```

## ✨ What's Achieved
✅ Single source of truth for API URL  
✅ Automatic JWT token attachment  
✅ Global 401 error handling  
✅ Clean separation: API layer handles all backend logic  
✅ Components never deal with tokens/headers directly  
✅ Type-safe API services  
✅ Health check for backend verification  
✅ No code duplication  
✅ Production-ready and maintainable  

## 🔧 Backend Requirements
Your FastAPI backend should:
1. Accept JWT Bearer tokens in `Authorization` header
2. Return 401 for expired/invalid tokens
3. Enable CORS for frontend origin (localhost:5173 for dev)
4. Optionally provide `/health` endpoint for health checks
