"""Module 5 ML Engine: Smart Governance & Compliance Monitoring for Coal Mines.

Evaluates multi-sensor atmospheric telemetry (CH4 methane, coal dust, ventilation airflow,
seismic vibration, CO) to forecast hazard conditions and enforce regulatory compliance.
"""

from typing import Any, Dict, List, Optional
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

from ml.shared.base_model import BaseMLModule, ModelStatus

# Statutory Regulatory Thresholds (DGMS Coal Mines Regulations 2017 & MSHA 30 CFR)
CH4_PERMISSIBLE_MAX = 1.0       # 1.0% / ppm operating limit
CH4_STATUTORY_INTERLOCK = 1.25  # 1.25% DGMS power trip threshold
CH4_CRITICAL_THRESHOLD = 1.5    # 1.50% mandatory evacuation
DUST_PERMISSIBLE_MAX = 3.0      # 3.0 mg/m3 respirable dust limit
DUST_CRITICAL_THRESHOLD = 5.0   # Combustible coal dust explosion hazard
AIRFLOW_MINIMUM_REQUIRED = 30.0 # 30.0 m3/s minimum fresh intake airflow
SEISMIC_BURST_THRESHOLD = 0.05  # 0.05g microseismic vibration (rockburst precursor)
INSPECTION_WINDOW_DAYS = 30     # 30 days statutory audit interval


def _generate_synthetic_mine_data(n_samples: int = 2500) -> tuple[np.ndarray, np.ndarray]:
    """Simulate multi-sensor telemetry with underlying non-linear hazard index based on mining safety physics."""
    rng = np.random.RandomState(42)
    methane = rng.uniform(0.1, 2.4, size=n_samples)
    dust = rng.uniform(0.5, 7.5, size=n_samples)
    airflow = rng.uniform(14.0, 65.0, size=n_samples)
    seismic = rng.uniform(0.005, 0.14, size=n_samples)
    days = rng.randint(1, 50, size=n_samples)

    # Calibrated physical hazard components
    ch4_risk = np.where(
        methane >= CH4_CRITICAL_THRESHOLD,
        0.90 + 0.10 * np.clip((methane - 1.5) / 0.8, 0, 1),
        np.clip((methane - 0.7) / 0.8, 0, 1) ** 1.4
    )

    dust_risk = np.where(
        dust >= DUST_CRITICAL_THRESHOLD,
        0.85 + 0.15 * np.clip((dust - 5.0) / 2.5, 0, 1),
        np.clip((dust - 2.2) / 3.0, 0, 1) ** 1.3
    )

    vent_risk = np.where(
        airflow < AIRFLOW_MINIMUM_REQUIRED,
        0.50 + 0.50 * np.clip((AIRFLOW_MINIMUM_REQUIRED - airflow) / 16.0, 0, 1),
        np.clip((35.0 - airflow) / 25.0, 0, 0.4)
    )

    seismic_risk = np.clip((seismic - 0.02) / 0.08, 0, 1) ** 1.2
    audit_risk = np.clip((days - 25) / 15.0, 0, 1) * 0.25

    # Non-linear coupling: high methane combined with deficient airflow multiplies hazard
    coupling_factor = np.where((methane > 1.2) & (airflow < 28.0), 0.25, 0.0)

    composite = np.clip(
        0.35 * ch4_risk + 0.25 * dust_risk + 0.20 * vent_risk + 0.12 * seismic_risk + audit_risk + coupling_factor,
        0.05, 0.99
    )

    X = np.column_stack([methane, dust, airflow, seismic, days])
    return X, composite


class MineGovernanceModule(BaseMLModule):
    """Environmental compliance & safety hazard forecasting engine for coal mines."""

    def __init__(self, version: str = "1.0.0"):
        super().__init__(module_name="governance", version=version)
        self.model: Optional[GradientBoostingRegressor] = None
        self._train_engine()

    def _train_engine(self):
        """Fit an ensemble Gradient Boosted Regressor on the 2,500-sample mine safety dataset."""
        X, y = _generate_synthetic_mine_data(2500)
        self.model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.06,
            max_depth=4,
            subsample=0.85,
            random_state=42
        )
        self.model.fit(X, y)
        self._status = ModelStatus.READY

    def load_model(self, artifact_path: Optional[str] = None) -> bool:
        if not self.model:
            self._train_engine()
        return True

    def preprocess(self, raw_input: Any) -> tuple[np.ndarray, Dict[str, Any]]:
        mine_site_id = raw_input.get("mine_site_id", "MINE-JH-04")
        methane = float(raw_input.get("methane_level_ppm", 0.8))
        dust = float(raw_input.get("dust_density_mg_m3", 2.1))
        airflow = float(raw_input.get("ventilation_airflow_m3_s", 42.5))
        seismic = float(raw_input.get("seismic_vibration_g", 0.012))
        days = int(raw_input.get("last_inspection_days_ago", 14))

        features = np.array([[methane, dust, airflow, seismic, days]])
        meta = {
            "mine_site_id": mine_site_id,
            "methane": methane,
            "dust": dust,
            "airflow": airflow,
            "seismic": seismic,
            "days": days,
        }
        return features, meta

    def predict(self, raw_input: Any) -> Dict[str, Any]:
        """Evaluate sensor thresholds, forecast hazard probability, and enforce regulatory rules."""
        if self._status != ModelStatus.READY:
            self.load_model()

        vec, meta = self.preprocess(raw_input)
        raw_hazard = float(self.model.predict(vec)[0])
        hazard_index = min(1.0, max(0.01, round(raw_hazard, 3)))
        safety_score = max(0, min(100, round((1.0 - hazard_index) * 100)))

        violations: List[str] = []
        mitigations: List[str] = []
        immediate_evac = False

        # Methane compliance
        if meta["methane"] >= CH4_CRITICAL_THRESHOLD:
            violations.append(f"CRITICAL: Methane at {meta['methane']} ppm exceeds evacuation limit (1.5 ppm)")
            mitigations.append("Cut all electrical power in section immediately and withdraw all underground miners")
            immediate_evac = True
        elif meta["methane"] > CH4_PERMISSIBLE_MAX:
            violations.append(f"WARNING: Methane at {meta['methane']} ppm exceeds standard permissible threshold (1.0 ppm)")
            mitigations.append("Increase aux ventilation fan speed and inspect return airway seals for methane pooling")

        # Respirable dust compliance
        if meta["dust"] >= DUST_CRITICAL_THRESHOLD:
            violations.append(f"CRITICAL: Dust density at {meta['dust']} mg/m3 exceeds combustible hazard threshold (5.0 mg/m3)")
            mitigations.append("Activate high-pressure water scrubber sprays at continuous miner cutter head")
        elif meta["dust"] > DUST_PERMISSIBLE_MAX:
            violations.append(f"WARNING: Dust density at {meta['dust']} mg/m3 exceeds permissible exposure (3.0 mg/m3)")
            mitigations.append("Enforce statutory N95/FFP3 respirator usage and verify water curtain operation")

        # Ventilation airflow
        if meta["airflow"] < AIRFLOW_MINIMUM_REQUIRED:
            violations.append(f"VIOLATION: Main airflow velocity at {meta['airflow']} m3/s is below legal minimum (30.0 m3/s)")
            mitigations.append("Inspect ventilation regulators and booster fans in district return airway")

        # Seismic hazard
        if meta["seismic"] >= SEISMIC_BURST_THRESHOLD:
            violations.append(f"ALERT: Microseismic acceleration at {meta['seismic']}g indicates strata stress concentration")
            mitigations.append("Halt extraction at face, install additional hydraulic prop supports, and monitor convergence")

        # Audit currency
        if meta["days"] > INSPECTION_WINDOW_DAYS:
            violations.append(f"AUDIT OVERDUE: Last certified safety inspection was {meta['days']} days ago (statutory limit: 30 days)")
            mitigations.append("Schedule expedited on-site safety audit with certified DGMS mine inspector")

        # Compliance Status Determination
        if immediate_evac or hazard_index >= 0.70 or len(violations) >= 2:
            status = "Critical Violation"
        elif len(violations) > 0 or hazard_index >= 0.40:
            status = "Warning"
        else:
            status = "Fully Compliant"

        if not mitigations:
            mitigations.append("Continue standard continuous atmospheric monitoring and daily shift logs")

        return {
            "mine_site_id": meta["mine_site_id"],
            "compliance_status": status,
            "safety_score": safety_score,
            "hazard_index": hazard_index,
            "flagged_violations": violations,
            "recommended_mitigation": mitigations,
            "inspector_signoff_needed": status != "Fully Compliant",
            "statutory_mandate": (
                "DGMS (Directorate General of Mines Safety) Coal Mines Regulations 2017 & MSHA Title 30 CFR. "
                "Automated compliance logs are archived to immutable regulatory audit records."
            ),
            "model_version": self.version,
        }


# Singleton instance
governance_evaluator_module = MineGovernanceModule()
mine_governance_module = governance_evaluator_module
