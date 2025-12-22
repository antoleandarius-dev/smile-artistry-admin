# Smile Artistry Admin Portal - Copilot Instructions

## Project Overview
This is the Clinic Desktop Web portal for a dental clinic system. The backend is implemented using FastAPI. This portal is used by admin and clinic staff.

## Tech Stack
- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Router v6
- React Query (TanStack Query)
- Axios

## Project Structure
```
src/
├── api/          # API client and service modules
├── features/     # Feature-based modules
├── layouts/      # Layout components (Sidebar, TopBar, MainLayout)
├── pages/        # Page components
├── shared/       # Shared components, hooks, utils
└── App.tsx       # Main app entry point
```

## Development Guidelines
- Use TypeScript for all files
- Follow feature-based organization
- Use MUI components for UI
- Use React Query for server state management
- Use React Router for navigation
- Handle authentication with tokens in localStorage
- Keep styling minimal and clean
