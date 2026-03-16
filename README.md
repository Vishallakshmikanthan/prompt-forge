<div align="center">
  <img src="https://raw.githubusercontent.com/Vishallakshmikanthan/prompt-forge/main/frontend/public/logo.png" alt="PromptForge Logo" width="120"/>

  # ⚡ PromptForge

  **The ultimate collaborative platform for prompt engineers and AI developers.**

  Discover, create, version, fork, and share high-performance AI prompts — all in one place.

  [![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

  [🌐 Live Demo](https://prompt-forge-two-indol.vercel.app) &nbsp;•&nbsp;
  [📖 Documentation](https://prompt-forge-two-indol.vercel.app/documentation) &nbsp;•&nbsp;
  [💬 Community](https://prompt-forge-two-indol.vercel.app/community) &nbsp;•&nbsp;
  [🗂 Categories](https://prompt-forge-two-indol.vercel.app/categories)

  > [!IMPORTANT]
  > **🚧 Under Active Development** — PromptForge is currently in active development. While the core features are functional, expect frequent updates and new capabilities!
</div>

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Visual Interface](#-visual-interface)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#️-system-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Configuration](#️-configuration)
- [Deployment](#-deployment)
- [Development Workflow](#-development-workflow)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Project Overview

**PromptForge** is built on the philosophy that prompts are the *code* of the Generative AI era. In a world where LLMs drive innovation, prompt engineering requires a specialized, structured workspace.

PromptForge addresses the fragmented landscape of AI prompting by providing:
- **Prompts as Assets**: Moving beyond ephemeral text to structured, versioned, and measurable assets.
- **Democratized Quality**: A community-driven platform where the best prompts are surfaced through sharing and iteration.
- **Unified Workspace**: Bridging the gap between technical AI developers and creative prompt designers.

---

## 🖼️ Visual Interface

### Homepage & Hero
![Homepage](docs/screenshots/homepage.png)
*The landing page features a premium 3D Spline robot and high-performance GSAP animations.*

### Prompt Discovery (Explore)
![Explore Page](docs/screenshots/explore.png)
*Discover prompts using advanced filtering, categories, and real-time search.*

### Deep Dive: Prompt Details
![Prompt Detail](docs/screenshots/prompt-detail.png)
*Detailed view showing prompt content, version history, and community interactions.*

### Categories & Navigation
![Categories](docs/screenshots/categories.png)
*Structured classification of prompts by use-case and AI model compatibility.*

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **Prompt Discovery** | Browse curated prompts organized by categories, trending status, and community recommendations. |
| 📤 **Structured Upload** | A multi-step wizard for prompt design, including meta-tags and variable placeholders. |
| 🔀 **Fork & Iterate** | Fork any public prompt to create your own lineage and improve upon existing work. |
| 🕒 **Version History** | Track every change with full versioning and side-by-side diff comparisons. |
| 📊 **Analytics & Metrics** | Real-time tracking of views, forks, votes, and bookmark stats. |
| 🏆 **Leaderboard** | Community reputation system surfacing the most impactful prompt engineers. |
| 🔐 **Secure Auth** | Integrated Google OAuth and Email/Password authentication via Supabase. |
| 🎨 **Premium UI/UX** | Glassmorphism, GSAP timeline animations, Spline 3D models, and smooth Lenis scrolling. |

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Logic**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **3D Graphics**: [Spline](https://spline.design/) & [Three.js (R3F)](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Auth Client**: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Backend
- **Server**: [Express.js 5](https://expressjs.com/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **ORM**: [Prisma 6.19.2](https://www.prisma.io/)
- **Database**: [PostgreSQL 15](https://www.postgresql.org/)
- **Security**: [Helmet](https://helmetjs.github.io/), [XSS-Clean](https://www.npmjs.com/package/xss-clean)
- **Monitoring**: [Sentry](https://sentry.io/)

---

## 🏛️ System Architecture

PromptForge follows a **distributed three-tier architecture** that optimizes for high-bandwidth user interaction and low-latency API response.

### Component Interaction
```mermaid
graph TB
    subgraph Client["🖥️ Frontend — Next.js 16"]
        A[Next.js App Router] --> B[React Components]
        B --> C[shadcn/ui + TailwindCSS]
        B --> D[GSAP / Spline / Frame Motion]
        A --> E[Supabase Auth Client]
    end

    subgraph Server["⚙️ Backend — Express.js 5"]
        F[Request Router] --> G[Auth Guard Middleware]
        G --> H[Controllers]
        H --> I[Business Services]
        I --> J[Prisma ORM Layer]
        F --> K[Security Headers & Rate Limiting]
    end

    subgraph Storage["🗄️ Persistence Layer"]
        L[(PostgreSQL 15)]
        M[Supabase Auth Engine]
    end

    A -- "Stateful REST Requests" --> F
    E -- "JWT Verification" --> M
    J --> L
    G -- "Token Check" --> M
```

### Data Flow Overview
1. **User Request**: The Next.js frontend initiates a request with a Supabase JWT.
2. **Middleware**: Backend `authMiddleware` validates the token with Supabase.
3. **Controller**: Decoupled handlers direct requests to specialized services.
4. **ORM**: Prisma handles type-safe database access with PostgreSQL.

---

## 📊 Database Schema

The database is built on **relational integrity** and **low-latency analytics tracking**.

### Entity Relationship Diagram
```mermaid
erDiagram
    User ||--o{ Prompt : "authors"
    User ||--o{ Vote : "casts"
    User ||--o{ Bookmark : "saves"
    Prompt ||--o{ PromptVersion : "manages history"
    Prompt ||--o{ Vote : "receives"
    Prompt ||--o{ Bookmark : "bookmarked in"
    Prompt ||--|| PromptAnalytics : "cached stats"
    Prompt ||--o{ Prompt : "forked lineage"
```

### Core Entities

| Table | Field | Type | Description |
|---|---|---|---|
| **User** | `id`, `username`, `email` | String | Core identity profile. |
| | `reputation` | Integer | Community impact score. |
| **Prompt** | `id`, `title`, `content` | String | Central prompt asset. |
| | `parentPromptId` | String? | Reference for fork lineage. |
| **PromptVersion** | `id`, `versionNumber` | UUID/Int | Immutable snapshot of contents. |
| **PromptAnalytics**| `views`, `forks`, `votes` | Integer | Denormalized stats for performance. |

---

## 🔌 API Documentation

Stateless REST API endpoints exposed under `/api/*`.

### Prompt Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/prompts` | List all public prompts. | No |
| `GET` | `/api/prompts/:id` | Fetch specific prompt details. | No |
| `POST` | `/api/prompts` | Create a new prompt asset. | Yes |
| `POST` | `/api/prompts/:id/vote`| Cast an upvote/downvote. | Yes |
| `PATCH`| `/api/prompts/:id` | Update existing prompt. | Yes |

### Discovery & Trends
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/discovery/trending` | List trending prompts. |
| `GET` | `/api/discovery/popular` | List all-time popular prompts. |
| `GET` | `/api/search` | Search prompts via query. |

---

## 📁 Project Structure

```bash
prompt-forge/
├── frontend/                   # Next.js 16 Web Application
│   ├── src/app/                # App Router pages and layouts
│   ├── src/components/         # UI components (shadcn/ui)
│   ├── public/                 # Static assets & 3D models
│   └── package.json            # Frontend config
│
├── backend/                    # Express.js 5 REST API
│   ├── src/routes/             # API Router definitions
│   ├── src/controllers/        # Request handlers
│   ├── src/services/           # Business logic layer
│   ├── src/middleware/         # Auth, Rate limiting, Security
│   └── package.json            # Backend config
│
├── database/                   # Schema & Migrations
│   └── schema.prisma           # Prisma Data Model
│
├── docs/                       # Project Documentation
│   └── screenshots/            # Visual documentation assets
└── README.md                   # Main documentation
```

---

## 🚀 Installation & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0+
- **PostgreSQL**: v15.0+
- **Supabase Account**: For Authentication

### 2. Environment Configuration
Create `.env` in the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Execution
```bash
# Install
cd frontend && npm install
cd ../backend && npm install

# Initialize DB
cd backend && npx prisma generate && npx prisma migrate dev

# Run
npm run dev # In both directories
```

---

## 🔭 Future Improvements
- **AI Scoring**: Evaluation of prompt quality via LLM API.
- **WebSocket Sync**: Real-time collaborative prompt editing.
- **Prompt Playground**: Test prompts directly against GPT-4/Claude in-browser.
- **CLI Tool**: `promptforge` command-line utility.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project currently does not have an open-source license. Please contact the author for permissions regarding commercial use.

---

<div align="center">
  Built with ❤️ by [Vishallakshmikanthan](https://github.com/Vishallakshmikanthan)
</div>
