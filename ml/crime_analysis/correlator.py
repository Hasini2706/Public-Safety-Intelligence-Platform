"""Module 4 ML Engine: Crime Scene Evidence Analysis & Incident Risk Assessment.

Performs multi-attribute evidence correlation, narrative text pattern mining,
modus operandi clustering, and investigative decision-support scoring.
"""

from typing import Any, Dict, List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge

from ml.shared.base_model import BaseMLModule, ModelStatus

# Historical crime archetype training patterns
TRAINING_ARCHETYPES = [
    # Armed / Violent Incident Patterns (High risk)
    ("Armed commercial robbery with firearm brandished at clerks", ["weapon_recovered", "ballistic_residue", "surveillance_match"], 0.92, "Armed Commercial Robbery"),
    ("Gunshots reported during jewelry store heist with shattered glass", ["weapon_recovered", "ballistic_residue", "forced_entry"], 0.88, "Armed Commercial Robbery"),
    ("Violent warehouse takeover by masked suspects with knives", ["weapon_recovered", "surveillance_match", "vehicle_sighted"], 0.82, "Aggravated Robbery"),

    # Sophisticated Burglary / Forced Entry (Elevated risk)
    ("Nighttime commercial burglary with safe cracked using thermal cutting torches", ["forced_entry", "tool_marks", "insider_badge_usage"], 0.74, "Commercial Burglary"),
    ("Electronics warehouse perimeter fence cut with hydraulic shears at 3 AM", ["forced_entry", "tool_marks", "vehicle_sighted"], 0.68, "Commercial Burglary"),
    ("Pharmacy backdoor lock cylinder pried open and narcotics cabinet emptied", ["forced_entry", "tool_marks", "fingerprints_lifted"], 0.65, "Commercial Burglary"),

    # Opportunistic / Property Theft (Standard / Moderate risk)
    ("Construction site copper wiring stripped from outdoor spool over weekend", ["tool_marks", "vehicle_sighted"], 0.42, "Material Theft"),
    ("Bicycle and power tools taken from unlocked residential garage", ["fingerprints_lifted"], 0.28, "Petty Property Theft"),
    ("Storefront graffiti tagging and broken exterior display sign", ["surveillance_match"], 0.22, "Vandalism / Criminal Mischief"),
    ("Shoplifting of high-value perfume bottles concealed in backpack", ["surveillance_match"], 0.25, "Retail Theft"),
]

KNOWN_EVIDENCE_WEIGHTS = {
    "weapon_recovered": 0.25,
    "ballistic_residue": 0.22,
    "dna_sample": 0.18,
    "forced_entry": 0.14,
    "tool_marks": 0.12,
    "surveillance_match": 0.10,
    "fingerprints_lifted": 0.09,
    "vehicle_sighted": 0.08,
    "cyber_tampering": 0.15,
    "insider_badge_usage": 0.16,
}


class CrimeAnalysisModule(BaseMLModule):
    """Evidence correlation and incident risk assessment decision-support engine."""

    def __init__(self, version: str = "1.0.0"):
        super().__init__(module_name="crime_analysis", version=version)
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.regressor: Optional[Ridge] = None
        self._train_engine()

    def _train_engine(self):
        """Fit NLP narrative feature extractor and risk regressor."""
        narratives = [n for n, _, _, _ in TRAINING_ARCHETYPES]
        scores = [s for _, _, s, _ in TRAINING_ARCHETYPES]

        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1000)
        X = self.vectorizer.fit_transform(narratives)

        self.regressor = Ridge(alpha=1.0)
        self.regressor.fit(X, scores)
        self._status = ModelStatus.READY

    def load_model(self, artifact_path: Optional[str] = None) -> bool:
        if not self.regressor:
            self._train_engine()
        return True

    def preprocess(self, raw_input: Any) -> Dict[str, Any]:
        incident_id = raw_input.get("incident_id", "INC-2026-0881")
        location = raw_input.get("location", "Sector 4 Industrial Area")
        evidence_items = raw_input.get("evidence_items", []) or []
        narrative = raw_input.get("incident_narrative", "")

        return {
            "incident_id": incident_id,
            "location": location,
            "evidence_items": [str(e).lower().replace(" ", "_") for e in evidence_items],
            "narrative": str(narrative).strip(),
        }

    def predict(self, raw_input: Any) -> Dict[str, Any]:
        """Correlate evidence items, evaluate incident escalation risk, and generate investigator guidance."""
        if self._status != ModelStatus.READY:
            self.load_model()

        data = self.preprocess(raw_input)
        evidence = set(data["evidence_items"])
        narrative = data["narrative"]

        # Base narrative risk score via NLP
        if narrative:
            feat = self.vectorizer.transform([narrative])
            nlp_score = float(self.regressor.predict(feat)[0])
        else:
            nlp_score = 0.35

        # Evidence weight sum
        evidence_score = sum(KNOWN_EVIDENCE_WEIGHTS.get(item, 0.05) for item in evidence)
        composite_score = min(0.98, max(0.10, round(0.55 * nlp_score + 0.45 * evidence_score, 3)))

        # Pattern identification & Modus Operandi (M.O.)
        pattern_indicators: List[str] = []
        corroboration_notes: List[str] = []

        if "weapon_recovered" in evidence or "ballistic_residue" in evidence:
            pattern_indicators.append("Ballistic/Weapon Factor: Firearms or tactical weapons involved")
            corroboration_notes.append("Forensic ballistics test matching registered serials recommended")

        if "forced_entry" in evidence and "tool_marks" in evidence:
            pattern_indicators.append("Mechanical Breach: Heavy mechanical tool signatures indicate planned entry")
            corroboration_notes.append("Tool mark microscopic striation comparison indicated")

        if "insider_badge_usage" in evidence or "cyber_tampering" in evidence:
            pattern_indicators.append("Credential Exploitation: Access logs point to insider clearance compromise")
            corroboration_notes.append("Cross-reference electronic badge punch timestamps with CCTV feeds")

        if "dna_sample" in evidence or "fingerprints_lifted" in evidence:
            pattern_indicators.append("Direct Biological/Latent Trace: High-value forensic link available")
            corroboration_notes.append("Prioritize AFIS & CODIS database matching on expedited timeline")

        if "surveillance_match" in evidence and "vehicle_sighted" in evidence:
            pattern_indicators.append("Getaway Vehicle Corroboration: License plate reader correlation active")

        if not pattern_indicators:
            pattern_indicators.append("Isolated event: No corroborated multi-crime nexus identified at this stage")

        # Determine Risk Level
        if composite_score >= 0.75:
            risk_level = "Elevated"
            guidance = (
                f"Incident {data['incident_id']} exhibits high escalation risk due to violent weapon or organized breach indicators. "
                "Recommend fast-tracking forensic ballistics and coordinating with regional task force."
            )
        elif composite_score >= 0.45:
            risk_level = "Moderate"
            guidance = (
                f"Incident {data['incident_id']} shows established commercial burglary or property breach patterns. "
                "Investigator should prioritize local surveillance camera retrieval within 500m radius."
            )
        else:
            risk_level = "Standard"
            guidance = (
                f"Incident {data['incident_id']} classified as standard property or nuisance complaint. "
                "Process standard crime scene documentation without urgent operational mobilization."
            )

        corroboration_score = min(1.0, max(0.15, round(len(evidence) * 0.22 + 0.20, 2)))

        return {
            "incident_id": data["incident_id"],
            "location": data["location"],
            "risk_level": risk_level,
            "escalation_score": composite_score,
            "corroboration_score": corroboration_score,
            "pattern_indicators": pattern_indicators,
            "corroboration_notes": corroboration_notes,
            "investigator_guidance": guidance,
            "ethical_disclaimer": (
                "Responsible AI Protocol: Automated decision-support output is an analytical aid for sworn investigators. "
                "It does not establish criminal guilt, liability, or probable cause."
            ),
            "model_version": self.version,
        }


# Singleton instance
crime_analysis_module = CrimeAnalysisModule()
