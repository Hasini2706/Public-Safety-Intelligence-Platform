# Public Safety, Physical Security & Governance Intelligence Platform

[![CI Pipeline](https://github.com/Hasini2706/Public-Safety-Intelligence-Platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Hasini2706/Public-Safety-Intelligence-Platform/actions/workflows/ci.yml)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.10%2B%20%7C%203.13-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![Pytest](https://img.shields.io/badge/Tests-29%20Passing-brightgreen.svg?logo=pytest&logoColor=white)](https://pytest.org)

An enterprise-grade, integrated machine learning platform engineered for public safety decision-support, critical infrastructure physical threat monitoring, crime scene evidence correlation, and smart environmental governance for coal mines.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The 5 Intelligence Modules](#2-the-5-intelligence-modules)
3. [Technology Stack](#3-technology-stack)
4. [Monorepo Project Structure](#4-monorepo-project-structure)
5. [Quick Start & Local Setup](#5-quick-start--local-setup)
   - [Prerequisites](#prerequisites)
   - [Backend Setup (FastAPI)](#backend-setup-fastapi)
   - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
6. [Testing & Quality Assurance](#6-testing--quality-assurance)
   - [Full Pytest Suite (29/29 Passing)](#full-pytest-suite-2929-passing)
   - [Frontend Typecheck & Production Build](#frontend-typecheck--production-build)
7. [Inference Performance & Benchmarks](#7-inference-performance--benchmarks)
8. [Continuous Integration (CI)](#8-continuous-integration-ci)
9. [Documentation Reference](#9-documentation-reference)
10. [Responsible AI Policy](#10-responsible-ai-policy)

---

## 1. Executive Summary

Modern public safety and governance organizations face fragmented workflows: citizen grievances sit in disconnected queues, biometric identity checks require manual cross-referencing, facility intrusions occur without early multi-sensor anomaly alarms, crime scene evidence is difficult to synthesize rapidly, and hazardous atmospheric conditions in mining operations risk worker safety.

This platform provides a **unified decision-support console** that integrates these capabilities into a single operational interface while preserving modular, independently testable machine learning pipelines.

---

## 2. The 5 Intelligence Modules

| # | Module Name | Primary ML Algorithm | Key Output / Metric | Frontend Route | Backend Route |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Smart Citizen Complaint Triage** | Trigram TF-IDF + Calibrated Multinomial Naive Bayes | Priority Triage, Department Routing, Emergency SLAs | `/complaints` | `/api/v1/complaints/classify` |
| **2** | **AI Biometric Face Verification** | Concentric Multi-Scale Spatial Pyramids + LBP Texture | Similarity Score, Landmark Conformance, Ethical Guardrail | `/identity` | `/api/v1/identity/verify` |
| **3** | **Physical Threat Detection** | Scikit-Learn Isolation Forest Anomaly Engine | Multi-Sensor Anomaly Score, Optical Tamper Alarm, Playbooks | `/threat-detection` | `/api/v1/threat-detection/analyze` |
| **4** | **Crime Scene Evidence Correlator** | NLP Feature Extraction + Ridge Risk Regressor | Escalation Risk Score, Forensic Ballistics / DNA Guidance | `/crime-analysis` | `/api/v1/crime-analysis/correlate` |
| **5** | **Coal Mine Safety Governance** | Physics Coupled Gradient Boosting Regressor | DGMS Compliance Status, Reg 153/169 Interlocks | `/governance` | `/api/v1/governance/evaluate` |

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS, React Router v6, Lucide React icons
- **Backend**: FastAPI, Pydantic v2, Uvicorn, HTTPX TestClient, AnyIO
- **Machine Learning**: Scikit-Learn (Isolation Forest, Gradient Boosting, Ridge, Naive Bayes), NumPy, Pillow (PIL), SciPy
- **Testing & CI**: Pytest 9, GitHub Actions (`.github/workflows/ci.yml`)
- **Performance Benchmarking**: Native high-precision timer harness (`scripts/benchmark_models.py`)

---

## 4. Monorepo Project Structure

```text
Public-Safety-Intelligence-Platform/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI for backend tests & frontend build
├── backend/                           # FastAPI Python Service
│   ├── app/
│   │   ├── main.py                    # Application entry point, CORS & middleware
│   │   ├── core/                      # Settings, environment configuration & logging
│   │   ├── schemas/                   # Standard ApiResponse envelope schemas
│   │   ├── api/v1/                    # Unified router aggregator & health checks
│   │   └── modules/                   # 5 domain backend API endpoints & routers
│   ├── tests/                         # Full Pytest test suite (29 tests)
│   │   ├── test_health.py             # System health & readiness probe tests
│   │   ├── test_modules.py            # API contracts & registry validation
│   │   ├── test_complaints_extended.py# Module 1 priority triage & SLA calculation tests
│   │   ├── test_identity_extended.py  # Module 2 landmark divergence & LBP verification
│   │   ├── test_threats_extended.py   # Module 3 sensor anomaly & optical tampering tests
│   │   ├── test_crime_extended.py     # Module 4 evidence correlation & risk index tests
│   │   └── test_governance_extended.py# Module 5 DGMS coal mine compliance tests
│   ├── pytest.ini                     # Pytest configuration
│   └── requirements.txt               # Backend Python dependencies
├── frontend/                          # React + TypeScript + Vite Single-Page Application
│   ├── src/
│   │   ├── components/                # Reusable UI cards, modal dialogs, status badges
│   │   ├── config/navigation.ts       # Module navigation & route metadata
│   │   ├── layouts/                   # AppShell, TopNav, Sidebar, Header
│   │   ├── pages/                     # Dashboard, System Status, About, 404
│   │   ├── modules/                   # 5 domain UI modules
│   │   │   ├── complaints/            # Citizen Grievance Portal & triage view
│   │   │   ├── identity/              # Face match upload & biometric audit
│   │   │   ├── threat-detection/      # Physical security telemetry & CCTV stream
│   │   │   ├── crime-analysis/        # Forensic evidence matrix & MO analysis
│   │   │   └── governance/            # Underground coal mine environmental telemetry
│   │   ├── services/api.ts            # Centralized Axios/fetch client & health probes
│   │   ├── App.tsx                    # React router definition
│   │   ├── main.tsx                   # React root bootstrap
│   │   └── index.css                  # Tailwind styles & theme variables
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── ml/                                # Machine Learning Engines & Inference Pipelines
│   ├── shared/                        # BaseMLModule abstract class & status enums
│   ├── complaints/                    # Complaint classification & SLA inference
│   ├── identity/                      # Concentric face biometrics & landmark matcher
│   ├── threat_detection/              # Isolation Forest sensor anomaly detector
│   ├── crime_analysis/                # Evidence correlator & escalation risk model
│   └── governance/                    # Mine environmental safety & hazard evaluator
├── docs/                              # Project Documentation
│   ├── architecture.md                # End-to-end system architecture overview
│   ├── API_REFERENCE.md               # REST API specification & endpoint schemas
│   ├── DEPLOYMENT_GUIDE.md            # Production deployment & containerization guide
│   ├── api-contracts.md               # Data contracts & JSON schemas
│   ├── setup.md                       # Developer environment setup
│   └── contribution-guide.md          # Branching & team collaboration workflow
├── scripts/                           # Utility & Benchmarking Scripts
│   └── benchmark_models.py            # Latency (p50, p95, p99) benchmarking harness
├── data/                              # Local training sets & baseline assets (.gitignored)
├── .env.example                       # Environment variable template
├── .gitignore
└── README.md
```

---

## 5. Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18+ (v20+ recommended) & npm v9+
- **Python**: v3.10 - v3.13
- **Git**: v2.30+

```bash
git clone https://github.com/Hasini2706/Public-Safety-Intelligence-Platform.git
cd Public-Safety-Intelligence-Platform
```

---

### Backend Setup (FastAPI)

1. Navigate to the backend directory and activate a virtual environment:

```powershell
# Windows PowerShell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

```bash
# macOS / Linux
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

2. Install backend dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3. Launch the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check Probe**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### Frontend Setup (React + Vite)

In a separate terminal window:

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

- **Web Application Console**: [http://localhost:5173](http://localhost:5173)

---

## 6. Testing & Quality Assurance

### Full Pytest Suite (29/29 Passing)

From the project root:
```powershell
# Windows PowerShell
$env:PYTHONPATH='backend;project1'; & .\backend\.venv\Scripts\pytest.exe -v
```

```bash
# macOS / Linux
PYTHONPATH='backend:project1' pytest -v
```

**Test Coverage Summary:**
- ✅ **System Health & Registry**: Health checks, API status, module enumeration (2 tests)
- ✅ **Module Integration Contracts**: End-to-end endpoint tests for all 5 domains (8 tests)
- ✅ **Module 1 (Complaints)**: Emergency gas leak priority, SLA hours, sewage routing (3 tests)
- ✅ **Module 2 (Identity)**: Enrolled matches, watchlists, LBP texture comparison, validation (4 tests)
- ✅ **Module 3 (Threat Detection)**: Ambient baselines, intrusion escalations, optical tamper alarms (4 tests)
- ✅ **Module 4 (Crime Analysis)**: Armed heists, mechanical breaches, DNA/CODIS guidance (4 tests)
- ✅ **Module 5 (Mine Governance)**: Compliant baselines, CH4 evacuation interlocks, DGMS Reg 153/169 (4 tests)

---

### Frontend Typecheck & Production Build

Verify TypeScript interfaces and bundle integrity:
```bash
cd frontend
npm run build
```
Executes `tsc -b && vite build` with zero compiler warnings or bundle errors.

---

## 7. Inference Performance & Benchmarks

An automated benchmarking script measures real-time response latency (p50, p95, and p99 percentiles) across all 5 ML models:

```powershell
# Windows PowerShell
$env:PYTHONPATH='backend;project1'; & .\backend\.venv\Scripts\python.exe scripts/benchmark_models.py
```

```bash
# macOS / Linux
PYTHONPATH='backend:project1' python scripts/benchmark_models.py
```

### Benchmark Results (40 Iterations / Model)

| ML Engine | Model Type | Mean Latency | Median (p50) | p95 Latency | SLA Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Module 1 (Complaints)** | Calibrated Naive Bayes | 1.66 ms | 1.46 ms | 2.66 ms | < 50 ms | Passed |
| **Module 2 (Identity)** | Concentric Spatial Biometrics | 0.39 ms | 0.34 ms | 0.70 ms | < 50 ms | Passed |
| **Module 3 (Threat Detection)** | Isolation Forest (200 trees) | 14.14 ms | 13.94 ms | 16.51 ms | < 50 ms | Passed |
| **Module 4 (Crime Analysis)** | TF-IDF + Ridge Regression | 1.11 ms | 1.00 ms | 1.48 ms | < 50 ms | Passed |
| **Module 5 (Mine Governance)** | Gradient Boosted Regressor | 0.53 ms | 0.44 ms | 1.10 ms | < 50 ms | Passed |

---

## 8. Continuous Integration (CI)

This repository includes a GitHub Actions CI pipeline located at [`.github/workflows/ci.yml`](.github/workflows/ci.yml) that executes automatically on pushes and pull requests to `main`:
1. **Backend Matrix Job**: Runs on Python 3.11 and Python 3.12, installs dependencies, and runs the entire `pytest` test suite.
2. **Frontend Job**: Sets up Node.js 20, installs npm dependencies, and runs `npm run build` (`tsc -b && vite build`).

---

## 9. Documentation Reference

Detailed documentation is available in the [`docs/`](docs/) directory:
- [**System Architecture Overview**](docs/architecture.md) — Comprehensive technical design, microservice boundaries, data flow diagrams, and ML pipelines.
- [**REST API Reference Guide**](docs/API_REFERENCE.md) — Full request/response payload specifications and error envelopes for every endpoint.
- [**Deployment Guide**](docs/DEPLOYMENT_GUIDE.md) — Step-by-step local development, Docker multi-stage builds, and cloud scaling.
- [**Standard API Contracts**](docs/api-contracts.md) — Common schema specifications and error guidelines.
- [**Contribution Guide**](docs/contribution-guide.md) — Team git branching strategy, commit guidelines, and PR workflow.
- [**Environment Setup**](docs/setup.md) — Complete environment onboarding instructions.

---

## 10. Responsible AI Policy

- **Human-in-the-Loop Decision Support**: All machine learning algorithms provide probabilistic advisory signals, confidence intervals, and audit IDs designed to assist sworn human investigators and safety inspectors.
- **No Automated Guilt Claims**: Machine outputs never determine legal liability, probable cause, or criminal guilt.
- **Biometric Privacy**: Live photos are evaluated in-memory without persistent unencrypted storage of biometric templates.
- **Statutory Transparency**: Regulatory violations explicitly reference statutory codes (DGMS Coal Mines Regulations 1957, MSHA 30 CFR, NFPA Fire Codes) to maintain full legal defensibility.
