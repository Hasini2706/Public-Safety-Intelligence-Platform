"""Schemas for Module 2: AI Smart Identity Verification + Face Matching."""

from typing import Optional
from pydantic import BaseModel, Field


class IdentityVerificationInput(BaseModel):
    reference_id: str = Field(..., examples=["REF-ID-98214"])
    reference_image_b64: Optional[str] = Field(None, description="Base64 encoded reference face image")
    verification_image_b64: Optional[str] = Field(None, description="Base64 encoded probe face image")


class IdentityVerificationResult(BaseModel):
    match_status: str = Field(..., description="Match, Non-Match, Inconclusive")
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    confidence_level: str = Field(..., description="High, Medium, Low")
    human_review_required: bool = Field(True, description="Human safety review mandate")
    disclaimer: str = Field(
        "Verification output is probabilistic assistance for human officers and must not be used as sole legal identifier.",
        description="Responsible AI disclaimer",
    )
