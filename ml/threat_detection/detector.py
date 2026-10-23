"""Module 3 ML Engine: Physical Security Threat Detection for Critical IT Infrastructure.

Evaluates multi-sensor telemetry (CCTV motion, badge access, door contact, rack vibration,
thermal IR) using anomaly detection to identify physical security threats in data centers.
"""

from typing import Any, Dict, List, Optional
import numpy as np
from sklearn.ensemble import IsolationForest

from ml.shared.base_model import BaseMLModule, ModelStatus

# Normal baseline distribution for critical data center sensor telemetry
# Features: [after_hours (0/1), badge_failed_count, person_count, door_dwell_s, vibration_g, thermal_delta_c]
def _generate_synthetic_baseline(n_samples: int = 500) -> np.ndarray:
    rng = np.random.RandomState(42)
    # Normal authorized day operations
    after_hours = rng.choice([0, 1], size=n_samples, p=[0.85, 0.15])
    failed_badges = rng.choice([0, 1], size=n_samples, p=[0.94, 0.06])
    person_count = rng.choice([0, 1, 2], size=n_samples, p=[0.3, 0.6, 0.1])
    door_dwell = rng.exponential(scale=8.0, size=n_samples) + 2.0  # avg 10s
    vibration = rng.normal(loc=0.02, scale=0.01, size=n_samples)  # ambient ~0.02g
    vibration = np.clip(vibration, 0.005, 0.08)
    thermal_delta = rng.normal(loc=0.5, scale=0.8, size=n_samples)  # normal delta < 2C

    return np.column_stack([
        after_hours,
        failed_badges,
        person_count,
        door_dwell,
        vibration,
        thermal_delta,
    ])


class PhysicalThreatDetectionModule(BaseMLModule):
    """Anomaly detection model for data centers and server rooms."""

    def __init__(self, version: str = "1.0.0"):
        super().__init__(module_name="threat_detection", version=version)
        self.model: Optional[IsolationForest] = None
        self._train_anomaly_detector()

    def _train_anomaly_detector(self):
        """Fit Isolation Forest on normal baseline telemetry."""
        baseline = _generate_synthetic_baseline(600)
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.05,
            random_state=42
        )
        self.model.fit(baseline)
        self._status = ModelStatus.READY

    def load_model(self, artifact_path: Optional[str] = None) -> bool:
        if not self.model:
            self._train_anomaly_detector()
        return True

    def preprocess(self, raw_input: Any) -> tuple[np.ndarray, Dict[str, Any]]:
        """Extract multi-sensor telemetry features."""
        zone_id = raw_input.get("zone_id", "SERVER-ROOM-ALPHA")
        sensor_type = raw_input.get("sensor_type", "cctv_motion_badge_reader")
        payload = raw_input.get("event_payload", {}) or {}

        # Extract telemetry attributes with resilient fallbacks
        after_hours = 1.0 if payload.get("after_hours", False) else 0.0
        failed_badges = float(payload.get("failed_badge_attempts", 0))
        person_count = float(payload.get("person_count", 1))
        door_dwell = float(payload.get("door_dwell_seconds", 12.0))
        vibration = float(payload.get("rack_vibration_g", 0.02))
        thermal_delta = float(payload.get("thermal_delta_c", 0.8))

        tailgating = bool(payload.get("tailgating_detected", False)) or (person_count > 1 and failed_badges > 0)
        forced_entry = bool(payload.get("forced_door", False)) or (door_dwell > 60 and failed_badges >= 2)

        feature_vector = np.array([[
            after_hours,
            failed_badges,
            person_count,
            door_dwell,
            vibration,
            thermal_delta,
        ]])

        metadata = {
            "zone_id": zone_id,
            "sensor_type": sensor_type,
            "tailgating": tailgating,
            "forced_entry": forced_entry,
            "raw_payload": payload,
        }
        return feature_vector, metadata

    def predict(self, raw_input: Any) -> Dict[str, Any]:
        """Compute anomaly score, threat classification, and SOC response directives."""
        if self._status != ModelStatus.READY:
            self.load_model()

        vec, meta = self.preprocess(raw_input)
        payload = meta["raw_payload"]
        zone_id = meta["zone_id"]

        # Isolation Forest decision_function returns negative for anomalies
        # Range is roughly [-0.5, 0.5]; we calibrate into normalized [0.0, 1.0] anomaly score
        raw_score = float(self.model.decision_function(vec)[0])
        # Invert: low decision_function -> high anomaly
        base_anomaly = 1.0 / (1.0 + np.exp(raw_score * 5.0))

        # Rule-based threat booster based on physical security invariants
        boost = 0.0
        indicators: List[str] = []

        if payload.get("after_hours", False):
            boost += 0.15
            indicators.append("Off-hours access detected during inactive shift window")

        failed_attempts = payload.get("failed_badge_attempts", 0)
        if failed_attempts >= 3:
            boost += 0.35
            indicators.append(f"Brute-force badge scan anomaly: {failed_attempts} consecutive credential failures")
        elif failed_attempts >= 1:
            boost += 0.10
            indicators.append("Credential rejection recorded on primary reader")

        if meta["tailgating"]:
            boost += 0.25
            indicators.append("Tailgating anomaly: Multiple individuals entered on single badge clearance")

        if meta["forced_entry"]:
            boost += 0.40
            indicators.append("Forced entry / Door contact held open past critical 60s threshold")

        vibration = payload.get("rack_vibration_g", 0.02)
        if vibration > 0.35:
            boost += 0.30
            indicators.append(f"High server rack mechanical vibration ({vibration}g): Physical prying or impact")

        thermal = payload.get("thermal_delta_c", 0.8)
        if thermal > 4.0:
            boost += 0.20
            indicators.append(f"Thermal anomaly in server pod: Temperature surge +{thermal}°C above baseline")

        anomaly_score = min(1.0, max(0.02, round(base_anomaly + boost, 3)))

        # Determine Threat Level
        if anomaly_score >= 0.75 or meta["forced_entry"]:
            threat_level = "Critical"
            alert_triggered = True
            soc_escalation_advised = True
        elif anomaly_score >= 0.50:
            threat_level = "High"
            alert_triggered = True
            soc_escalation_advised = True
        elif anomaly_score >= 0.30:
            threat_level = "Medium"
            alert_triggered = True
            soc_escalation_advised = False
        elif anomaly_score >= 0.15:
            threat_level = "Low"
            alert_triggered = False
            soc_escalation_advised = False
        else:
            threat_level = "Normal"
            alert_triggered = False
            soc_escalation_advised = False
            indicators.append("All sensor readings conform to standard authorized baseline")

        # Recommended Playbook
        playbook: List[str] = []
        if threat_level == "Critical":
            playbook.extend([
                f"1. Trigger local acoustic alarm and lock inner server pods in {zone_id}",
                "2. Dispatch emergency on-site security response team immediately",
                "3. Auto-archive high-framerate CCTV feeds to incident vault",
                "4. Notify Security Operations Center (SOC) Incident Commander",
            ])
        elif threat_level == "High":
            playbook.extend([
                f"1. Aim PTZ cameras toward {zone_id} access corridors",
                "2. Request security patrol verification of badge identity",
                "3. Flag badge holder for two-factor verification upon exit",
            ])
        elif threat_level == "Medium":
            playbook.extend([
                "1. Log event in 24-hour security audit ledger",
                "2. Verify technician work order schedule in maintenance portal",
            ])
        else:
            playbook.append("No defensive action required. Routine continuous monitoring active.")

        return {
            "threat_level": threat_level,
            "anomaly_score": anomaly_score,
            "detected_indicators": indicators,
            "alert_triggered": alert_triggered,
            "soc_escalation_advised": soc_escalation_advised,
            "zone_id": zone_id,
            "sensor_type": meta["sensor_type"],
            "recommended_playbook": playbook,
            "model_version": self.version,
        }


# Singleton instance
threat_detection_module = PhysicalThreatDetectionModule()
