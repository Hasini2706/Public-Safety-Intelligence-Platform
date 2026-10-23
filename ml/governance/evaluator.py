"""Module 5 ML Engine: Smart Governance & Compliance Monitoring for Coal Mines.

Evaluates multi-sensor atmospheric telemetry (CH4 methane, coal dust, ventilation airflow,
seismic vibration, CO) to forecast hazard conditions and enforce regulatory compliance.
"""

from typing import Any, Dict, List, Optional
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

from ml.shared.base_model import BaseMLModule, ModelStatus

# Statutory Regulatory Thresholds (DGMS Coal Mines Regulations & MSHA 30 CFR)
CH4_PERMISSIBLE_MAX = 1.0       # 1.0% / ppm threshold
CH4_CRITICAL_THRESHOLD = 1.5    # Mandatory immediate evacuation above 1.5%
DUST_PERMISSIBLE_MAX = 3.0      # 3.0 mg/m3 respirable dust
DUST_CRITICAL_THRESHOLD = 5.5   # Combustible coal dust explosion hazard
AIRFLOW_MINIMUM_REQUIRED = 30.0 # 30.0 m3/s minimum fresh intake airflow
SEISMIC_BURST_THRESHOLD = 0.05  # 0.05g microseismic vibration (rockburst precursor)
INSPECTION_WINDOW_DAYS = 30     # 30 days statutory audit interval


def _generate_synthetic_mine_data(n_samples: int = 500) -> tuple[np.ndarray, np.ndarray]:
    """Simulate multi-sensor telemetry with underlying non-linear hazard index."""
    rng = np.random.RandomState(42)
    methane = rng.uniform(0.1, 2.2, size=n_samples)
    dust = rng.uniform(0.5, 7.0, size=n_samples)
    airflow = rng.uniform(15.0, 60.0, size=n_samples)
    seismic = rng.uniform(0.005, 0.12, size=n_samples)
    days = rng.randint(1, 45, size=n_samples)

    # Composite physical hazard formula
    ch4_risk = np.clip((methane - 0.8) / 1.0, 0, 1) ** 1.5
    dust_risk = np.clip((dust - 2.5) / 4.0, 0, 1) ** 1.3
    vent_risk = np.clip((35.0 - airflow) / 20.0, 0, 1)
    seismic_risk = np.clip((seismic - 0.02) / 0.08, 0, 1)
    audit_risk = np.clip((days - 25) / 15.0, 0, 1) * 0.2

    composite = np.clip(
        0.35 * ch4_risk + 0.25 * dust_risk + 0.25 * vent_risk + 0.10 * seismic_risk + audit_risk,
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
        """Fit Gradient Boosted Regressor on simulated multi-variable mine physics."""
        X, y = _generate_synthetic_mine_data(500)
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.08,
            max_depth=3,
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

        # Rule evaluation & statutory violation checks
        flagged_violations: List[str] = []
        mitigation_directives: List[str] = []

        # 1. Methane (CH4) checks
        if meta["methane"] >= CH4_CRITICAL_THRESHOLD:
            flagged_violations.append(
                f"CRITICAL VIOLATION: Methane level {meta['methane']} PPM exceeds statutory evacuation ceiling ({CH4_CRITICAL_THRESHOLD} PPM) [DGMS Reg 169]"
            )
            mitigation_directives.append("Immediate electric power isolation to longwall face and evacuate underground personnel")
        elif meta["methane"] > CH4_PERMISSIBLE_MAX:
            flagged_violations.append(
                f"Statutory Warning: Methane level {meta['methane']} PPM exceeds standard threshold ({CH4_PERMISSIBLE_MAX} PPM) [MSHA § 75.323]"
            )
            mitigation_directives.append("Ramp auxiliary ventilation fans and halt mechanical coal shearer cutting")

        # 2. Combustible Dust checks
        if meta["dust"] >= DUST_CRITICAL_THRESHOLD:
            flagged_violations.append(
                f"CRITICAL VIOLATION: Coal dust density {meta['dust']} mg/m³ exceeds explosive combustion limit ({DUST_CRITICAL_THRESHOLD} mg/m³) [DGMS Reg 123]"
            )
            mitigation_directives.append("Activate high-pressure water deluge sprayers and apply limestone rock dusting immediately")
        elif meta["dust"] > DUST_PERMISSIBLE_MAX:
            flagged_violations.append(
                f"Compliance Advisory: Dust density {meta['dust']} mg/m³ exceeds permissible worker exposure ({DUST_PERMISSIBLE_MAX} mg/m³)"
            )
            mitigation_directives.append("Inspect dust collection cyclone filters and enforce N95 respirator compliance")

        # 3. Airflow checks
        if meta["airflow"] < AIRFLOW_MINIMUM_REQUIRED:
            flagged_violations.append(
                f"Ventilation Deficit: Intake airflow {meta['airflow']} m³/s falls below statutory requirement ({AIRFLOW_MINIMUM_REQUIRED} m³/s) [DGMS Reg 153]"
            )
            mitigation_directives.append("Verify booster fan RPM and inspect ventilation stoppings for leakage or blockages")

        # 4. Seismic checks
        if meta["seismic"] >= SEISMIC_BURST_THRESHOLD:
            flagged_violations.append(
                f"Seismic Anomaly: Microseismic vibration {meta['seismic']}g indicates potential pillar spalling or roof burst"
            )
            mitigation_directives.append("Deploy ultrasonic roof bolt stress testing crew to inspect Shaft 3 pillars")

        # 5. Inspection window
        if meta["days"] > INSPECTION_WINDOW_DAYS:
            flagged_violations.append(
                f"Statutory Audit Overdue: Last formal inspection conducted {meta['days']} days ago (Mandatory cycle: {INSPECTION_WINDOW_DAYS} days)"
            )
            mitigation_directives.append("Schedule certified safety officer comprehensive site walk within 48 hours")

        # Overall Status
        if hazard_index >= 0.70 or meta["methane"] >= CH4_CRITICAL_THRESHOLD:
            compliance_status = "Critical Violation"
            urgency = "Immediate Emergency Intervention"
        elif hazard_index >= 0.40 or flagged_violations:
            compliance_status = "Action Required"
            urgency = "Priority 24-Hour Mitigation"
        else:
            compliance_status = "Compliant"
            urgency = "Routine Continuous Monitoring"
            mitigation_directives.append("All physical parameters within statutory permissible safety envelopes")

        return {
            "mine_site_id": meta["mine_site_id"],
            "compliance_status": compliance_status,
            "hazard_index": hazard_index,
            "safety_score": safety_score,
            "flagged_violations": flagged_violations,
            "recommended_mitigation": mitigation_directives,
            "inspector_signoff_needed": compliance_status != "Compliant",
            "inspection_urgency": urgency,
            "sensor_telemetry_snapshot": {
                "methane_ppm": meta["methane"],
                "dust_mg_m3": meta["dust"],
                "airflow_m3_s": meta["airflow"],
                "seismic_g": meta["seismic"],
                "inspection_days_ago": meta["days"],
            },
            "model_version": self.version,
        }


# Singleton instance
governance_evaluator_module = MineGovernanceModule()
