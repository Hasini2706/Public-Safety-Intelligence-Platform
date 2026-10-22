"""Aggregated modules status endpoint."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
from app.modules.complaints.service import complaint_service
from app.modules.identity.service import identity_service
from app.modules.threat_detection.service import threat_service
from app.modules.crime_analysis.service import crime_service
from app.modules.governance.service import governance_service

router = APIRouter()


@router.get("/modules", response_model=ApiResponse, summary="List all 5 intelligence modules and status")
async def list_modules():
    """Returns registration, API status, and ML model status for all 5 intelligence modules."""
    modules = [
        complaint_service.get_status().model_dump(),
        identity_service.get_status().model_dump(),
        threat_service.get_status().model_dump(),
        crime_service.get_status().model_dump(),
        governance_service.get_status().model_dump(),
    ]
    return ApiResponse(
        success=True,
        data={
            "total_modules": len(modules),
            "modules": modules,
        },
        message="Module registry status retrieved",
    )
