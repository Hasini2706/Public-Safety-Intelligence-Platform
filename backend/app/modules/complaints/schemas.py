"""Schemas for Module 1: Smart Complaint Category Classification."""

from typing import List, Optional
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
    department: str = Field("Municipal Grievance Cell", description="Target routing department")
    sla_hours: int = Field(24, description="Target response SLA in hours")
    requires_human_review: bool = Field(True, description="Human in the loop safety flag")
    key_risk_factors: List[str] = Field(default_factory=list, description="Extracted risk indicators")
    model_version: str = Field("1.0.0", description="Version of the model used")
