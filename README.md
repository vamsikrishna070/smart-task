# Full-Stack MERN Productivity Management System

This is a comprehensive real-time productivity management system built with:

- **Frontend**: React.js + Redux Toolkit + Tailwind CSS
- **Backend**: Node.js + Express.js + Socket.io
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT

## Features

### Module 1: Auth & Core Task System

- User registration and login with JWT authentication
- CRUD operations for tasks
- Task model with priority scoring
- Protected routes

### Module 2: Smart Task Prioritization Engine

- Automatic priority calculation based on:
  - Deadline proximity (overdue tasks get highest priority)
  - Task age (older tasks increase in priority)
  - Current status
- Dynamic recalculation on every fetch/update

### Module 3: Real-Time Updates (Socket.io)

- Real-time task creation, updates, and deletions
- Multi-user synchronization
- Updates reflected within 1 second across clients

### Module 4: Productivity Dashboard

- Total/completed/pending task counts
- Daily completion statistics
- Category-wise distribution
- Completion rate tracking
- Real-time insights updates

## Project Structure

```
/backend/
  src/
    lib/
      - logger.js       (Pino logging)
      - mongodb.js      (MongoDB connection)
      - jwt.js          (JWT utilities)
      - socket.js       (Socket.io setup)
    models/
      - User.js         (User schema)
      - Task.js         (Task schema + prioritization)
    routes/
      - auth.js         (Auth endpoints)
      - tasks.js        (Task CRUD endpoints)
      - insights.js     (Analytics endpoints)
      - health.js       (Health check)
    middlewares/
      - auth.js         (JWT verification)
    app.js
    index.js

/frontend/
  src/
    store/
      - authSlice.js    (Auth state)
      - tasksSlice.js   (Tasks state)
      - insightsSlice.js (Analytics state)
    components/
      - auth/           (Auth provider)
      - layout/         (Sidebar, App layout)
      - providers/      (Socket provider)
      - ui/             (UI components)
    pages/
      - login.jsx
      - register.jsx
      - dashboard.jsx
      - tasks.jsx
      - task-form.jsx
      - not-found.jsx
    App.jsx
    main.jsx
```

## Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+) - [Install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
- npm or pnpm

### Step 1: Start MongoDB

```bash
# Start MongoDB locally
mongod
```

MongoDB will run on `mongodb://localhost:27017/taskflow`

### Step 2: Backend Setup

```bash
cd backend
npm install

# Configure .env file
# PORT=3000
# NODE_ENV=development
# MONGODB_URI=mongodb://localhost:27017/taskflow
# SESSION_SECRET=your-secret-key

# Start development server
npm run dev
```

Backend API will be available at `http://localhost:3000`

### Step 3: Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Task Routes (All protected)

- `GET /api/tasks` - Get all tasks (sorted by priority)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Insights Routes (All protected)

- `GET /api/insights` - Get dashboard insights
- `GET /api/insights/categories` - Get category distribution

## Socket.io Events

### Emitted from Server

- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `insights:updated` - Insights data changed

### Listened on Client

- Same events as above for real-time sync

## Technology Stack Details

- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token management
- **Socket.io**: Real-time communication
- **React.js**: UI library
- **Redux Toolkit**: State management
- **Tailwind CSS**: Styling
- **Wouter**: Lightweight routing
- **Recharts**: Data visualization
- **Lucide React**: Icons

## Features Highlights

1. **Dynamic Priority System**: Tasks automatically get higher priority as deadlines approach or become overdue
2. **Real-time Sync**: All connected users see task updates instantly
3. **Responsive Design**: Works seamlessly on desktop and mobile
4. **Comprehensive Analytics**: Track productivity with detailed insights
5. **Category Management**: Organize tasks by categories with distribution tracking
6. **User-specific Data**: All data is scoped to authenticated user

## Production Deployment

1. Update environment variables for production
2. Build frontend: `npm run build` (generates dist/public)
3. Use process manager like PM2 for backend
4. Setup MongoDB Atlas or managed MongoDB service
5. Deploy to your hosting platform (Vercel, Heroku, etc.)

## License

MIT
