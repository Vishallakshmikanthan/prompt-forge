# PromptForge

A developer platform where users can browse, upload, fork, and version structured AI prompts.

## Project Structure

- `/frontend` - Next.js App Router application with TailwindCSS, shadcn/ui, and animation libraries
- `/backend` - Express.js API server
- `/database` - Prisma ORM database models and migrations
- `/docs` - System architecture and product requirements

## Getting Started

1. Set up the environment variables:
   Copy `.env.example` to `.env` in the root (or frontend and backend folders respectively).

2. Start the Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Start the Backend:
   ```bash
   cd backend
   npm run dev
   ```

4. Database Setup:
   ```bash
   cd database
   npx prisma generate
   ```
