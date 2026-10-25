"""Extended unit tests for Module 1 Complaint Classification and SLA triage."""

import pytest
from ml.complaints.classifier import complaint_classifier_module


def test_complaint_empty_text_fallback():
    """Verify default graceful fallback when whitespace/empty input is provided."""
    res = complaint_classifier_module.predict("")
    assert res["priority"] == "Low"
    assert res["requires_human_review"] is True
    assert res["sla_hours"] == 72


def test_complaint_urgent_fire_hazard():
    """Verify that fire and thermal hazards are immediately classified as Urgent."""
    res = complaint_classifier_module.predict({
        "title": "Commercial LPG gas cylinder leak",
        "description": "Intense gas odor and hissing sound near restaurant kitchen with active flames",
    })
    assert res["priority"] == "Urgent"
    assert res["sla_hours"] == 2
    assert "Fire" in res["category"] or "Thermal" in res["category"]
    assert len(res["key_risk_factors"]) > 0


def test_complaint_water_sewage_contamination():
    """Verify raw sewage overflow correctly routes to Water & Sanitation."""
    res = complaint_classifier_module.predict({
        "title": "Raw sewage pipe burst flooding walkway",
        "description": "Black toxic wastewater spilling from broken manhole cap",
    })
    assert res["category"] == "Water Supply & Sewage Contamination"
    assert "Water" in res["department"]
    assert res["confidence"] >= 0.25
