"""API Router for Module 3: Physical Security Threat Detection."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
from .schemas import ThreatDetectionInput
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
async def analyze_threat(payload: ThreatDetectionInput):
    result = threat_service.analyze_event(payload.zone_id, payload.sensor_type)
    if not result.get("configured", True):
        return ApiResponse(
            success=False,
            error={
                "code": "MODEL_NOT_CONFIGURED",
                "message": result["message"],
                "details": result,
            },
        )
    return ApiResponse(
        success=True,
        data=result,
        message="Threat analysis completed",
    )
