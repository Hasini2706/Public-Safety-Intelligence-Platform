# Public Safety, Physical Security & Governance Intelligence Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB.svg?logo=python&logoColor=white)](https://python.org)

An enterprise-grade, integrated machine learning platform designed for public safety decision-support, critical infrastructure physical threat monitoring, crime evidence correlation, and smart environmental governance for coal mines.

Developed as a 5-member collaborative engineering project structured around **one shared base platform** and **five independently developed ML feature modules**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [The 5 Intelligence Modules](#2-the-5-intelligence-modules)
3. [Technology Stack](#3-technology-stack)
4. [Monorepo Architecture](#4-monorepo-architecture)
5. [Quick Start & Local Setup](#5-quick-start--local-setup)
   - [Backend Setup](#backend-setup-fastapi)
   - [Frontend Setup](#frontend-setup-react--vite)
6. [Testing](#6-testing)
7. [Contribution & Branching Rules](#7-contribution--branching-rules)
8. [File Ownership & Conflict Prevention](#8-file-ownership--conflict-prevention)
9. [Dataset & Model Weights Policy](#9-dataset--model-weights-policy)
10. [Responsible AI Policy](#10-responsible-ai-policy)
11. [Documentation Links](#11-documentation-links)

---

## 1. Project Overview

Modern public safety and governance organizations face fragmented workflows: citizen grievances sit in disconnected queues, biometric identity verifications require manual cross-referencing, facility intrusions occur without early multi-sensor anomaly alarms, crime scene evidence is difficult to rapidly synthesize, and hazardous environmental conditions in mining operations risk worker safety.

This platform provides a **unified decision-support console** that integrates these capabilities while preserving modular, independent machine learning pipelines.

---

## 2. The 5 Intelligence Modules

| # | Module Name | Git Branch | Frontend Path | Backend Path | ML Engine Path | Assigned Developer |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Smart Complaint Category Classification** | `feature/complaints` | `frontend/src/modules/complaints/` | `backend/app/modules/complaints/` | `ml/complaints/` | Member 1 |
| **2** | **AI Smart Identity Verification + Face Matching** | `feature/identity` | `frontend/src/modules/identity/` | `backend/app/modules/identity/` | `ml/identity/` | Member 2 |
| **3** | **Physical Security Threat Detection for Critical IT Infrastructure** | `feature/threat-detection` | `frontend/src/modules/threat-detection/` | `backend/app/modules/threat_detection/` | `ml/threat_detection/` | Member 3 |
| **4** | **Crime Scene Evidence Analysis + Incident Risk Assessment** | `feature/crime-analysis` | `frontend/src/modules/crime-analysis/` | `backend/app/modules/crime_analysis/` | `ml/crime_analysis/` | Member 4 |
| **5** | **Smart Governance & Compliance Monitoring for Coal Mines** | `feature/governance` | `frontend/src/modules/governance/` | `backend/app/modules/governance/` | `ml/governance/` | Member 5 |

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons
- **Backend API**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn, HTTPX
- **Machine Learning Foundation**: Scikit-Learn, Pandas, NumPy, Joblib (extensible per module to PyTorch, OpenCV, LightGBM)
- **Database Architecture**: Prepared for PostgreSQL / Supabase (runs 100% locally without database credentials in base version)
- **Testing**: Pytest, FastAPI TestClient

---

## 4. Monorepo Architecture

```text
Public-Safety-Intelligence-Platform/
├── frontend/                     # React + TypeScript + Vite Web Shell
│   ├── src/
│   │   ├── components/common/    # Reusable UI cards, tables, badges
│   │   ├── config/navigation.ts  # Centralized nav and module metadata
│   │   ├── layouts/              # AppShell, Sidebar, Header
│   │   ├── pages/                # Dashboard, System Status, About, 404
│   │   ├── modules/              # 5 domain UI modules (owned by members)
│   │   ├── services/api.ts       # Centralized API fetcher & health checks
│   │   ├── App.tsx
│   │   └── main.tsx
├── backend/                      # FastAPI Python Service
│   ├── app/
│   │   ├── main.py               # FastAPI entry point & CORS
│   │   ├── core/config.py        # Settings & environment configuration
│   │   ├── schemas/common.py     # Standard ApiResponse envelope
│   │   ├── api/v1/api.py         # Unified router aggregator
│   │   └── modules/              # 5 domain backend modules
│   ├── tests/                    # Backend unit & integration tests
│   └── requirements.txt
├── ml/                           # ML Training, Weights documentation & shared utilities
│   ├── shared/                   # BaseMLModule interface
│   ├── complaints/
│   ├── identity/
│   ├── threat_detection/
│   ├── crime_analysis/
│   └── governance/
├── data/                         # Local datasets (git-ignored)
├── docs/                         # Architecture, API & Contribution documentation
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Quick Start & Local Setup

### Prerequisites
- Node.js (v18+) & npm (v9+)
- Python (3.10 - 3.13)
- Git (v2.30+)

```bash
git clone https://github.com/Hasini2706/Public-Safety-Intelligence-Platform.git
cd Public-Safety-Intelligence-Platform
```

### Backend Setup (FastAPI)

1. Create and activate a Python virtual environment:
   ```powershell
   # Windows PowerShell
   cd backend
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
   ```bash
   # macOS / Linux
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. Run backend tests:
   ```bash
   pytest
   ```

4. Launch the API server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   API interactive docs: `http://localhost:8000/docs`  
   Health endpoint: `http://localhost:8000/api/v1/health`

### Frontend Setup (React + Vite)

In a separate terminal:

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Test production bundle build:
   ```bash
   npm run build
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```
   Open your browser at: `http://localhost:5173`

---

## 6. Testing

### Backend Test Suite
```bash
cd backend
pytest -v
```
Verifies:
- Service health endpoint returns HTTP 200 and standard response.
- Modules registry returns all 5 modules with accurate uninitialized states.
- Error envelope contracts properly catch unconfigured model calls without crashing.

### Frontend Production Build
```bash
cd frontend
npm run build
```
Runs TypeScript compiler (`tsc -b`) and Vite production bundler to verify zero type errors or missing imports.

---

## 7. Contribution & Branching Rules

To prevent merge conflicts across 5 simultaneous developers:

1. **Never work on `main`**.
2. Synchronize before branching:
   ```bash
   git switch main
   git pull origin main
   ```
3. Checkout your assigned branch:
   - `git switch -c feature/complaints`
   - `git switch -c feature/identity`
   - `git switch -c feature/threat-detection`
   - `git switch -c feature/crime-analysis`
   - `git switch -c feature/governance`
4. Stage only your module's files:
   ```bash
   git add frontend/src/modules/<your-module>/ backend/app/modules/<your-module>/ ml/<your-module>/
   git commit -m "feat(<module>): integrate model pipeline"
   git push -u origin <your-branch>
   ```
5. Open a Pull Request on GitHub into `main`.

---

## 8. File Ownership & Conflict Prevention

- **Protected Shared Files** (DO NOT casually modify):
  `App.tsx`, `main.tsx`, `layouts/*`, `components/common/*`, `main.py`, `core/*`, `package.json`, `requirements.txt`.
- **Member-Owned Safe Edit Zones**:
  `frontend/src/modules/<module>/`  
  `backend/app/modules/<module>/`  
  `ml/<module>/`

---

## 9. Dataset & Model Weights Policy

- **Do NOT commit large datasets** (`.csv`, `.tsv`, `.parquet`). Place local datasets in `data/raw/<module>/` and document download scripts.
- **Do NOT commit large binary model checkpoints** (`.pt`, `.bin`, `.h5`, `.joblib`). Host weights on Hugging Face Hub or cloud storage and document SHA256 checksums.

---

## 10. Responsible AI Policy

- **Human-in-the-Loop Decision Support**: All ML models provide advisory signals and confidence intervals to assist human domain experts.
- **Zero Guilt Claims**: Machine outputs do not determine legal guilt, liability, or criminality.
- **Biometric Ethics**: Never upload real-world citizen biometric data during development.

---

## 11. Documentation Links

- [System Architecture](docs/architecture.md)
- [Standard API Contracts](docs/api-contracts.md)
- [Team Contribution Guide](docs/contribution-guide.md)
- [Local Setup Guide](docs/setup.md)
- [ML Guidelines](ml/README.md)
- [Data Policy](data/README.md)
