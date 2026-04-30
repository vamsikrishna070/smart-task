# TaskFlow - Backend API

Real-time productivity management system backend built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT tokens
- Task management with dynamic priority scoring
- Real-time updates using Socket.io
- Dashboard analytics and insights
- Category-based task organization
- RESTful API endpoints

## Project Structure

```
backend/
├── config/          # Configuration files (logger, database)
├── controllers/     # Business logic for each route
├── routes/          # API endpoints
├── models/          # MongoDB schemas (User, Task)
├── middlewares/     # Express middlewares (auth)
├── lib/             # Utilities (JWT, Socket.io)
├── app.js           # Express app setup
├── index.js         # Server entry point
├── package.json     # Dependencies
└── .env             # Environment variables
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskflow
SESSION_SECRET=your-secret-key-here
```

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm run start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks

- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PATCH /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Insights

- `GET /api/insights` - Get dashboard insights (protected)
- `GET /api/insights/categories` - Get category distribution (protected)

### Health

- `GET /api/healthz` - Health check

## Real-Time Events (Socket.io)

### Emitted Events

- `task:created` - When a task is created
- `task:updated` - When a task is updated
- `task:deleted` - When a task is deleted
- `insights:updated` - When insights change

## Priority Scoring Algorithm

Tasks are automatically scored based on:

- **Overdue**: 100+ points
- **< 6 hours**: 95 points
- **< 24 hours**: 85 points
- **Graduated scale**: 20-70 points based on days remaining

## Technologies

- Node.js 16+
- Express 4.18
- MongoDB & Mongoose 7
- Socket.io 4.8
- JWT & bcryptjs
- Pino (logging)
- CORS

## License

MIT
