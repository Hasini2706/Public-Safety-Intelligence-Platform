# Developer Contribution & Branching Guide

**Target Audience**: The 5 Collaborating ML Engineers on the Public Safety Intelligence Platform.

---

## 1. Golden Rules of Collaboration

1. **NEVER commit directly to `main`**. All work must happen on your designated feature branch.
2. **Work strictly inside your assigned domain folders**. Do not modify files owned by teammates or shared core framework files without explicit coordination.
3. **Never commit datasets or model weights** (`.csv`, `.parquet`, `.pt`, `.pkl`, `.bin`). Use download instructions or cloud storage links.
4. **Never commit API keys or secrets** (`.env`).
5. **Always test locally before pushing** (frontend build, backend tests).

---

## 2. Feature Branches & Ownership Matrix

| Member | Feature Branch | Frontend Workspace | Backend Workspace | ML Workspace |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | `feature/complaints` | `frontend/src/modules/complaints/` | `backend/app/modules/complaints/` | `ml/complaints/` |
| **Member 2** | `feature/identity` | `frontend/src/modules/identity/` | `backend/app/modules/identity/` | `ml/identity/` |
| **Member 3** | `feature/threat-detection` | `frontend/src/modules/threat-detection/` | `backend/app/modules/threat_detection/` | `ml/threat_detection/` |
| **Member 4** | `feature/crime-analysis` | `frontend/src/modules/crime-analysis/` | `backend/app/modules/crime_analysis/` | `ml/crime_analysis/` |
| **Member 5** | `feature/governance` | `frontend/src/modules/governance/` | `backend/app/modules/governance/` | `ml/governance/` |

### Shared Files (Requires Full Team Alignment)
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`
- `frontend/src/layouts/*`
- `frontend/src/components/common/*`
- `frontend/package.json`
- `backend/app/main.py`
- `backend/app/core/*`
- `backend/requirements.txt`
- `.gitignore`, `.env.example`, `README.md`

---

## 3. Step-by-Step Developer Workflow

### Step 1: Clone the Central Repository
```bash
git clone https://github.com/Hasini2706/Public-Safety-Intelligence-Platform.git
cd Public-Safety-Intelligence-Platform
```

### Step 2: Ensure You Have Latest Main
```bash
git switch main
git pull origin main
```

### Step 3: Create Your Assigned Feature Branch
Choose your branch:
```bash
# Member 1
git switch -c feature/complaints

# Member 2
git switch -c feature/identity

# Member 3
git switch -c feature/threat-detection

# Member 4
git switch -c feature/crime-analysis

# Member 5
git switch -c feature/governance
```

### Step 4: Develop Your Module
- Build your React components and state inside `frontend/src/modules/<your-module>/`.
- Build your FastAPI endpoints, schemas, and services inside `backend/app/modules/<your-module>/`.
- Train and test your ML models inside `ml/<your-module>/`.

### Step 5: Verify Quality Before Committing
```bash
# 1. Frontend production build check
cd frontend
npm run build
cd ..

# 2. Backend unit test check
cd backend
pytest
cd ..
```

### Step 6: Commit and Push Safely
```bash
# Inspect what changed
git status

# Add only your module's files (avoid committing untracked clutter)
git add frontend/src/modules/<your-module>/ backend/app/modules/<your-module>/ ml/<your-module>/

# Commit with a clear, conventional commit message
git commit -m "feat(complaints): train and integrate text classification pipeline"

# Push to your remote feature branch
git push -u origin feature/complaints
```

### Step 7: Open a Pull Request
1. Open GitHub: `https://github.com/Hasini2706/Public-Safety-Intelligence-Platform`
2. Create a **Pull Request** from your feature branch into `main`.
3. Request code review from at least one teammate.

---

## 4. Python Dependency Management

If your ML module requires specialized packages (such as `opencv-python`, `transformers`, or `lightgbm`):
1. Test them locally first.
2. Document them in your module's `ml/<module>/requirements.txt` or propose addition to `backend/requirements.txt`.
3. Avoid pin conflicts by using compatible version ranges.
