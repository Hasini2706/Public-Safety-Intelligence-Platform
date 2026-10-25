"""Extended unit tests for Module 3 Physical Threat Detection and Vision Telemetry."""

import base64
import io
import numpy as np
from PIL import Image
from ml.threat_detection.detector import threat_detection_module


def test_threat_normal_telemetry():
    """Verify standard authorized daytime telemetry results in normal operational status."""
    res = threat_detection_module.predict({
        "zone_id": "SERVER-POD-ALPHA",
        "event_payload": {
            "after_hours": False,
            "failed_badge_attempts": 0,
            "person_count": 1,
            "door_dwell_seconds": 8.0,
            "rack_vibration_g": 0.02,
            "thermal_delta_c": 0.5,
        },
    })
    assert res["threat_level"] in ["Normal", "Low"]
    assert res["alert_triggered"] is False
    assert res["soc_escalation_advised"] is False
    assert len(res["recommended_playbook"]) > 0


def test_threat_critical_tampering_and_intrusion():
    """Verify multi-factor forced breach and severe rack vibration triggers critical SOC escalation."""
    res = threat_detection_module.predict({
        "zone_id": "SERVER-POD-ALPHA",
        "event_payload": {
            "after_hours": True,
            "failed_badge_attempts": 4,
            "person_count": 2,
            "door_dwell_seconds": 120.0,
            "rack_vibration_g": 0.65,
            "thermal_delta_c": 4.2,
        },
    })
    assert res["threat_level"] in ["High", "Critical"]
    assert res["alert_triggered"] is True
    assert res["soc_escalation_advised"] is True
    assert res["anomaly_score"] >= 0.50


def test_threat_text_incident_report():
    """Verify natural language incident report triage identifies zone and thermal urgency."""
    res = threat_detection_module.predict({
        "text": "Severe electrical fire and thick black smoke billowing from battery vault UPS unit after hours",
    })
    assert res["threat_level"] in ["High", "Critical"]
    assert res["alert_triggered"] is True
    assert "BATTERY-VAULT-02" in res["zone_id"]
    assert any("fire" in ind.lower() or "thermal" in ind.lower() for ind in res["detected_indicators"])


def test_threat_optical_tamper_detection():
    """Verify completely black / occluded CCTV camera feed flags optical tampering."""
    # Create solid black image simulating covered lens
    black_im = Image.new("RGB", (128, 128), color=(0, 0, 0))
    buf = io.BytesIO()
    black_im.save(buf, format="PNG")
    b64 = f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

    res = threat_detection_module.predict({
        "image_b64": b64,
        "zone_id": "NOC-MAIN-ENTRANCE",
    })
    assert res["threat_level"] in ["High", "Critical"]
    assert res["alert_triggered"] is True
    assert any("tamper" in ind.lower() or "occlusion" in ind.lower() or "uniform" in ind.lower() for ind in res["detected_indicators"])
