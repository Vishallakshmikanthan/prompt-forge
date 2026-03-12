# PromptForge

## Project Introduction
PromptForge is a centralized platform for creating, organizing, versioning, and discovering high-quality AI prompts. Whether you are an AI developer looking to seamlessly integrate proven prompts into your application, or a prompt engineer looking to test and share your creations, PromptForge provides the necessary infrastructure.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TailwindCSS, TypeScript.
- **Backend:** Node.js, Next.js API Routes (or Express), TypeScript.
- **Database:** PostgreSQL.
- **ORM:** Prisma / Drizzle.
- **Authentication:** NextAuth.js / Auth.js.
- **Validation:** Zod.

## Folder Structure
```
prompt-book/
├── docs/                 # Platform documentation (PRD, Architecture, Schemas)
├── frontend/             # Next.js frontend application (if separate from backend)
│   ├── src/
│   │   ├── app/          # Next.js App Router pages
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # Utilities and configuration
│   │   └── styles/       # Global CSS and Tailwind setup
├── backend/              # Node.js API (if detached) or centralized server logic
├── prisma/               # Database schema and migration files
├── package.json
└── README.md
```
*(Note: Setup may vary slightly if utilizing a full-stack Next.js monolith)*

## Development Setup
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd prompt-book
   ```
2. **Install dependencies:**
   Choose your package manager (npm, yarn, or pnpm).
   ```bash
   npm install
   ```
3. **Set up the Database:**
   Ensure PostgreSQL is running locally or provide a cloud connection string.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Running Frontend
To run the Next.js development server:
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

## Running Backend
If the backend is decoupled from Next.js, navigate to the backend directory and run:
```bash
npm run server
```
If using Next.js API Routes, the backend automatically runs with `npm run dev`.

## Environment Variables
Create a `.env.local` or `.env` file at the root of your project. Required variables include:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/promptforge"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional external API keys (e.g. OpenAI for validation)
OPENAI_API_KEY="sk-..."
```

## Contribution Guidelines
We welcome contributions to PromptForge! 
1. **Branch Naming:** Use feature branches (e.g., `feature/add-search`, `bugfix/fix-auth`).
2. **Code Style:** Ensure you run `npm run lint` and format code via Prettier before submitting.
3. **Pull Requests:** Provide a detailed description of your changes when opening a PR. Ensure all new logic is covered by existing or new test cases.
4. **Documentation:** Any changes to system architecture or data models must be reflected in the `/docs` folder.
