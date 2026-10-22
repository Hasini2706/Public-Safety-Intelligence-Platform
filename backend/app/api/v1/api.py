"""API v1 router aggregator."""

from fastapi import APIRouter
from app.api.v1.endpoints import health, modules
from app.modules.complaints import router as complaints_router
from app.modules.identity import router as identity_router
from app.modules.threat_detection import router as threat_router
from app.modules.crime_analysis import router as crime_router
from app.modules.governance import router as governance_router

api_v1_router = APIRouter()

# Core system endpoints
api_v1_router.include_router(health.router, tags=["System Health"])
api_v1_router.include_router(modules.router, tags=["Modules Registry"])

# Module-specific routers
api_v1_router.include_router(complaints_router)
api_v1_router.include_router(identity_router)
api_v1_router.include_router(threat_router)
api_v1_router.include_router(crime_router)
api_v1_router.include_router(governance_router)
