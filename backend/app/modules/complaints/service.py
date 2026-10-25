"""Service integration layer for Module 1: Complaint Classification.

Connects the FastAPI router to the ML complaints classification module.
"""

from typing import Dict, Any, Optional
from app.schemas.common import ModuleInfo
from ml.complaints.classifier import complaint_classifier_module


class ComplaintService:
    def __init__(self):
        self.module_id = "complaints"
        self.module_name = "Smart Complaint Category Classification"
        self.branch = "feature/complaints"
        self.ml_model_status = "ready"
        self.model_version = "1.0.0-calibrated"

    def get_status(self) -> ModuleInfo:
        return ModuleInfo(
            id=self.module_id,
            name=self.module_name,
            description="NLP-driven classification and priority triage of citizen grievances.",
            branch=self.branch,
            api_status="active",
            ml_status=self.ml_model_status,
            version=self.model_version,
        )

    def classify_complaint(self, title: str, description: str, department_hint: Optional[str] = None) -> Dict[str, Any]:
        """Execute complaint classification using the trained NLP pipeline."""
        payload = {
            "title": title,
            "description": description,
            "department_hint": department_hint,
        }
        return complaint_classifier_module.predict(payload)


complaint_service = ComplaintService()
