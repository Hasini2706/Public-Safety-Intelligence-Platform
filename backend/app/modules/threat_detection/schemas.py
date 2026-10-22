"""Schemas for Module 3: Physical Security Threat Detection for Critical IT Infrastructure."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ThreatDetectionInput(BaseModel):
    zone_id: str = Field(..., examples=["SERVER-ROOM-ALPHA"])
    sensor_type: str = Field(..., examples=["cctv_motion_badge_reader"])
    event_payload: Optional[dict] = Field(default_factory=dict)


class ThreatDetectionResult(BaseModel):
    threat_level: str = Field(..., description="Normal, Low, Medium, Critical")
    anomaly_score: float = Field(..., ge=0.0, le=1.0)
    detected_indicators: List[str] = Field(default_factory=list)
    alert_triggered: bool = False
    soc_escalation_advised: bool = False
