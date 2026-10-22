"""API Router for Module 1: Smart Complaint Category Classification."""

from fastapi import APIRouter, HTTPException, status
from app.schemas.common import ApiResponse
from .schemas import ComplaintInput
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
    """Classify a citizen complaint.

    Requires trained model deployed on feature/complaints branch.
    """
    result = complaint_service.classify_complaint(payload.title, payload.description)
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
        message="Complaint classified successfully",
    )
