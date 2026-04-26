# TaskFlow – Team Task Management System

A production-ready MERN stack application for managing team tasks with role-based access, a Kanban board, and JWT authentication.

---

## Features

- **JWT Authentication** — Signup, Login, token-based session persistence
- **Role-Based Access** — Admin can assign/delete tasks; users manage their own
- **Kanban Board** — Three-column board: To Do / In Progress / Done
- **Task Management** — Create, edit, delete, filter by priority/status
- **Dashboard** — Stats cards, progress bar, recent tasks table
- **Split-screen Auth UI** — Clean design with blue gradient left panel
- **Responsive** — Works on mobile and desktop

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS        |
| State      | Context API + useReducer pattern    |
| HTTP       | Axios with request/response interceptors |
| Backend    | Node.js, Express.js (MVC)           |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT + bcrypt (12 rounds)            |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth, role, error handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   └── services/       # Business logic layer
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance + endpoint functions
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, TaskContext
│   │   └── pages/          # Login, Signup, Dashboard, TaskBoard
│   ├── index.html
│   └── package.json
│
└── docs/
    └── PRD.md
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1 — Clone & install

```bash
# Backend
cd taskflow/backend
npm install

# Frontend
cd taskflow/frontend
npm install
```

### 2 — Configure environment

```bash
# Backend — copy and edit
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
# Frontend — copy and edit
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3 — Run

```bash
# Terminal 1 — start MongoDB (if local)
mongod

# Terminal 2 — backend
cd taskflow/backend
npm run dev       # nodemon, restarts on change

# Terminal 3 — frontend
cd taskflow/frontend
npm run dev       # Vite dev server at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path      | Auth | Description              |
|--------|-----------|------|--------------------------|
| POST   | /signup   | No   | Register a new user      |
| POST   | /login    | No   | Login, receive JWT       |
| GET    | /me       | Yes  | Get current user profile |

### Tasks — `/api/tasks`

| Method | Path        | Auth  | Description                        |
|--------|-------------|-------|------------------------------------|
| GET    | /           | Yes   | List tasks (role-filtered)         |
| POST   | /           | Yes   | Create a new task                  |
| GET    | /stats      | Yes   | Task count stats by status         |
| PUT    | /:id        | Yes   | Update task (role restrictions)    |
| DELETE | /:id        | Yes   | Delete task (owner or admin only)  |

### Users — `/api/users`

| Method | Path   | Auth | Description        |
|--------|--------|------|--------------------|
| GET    | /      | Yes  | List all users     |
| GET    | /:id   | Yes  | Get user by ID     |
| PUT    | /:id   | Yes  | Update user name   |

### Request/Response Shape

**POST /api/auth/login**
```json
// Request
{ "email": "admin@test.com", "password": "123456" }

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": { "_id": "...", "name": "Admin", "email": "...", "role": "admin" }
  }
}
```

**POST /api/tasks**
```json
// Request (Authorization: Bearer <token>)
{
  "title": "Design new landing page",
  "description": "Figma mockups needed",
  "status": "todo",
  "priority": "high",
  "assignedTo": "<userId>",
  "deadline": "2026-05-01"
}
```

---

## Role-Based Rules

| Action                  | Admin | User (owner) | User (assignee) |
|-------------------------|-------|--------------|-----------------|
| Create task             | ✅    | ✅           | ✅              |
| Assign task to others   | ✅    | ❌           | ❌              |
| Update any field        | ✅    | ✅           | Status only     |
| Delete task             | ✅    | ✅           | ❌              |
| View all tasks          | ✅    | Own tasks    | Own tasks       |

---

## Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env.example`
6. Use a **MongoDB Atlas** URI for `MONGO_URI`