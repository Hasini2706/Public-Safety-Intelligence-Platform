"""Schemas for Module 4: Crime Scene Evidence Analysis + Incident Risk Assessment."""

from typing import List, Optional
from pydantic import BaseModel, Field


class CrimeEvidenceInput(BaseModel):
    incident_id: str = Field(..., examples=["INC-2026-0881"])
    location: str = Field(..., examples=["Sector 4 Industrial Area"])
    evidence_items: List[str] = Field(default_factory=list)
    incident_narrative: str = Field(..., examples=["Commercial break-in reported at midnight."])


class CrimeAnalysisResult(BaseModel):
    risk_level: str = Field(..., description="Elevated, Moderate, Standard")
    pattern_indicators: List[str] = Field(default_factory=list)
    corroboration_score: float = Field(..., ge=0.0, le=1.0)
    investigator_guidance: str = Field(..., description="Decision-support summary for detective")
    ethical_disclaimer: str = Field(
        "Automated decision-support model. Does not determine guilt or liability. Subject to judicial standards.",
        description="Responsible ML notice",
    )
