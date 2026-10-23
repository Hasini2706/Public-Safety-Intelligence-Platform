"""API Router for Module 5: Governance & Compliance Monitoring."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
from .schemas import MineComplianceInput, ComplianceReportResult
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
async def evaluate_mine_compliance(payload: MineComplianceInput):
    result = governance_service.evaluate_compliance(
        mine_site_id=payload.mine_site_id,
        methane_level_ppm=payload.methane_level_ppm,
        dust_density_mg_m3=payload.dust_density_mg_m3,
        ventilation_airflow_m3_s=payload.ventilation_airflow_m3_s,
        seismic_vibration_g=payload.seismic_vibration_g,
        last_inspection_days_ago=payload.last_inspection_days_ago,
    )
    return ApiResponse(
        success=True,
        data=result,
        message="Mine compliance evaluation completed",
    )
