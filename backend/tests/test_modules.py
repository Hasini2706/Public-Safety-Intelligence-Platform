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


def test_identity_verify_scenarios(client):
    """Test Module 2: Borderline and mismatch status classifications."""
    # Borderline scenario
    res_b = client.post(
        "/api/v1/identity/verify",
        json={"reference_id": "REF-ID-98214", "test_scenario": "borderline"},
    ).json()
    assert res_b["success"] is True
    assert res_b["data"]["match_status"] == "Borderline Match – Manual Review Required"
    assert 0.65 <= res_b["data"]["similarity_score"] < 0.78

    # Mismatch scenario
    res_m = client.post(
        "/api/v1/identity/verify",
        json={"reference_id": "REF-ID-98214", "test_scenario": "mismatch"},
    ).json()
    assert res_m["success"] is True
    assert res_m["data"]["match_status"] == "Not Verified"
    assert res_m["data"]["similarity_score"] < 0.65

    # Missing one photo validation error
    res_err = client.post(
        "/api/v1/identity/verify",
        json={"reference_id": "REF-ID-98214", "reference_image_b64": "invalid_too_short"},
    ).json()
    assert res_err["success"] is False
    assert "error" in res_err


def test_identity_verify_with_real_images(client):
    """Test actual image base64 comparison between match, mismatch, and blank images."""
    import base64
    import io
    import numpy as np
    from PIL import Image

    def make_face_png(bg_color=(200, 220, 240), eye_offset=0):
        im = Image.new("RGB", (100, 100), color=bg_color)
        arr = np.array(im, dtype=np.uint8)
        arr[20:80, 25:75] = [150, 120, 100]
        arr[35:45, 35 - eye_offset : 45 - eye_offset] = [30, 30, 30]
        arr[35:45, 55 + eye_offset : 65 + eye_offset] = [30, 30, 30]
        arr[50:60, 48:52] = [60, 40, 30]
        arr[65:72, 40:60] = [120, 40, 40]
        buf = io.BytesIO()
        Image.fromarray(arr).save(buf, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

    img_ref = make_face_png(bg_color=(200, 220, 240), eye_offset=0)
    img_match = make_face_png(bg_color=(200, 220, 240), eye_offset=0) # identical
    img_diff = make_face_png(bg_color=(50, 60, 80), eye_offset=6) # different features & bg

    # Test Match
    res_match = client.post(
        "/api/v1/identity/verify",
        json={
            "reference_id": "REF-ID-98214",
            "reference_image_b64": img_ref,
            "verification_image_b64": img_match,
        },
    ).json()
    assert res_match["success"] is True
    assert res_match["data"]["match_status"] == "Verified Match"
    assert res_match["data"]["similarity_score"] >= 0.78
    assert len(res_match["data"]["features_breakdown"]) == 4

    # Test Mismatch / Divergent Images
    res_mismatch = client.post(
        "/api/v1/identity/verify",
        json={
            "reference_id": "REF-ID-98214",
            "reference_image_b64": img_ref,
            "verification_image_b64": img_diff,
        },
    ).json()
    assert res_mismatch["success"] is True
    assert res_mismatch["data"]["match_status"] in ["Not Verified", "Borderline Match – Manual Review Required"]
    assert res_mismatch["data"]["similarity_score"] < 0.78

    # Test Blank / Corrupt Image
    blank_im = Image.new("RGB", (100, 100), color=(0, 0, 0))
    buf = io.BytesIO()
    blank_im.save(buf, format="PNG")
    blank_b64 = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

    res_blank = client.post(
        "/api/v1/identity/verify",
        json={
            "reference_id": "REF-ID-98214",
            "reference_image_b64": img_ref,
            "verification_image_b64": blank_b64,
        },
    ).json()
    assert res_blank["success"] is False
    assert "error" in res_blank




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
