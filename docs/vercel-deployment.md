# Vercel Deployment Guide - PromptForge

This guide explains how to deploy the PromptForge monorepo to Vercel and other cloud platforms.

## Prerequisites
1. A [Vercel](https://vercel.com) account.
2. A managed PostgreSQL database (e.g., [Supabase](https://supabase.com), [Neon](https://neon.tech)).
3. A Supabase project (for Auth/Storage).

---

## 1. Frontend Deployment (Vercel)

The Next.js frontend is optimized for Vercel.

### Steps:
1. Connect your GitHub repository to Vercel.
2. Select the `frontend` directory as the **Root Directory**.
3. Use the following **Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (see below).
   - `NEXT_PUBLIC_SUPABASE_URL`: From Supabase dashboard.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From Supabase dashboard.

---

## 2. Backend Deployment (Express)

You have two main ways to deploy the backend:

### Option A: Railway/Render (Recommended for long servers)
*Used if you want a persistent server that doesn't sleep.*
1. Create a project on [Railway.app](https://railway.app).
2. Root Directory: `backend`.
3. Build Command: `npm install && npm run build`.
4. Start Command: `npm start`.

### Option B: Vercel (Serverless Functions)
*Used if you want everything on Vercel. Your Express app will be converted to Serverless Functions.*
1. Create a **NEW** project on Vercel from the same repo.
2. **Framework Preset:** `Other`.
3. **Root Directory:** Leave as the project root (do **not** select `backend`).
4. **Build & Output Settings:**
   - Build Command: `cd backend && npm install && npm run build`
   - Output Directory: `backend/dist`
5. **Install Command:** `cd backend && npm install`
6. **Environment Variables:** Add `DATABASE_URL`, `JWT_SECRET`, etc.
7. **Important**: Add a `vercel.json` in the `backend` folder as shown below to route requests to your `server.ts`.

---

## 3. Database Migration
Once you have your `DATABASE_URL`, run the migrations from your local machine to populate the production database:

```bash
cd backend
npx prisma migrate deploy
```

---

## 4. Environment Checklist
Ensure your `.env` files are never committed. Use the `.env.example` at the root as a template for what keys are required in your deployment dashboard.
