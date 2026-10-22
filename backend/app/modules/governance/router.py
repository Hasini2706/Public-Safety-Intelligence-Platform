"""API Router for Module 5: Governance & Compliance Monitoring."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
from .schemas import MineComplianceInput
from .service import governance_service

router = APIRouter(prefix="/governance", tags=["Module 5: Governance"])


@router.get("/status", response_model=ApiResponse)
async def get_governance_module_status():
    return ApiResponse(
        success=True,
        data=governance_service.get_status().model_dump(),
        message="Governance module status retrieved",
    )


@router.post("/evaluate", response_model=ApiResponse)
async def evaluate_compliance(payload: MineComplianceInput):
    result = governance_service.evaluate_compliance(payload.mine_site_id)
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
        message="Compliance evaluation completed",
    )
