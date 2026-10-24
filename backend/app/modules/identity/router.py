"""API Router for Module 2: AI Smart Identity Verification."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse, ErrorDetail
from .schemas import IdentityVerificationInput
from .service import identity_service

router = APIRouter(prefix="/identity", tags=["Module 2: Identity"])


@router.get("/status", response_model=ApiResponse)
async def get_identity_module_status():
    return ApiResponse(
        success=True,
        data=identity_service.get_status().model_dump(),
        message="Identity module status retrieved",
    )


@router.post("/verify", response_model=ApiResponse)
async def verify_identity(payload: IdentityVerificationInput):
    try:
        result = identity_service.verify_identity(
            reference_id=payload.reference_id,
            reference_image_b64=payload.reference_image_b64,
            verification_image_b64=payload.verification_image_b64,
            test_scenario=payload.test_scenario,
        )
        return ApiResponse(
            success=True,
            data=result,
            message="Identity verification completed",
        )
    except ValueError as err:
        return ApiResponse(
            success=False,
            error=ErrorDetail(code="INVALID_BIOMETRIC_IMAGE", message=str(err)),
            message=str(err),
        )
