# Smile Artistry Admin Portal

A modern React + TypeScript frontend for the dental clinic admin portal.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Axios** - HTTP client

## Project Structure

```
src/
├── api/              # API client and service modules
├── features/         # Feature-based modules
├── layouts/          # Layout components (Sidebar, TopBar, MainLayout)
├── pages/            # Page components
├── shared/           # Shared components, hooks, utils
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom React hooks
│   └── utils/        # Utility functions
└── App.tsx           # Main app entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your backend API URL

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Features

- Protected routes with authentication
- Token-based auth with auto-logout on 401
- Responsive layout with sidebar and topbar
- MUI theming support
- React Query for efficient server state management

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:8000`)

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
