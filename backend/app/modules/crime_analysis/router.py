"""API Router for Module 4: Crime Scene Evidence Analysis."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
from .schemas import CrimeEvidenceInput, CrimeAnalysisResult
from .service import crime_service

router = APIRouter(prefix="/crime-analysis", tags=["Module 4: Crime Analysis"])


@router.get("/status", response_model=ApiResponse)
async def get_crime_module_status():
    return ApiResponse(
        success=True,
        data=crime_service.get_status().model_dump(),
        message="Crime analysis module status retrieved",
    )


@router.post("/analyze", response_model=ApiResponse)
async def analyze_crime_incident(payload: CrimeEvidenceInput):
    result = crime_service.analyze_incident(
        incident_id=payload.incident_id,
        narrative=payload.incident_narrative,
        location=payload.location,
        evidence_items=payload.evidence_items,
    )
    return ApiResponse(
        success=True,
        data=result,
        message="Incident risk analysis and evidence correlation completed",
    )
