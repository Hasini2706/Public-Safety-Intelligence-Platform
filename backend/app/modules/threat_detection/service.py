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

    def analyze_event(
        self,
        zone_id: Optional[str] = None,
        sensor_type: Optional[str] = None,
        event_payload: Optional[Dict[str, Any]] = None,
        text: Optional[str] = None,
        image_url: Optional[str] = None,
        image_b64: Optional[str] = None,
        input_type: Optional[str] = "text",
    ) -> Dict[str, Any]:
        """Execute physical threat anomaly scoring pipeline."""
        # Validate based on input_type if specified
        if input_type == "text" and not event_payload:
            if not text or not str(text).strip():
                raise ValueError("Please enter an incident description or threat text to analyze.")
        elif input_type == "image_url":
            if not image_url or not str(image_url).strip():
                raise ValueError("Please provide a valid image URL to analyze.")
        elif input_type == "file_upload":
            if not image_b64 or not str(image_b64).strip():
                raise ValueError("Please select or upload an image file to analyze.")

        payload = {
            "zone_id": (zone_id or "DATA-CENTER-ZONE-B").strip(),
            "sensor_type": (sensor_type or "cctv_motion_badge_reader").strip(),
            "event_payload": event_payload or {},
            "text": text.strip() if text else None,
            "image_url": image_url.strip() if image_url else None,
            "image_b64": image_b64.strip() if image_b64 else None,
            "input_type": input_type,
        }
        return threat_detection_module.predict(payload)


threat_service = ThreatDetectionService()
