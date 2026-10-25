"""API Router for Module 3: Physical Security Threat Detection."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse, ErrorDetail
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
    try:
        result = threat_service.analyze_event(
            zone_id=payload.zone_id,
            sensor_type=payload.sensor_type,
            event_payload=payload.event_payload,
            text=payload.text,
            image_url=payload.image_url,
            image_b64=payload.image_b64,
            input_type=payload.input_type,
        )
        return ApiResponse(
            success=True,
            data=result,
            message="Threat event analysis completed",
        )
    except ValueError as err:
        return ApiResponse(
            success=False,
            error=ErrorDetail(code="INVALID_INPUT", message=str(err)),
            message=str(err),
        )
    except Exception as err:
        return ApiResponse(
            success=False,
            error=ErrorDetail(code="DETECTION_FAILED", message=f"Threat detection could not be completed: {str(err)}"),
            message=f"Threat detection could not be completed: {str(err)}",
        )
