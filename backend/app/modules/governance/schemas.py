"""Schemas for Module 5: Smart Governance & Compliance Monitoring for Coal Mines."""

from typing import List, Optional
from pydantic import BaseModel, Field


class MineComplianceInput(BaseModel):
    mine_site_id: str = Field(..., examples=["MINE-JH-04"])
    methane_level_ppm: float = Field(..., examples=[0.8])
    dust_density_mg_m3: float = Field(..., examples=[2.1])
    ventilation_airflow_m3_s: float = Field(..., examples=[42.5])
    seismic_vibration_g: float = Field(..., examples=[0.012])
    last_inspection_days_ago: int = Field(..., examples=[14])


class ComplianceReportResult(BaseModel):
    compliance_status: str = Field(..., description="Compliant, Action Required, Critical Violation")
    hazard_index: float = Field(..., ge=0.0, le=1.0)
    flagged_violations: List[str] = Field(default_factory=list)
    recommended_mitigation: List[str] = Field(default_factory=list)
    inspector_signoff_needed: bool = True
