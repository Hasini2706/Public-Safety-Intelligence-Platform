"""Service layer for Module 3: Threat Detection.

Owned by Member 3 (Branch: feature/threat-detection).
"""

from typing import Dict, Any, Optional
from app.schemas.common import ModuleInfo
from ml.threat_detection.detector import threat_detection_module


class ThreatDetectionService:
    def __init__(self):
        self.module_id = "threat-detection"
        self.module_name = "Physical Security Threat Detection for Critical IT Infrastructure"
        self.branch = "feature/threat-detection"
        self.ml_model_status = "ready"
        self.model_version = "1.0.0-calibrated"

    def get_status(self) -> ModuleInfo:
        return ModuleInfo(
            id=self.module_id,
            name=self.module_name,
            description="Multi-sensor & vision-based physical intrusion anomaly monitoring.",
            branch=self.branch,
            api_status="active",
            ml_status=self.ml_model_status,
            version=self.model_version,
        )

    def analyze_event(self, zone_id: str, sensor_type: str, event_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute physical threat anomaly scoring pipeline."""
        payload = {
            "zone_id": zone_id,
            "sensor_type": sensor_type,
            "event_payload": event_payload or {},
        }
        return threat_detection_module.predict(payload)


threat_service = ThreatDetectionService()
