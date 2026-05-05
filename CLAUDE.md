# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two distinct systems:

1. **Skill Gap Analyzer** - A full-stack web application that analyzes skill gaps, generates learning roadmaps, and finds resources
2. **Antigravity Kit** (`.agents/`) - A modular AI Agent Capability Expansion Toolkit with specialist personas and domain-specific skills

## Architecture

### Main Application

```
├── frontend/          # Next.js 16 (React 19) application
│   ├── src/app/      # Next.js app router pages
│   ├── src/components/  # React components
│   ├── src/context/ # React context (auth)
│   ├── src/lib/     # Firebase and utility functions
│   └── src/data/    # Static data
│
└── backend/           # FastAPI application
    ├── routes/       # API endpoints (jobs, analysis, roadmap, resources, dashboard)
    ├── models/       # Pydantic models
    ├── services/     # Business logic
    └── api/          # Additional API utilities
```

### Antigravity Kit (`.agents/`)

The system is organized within the `.agents/` directory:

- **Agents (`.agents/agents/`)**: 20 specialist AI personas (e.g., `orchestrator`, `frontend-specialist`, `security-auditor`)
- **Skills (`.agents/skills/`)**: 36 modular knowledge domains, each with `SKILL.md`, `scripts/`, and `references/`
- **Workflows (`.agents/workflows/`)**: Slash command procedures (e.g., `/brainstorm`, `/plan`, `/debug`)
- **Scripts (`.agents/scripts/`)**: Master validation scripts

## Common Commands

### Frontend (Next.js)

```bash
cd frontend
npm install        # Install dependencies
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt  # Install dependencies
uvicorn main:app --reload        # Start dev server (http://localhost:8000)
# API docs available at http://localhost:8000/docs
```

### Antigravity Kit Validation

```bash
# Core validation (quick check)
python .agents/scripts/checklist.py .

# Full verification
python .agents/scripts/verify_all.py . --url http://localhost:3000
```

## Skill Loading Protocol

When a task matches a specific domain within the Antigravity Kit:
1. Identify the relevant skill in `.agents/skills/`
2. Load the `SKILL.md` for that domain
3. Refer to associated `scripts/` or `references/` within the skill directory