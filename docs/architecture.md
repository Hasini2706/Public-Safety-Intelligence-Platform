# Public Safety & Governance Intelligence Platform Architecture

## System Overview
The Public Safety & Governance Intelligence Platform is a modular intelligence suite integrating machine learning inference engines with an interactive situational awareness frontend.

```
+-------------------------------------------------------------+
|                      React (Vite) UI                        |
|  - Situational Awareness Dashboard (Light / Navy Theme)    |
|  - Complaint Classification & Triage Console                |
|  - Biometric Identity Verification Console                  |
|  - Physical Threat Monitoring & CCTV Detection              |
|  - Crime Scene Evidence Correlation & Risk Engine           |
|  - DGMS Statutory Coal Mines Governance Console             |
+-------------------------------------------------------------+
                              |
                     REST API (HTTP/JSON)
                              v
+-------------------------------------------------------------+
|                     FastAPI Backend                         |
|  - Pydantic Data Contract Validation                        |
|  - Async Request Handling & Service Routers                 |
|  - In-Memory State & Incident Event Ledger                  |
+-------------------------------------------------------------+
                              |
               Machine Learning Pipeline Layer
                              v
+-------------------------------------------------------------+
|                     ML Engine Services                      |
|  1. Grievance NLP Classifier (TF-IDF + Calibrated Logistic) |
|  2. Biometric Face Matcher (YCbCr + LBP + Landmarks)       |
|  3. Physical Threat Detector (Isolation Forest + CV Stream) |
|  4. Crime Correlator (Gradient Boosting + MO Clustering)    |
|  5. Mine Governance Evaluator (DGMS Physical Regressor)     |
+-------------------------------------------------------------+
```

## Modular Micro-Architecture

### 1. Complaint Classification
- **Pipeline**: Scikit-Learn TF-IDF N-Gram Vectorizer + Multi-class Logistic Regression with balanced weighting.
- **Output**: Category classification, priority score (Urgent, High, Medium, Low), SLA target hours, and department routing.

### 2. Biometric Identity Verification
- **Pipeline**: Multi-scale spatial pyramid pooling, YCbCr skin-tone centroid localization, Local Binary Pattern (LBP) texture descriptor, and anatomical landmark ratio correlation.
- **Output**: Biometric similarity percentage (0-100%), compliance status (Verified, Borderline, Not Verified), and landmark breakdown.

### 3. Physical Security Threat Detection
- **Pipeline**: Multi-sensor Isolation Forest anomaly model trained on 1,500 telemetry baseline samples + real-time pixel scene analysis.
- **Output**: Continuous anomaly score (0.00-1.00), threat classification level, and tactical security playbooks.

### 4. Crime Scene Evidence Analysis
- **Pipeline**: N-gram TF-IDF narrative pattern mining + Gradient Boosting risk regressor + multi-attribute forensic evidence weighting.
- **Output**: Escalation risk score, pattern indicators, similar case correlation, and investigator guidance notes.

### 5. Coal Mines Governance & Compliance
- **Pipeline**: Gradient Boosted multi-variable regressor calibrated to Indian DGMS Coal Mines Regulations 2017 & MSHA 30 CFR.
- **Output**: Multi-hazard index, safety score (0-100), statutory violation alerts, and certified mitigations.
