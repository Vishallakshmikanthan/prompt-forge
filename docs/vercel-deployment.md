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

## 2. Backend Deployment (Railway/Render)

While Vercel can run serverless functions, a dedicated Express server is better suited for the current backend architecture.

### Recommended: Railway.app
1. Create a new project on Railway.
2. Connect your repo and point to the `backend` directory.
3. Configure the **Build Command**: `cd backend && npm install && npm run build`
4. Configure the **Start Command**: `npm start`
5. Add Environment Variables:
   - `DATABASE_URL`: Your managed Postgres connection string.
   - `JWT_SECRET`: A random 32+ character string.
   - `FRONTEND_URL`: Your Vercel deployment URL.
   - `NODE_ENV`: `production`

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
