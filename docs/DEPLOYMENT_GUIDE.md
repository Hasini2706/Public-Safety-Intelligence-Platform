# Deployment & Operations Guide

## Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Git

## 1. Local Development Setup

### Backend (FastAPI + ML Modules)
```bash
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

### Frontend (React + Vite + TailwindCSS)
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at:
- **Frontend Dashboard**: `http://localhost:5173`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`

## 2. Running Automated Test Suites
```bash
# Backend pytest suite (10/10 tests)
pytest -v backend/tests

# Frontend production typecheck & bundling
cd frontend
npm run build
```

## 3. Production Deployment Notes
- Set `ENVIRONMENT=production` in `.env`.
- Ensure CORS headers in `app/main.py` restrict origins to authorized domain URLs.
- In production, run FastAPI behind Nginx or Cloudflare reverse proxy with SSL/TLS termination enabled.
