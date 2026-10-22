"""Common standard API response schemas and envelopes."""

from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str = Field(..., description="Machine-readable error identifier")
    message: str = Field(..., description="Human-readable explanation of the error")
    details: Optional[Any] = Field(None, description="Optional extra diagnostic details")


class ApiResponse(BaseModel, Generic[T]):
    """Standardized API response envelope for all endpoints."""

    success: bool = Field(True, description="Indicates request success status")
    data: Optional[T] = Field(None, description="Payload payload returned on success")
    message: Optional[str] = Field("Request completed successfully", description="Status message")
    error: Optional[ErrorDetail] = Field(None, description="Error detail if request failed")


class HealthStatus(BaseModel):
    status: str = "healthy"
    service: str = "Public Safety Intelligence API"
    version: str = "1.0.0"
    environment: str = "development"


class ModuleInfo(BaseModel):
    id: str
    name: str
    description: str
    branch: str
    api_status: str
    ml_status: str
    version: str = "0.1.0"
