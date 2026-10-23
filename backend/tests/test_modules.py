"""Comprehensive test suite for the 5 intelligence modules and standard API contracts."""


def test_list_modules_endpoint(client):
    """Verify that all 5 intelligence modules are registered and operational."""
    response = client.get("/api/v1/modules")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert data["total_modules"] == 5

    module_ids = [m["id"] for m in data["modules"]]
    assert "complaints" in module_ids
    assert "identity" in module_ids
    assert "threat-detection" in module_ids
    assert "crime-analysis" in module_ids
    assert "governance" in module_ids

    # All modules should now be active and their ML models initialized & ready
    for m in data["modules"]:
        assert m["api_status"] == "active"
        assert m["ml_status"] == "ready"
        assert "1.0.0" in m["version"]


def test_complaints_classify_endpoint(client):
    """Test Module 1: Complaint classification and priority triage."""
    response = client.post(
        "/api/v1/complaints/classify",
        json={
            "title": "High voltage electrical wire sparking after thunderstorm",
            "description": "Exposed high voltage electrical wire sparking after thunderstorm near school gate",
            "department_hint": "Public Works",
        },
    )
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert "Electrical" in data["category"] or "Hazard" in data["category"]
    assert data["confidence"] > 0.0
    assert data["priority"] in ["Urgent", "High"]
    assert data["requires_human_review"] is True
    assert "sla_hours" in data
    assert len(data["key_risk_factors"]) > 0


def test_identity_verify_endpoint(client):
    """Test Module 2: AI Identity Verification and face matching."""
    response = client.post(
        "/api/v1/identity/verify",
        json={
            "reference_id": "REF-ID-98214",
            "test_scenario": "match",
        },
    )
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert data["match_status"] == "Verified Match"
    assert data["similarity_score"] >= 0.78
    assert "features_breakdown" in data
    assert len(data["features_breakdown"]) == 4
    assert "disclaimer" in data
    assert data["liveness_score"] > 0.0


def test_threat_detection_analyze_endpoint(client):
    """Test Module 3: Physical security threat detection for IT facilities."""
    response = client.post(
        "/api/v1/threat-detection/analyze",
        json={
            "zone_id": "DATA-CENTER-ZONE-B",
            "sensor_type": "cctv_motion_badge_reader",
            "event_payload": {
                "after_hours": True,
                "failed_badge_attempts": 3,
                "person_count": 2,
                "forced_door": True,
                "rack_vibration_g": 0.42,
            },
        },
    )
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert data["threat_level"] in ["High", "Critical"]
    assert data["anomaly_score"] >= 0.50
    assert data["alert_triggered"] is True
    assert data["soc_escalation_advised"] is True
    assert len(data["detected_indicators"]) > 0
    assert len(data["recommended_playbook"]) > 0


def test_crime_analysis_correlate_endpoint(client):
    """Test Module 4: Crime scene evidence correlation and incident risk assessment."""
    response = client.post(
        "/api/v1/crime-analysis/analyze",
        json={
            "incident_id": "INC-2026-X892",
            "location": "Sector 4 Industrial",
            "incident_narrative": "Armed commercial robbery at warehouse during night hours with firearms brandished.",
            "evidence_items": ["weapon_recovered", "ballistic_residue", "forced_entry"],
        },
    )
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert data["risk_level"] in ["Elevated", "Moderate"]
    assert data["escalation_score"] > 0.5
    assert len(data["pattern_indicators"]) > 0
    assert "ethical_disclaimer" in data


def test_governance_evaluate_endpoint(client):
    """Test Module 5: Smart mine governance and safety compliance monitoring."""
    response = client.post(
        "/api/v1/governance/evaluate",
        json={
            "mine_site_id": "MINE-JH-04",
            "methane_level_ppm": 1.8,
            "dust_density_mg_m3": 6.2,
            "ventilation_airflow_m3_s": 24.0,
            "seismic_vibration_g": 0.065,
            "last_inspection_days_ago": 35,
        },
    )
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert data["compliance_status"] == "Critical Violation"
    assert data["hazard_index"] >= 0.5
    assert len(data["flagged_violations"]) >= 2
    assert len(data["recommended_mitigation"]) >= 2
    assert data["inspector_signoff_needed"] is True
