# Machine Learning Architecture & Guidelines

Welcome to the ML foundation directory of the **Public Safety, Physical Security & Governance Intelligence Platform**.

## 1. Directory Structure

```text
ml/
├── complaints/           # Module 1: Smart Complaint Category Classification
├── identity/             # Module 2: AI Smart Identity Verification + Face Matching
├── threat_detection/     # Module 3: Physical Security Threat Detection (IT Infrastructure)
├── crime_analysis/       # Module 4: Crime Scene Evidence Analysis + Risk Assessment
├── governance/           # Module 5: Smart Governance & Compliance Monitoring (Coal Mines)
├── shared/               # Shared ML utilities, base interfaces, evaluation metrics
└── README.md             # This guide
```

---

## 2. ML Artifact Policy

- **DO NOT commit heavy binary model weights** (`.pt`, `.bin`, `.h5`, `.onnx`, large `.joblib`) directly to git.
- The `.gitignore` file automatically filters these binary extensions.
- Small educational/dummy models (< 5 MB) can be included for testing purposes if agreed by the team.
- For production/pre-trained models:
  - Document download scripts (`download_models.py` or bash scripts).
  - Use cloud storage (Hugging Face Hub, S3, or Google Drive) with documented checksum verification.

---

## 3. Responsible AI & Decision-Support Principles

Because this platform interfaces with public safety, crime analysis, and identity verification:
1. **Decision Support Only**: ML outputs are probabilistic decision-support signals to assist human experts, never autonomous determinations of guilt, criminality, or threat.
2. **Confidence Scores & Uncertainty**: Always return confidence scores, model versions, and uncertainty metrics alongside predictions.
3. **Auditability**: Maintain input logs and transformation steps for explainability.
4. **Synthetic Data for Development**: Never commit or train on real personal biometric or confidential citizen data during development.

---

## 4. Shared ML Interfaces

See `ml/shared/base_model.py` for standard Python interfaces for inference engines.
Every module can implement:
- `load_model()`
- `predict(inputs)`
- `preprocess(raw_data)`
- `health_check()` -> returns model status (ready, uninitialized, etc.)
