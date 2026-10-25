"""Schemas for Module 3: Physical Security Threat Detection for Critical IT Infrastructure."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ThreatDetectionInput(BaseModel):
    zone_id: Optional[str] = Field("DATA-CENTER-ZONE-B", description="Monitored facility zone identifier")
    sensor_type: Optional[str] = Field("cctv_motion_badge_reader", description="Primary sensor stream type")
    text: Optional[str] = Field(None, description="Incident description or threat narrative text")
    image_url: Optional[str] = Field(None, description="Image URL for threat inspection")
    image_b64: Optional[str] = Field(None, description="Base64 encoded image file")
    input_type: Optional[str] = Field("text", description="Input type: text, image_url, or file_upload")
    event_payload: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ThreatDetectionResult(BaseModel):
    threat_level: str = Field(..., description="Normal, Low, Medium, High, Critical")
    anomaly_score: float = Field(..., ge=0.0, le=1.0)
    detected_indicators: List[str] = Field(default_factory=list)
    alert_triggered: bool = False
    soc_escalation_advised: bool = False
    zone_id: str = Field("DATA-CENTER-ZONE-B")
    sensor_type: str = Field("cctv_motion_badge_reader")
    recommended_playbook: List[str] = Field(default_factory=list)
    vision_analysis: Optional[Dict[str, Any]] = Field(default=None, description="Detailed visual scene breakdown for image inputs")
    model_version: str = Field("1.0.0")
