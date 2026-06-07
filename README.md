# Skill Forge

> AI-powered skill gap analyzer and learning roadmap generator. Identify what you're missing for your target role and get a personalized path to get there.

![Status](https://img.shields.io/badge/status-MVP-blue)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-black)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)

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
┌────────────────────┐    fetch     ┌────────────────────┐
│   Next.js 16       │─────────────▶│   FastAPI          │
│   (App Router)     │              │   (stateless)      │
│                    │              │                    │
│  - Auth (Firebase) │              │  - jobs.json       │
│  - DataContext     │              │  - roadmaps.json   │
│  - AuthGuard       │              │  - youtube_links   │
│  - Tailwind v4     │              │  - Pydantic models │
└─────────┬──────────┘              └─────────┬──────────┘
          │                                   │
          │  Firebase SDK                     │
          ▼                                   ▼
   ┌─────────────┐                  (deployed on Vercel
   │  Firestore  │                   as Python serverless
   └─────────────┘                   function)
```

The frontend calls the FastAPI backend directly via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`). A Next.js rewrite at `/api/proxy/:path*` is also configured for proxying.

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
├── README.md
└── CLAUDE.md                 (gitignored — local AI tooling notes)
```

---

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.12+
- A Firebase project (for auth + Firestore)

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # then fill in NEBIUS_API_KEY if you want AI mode
uvicorn main:app --reload     # http://localhost:8000
```

Interactive API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local    # then fill in your Firebase config
npm run dev                   # http://localhost:3000
```

### Environment variables

See `.env.example` files in each subdirectory for the full list. The frontend `.env.local` requires a Firebase web app config (Project settings → General → Your apps → Web app).

---

## API endpoints

| Method | Path                          | Purpose                                                     |
|--------|-------------------------------|-------------------------------------------------------------|
| GET    | `/job-roles`                  | List all available job roles                                |
| POST   | `/analyze-skills`             | Compare skills against a role (returns matched/missing)     |
| POST   | `/analyze-skills/detailed`    | Same, with proficiency-level comparison                     |
| GET    | `/roadmap`                    | Curated roadmap for a set of missing skills                 |
| POST   | `/learning-roadmap`           | Gap detection + roadmap + YouTube videos in one call        |
| GET    | `/youtube-resources`          | Curated YouTube links for a list of skills                  |
| GET    | `/dashboard`                  | Unified view: gap score, matched/missing, roadmap summary   |

---

## Deployment

The backend is configured for Vercel's Python serverless runtime — see `backend/vercel.json` and `backend/api/index.py`. The frontend is a standard Next.js app, also Vercel-ready.

---

## License

MIT
