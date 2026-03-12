# PromptForge Deployment Guide

This document outlines the steps required to deploy the PromptForge platform in a production environment.

## 1. Environment Configuration

Create a `.env` file in the project root based on `.env.example`.

### Required Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `min_32_chars_random_string` |
| `NEXT_PUBLIC_API_URL` | Absolute URL of the Backend API | `https://api.promptforge.com/api` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `your_anon_key` |

---

## 2. Database Setup

Ensure your PostgreSQL database is running and accessible.

### Run Migrations
To update the production database schema to match the current models:
```bash
cd backend
npx prisma migrate deploy
```

---

## 3. Backend Deployment (Docker)

The backend can be containerized using the provided `Dockerfile`.

### Build image
```bash
docker build -t promptforge-backend -f backend/Dockerfile .
```

### Run Container
```bash
docker run -d -p 4000:4000 --env-file .env promptforge-backend
```

---

## 4. Frontend Deployment (Next.js)

The frontend should be built and served as a standard Next.js application.

### Build
```bash
cd frontend
npm install
npm run build
```

### Start
```bash
npm run start
```

---

## 5. Local Production Simulation

You can simulate the production environment locally using Docker Compose:

```bash
docker-compose up --build -d
```

This will start:
- **Postgres**: Database on port 5432
- **Backend API**: Port 4000
- **Health Check**: `http://localhost:4000/api/health`
