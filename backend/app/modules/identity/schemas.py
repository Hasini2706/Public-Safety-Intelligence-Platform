"""Schemas for Module 2: AI Smart Identity Verification + Face Matching."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class IdentityVerificationInput(BaseModel):
    reference_id: str = Field(..., examples=["REF-ID-98214"])
    reference_image_b64: Optional[str] = Field(None, description="Base64 encoded reference face image")
    verification_image_b64: Optional[str] = Field(None, description="Base64 encoded probe face image")
    test_scenario: Optional[str] = Field("match", description="Preset test scenario (match, borderline, mismatch)")
    match_threshold: Optional[float] = Field(0.78, description="Configurable verification threshold")


class FeatureBreakdownItem(BaseModel):
    feature: str
    similarity_pct: float
    conformance: str


class IdentityVerificationResult(BaseModel):
    match_status: str = Field(..., description="Verified Match, Borderline, Mismatch")
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    confidence_level: str = Field(..., description="High, Medium, Low")
    human_review_required: bool = Field(True, description="Human safety review mandate")
    verdict_summary: str = Field(..., description="Summary analysis")
    match_threshold_used: float = Field(0.78)
    liveness_score: float = Field(..., ge=0.0, le=1.0)
    quality_metrics: Dict[str, float] = Field(default_factory=dict)
    subject_profile: Dict[str, Any] = Field(default_factory=dict)
    features_breakdown: List[FeatureBreakdownItem] = Field(default_factory=list)
    audit_id: str = Field(...)
    disclaimer: str = Field(..., description="Responsible AI disclaimer")
    model_version: str = Field("1.0.0")
