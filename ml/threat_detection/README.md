# Module 3 ML: Physical Security Threat Detection for Critical IT Infrastructure

- **Branch**: `feature/threat-detection`
- **Owner**: Member 3
- **Focus**: Multi-modal sensor/vision anomaly detection for server rooms and data centers

## Pipeline Stages
1. Sensor Event / CCTV Frame ingestion
2. Feature extraction (motion patterns, tailgating detection, unauthorized badge attempts)
3. Anomaly / Threat Scoring Model (Isolation Forest, One-Class SVM, or temporal sequence model)
4. Alert Classification (Low, Medium, Critical, Tamper)
5. Security Operations Center (SOC) review recommendation

## Integration Point
Connect your evaluation pipeline to `backend/app/modules/threat_detection/service.py`.
Provide clear feature schemas and confidence metrics.
