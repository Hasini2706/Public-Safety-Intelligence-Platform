"""API Router for Module 3: Physical Security Threat Detection."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
from .schemas import ThreatDetectionInput, ThreatDetectionResult
from .service import threat_service

router = APIRouter(prefix="/threat-detection", tags=["Module 3: Threat Detection"])


@router.get("/status", response_model=ApiResponse)
async def get_threat_module_status():
    return ApiResponse(
        success=True,
        data=threat_service.get_status().model_dump(),
        message="Threat detection module status retrieved",
    )


@router.post("/analyze", response_model=ApiResponse)
async def analyze_threat_event(payload: ThreatDetectionInput):
    result = threat_service.analyze_event(
        zone_id=payload.zone_id,
        sensor_type=payload.sensor_type,
        event_payload=payload.event_payload,
    )
    return ApiResponse(
        success=True,
        data=result,
        message="Threat event analysis completed",
    )
