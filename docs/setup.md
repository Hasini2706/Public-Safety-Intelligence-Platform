# Local Development Setup Guide

Follow this guide to get the **Public Safety, Physical Security & Governance Platform** running locally.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **Python**: 3.10 to 3.13
- **Git**: 2.30+

Verify installations:
```bash
node -v
npm -v
python --version
git --version
```

---

## 2. Quick Start

### 2.1 Clone the Repository
```bash
git clone https://github.com/Hasini2706/Public-Safety-Intelligence-Platform.git
cd Public-Safety-Intelligence-Platform
```

---

## 3. Backend Setup (FastAPI)

### Step 1: Create a Python Virtual Environment
**On Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**On macOS / Linux:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### Step 2: Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 3: Run Backend Tests
```bash
pytest
```
All unit tests should pass with HTTP 200 checks on `/api/v1/health`.

### Step 4: Start the FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```
- API is live at: `http://localhost:8000`
- Interactive OpenAPI Swagger docs: `http://localhost:8000/docs`
- Health probe: `http://localhost:8000/api/v1/health`

---

## 4. Frontend Setup (React + Vite)

Open a second terminal window:

### Step 1: Install Node Dependencies
```bash
cd frontend
npm install
```

### Step 2: Verify Production Build
```bash
npm run build
```

### Step 3: Start the Vite Development Server
```bash
npm run dev
```
- Web Application is live at: `http://localhost:5173`
- The application will automatically detect and link to the backend at `http://localhost:8000`.

---

## 5. Environment Variables Configuration

Copy the example environment files if you wish to customize port or host settings:

```bash
# Root
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

*Note: The base application works immediately out of the box with default localhost settings even without creating `.env` files.*
