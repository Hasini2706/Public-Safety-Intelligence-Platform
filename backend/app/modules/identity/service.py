"""Service layer for Module 2: AI Smart Identity Verification.

Owned by Member 2 (Branch: feature/identity).
"""

from typing import Dict, Any, Optional
from app.schemas.common import ModuleInfo
from ml.identity.matcher import identity_verification_module


class IdentityService:
    def __init__(self):
        self.module_id = "identity"
        self.module_name = "AI Smart Identity Verification + Face Matching"
        self.branch = "feature/identity"
        self.ml_model_status = "ready"
        self.model_version = "1.0.0-calibrated"

    def get_status(self) -> ModuleInfo:
        return ModuleInfo(
            id=self.module_id,
            name=self.module_name,
            description="Facial similarity comparison and identity verification decision-support.",
            branch=self.branch,
            api_status="active",
            ml_status=self.ml_model_status,
            version=self.model_version,
        )

    def verify_identity(
        self,
        reference_id: str,
        reference_image_b64: Optional[str] = None,
        verification_image_b64: Optional[str] = None,
        test_scenario: Optional[str] = "match",
    ) -> Dict[str, Any]:
        """Execute facial biometric comparison pipeline."""
        payload = {
            "reference_id": reference_id,
            "reference_image_b64": reference_image_b64,
            "verification_image_b64": verification_image_b64,
            "test_scenario": test_scenario,
        }
        return identity_verification_module.predict(payload)


identity_service = IdentityService()
