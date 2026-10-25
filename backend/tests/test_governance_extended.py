"""Extended unit tests for Module 5 Coal Mines Environmental Safety & DGMS Compliance."""

import pytest
from ml.governance.evaluator import governance_evaluator_module


def test_governance_compliant_baseline():
    """Verify standard nominal environmental readings yield Compliant status."""
    res = governance_evaluator_module.predict({
        "mine_site_id": "MINE-JH-04",
        "methane_level_ppm": 0.45,
        "dust_density_mg_m3": 1.2,
        "ventilation_airflow_m3_s": 48.0,
        "seismic_vibration_g": 0.008,
        "last_inspection_days_ago": 10,
    })
    assert res["compliance_status"] == "Compliant"
    assert res["inspector_signoff_needed"] is False
    assert res["safety_score"] >= 70
    assert len(res["flagged_violations"]) == 0


def test_governance_critical_methane_interlock():
    """Verify methane levels above 1.5% trigger critical status and power isolation directive."""
    res = governance_evaluator_module.predict({
        "mine_site_id": "MINE-JH-04",
        "methane_level_ppm": 1.85,
        "dust_density_mg_m3": 2.0,
        "ventilation_airflow_m3_s": 35.0,
        "seismic_vibration_g": 0.01,
        "last_inspection_days_ago": 5,
    })
    assert res["compliance_status"] == "Critical Violation"
    assert res["inspector_signoff_needed"] is True
    assert any("electric power isolation" in d.lower() for d in res["recommended_mitigation"])
    assert any("Reg 169" in v for v in res["flagged_violations"])


def test_governance_ventilation_airflow_deficit():
    """Verify ventilation drop below statutory 30 m3/s flags DGMS Regulation 153 deficit."""
    res = governance_evaluator_module.predict({
        "mine_site_id": "MINE-JH-04",
        "methane_level_ppm": 0.8,
        "dust_density_mg_m3": 2.1,
        "ventilation_airflow_m3_s": 22.0,
        "seismic_vibration_g": 0.01,
        "last_inspection_days_ago": 12,
    })
    assert res["compliance_status"] in ["Action Required", "Critical Violation"]
    assert any("DGMS Reg 153" in v for v in res["flagged_violations"])
    assert any("fan" in d.lower() for d in res["recommended_mitigation"])


def test_governance_statutory_audit_overdue():
    """Verify inspection intervals exceeding 30-day statutory window flag audit overdue."""
    res = governance_evaluator_module.predict({
        "mine_site_id": "MINE-JH-04",
        "methane_level_ppm": 0.5,
        "dust_density_mg_m3": 1.5,
        "ventilation_airflow_m3_s": 45.0,
        "seismic_vibration_g": 0.01,
        "last_inspection_days_ago": 42,
    })
    assert any("Audit Overdue" in v for v in res["flagged_violations"])
    assert res["inspector_signoff_needed"] is True
