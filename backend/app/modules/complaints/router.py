"""API Router for Module 1: Smart Complaint Category Classification."""

from fastapi import APIRouter
from app.schemas.common import ApiResponse
from .schemas import ComplaintInput, ComplaintClassificationResult
from .service import complaint_service

router = APIRouter(prefix="/complaints", tags=["Module 1: Complaints"])


@router.get("/status", response_model=ApiResponse)
async def get_complaint_module_status():
    """Retrieve operational status of Module 1."""
    return ApiResponse(
        success=True,
        data=complaint_service.get_status().model_dump(),
        message="Complaint classification module status retrieved",
    )


@router.post("/classify", response_model=ApiResponse)
async def classify_complaint(payload: ComplaintInput):
    """Classify a citizen complaint and calculate priority triage SLA."""
    result = complaint_service.classify_complaint(
        title=payload.title,
        description=payload.description,
        department_hint=payload.department_hint,
    )
    return ApiResponse(
        success=True,
        data=result,
        message="Complaint classified successfully",
    )
