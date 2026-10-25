"""Extended unit test coverage for Module 4 Crime Scene Evidence Correlator and Risk Triage."""

import pytest
from ml.crime_analysis.correlator import crime_analysis_module


def test_crime_armed_robbery_escalation():
    """Verify armed violent heist triggers elevated/moderate risk and forensic ballistics guidance."""
    res = crime_analysis_module.predict({
        "incident_id": "INC-ARMED-001",
        "location": "Downtown Financial Center",
        "evidence_items": ["weapon_recovered", "ballistic_residue", "surveillance_match"],
        "incident_narrative": "Armed commercial robbery with firearm brandished at bank tellers with gunshots fired",
    })
    assert res["risk_level"] in ["Moderate", "Elevated"]
    assert res["escalation_score"] >= 0.50
    assert any("Ballistic" in p for p in res["pattern_indicators"])
    assert any("ballistics" in n.lower() for n in res["corroboration_notes"])


def test_crime_mechanical_burglary():
    """Verify safe-cracking and forced entry produces mechanical breach pattern indicators."""
    res = crime_analysis_module.predict({
        "incident_id": "INC-BURG-002",
        "location": "Industrial Warehouse Zone 7",
        "evidence_items": ["forced_entry", "tool_marks"],
        "incident_narrative": "Nighttime commercial burglary with safe pried open using heavy hydraulic shears",
    })
    assert res["risk_level"] in ["Moderate", "Elevated"]
    assert any("Mechanical Breach" in p for p in res["pattern_indicators"])


def test_crime_biological_trace_prioritization():
    """Verify DNA sample and fingerprints trigger AFIS & CODIS database matching guidance."""
    res = crime_analysis_module.predict({
        "incident_id": "INC-FORENSIC-003",
        "evidence_items": ["dna_sample", "fingerprints_lifted"],
        "incident_narrative": "Latent blood traces and prints recovered from shattered display cabinet",
    })
    assert any("Biological" in p for p in res["pattern_indicators"])
    assert any("CODIS" in n for n in res["corroboration_notes"])


def test_crime_petty_theft_standard_risk():
    """Verify isolated petty vandalism/theft without weapons produces standard risk classification."""
    res = crime_analysis_module.predict({
        "incident_id": "INC-PETTY-004",
        "evidence_items": [],
        "incident_narrative": "Exterior spray paint graffiti tagging on park bench",
    })
    assert res["risk_level"] == "Standard"
    assert res["escalation_score"] < 0.45
    assert "Isolated event" in res["pattern_indicators"][0]
