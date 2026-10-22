# Standard API Contracts & Envelope Specifications

All endpoints in the **Public Safety Intelligence Platform** adhere to a uniform JSON envelope standard.
This consistency ensures seamless frontend-to-backend communication across all five modules.

---

## 1. Response Envelope Format

### Successful Response (HTTP 200, 201)

```json
{
  "success": true,
  "data": {
    "key": "value"
  },
  "message": "Request completed successfully"
}
```

### Error Response (HTTP 400, 404, 422, 500)

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_IDENTIFIER",
    "message": "Human-readable explanation of the issue",
    "details": null
  }
}
```

---

## 2. Core System Endpoints

### 2.1 Health Probe
- **Endpoint**: `GET /api/v1/health`
- **Purpose**: Liveness and readiness verification for container orchestrators and frontend connectivity indicators.
- **Response**:
```json
{
  "status": "healthy",
  "service": "Public Safety Intelligence Platform API",
  "version": "1.0.0"
}
```

### 2.2 Intelligence Modules Registry
- **Endpoint**: `GET /api/v1/modules`
- **Purpose**: Returns the list of registered modules, their branches, API status, and ML model configuration status.
- **Response**:
```json
{
  "success": true,
  "data": {
    "total_modules": 5,
    "modules": [
      {
        "id": "complaints",
        "name": "Smart Complaint Category Classification",
        "branch": "feature/complaints",
        "api_status": "active",
        "ml_status": "not_configured",
        "version": "0.1.0-uninitialized"
      }
    ]
  },
  "message": "Module registry status retrieved"
}
```

---

## 3. Module 1: Complaint Classification

### Status
`GET /api/v1/complaints/status`

### Classification Prediction
`POST /api/v1/complaints/classify`
- **Payload**:
```json
{
  "title": "Streetlight outage and exposed wire",
  "description": "Exposed high voltage electrical wire sparking after thunderstorm",
  "department_hint": "Public Works"
}
```
- **Expected Success Response** (when model configured):
```json
{
  "success": true,
  "data": {
    "category": "Electrical Hazard / Public Works",
    "confidence": 0.94,
    "priority": "Urgent",
    "requires_human_review": true
  },
  "message": "Complaint classified successfully"
}
```
- **Base App Response** (unconfigured model):
```json
{
  "success": false,
  "error": {
    "code": "MODEL_NOT_CONFIGURED",
    "message": "Complaint classification ML model has not been trained or configured yet."
  }
}
```

---

## 4. Module 2: AI Identity Verification

### Status
`GET /api/v1/identity/status`

### Verify Pair
`POST /api/v1/identity/verify`
- **Payload**:
```json
{
  "reference_id": "REF-ID-98214",
  "reference_image_b64": "<base64>",
  "verification_image_b64": "<base64>"
}
```

---

## 5. Module 3: Threat Detection

### Status
`GET /api/v1/threat-detection/status`

### Analyze Telemetry Event
`POST /api/v1/threat-detection/analyze`
- **Payload**:
```json
{
  "zone_id": "DATA-CENTER-ZONE-B",
  "sensor_type": "cctv_motion_badge_reader",
  "event_payload": {
    "after_hours": true
  }
}
```

---

## 6. Module 4: Crime Scene Evidence Analysis

### Status
`GET /api/v1/crime-analysis/status`

### Correlate Incident
`POST /api/v1/crime-analysis/analyze`
- **Payload**:
```json
{
  "incident_id": "INC-2026-X892",
  "location": "Sector 4 Industrial",
  "incident_narrative": "Commercial burglary during night hours.",
  "evidence_items": ["forced_entry", "tool_marks"]
}
```

---

## 7. Module 5: Mine Governance & Compliance

### Status
`GET /api/v1/governance/status`

### Audit Sensor Telemetry
`POST /api/v1/governance/evaluate`
- **Payload**:
```json
{
  "mine_site_id": "MINE-JH-04",
  "methane_level_ppm": 0.8,
  "dust_density_mg_m3": 2.1,
  "ventilation_airflow_m3_s": 42.5,
  "seismic_vibration_g": 0.012,
  "last_inspection_days_ago": 14
}
```
