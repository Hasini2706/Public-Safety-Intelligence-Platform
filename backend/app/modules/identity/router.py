"""API Router for Module 2: AI Smart Identity Verification."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
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
    result = identity_service.verify_identity(payload.reference_id)
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
        message="Identity verification completed",
    )
