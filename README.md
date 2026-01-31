# Vedified

A modern, full-stack blogging platform with AI-powered content generation, JWT authentication, and role-based access control. Built with React, Node.js, and MongoDB.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Docker Deployment](#-docker-deployment)
- [API Reference](#-api-reference)
- [Authentication & Authorization](#-authentication--authorization)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Troubleshooting](#-troubleshooting)

---

## Features

| Feature | Description |
|--------|-------------|
| **AI Content Generation** | Generate blog content automatically using Google Gemini AI based on title, category, and subtitle |
| **Rich Text Editor** | TipTap-based WYSIWYG editor with formatting, images, links, and custom styling |
| **Role-Based Access** | Separate **Admin** and **Writer** roles with different permissions |
| **Ownership Rules** | Users can only delete/edit their own blogs and comments |
| **Image Management** | Upload images via Multer, stored and optimized on ImageKit CDN (max 20MB) |
| **Comments System** | Add, approve, and moderate comments on blog posts |
| **Responsive UI** | Tailwind CSS with mobile-first design |
| **JWT Authentication** | Secure login for both admins and writers |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library for building component-based interfaces |
| **Vite 7** | Build tool and dev server – fast HMR, optimized production bundles |
| **Tailwind CSS 4** | Utility-first CSS framework for rapid styling |
| **TipTap** | Rich text editor (headless ProseMirror) – formatting, images, links, colors |
| **React Router 7** | Client-side routing for SPA navigation |
| **Axios** | HTTP client for API requests with interceptors |
| **React Hot Toast** | Lightweight toast notifications |
| **Motion** | Animation library for smooth transitions |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js 20** | JavaScript runtime |
| **Express 5** | Web framework for REST API |
| **MongoDB** | NoSQL database (via Mongoose ODM) |
| **Mongoose 8** | Schema-based data modeling for MongoDB |
| **JWT (jsonwebtoken)** | Stateless authentication tokens (7-day expiry) |
| **bcrypt** | Password hashing for secure storage |
| **Multer** | Multipart/form-data handling for file uploads |
| **dotenv** | Load environment variables from `.env` |
| **CORS** | Cross-Origin Resource Sharing configuration |
| **ImageKit SDK** | Image upload, optimization, and CDN delivery |
| **Google Gemini AI** | AI-powered blog content generation |

### DevOps & Deployment

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization for consistent deployments |
| **Docker Compose** | Multi-container orchestration (frontend + backend) |
| **GitHub Actions** | CI/CD – build, test, deploy to AWS |
| **PM2** | Process manager for Node.js (production) |

---

## Project Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     Client      │  HTTP   │     Server      │  TCP    │    MongoDB      │
│   (React/Vite)  │ ──────► │   (Express)     │ ──────► │   (Database)    │
│   Port: 5173    │ ◄────── │   Port: 4000    │ ◄────── │   (Cloud/Atlas) │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     │ HTTPS
                                     ▼
                            ┌─────────────────┐
                            │   ImageKit CDN  │  (Image storage)
                            │   Gemini API    │  (AI content)
                            └─────────────────┘
```

- **Client**: SPA served by Vite (dev) or static files (prod)
- **Server**: REST API, JWT auth, file uploads, AI generation
- **Database**: MongoDB for blogs, users, admins, comments

---

## Project Structure

```
Vedified/
├── .github/
│   └── workflows/
│       └── cicd.yml              # GitHub Actions CI/CD pipeline
│
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/             # Login, Register, Sidebar, AdminAccounts
│   │   │   ├── user/              # WriterLogin, WriterRegister
│   │   │   ├── BlogCard.jsx
│   │   │   ├── BlogList.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Navbar.jsx
│   │   ├── contexts/
│   │   │   └── AppContext.jsx     # Global state, axios, token, user
│   │   ├── pages/
│   │   │   ├── admin/             # Dashboard, AddBlog, BlogList, Comments, Layout
│   │   │   ├── writer/            # WriterDashboard
│   │   │   ├── Blog.jsx
│   │   │   └── Home.jsx
│   │   ├── assets/
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── server/                        # Node.js backend
│   ├── configs/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── gemini.js              # Google Gemini AI integration
│   │   └── imagekit.js            # ImageKit upload config
│   ├── controlers/
│   │   ├── admincontrole.js       # Admin login, register, dashboard, comments
│   │   └── blogControler.js       # Blogs CRUD, comments, AI generation
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/
│   │   ├── admin.js               # Admin schema (email, hashed password)
│   │   ├── user.js                # Writer schema (email, password, name)
│   │   ├── blog.js                # Blog schema
│   │   └── comments.js            # Comment schema
│   ├── routes/
│   │   ├── adminRoutes.js         # /api/admin/* + /api/auth/* (writer)
│   │   └── blogRouter.js          # /api/blog/*
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml             # Local Docker setup (build from source)
├── docker-prod-compose.yml        # Production Docker (pre-built images)
└── README.md
```

---

## Prerequisites

- **Node.js** v20.x or higher
- **npm** or **yarn**
- **MongoDB** – local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **ImageKit** account – [imagekit.io](https://imagekit.io)
- **Google AI Studio** – [Gemini API key](https://makersuite.google.com/app/apikey)

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Vedified
```

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Configure environment

```bash
# Server – copy example and edit
cd server
cp .env.example .env
# Edit .env with your values

# Client – create .env
cd ../client
echo "VITE_API_URL=http://localhost:4000" > .env
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 4000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | **Yes** | MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`) |
| `DB_NAME` | No | Database name |
| `JWT_SECRET` | **Yes** | Strong random string for signing JWTs (min 16 chars) |
| `ADMIN_EMAIL` | No | Fallback admin email (when no DB admins exist) |
| `ADMIN_PASSWORD` | No | Fallback admin password |
| `ADMIN_NAME` | No | Fallback admin display name |
| `IMAGEKIT_PUBLIC_KEY` | **Yes** | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | **Yes** | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | **Yes** | ImageKit URL (e.g. `https://ik.imagekit.io/your_id`) |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for AI content |

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | **Yes** | Backend API URL – `http://localhost:4000` for local dev |

---

## Running the Application

### Development

```bash
# Terminal 1 – start backend
cd server
npm run dev
# Server: http://localhost:4000

# Terminal 2 – start frontend
cd client
npm run dev
# Client: http://localhost:5173
```

### Production

```bash
# Build client
cd client
npm run build

# Start server (serves API; serve client from nginx/CDN separately if needed)
cd ../server
npm start
```

---

## Docker Deployment

### What Docker Does Here

- **Backend container**: Runs Node.js Express server.
- **Frontend container**: Builds the Vite app and serves static files with `serve`.
- **MongoDB**: Not in Docker – use MongoDB Atlas or a separate MongoDB container.

### Local Development with Docker

```bash
# Build and run (from project root)
docker-compose up --build

# Backend: http://localhost:4000
# Frontend: http://localhost:5173
```

`docker-compose.yml`:

- **backend**: Builds from `server/Dockerfile`, uses `server/.env`, exposes 4000.
- **frontend**: Builds from `client/Dockerfile`, depends on backend, exposes 5173.

### Production with Pre-built Images

```bash
docker-compose -f docker-prod-compose.yml up -d
```

Uses pre-built images (`arshthakur/vedified-backend:latest`, `arshthakur/vedified-frontend:latest`) instead of building locally.

### Dockerfiles Explained

**Server (`server/Dockerfile`):**

- Base: `node:20-alpine`
- Copies `package.json`, runs `npm install`
- Copies source, sets `NODE_ENV=production`
- Exposes 4000, runs `npm start`

**Client (`client/Dockerfile`):**

- **Stage 1 (builder)**: Installs deps, runs `npm run build`
- **Stage 2**: Uses `serve` to serve `dist/` on 5173

---

## API Reference

### Base URL

- Local: `http://localhost:4000`
- Production: Your deployed server URL

### Auth Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/login` | No | Admin login (email, password) |
| POST | `/api/admin/register` | No | Admin registration |
| POST | `/api/auth/writer-login` | No | Writer login |
| POST | `/api/auth/writer-register` | No | Writer registration |

### Admin Routes (require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats (blogs, comments, drafts) |
| GET | `/api/admin/comments` | All comments |
| POST | `/api/admin/approveComment/:id` | Approve comment |
| POST | `/api/admin/deleteComment/:id` | Delete own comment only |
| GET | `/api/admin/admin-accounts` | List admin accounts |
| DELETE | `/api/admin/blog/:id` | Delete own blog only |

### User (Writer) Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/user/dashboard` | Yes | Writer dashboard data |

### Blog Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blog/all` | No | All published blogs (public) |
| GET | `/api/blog/:id` | No | Single blog by ID |
| GET | `/api/blog/` | Yes | All blogs (filtered by role) |
| POST | `/api/blog/add` | Yes | Create blog (multipart) |
| PUT | `/api/blog/:id` | Yes | Update blog |
| DELETE | `/api/blog/:id` | Yes | Delete own blog only |
| POST | `/api/blog/:id/togglePublish` | Yes | Toggle publish status |
| POST | `/api/blog/generateContent` | Yes | AI generate content |
| POST | `/api/blog/addComment` | No | Add comment |
| GET | `/api/blog/:id/comments` | No | Get comments |
| DELETE | `/api/blog/comment/:id` | Yes | Delete own comment only |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Basic server message |
| GET | `/health` | Health check |

---

## Authentication & Authorization

### Flow

1. User submits email + password to `/api/admin/login` or `/api/auth/writer-login`.
2. Server validates credentials, issues JWT (7-day expiry).
3. Client stores token in `localStorage` (`adminToken` or `userToken`).
4. Client sends `Authorization: Bearer <token>` on protected requests.
5. Server middleware verifies JWT and attaches `req.user` (email, name, role).

### Roles

| Role | Access |
|------|--------|
| **Admin** | Admin dashboard, add blog, blog list, comments, admin accounts. Can only delete/edit own blogs and comments. |
| **Writer** | Writer dashboard, create/edit/delete own blogs. Can only delete own comments. |

### Ownership Rules

- **Blogs**: Delete, update, toggle publish only if `blog.authorEmail === req.user.email`.
- **Comments**: Delete only if `comment.authorEmail === req.user.email`.

---

## CI/CD Pipeline

Location: `.github/workflows/cicd.yml`

### Triggers

- Push to `main` branch

### Jobs

1. **build-and-test**
   - Checkout code
   - Node.js 20
   - Install server and client deps
   - Build client (`npm run build`)
   - Upload `client/dist` as artifact

2. **deploy-frontend**
   - Download build artifact
   - Configure AWS credentials
   - Sync `dist/` to S3 bucket

3. **deploy-backend**
   - SSH into EC2
   - Clone/pull repo
   - `npm install --production` in `server/`
   - Restart app with PM2 (`vedified-server`)

### Required Secrets

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `EC2_HOST`
- `EC2_SSH_KEY`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB connection error** | Check `MONGODB_URI`, network, and Atlas IP whitelist |
| **JWT errors** | Ensure `JWT_SECRET` is set and same across restarts |
| **Image upload fails** | Verify ImageKit keys and 20MB limit |
| **AI generation fails** | Check `GEMINI_API_KEY` and quota |
| **CORS errors** | Add frontend origin to `server.js` CORS config |
| **401 on protected routes** | Ensure token is sent as `Authorization: Bearer <token>` |
| **Docker build fails** | Ensure `.dockerignore` excludes `node_modules`, `.env` as needed |

---

## License

ISC License.

---

Built with React, Node.js, MongoDB, and modern web technologies.
