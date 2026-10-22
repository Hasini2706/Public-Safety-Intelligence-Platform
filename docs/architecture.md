# System Architecture & Technical Specifications

**Platform**: Public Safety, Physical Security & Governance Intelligence Platform  
**Architecture Style**: Modular Monorepo with Domain-Isolated Feature Modules  
**Target Audience**: 5 Collaborative Machine Learning & Full-Stack Developers  

---

## 1. High-Level Architecture Overview

The platform is designed around **one shared application core** that hosts **five independent intelligence modules**:

```text
[ Browser / Single Page App: React + TypeScript + Vite + Tailwind CSS ]
                               │
                       REST API (HTTP / JSON)
                               │
[ Backend Application Gateway: Python FastAPI + Pydantic v2 + Uvicorn ]
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
[ Core / Health / Auth ]  [ 5 Domain Routers ]   [ Database Engine (Future) ]
                               │                  (PostgreSQL / Supabase)
                               │
    ┌──────────────────────────┼──────────────────────────┐
    ▼                          ▼                          ▼
Module 1: Complaints       Module 2: Identity         Module 3: Threat Detection
(NLP Classifier)           (Facial Embedding Match)   (Facility Anomaly Detection)
    │                          │                          │
    ▼                          ▼                          ▼
Module 4: Crime Analysis   Module 5: Governance
(Evidence Correlator)      (Mine Compliance Model)
```

---

## 2. Directory Structure

```text
Public-Safety-Intelligence-Platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Reusable enterprise UI cards, badges, layouts
│   │   │   └── ui/
│   │   ├── config/
│   │   │   └── navigation.ts       # Centralized nav & module registry
│   │   ├── layouts/                # Root shell, sidebar & header container
│   │   ├── pages/                  # Dashboard, System Status, About, 404
│   │   ├── modules/                # 5 isolated developer workspaces
│   │   │   ├── complaints/         # Member 1 UI
│   │   │   ├── identity/           # Member 2 UI
│   │   │   ├── threat-detection/   # Member 3 UI
│   │   │   ├── crime-analysis/     # Member 4 UI
│   │   │   └── governance/         # Member 5 UI
│   │   ├── services/
│   │   │   └── api.ts              # Centralized fetch wrapper & health check
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI bootstrap & CORS middleware
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic Settings
│   │   │   └── responses.py        # Envelope builders
│   │   ├── schemas/
│   │   │   └── common.py           # Standard ApiResponse & error schemas
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── api.py          # Unified router mount point
│   │   │       └── endpoints/      # /health and /modules
│   │   └── modules/                # 5 isolated backend module domains
│   │       ├── complaints/         # Member 1 backend
│   │       ├── identity/           # Member 2 backend
│   │       ├── threat_detection/   # Member 3 backend
│   │       ├── crime_analysis/     # Member 4 backend
│   │       └── governance/         # Member 5 backend
│   ├── tests/                      # Pytest suite
│   ├── requirements.txt
│   └── .env.example
│
├── ml/
│   ├── complaints/                 # Member 1 ML scripts & training
│   ├── identity/                   # Member 2 ML scripts & embeddings
│   ├── threat_detection/           # Member 3 ML anomaly scripts
│   ├── crime_analysis/             # Member 4 ML risk models
│   ├── governance/                 # Member 5 ML compliance algorithms
│   ├── shared/                     # BaseMLModule interface & common utilities
│   └── README.md
│
├── data/                           # Local datasets (git-ignored)
│   ├── raw/
│   ├── processed/
│   └── README.md
│
├── docs/                           # Architecture, API & Contribution Docs
├── tests/
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Merge Conflict Elimination Strategy

A major risk in multi-developer student and enterprise projects is constant git merge conflicts in shared files.
Our architecture eliminates this via **Domain Isolation**:

| Layer | Shared / Restricted Files (Coordinated Edits Only) | Member-Owned Safe Edit Zones |
| :--- | :--- | :--- |
| **Frontend** | `App.tsx`, `main.tsx`, `layouts/*`, `components/common/*`, `package.json` | `frontend/src/modules/<your-module>/*` |
| **Backend** | `backend/app/main.py`, `backend/app/core/*`, `backend/requirements.txt` | `backend/app/modules/<your-module>/*` |
| **ML Engine** | `ml/shared/*`, `ml/README.md` | `ml/<your-module>/*` |

Each developer creates new pages, widgets, and schemas exclusively inside their assigned module directory.

---

## 4. Responsible Machine Learning Guardrails

Because this platform processes sensitive domains (identity, crime, infrastructure threats):
1. **Decision Support Only**: ML outputs are probabilistic aids for trained professionals, never autonomous determiners of guilt, liability, or threat status.
2. **Transparent Uncertainty**: Confidence percentages and model versions are mandated in every response schema.
3. **Synthetic Development**: Real biometric data and confidential police reports are strictly prohibited in the repository.
