# REST API Specification & Endpoints Reference

All API requests accept and return JSON payloads prefixed under `/api/v1`.

## 1. System Health & Diagnostics
- `GET /api/v1/health`
  - Returns backend health status, active database connections, and uptime.
- `GET /api/v1/modules`
  - Returns metadata, activation status, and ML model versions for all 5 modules.

## 2. Complaint Classification
- `POST /api/v1/complaints/classify`
  - **Body**: `{ "title": string, "description": string, "department_hint"?: string }`
  - **Response**: `{ "category": string, "confidence": float, "priority": string, "department": string, "sla_hours": int }`

## 3. Biometric Identity Verification
- `POST /api/v1/identity/verify`
  - **Body**: `{ "reference_id"?: string, "reference_image_b64"?: string, "verification_image_b64"?: string, "test_scenario"?: string }`
  - **Response**: `{ "match_status": string, "similarity_score": float, "features_breakdown": list, "liveness_score": float }`

## 4. Physical Threat Detection
- `POST /api/v1/threat-detection/analyze`
  - **Body**: `{ "zone_id"?: string, "sensor_type"?: string, "event_payload"?: dict, "text"?: string, "image_url"?: string, "image_b64"?: string }`
  - **Response**: `{ "threat_level": string, "anomaly_score": float, "detected_indicators": list, "alert_triggered": bool, "vision_analysis"?: dict }`

## 5. Crime Scene Evidence Correlation
- `POST /api/v1/crime-analysis/analyze`
  - **Body**: `{ "incident_id": string, "location": string, "incident_narrative": string, "evidence_items": list }`
  - **Response**: `{ "risk_level": string, "escalation_score": float, "pattern_indicators": list, "investigator_guidance": string }`

## 6. Coal Mines Governance & Compliance
- `POST /api/v1/governance/evaluate`
  - **Body**: `{ "mine_site_id": string, "methane_level_ppm": float, "dust_density_mg_m3": float, "ventilation_airflow_m3_s": float, "seismic_vibration_g": float, "last_inspection_days_ago": int }`
  - **Response**: `{ "compliance_status": string, "safety_score": int, "hazard_index": float, "flagged_violations": list, "recommended_mitigation": list }`
