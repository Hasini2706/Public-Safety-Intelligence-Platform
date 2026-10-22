"""Schemas for Module 1: Smart Complaint Category Classification."""

from typing import Optional
from pydantic import BaseModel, Field


class ComplaintInput(BaseModel):
    title: str = Field(..., examples=["Streetlight outage and exposed electrical wire"])
    description: str = Field(
        ...,
        examples=["The streetlight at the intersection of 5th and Main has been out for 3 days and there are exposed wires."],
    )
    department_hint: Optional[str] = Field(None, examples=["Public Works"])


class ComplaintClassificationResult(BaseModel):
    category: str = Field(..., description="Predicted classification category")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence score")
    priority: str = Field(..., description="Computed priority rating (Low, Medium, High, Urgent)")
    model_version: str = Field("0.1.0-placeholder", description="Version of the model used")
    requires_human_review: bool = Field(True, description="Human in the loop safety flag")
