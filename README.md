<p align="center">
  <img src="docs/screenshots/hero-section.png" alt="PromptForge Hero" width="100%" />
</p>

<h1 align="center">⚡ PromptForge</h1>

<p align="center">
  <strong>The ultimate collaborative platform for prompt engineers and AI developers.</strong><br/>
  Discover, create, version, fork, and share high-performance AI prompts — all in one place.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## 🧠 What is PromptForge?

**PromptForge** is a full-stack, developer-focused platform where prompt engineers and AI developers can:

- 📝 **Create & Upload** structured AI prompts with metadata, tags, and variable placeholders
- 🔍 **Discover & Search** high-quality prompts through full-text search and smart recommendations
- 🍴 **Fork & Version** prompts with git-like branching, semantic versioning, and diff tracking
- ⬆️ **Vote & Bookmark** the best community prompts to surface top-quality content
- 📊 **Track Analytics** — views, votes, forks, and engagement metrics per prompt
- 👤 **Manage Profiles** with avatar generation, reputation scores, and activity tracking

> Think of it as **GitHub, but for AI Prompts.**

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🏗️ **Prompt Management** | Create, edit, and organize prompts with rich metadata (category, AI model, tags) |
| 🔀 **Forking & Versioning** | Fork any public prompt; track changes with semantic versions and a diff viewer |
| 🔎 **Smart Discovery** | Full-text search, trending feeds, personalized recommendations, and category filters |
| 🗳️ **Community Voting** | Upvote/downvote system with reputation scoring for creators |
| 🔖 **Bookmarks** | Save prompts for later with a personal bookmarks dashboard |
| 📈 **Prompt Analytics** | Real-time view counts, vote tallies, fork stats, and engagement metrics |
| 🔐 **Dual Authentication** | Google OAuth + email/password login via Supabase Auth |
| 🛡️ **Security Hardened** | Helmet headers, rate limiting, XSS sanitization, input validation, CORS |
| 🤖 **3D Interactive UI** | Spline 3D robot model, Three.js globe, particle animations on the landing page |
| 🌓 **Dark/Light Mode** | System-aware theme toggle with smooth transitions |
| 🐳 **Docker Ready** | One-command deployment with Docker Compose (Postgres + Backend + pgAdmin) |
| 📡 **Sentry Monitoring** | Full error tracking and performance monitoring on both frontend and backend |

---

## 📸 Screenshots

### Landing Page — Hero Section
> Interactive 3D robot model with animated gradient typography and CTA buttons.

<p align="center">
  <img src="docs/screenshots/hero-section.png" alt="Hero Section" width="90%" />
</p>

### Platform Features
> Clean card layout showcasing core capabilities — Discover, Structured Design, and Community Driven.

<p align="center">
  <img src="docs/screenshots/features-section.png" alt="Features Section" width="90%" />
</p>

### How It Works — Pipeline Flow
> Animated step-by-step pipeline showing the prompt lifecycle: Create → Validate → Share → Discover.

<p align="center">
  <img src="docs/screenshots/how-it-works-section.png" alt="How It Works" width="90%" />
</p>

### Prompt Categories
> Browse prompts by category — Code Generation, Creative Writing, Data Analysis, and more.

<p align="center">
  <img src="docs/screenshots/categories-section.png" alt="Categories" width="90%" />
</p>

### Explore & Discovery Page
> Trending prompts feed with search, filters, and real-time prompt cards.

<p align="center">
  <img src="docs/screenshots/explore-page.png" alt="Explore Page" width="90%" />
</p>

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** (App Router) | React framework with server components and file-based routing |
| **React 19** | UI component library |
| **TypeScript 5** | Type-safe development |
| **TailwindCSS 4** | Utility-first styling |
| **shadcn/ui** | Beautifully designed, accessible component primitives |
| **Framer Motion** | Declarative layout and scroll animations |
| **GSAP** | High-performance timeline animations |
| **Three.js / React Three Fiber** | 3D globe and WebGL effects |
| **Spline** | Interactive 3D robot model |
| **Recharts** | Dashboard and analytics charts |
| **Supabase JS** | Auth client and session management |
| **Sentry** | Frontend error tracking and performance |

### Backend
| Technology | Purpose |
| :--- | :--- |
| **Express.js 5** | REST API framework |
| **TypeScript** | Type-safe server code |
| **Prisma ORM** | Database access and migrations |
| **PostgreSQL 15** | Relational database |
| **Supabase Auth** | Google OAuth and JWT-based authentication |
| **Helmet** | Security headers |
| **express-rate-limit** | API rate limiting |
| **express-validator** | Request input validation |
| **xss-clean** | XSS attack prevention |
| **Morgan** | HTTP request logging |
| **Sentry** | Backend error tracking |
| **Docker** | Containerized deployment |

---

## 🏛️ Architecture

```
PromptForge follows a modern, layered full-stack architecture:
```

```mermaid
graph TB
    subgraph Client["🖥️ Frontend — Next.js 16"]
        A[App Router Pages] --> B[React Components]
        B --> C[shadcn/ui + TailwindCSS]
        B --> D[Framer Motion / GSAP / Three.js]
        A --> E[Supabase Auth Client]
    end

    subgraph Server["⚙️ Backend — Express.js 5"]
        F[Routes] --> G[Controllers]
        G --> H[Services]
        H --> I[Prisma ORM]
        F --> J[Middleware]
        J --> J1[Auth Guard]
        J --> J2[Rate Limiter]
        J --> J3[Helmet / XSS]
    end

    subgraph Data["🗄️ Data Layer"]
        K[(PostgreSQL 15)]
        L[Supabase Auth]
    end

    A -- "REST API calls" --> F
    E -- "JWT tokens" --> L
    I --> K
    J1 -- "Verify JWT" --> L

    style Client fill:#0a0a0a,stroke:#3b82f6,color:#e2e8f0
    style Server fill:#0a0a0a,stroke:#10b981,color:#e2e8f0
    style Data fill:#0a0a0a,stroke:#8b5cf6,color:#e2e8f0
```

### Project Structure

```
prompt-book/
├── frontend/                # Next.js 16 App Router
│   ├── src/
│   │   ├── app/             # Pages & layouts (file-based routing)
│   │   │   ├── explore/     # Prompt discovery & trending feeds
│   │   │   ├── upload/      # Prompt creation form
│   │   │   ├── search/      # Full-text search results
│   │   │   ├── prompt/      # Individual prompt detail view
│   │   │   ├── profile/     # User profile & settings
│   │   │   ├── bookmarks/   # Saved prompts
│   │   │   ├── categories/  # Category-filtered browsing
│   │   │   ├── leaderboard/ # Top creators ranking
│   │   │   └── community/   # Community hub
│   │   ├── components/      # Reusable UI components
│   │   │   ├── sections/    # Landing page sections (hero, features, etc.)
│   │   │   ├── auth/        # Login, signup, OAuth components
│   │   │   ├── prompts/     # Prompt cards, detail views, editors
│   │   │   ├── upload/      # Multi-step upload wizard
│   │   │   ├── discovery/   # Trending, recommendations, search
│   │   │   ├── profile/     # Profile editing, avatar, stats
│   │   │   ├── navigation/  # Header, sidebar, mobile nav
│   │   │   └── ui/          # shadcn/ui base components + 3D models
│   │   └── lib/             # API services, utilities, Supabase client
│   └── public/              # Static assets
│
├── backend/                 # Express.js 5 REST API
│   └── src/
│       ├── routes/          # API endpoint definitions
│       ├── controllers/     # Request handlers
│       ├── services/        # Business logic layer
│       ├── middleware/       # Auth, rate-limit, security, validation
│       ├── config/          # Environment & app configuration
│       └── server.ts        # Application entry point
│
├── database/                # Data layer
│   └── prisma/
│       ├── schema.prisma    # Database schema (7 models)
│       └── migrations/      # Version-controlled schema changes
│
├── docs/                    # Documentation
│   ├── PRD.md               # Product Requirements Document
│   ├── architecture.md      # System architecture overview
│   ├── deployment.md        # Deployment guide
│   └── screenshots/         # App screenshots for README
│
├── docker-compose.yml       # Full-stack Docker orchestration
└── .env.example             # Environment variable template
```

---

## 📊 Database Schema

The platform uses **7 Prisma models** to manage all data:

```mermaid
erDiagram
    User ||--o{ Prompt : creates
    User ||--o{ Vote : casts
    User ||--o{ Bookmark : saves
    User ||--o{ Notification : receives
    Prompt ||--o{ PromptVersion : "has versions"
    Prompt ||--o{ Vote : receives
    Prompt ||--o{ Bookmark : "bookmarked by"
    Prompt ||--|| PromptAnalytics : tracks
    Prompt ||--o{ Prompt : "forked from"

    User {
        string id PK
        string username UK
        string email UK
        string displayName
        int reputation
        string bio
        string avatarUrl
        string authProvider
    }

    Prompt {
        string id PK
        string title
        string description
        string promptContent
        string category
        string aiModel
        string[] tags
        int score
        string moderationStatus
        float[] embedding
    }

    PromptVersion {
        string id PK
        int versionNumber
        string promptContent
    }

    Vote {
        string id PK
        string voteType
    }

    Bookmark {
        string id PK
    }

    PromptAnalytics {
        string id PK
        int views
        int votes
        int forks
        int bookmarks
    }

    Notification {
        string id PK
        string type
        string message
        boolean read
    }
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** 15+ (or use Docker)
- **npm** or **yarn**
- A **Supabase** project (for authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/Vishallakshmikanthan/prompt-forge.git
cd prompt-forge
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `http://localhost:4000/api`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

### 3. Database Setup

**Option A: Using Docker** (recommended)

```bash
docker-compose up -d postgres
```

**Option B: Local PostgreSQL**

Create a database named `promptforge_db` and update `DATABASE_URL` in `.env`.

Then run migrations:

```bash
cd database
npx prisma generate
npx prisma migrate deploy
```

### 4. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The API server will start at `http://localhost:4000`. Verify with:

```bash
curl http://localhost:4000/api/health
```

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📡 API Reference

The backend exposes a RESTful API at `/api`. Here's a summary of the available endpoints:

| Module | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `POST /api/auth/register` | Register with email/password |
| | `POST /api/auth/login` | Login and receive JWT |
| **Prompts** | `GET /api/prompts` | List all prompts (paginated) |
| | `POST /api/prompts` | Create a new prompt |
| | `GET /api/prompts/:id` | Get prompt details |
| | `PUT /api/prompts/:id` | Update a prompt |
| | `DELETE /api/prompts/:id` | Delete a prompt |
| **Search** | `GET /api/search` | Full-text search across prompts |
| **Discovery** | `GET /api/discovery/trending` | Get trending prompts |
| | `GET /api/discovery/categories` | Browse by category |
| **Recommendations** | `GET /api/recommendations/similar/:id` | Similar prompts |
| | `GET /api/recommendations/personalized` | Personalized feed |
| **Forking** | `POST /api/forks/:id` | Fork an existing prompt |
| **Versions** | `GET /api/versions/:promptId` | Get version history |
| **Votes** | `POST /api/prompts/:id/vote` | Vote on a prompt |
| **Bookmarks** | `POST /api/bookmarks/:id` | Bookmark a prompt |
| | `GET /api/bookmarks` | Get user's bookmarks |
| **Analytics** | `GET /api/analytics/:promptId` | Get prompt analytics |
| **Users** | `GET /api/users/:id` | Get user profile |
| | `PUT /api/users/:id` | Update profile |
| **Notifications** | `GET /api/notifications` | Get user notifications |

> 🔒 Endpoints marked with authentication require a valid JWT in the `Authorization: Bearer <token>` header.

---

## 🐳 Deployment

### Docker Compose (Recommended)

Spin up the entire stack with one command:

```bash
docker-compose up --build -d
```

This starts:
- **PostgreSQL 15** on port `5433`
- **Backend API** on port `4000`
- **pgAdmin** on port `5050` (admin@promptforge.com / admin123)

### Manual Deployment

#### Backend
```bash
cd backend
npm run build
npm run start
```

#### Frontend
```bash
cd frontend
npm run build
npm run start
```

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md).

---

## 🔄 Application Flow

```mermaid
flowchart LR
    A["🧑‍💻 Developer"] --> B{"Sign In"}
    B -->|Google OAuth| C[Supabase Auth]
    B -->|Email/Password| C
    C --> D["Dashboard"]

    D --> E["📝 Create Prompt"]
    D --> F["🔍 Explore"]
    D --> G["👤 Profile"]

    E --> E1["Fill Metadata\n(title, category, model, tags)"]
    E1 --> E2["Write Prompt Content\nwith {{variables}}"]
    E2 --> E3["Publish"]

    F --> F1["Search / Filter"]
    F --> F2["Trending Feed"]
    F --> F3["Recommendations"]
    F1 & F2 & F3 --> H["📄 Prompt Detail"]

    H --> H1["⬆️ Upvote / ⬇️ Downvote"]
    H --> H2["🔖 Bookmark"]
    H --> H3["🍴 Fork"]
    H --> H4["📊 View Analytics"]

    H3 --> I["New Forked Prompt\n(with version history)"]

    style A fill:#1e293b,stroke:#3b82f6,color:#e2e8f0
    style C fill:#1e293b,stroke:#8b5cf6,color:#e2e8f0
    style D fill:#1e293b,stroke:#10b981,color:#e2e8f0
    style H fill:#1e293b,stroke:#f59e0b,color:#e2e8f0
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing TypeScript patterns and naming conventions
- Use Prisma for all database operations (no raw SQL)
- Add proper error handling with `next(error)` middleware pattern
- Keep API responses consistent using the standard response format
- Test your changes locally before submitting

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Vishallakshmikanthan">Vishallakshmikanthan</a>
</p>
