# TaskFlow - Frontend

Real-time productivity management system frontend built with React, Redux, and Tailwind CSS.

## Features

- User authentication (register/login)
- Real-time task synchronization
- Dynamic priority visualization
- Analytics dashboard
- Category-based task filtering
- Socket.io real-time updates

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── auth/       # Authentication components
│   │   ├── layout/     # Layout components
│   │   ├── providers/  # Context providers
│   │   └── ui/         # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── store/          # Redux store configuration
│   ├── lib/            # Utilities and helpers
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── package.json        # Dependencies
└── index.html          # HTML template
```

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## Building for Preview

```bash
npm run preview
```

## Environment Setup

The frontend assumes the backend API is running on `http://localhost:3000`

### API Configuration

API base URL is configured in `src/lib/api.js`

## Pages

- **Login** (`/login`) - User login page
- **Register** (`/register`) - User registration page
- **Dashboard** (`/dashboard`) - Analytics dashboard
- **Tasks** (`/tasks`) - Task list view
- **Task Form** (`/tasks/new`, `/tasks/:id/edit`) - Create/edit tasks

## State Management

Uses Redux Toolkit with slices for:

- `authSlice` - Authentication state
- `tasksSlice` - Tasks data
- `insightsSlice` - Dashboard insights

## Real-Time Features

- Socket.io connection for real-time updates
- Automatic task list refresh on server changes
- Real-time priority score calculation

## Custom Hooks

- `useAuth()` - Authentication management
- `useTasks()` - Task CRUD operations
- `useInsights()` - Dashboard analytics

## Technologies

- React 18.2
- Redux Toolkit 1.9
- Wouter 3.3 (routing)
- Socket.io-client 4.8
- Recharts 2.12 (charts)
- Lucide React (icons)
- Tailwind CSS 4.0
- Vite 5.0

## License

MIT
