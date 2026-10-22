"""Abstract Base Class for ML Modules.

Ensures all 5 modules implement a predictable, uniform interface
without forcing concrete dependencies before developers start their work.
"""

from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Dict, Optional


class ModelStatus(str, Enum):
    NOT_CONFIGURED = "not_configured"
    FOUNDATION_READY = "foundation_ready"
    INITIALIZING = "initializing"
    READY = "ready"
    ERROR = "error"


class BaseMLModule(ABC):
    """Uniform contract for all ML modules."""

    def __init__(self, module_name: str, version: str = "0.1.0"):
        self.module_name = module_name
        self.version = version
        self._status: ModelStatus = ModelStatus.NOT_CONFIGURED
        self._model_artifact_path: Optional[str] = None

    @property
    def status(self) -> ModelStatus:
        return self._status

    @abstractmethod
    def load_model(self, artifact_path: Optional[str] = None) -> bool:
        """Load model weights or pipeline. Return True if loaded, False otherwise."""
        pass

    @abstractmethod
    def preprocess(self, raw_input: Any) -> Any:
        """Transform raw incoming payload into model-ready features."""
        pass

    @abstractmethod
    def predict(self, features: Any) -> Dict[str, Any]:
        """Generate prediction, confidence scores, and decision-support metadata."""
        pass

    def get_metadata(self) -> Dict[str, Any]:
        """Return operational metadata about this ML module."""
        return {
            "module_name": self.module_name,
            "version": self.version,
            "status": self._status.value,
            "model_path": self._model_artifact_path,
        }
