# Skill Forge

> AI-powered skill gap analyzer and learning roadmap generator. Identify what you're missing for your target role and get a personalized path to get there.

**🚀 Live backend:** [skill-forge-backend.vercel.app](https://skill-forge-backend.vercel.app) · **API docs:** [/docs](https://skill-forge-backend.vercel.app/docs)

![Status](https://img.shields.io/badge/status-MVP-blue)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-black)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Deploy](https://img.shields.io/badge/deploy-Vercel-black)

---

## Overview

Skill Forge compares your current skills against the requirements of a target job role, surfaces the gaps, and generates a curated learning roadmap with hand-picked YouTube resources for each missing skill.

- **Live gap analysis** — fuzzy-matched against a static catalog of job roles
- **Personalized roadmap** — static, curated content for every skill (no LLM round-trip on the hot path)
- **Optional AI mode** — drop in a `NEBIUS_API_KEY` to enable dynamic LLM-generated roadmaps
- **Firebase auth** — email/password, Google, and GitHub OAuth
- **Cloud sync** — analyses and progress are persisted to Firestore

---

## Architecture

```
┌────────────────────┐    fetch     ┌─────────────────────────────┐
│   Next.js 16       │─────────────▶│  FastAPI on Vercel          │
│   (App Router)     │              │  skill-forge-backend        │
│                    │              │  .vercel.app                │
│  - Auth (Firebase) │              │                             │
│  - DataContext     │              │  - jobs.json                │
│  - AuthGuard       │              │  - roadmaps.json            │
│  - Tailwind v4     │              │  - youtube_links            │
└─────────┬──────────┘              │  - Pydantic models          │
          │                         └─────────────────────────────┘
          │  Firebase SDK
          ▼
   ┌─────────────┐
   │  Firestore  │
   └─────────────┘
```

The frontend calls the deployed FastAPI backend at `NEXT_PUBLIC_API_URL` (default: `https://skill-forge-backend.vercel.app`). For local backend dev, override the var to `http://localhost:8000` in `frontend/.env.local`. A Next.js rewrite at `/api/proxy/:path*` is also configured for proxying.

### Project structure

```
.
├── backend/                  FastAPI app
│   ├── api/index.py          Vercel serverless entrypoint
│   ├── main.py               App factory, CORS, rate limit
│   ├── routes/               HTTP endpoints (jobs, analysis, roadmap, …)
│   ├── services/             Business logic + Nebius LLM client
│   ├── models/schemas.py     Pydantic models
│   └── data/                 jobs.json, roadmaps.json, youtube_links.json
├── frontend/                 Next.js 16 app
│   ├── src/app/              App router pages (dashboard, login, …)
│   ├── src/components/       UI components
│   ├── src/context/          AuthContext, DataContext
│   └── src/lib/              Firebase init + Firestore data layer
├── .env.example              Copy to .env and fill in
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.12+
- A Firebase project (for auth + Firestore)

### Run the frontend against the deployed backend (fastest)

```bash
cd frontend
npm install
cp .env.example .env.local    # fill in your Firebase config
npm run dev                   # http://localhost:3000
```

The frontend points at the deployed backend by default — no backend setup needed.

### Run the full stack locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # fill in NEBIUS_API_KEY for AI mode
uvicorn main:app --reload     # http://localhost:8000
```

**Frontend** (with the override):
```bash
cd frontend
# in .env.local, set: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### Environment variables

See `.env.example` files in each subdirectory for the full list.

- **Backend** `backend/.env` — only `NEBIUS_API_KEY` is optional (enables AI roadmap generation).
- **Frontend** `frontend/.env.local` — `NEXT_PUBLIC_API_URL` defaults to the deployed backend; Firebase vars are required for auth & cloud sync.

---

## API endpoints

Base URL: `https://skill-forge-backend.vercel.app`

| Method | Path                          | Purpose                                                     |
|--------|-------------------------------|-------------------------------------------------------------|
| GET    | `/job-roles`                  | List all available job roles                                |
| POST   | `/analyze-skills`             | Compare skills against a role (returns matched/missing)     |
| POST   | `/analyze-skills/detailed`    | Same, with proficiency-level comparison                     |
| GET    | `/roadmap`                    | Curated roadmap for a set of missing skills                 |
| POST   | `/learning-roadmap`           | Gap detection + roadmap + YouTube videos in one call        |
| GET    | `/youtube-resources`          | Curated YouTube links for a list of skills                  |
| GET    | `/dashboard`                  | Unified view: gap score, matched/missing, roadmap summary   |

Full interactive docs: **https://skill-forge-backend.vercel.app/docs**

---

## Deployment

| Component | Platform | Config |
|-----------|----------|--------|
| Backend   | Vercel (Python serverless) | `backend/vercel.json` + `backend/api/index.py` |
| Frontend  | Vercel (Next.js)           | standard Next.js build |

Set `FRONTEND_URL=<your-deployed-frontend>` on the backend Vercel project to allow CORS. Set `NEXT_PUBLIC_API_URL=https://skill-forge-backend.vercel.app` on the frontend Vercel project.

---

## License

MIT
