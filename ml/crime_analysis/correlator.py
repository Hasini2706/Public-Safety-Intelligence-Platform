"""Module 4 ML Engine: Crime Scene Evidence Analysis & Incident Risk Assessment.

Performs multi-attribute evidence correlation, narrative text pattern mining,
modus operandi clustering, and investigative decision-support scoring.
"""

from typing import Any, Dict, List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import GradientBoostingRegressor

from ml.shared.base_model import BaseMLModule, ModelStatus

# Historical crime archetype training patterns spanning violent, property, financial, and opportunistic crimes
TRAINING_ARCHETYPES = [
    # 1. Armed & Violent Incident Patterns (High/Elevated risk: 0.80 - 0.95)
    ("Armed commercial robbery with firearm brandished at clerks", ["weapon_recovered", "ballistic_residue", "surveillance_match"], 0.94, "Armed Commercial Robbery"),
    ("Gunshots reported during jewelry store heist with shattered glass", ["weapon_recovered", "ballistic_residue", "forced_entry"], 0.91, "Armed Commercial Robbery"),
    ("Violent warehouse takeover by masked suspects with tactical weapons", ["weapon_recovered", "surveillance_match", "vehicle_sighted"], 0.88, "Aggravated Robbery"),
    ("Cash-in-transit armored van ambushed with assault rifles and explosives", ["weapon_recovered", "ballistic_residue", "vehicle_sighted"], 0.96, "Armored Vehicle Ambush"),
    ("Bank branch hostage situation with armed perpetrators demanding vault access", ["weapon_recovered", "surveillance_match", "forced_entry"], 0.95, "Armed Bank Robbery"),
    ("Nightclub parking lot shooting leaving multiple victims wounded", ["weapon_recovered", "ballistic_residue"], 0.89, "Violent Assault with Weapon"),
    ("Home invasion with armed suspects holding residents at gunpoint", ["weapon_recovered", "forced_entry", "dna_sample"], 0.92, "Aggravated Home Invasion"),

    # 2. Sophisticated Burglary & Infrastructure Breaches (Elevated risk: 0.65 - 0.79)
    ("Nighttime commercial burglary with safe cracked using thermal cutting torches", ["forced_entry", "tool_marks", "insider_badge_usage"], 0.76, "Commercial Safe Burglary"),
    ("Electronics warehouse perimeter fence cut with hydraulic shears at 3 AM", ["forced_entry", "tool_marks", "vehicle_sighted"], 0.72, "Commercial Burglary"),
    ("Pharmacy backdoor lock cylinder pried open and narcotics cabinet emptied", ["forced_entry", "tool_marks", "fingerprints_lifted"], 0.69, "Pharmaceutical Theft"),
    ("Substation control room door breached and copper grounding cables stripped", ["forced_entry", "tool_marks"], 0.74, "Critical Infrastructure Tampering"),
    ("ATM machine attacked with gas explosive mixture and cash cassette stolen", ["forced_entry", "tool_marks", "surveillance_match"], 0.78, "ATM Explosive Tampering"),
    ("Data center server rack cages pried open and enterprise SSD drives stolen", ["forced_entry", "insider_badge_usage", "cyber_tampering"], 0.77, "Enterprise Hardware Theft"),
    ("Art museum skylight cut and alarm system wiring severed with bypass tools", ["forced_entry", "tool_marks", "cyber_tampering"], 0.79, "High-Value Cultural Theft"),

    # 3. Cyber-Physical & Insider Exploitation (Moderate risk: 0.50 - 0.64)
    ("Unauthorized badge cloning used to enter executive finance suite after midnight", ["insider_badge_usage", "cyber_tampering"], 0.63, "Credential Compromise"),
    ("Industrial SCADA telemetry terminal infected with external USB payload", ["cyber_tampering", "insider_badge_usage"], 0.62, "Cyber-Physical Tampering"),
    ("Logistics terminal freight dispatch records altered to divert shipping container", ["cyber_tampering"], 0.56, "Cargo Theft & Fraud"),
    ("Security camera network feed looped while loading dock was accessed", ["cyber_tampering", "surveillance_match"], 0.64, "Surveillance Countermeasures"),

    # 4. Property Theft & Serial Opportunistic Crimes (Moderate/Standard risk: 0.35 - 0.49)
    ("Construction site copper wiring stripped from outdoor spool over weekend", ["tool_marks", "vehicle_sighted"], 0.45, "Material Theft"),
    ("Catalytic converters cut from fleet vehicles in commercial parking lot", ["tool_marks", "vehicle_sighted"], 0.44, "Serial Auto Part Theft"),
    ("Commercial storefront display window smashed and designer apparel grabbed", ["forced_entry", "surveillance_match"], 0.46, "Smash and Grab"),
    ("Residential construction tools and generators taken from secured trailer", ["forced_entry", "tool_marks"], 0.42, "Tool & Equipment Theft"),
    ("Motorcycle stolen from public transit parking lot using bypass ignition wires", ["tool_marks", "surveillance_match"], 0.40, "Vehicle Theft"),

    # 5. Petty Theft & Public Order Mischief (Standard risk: 0.15 - 0.34)
    ("Bicycle and power tools taken from unlocked residential garage", ["fingerprints_lifted"], 0.28, "Petty Property Theft"),
    ("Storefront graffiti tagging and broken exterior display sign", ["surveillance_match"], 0.22, "Vandalism / Criminal Mischief"),
    ("Shoplifting of high-value perfume bottles concealed in backpack", ["surveillance_match"], 0.25, "Retail Theft"),
    ("Public park bench vandalized and bronze plaque unscrewed", ["tool_marks"], 0.20, "Public Property Vandalism"),
    ("Smartphone pickpocketed from commuter boarding crowded city bus", ["surveillance_match"], 0.32, "Pickpocketing"),
]

KNOWN_EVIDENCE_WEIGHTS = {
    "weapon_recovered": 0.26,
    "ballistic_residue": 0.24,
    "dna_sample": 0.19,
    "forced_entry": 0.15,
    "tool_marks": 0.12,
    "surveillance_match": 0.11,
    "fingerprints_lifted": 0.10,
    "vehicle_sighted": 0.08,
    "cyber_tampering": 0.16,
    "insider_badge_usage": 0.17,
}


class CrimeAnalysisModule(BaseMLModule):
    """Evidence correlation and incident risk assessment decision-support engine."""

    def __init__(self, version: str = "1.0.0"):
        super().__init__(module_name="crime_analysis", version=version)
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.regressor: Optional[GradientBoostingRegressor] = None
        self._train_engine()

    def _train_engine(self):
        """Fit NLP narrative feature extractor and Gradient Boosting risk regressor."""
        narratives = [n for n, _, _, _ in TRAINING_ARCHETYPES]
        scores = [s for _, _, s, _ in TRAINING_ARCHETYPES]

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            sublinear_tf=True,
            max_features=2500
        )
        X = self.vectorizer.fit_transform(narratives)

        self.regressor = GradientBoostingRegressor(
            n_estimators=120,
            learning_rate=0.06,
            max_depth=3,
            random_state=42
        )
        self.regressor.fit(X.toarray(), scores)
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

        # Base narrative risk score via calibrated NLP
        if narrative:
            feat = self.vectorizer.transform([narrative]).toarray()
            nlp_score = float(self.regressor.predict(feat)[0])
        else:
            nlp_score = 0.35

        # Evidence weight sum
        evidence_score = sum(KNOWN_EVIDENCE_WEIGHTS.get(item, 0.06) for item in evidence)
        composite_score = min(0.98, max(0.12, round(0.50 * nlp_score + 0.50 * evidence_score, 3)))

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

        corroboration_score = min(1.0, max(0.18, round(len(evidence) * 0.22 + 0.20, 2)))

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
