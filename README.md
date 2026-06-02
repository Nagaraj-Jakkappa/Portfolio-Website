# 🚀 Nagaraj Jakkappa — MERN Portfolio

A full-stack portfolio application built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
mern-portfolio/
├── client/                  # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── api/             # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── layout/      # Navbar, Footer, ProtectedRoute
│   │   │   └── sections/    # Hero, About, Skills, Projects, Contact
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── hooks/           # useProjects, useMessages (data hooks)
│   │   └── pages/           # Home, AdminLogin, AdminDashboard, NotFound
│   └── .env.example
└── server/                  # Express + MongoDB backend
    ├── models/              # Project, Message, Admin (Mongoose)
    ├── routes/              # /api/auth, /api/projects, /api/messages
    ├── middleware/          # JWT auth guard
    └── .env.example
```

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Fill in: MONGODB_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD

# Client
cp client/.env.example client/.env
# Fill in: VITE_API_URL (default: http://localhost:5000/api)
```

### 3. Create admin account (run once)

```bash
# With the server running:
curl -X POST http://localhost:5000/api/auth/seed
```

### 4. Start development servers

```bash
npm run dev
# Client → http://localhost:5173
# Server → http://localhost:5000
```

---

## 🔑 API Endpoints

| Method | Route                         | Auth          | Description         |
| ------ | ----------------------------- | ------------- | ------------------- |
| POST   | `/api/auth/login`             | ❌            | Admin login → JWT   |
| GET    | `/api/auth/me`                | ✅            | Verify token        |
| POST   | `/api/auth/seed`              | ❌ (dev only) | Create admin        |
| GET    | `/api/projects`               | ❌            | All projects        |
| GET    | `/api/projects?featured=true` | ❌            | Featured only       |
| POST   | `/api/projects`               | ✅            | Create project      |
| PUT    | `/api/projects/:id`           | ✅            | Update project      |
| DELETE | `/api/projects/:id`           | ✅            | Delete project      |
| POST   | `/api/messages`               | ❌            | Submit contact form |
| GET    | `/api/messages`               | ✅            | View all messages   |
| PATCH  | `/api/messages/:id/read`      | ✅            | Mark read           |
| DELETE | `/api/messages/:id`           | ✅            | Delete message      |

---

## 🛡️ Security Features

- **JWT Bearer tokens** — 7-day expiry, verified on every protected route
- **bcrypt** — Admin password hashed at 12 rounds
- **Rate limiting** — Contact form: max 5 submissions per 15 minutes
- **CORS** — Origin whitelist via `CLIENT_URL` env var
- **Admin seed** — Disabled in production (`NODE_ENV=production`)

---

## 🎨 Design System

| Token        | Value                |
| ------------ | -------------------- |
| Background   | `#0f172a` (navy-900) |
| Surface      | `#1e293b` (navy-800) |
| Accent       | `#38bdf8` (blue-400) |
| Display font | Syne                 |
| Body font    | DM Sans              |
| Mono font    | JetBrains Mono       |

---

## 🚀 Deployment

**Frontend** → Vercel / Netlify (set `VITE_API_URL` to your production API)

**Backend** → Railway / Render / Fly.io (set all env vars from `.env.example`)

**Database** → MongoDB Atlas (free tier works great)

---

## 👤 Admin Dashboard

Visit `/admin` → redirects to `/admin/login` if not authenticated.

Features:

- 📊 Stats overview (total projects, featured, messages, unread)
- ➕ Add / ✏️ Edit / 🗑️ Delete projects
- 📬 View contact messages, mark read, reply via email, delete
