# PromptForge Architecture

PromptForge follows a modern full-stack architecture separated into isolated concerns.

## 1. Frontend Layer
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **Animations**: GSAP, Framer Motion, Anime.js, WebGL (Three.js), Barba.js
- **Responsibilities**: UI rendering, client-side routing, complex transitions, state management.

## 2. Backend Layer
- **Framework**: Node.js & Express.js
- **Responsibilities**: API endpoints, business logic, authentication wrapper, communication with external services.

## 3. Data Layer
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Search Engine**: Meilisearch
- **Responsibilities**: Relational data storage, migrations, full-text prompt search.

## 4. Authentication Layer
- **Provider**: Supabase Auth (Google OAuth, JWT)
- **Responsibilities**: Identify users securely, session management.
