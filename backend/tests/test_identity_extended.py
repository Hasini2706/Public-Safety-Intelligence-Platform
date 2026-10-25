"""Extended unit test coverage for Module 2 AI Identity Verification and Face Matching."""

import base64
import io
import pytest
import numpy as np
from PIL import Image
from ml.identity.matcher import identity_verification_module


def _create_synthetic_face_image_b64(seed: int = 42) -> str:
    """Generate a realistic synthetic face image with gradients and contrast."""
    rng = np.random.RandomState(seed)
    # 128x128 image with skin base and facial variation
    base = np.full((128, 128, 3), [195, 145, 120], dtype=np.uint8)
    # Add facial oval and simulated eye/mouth regions for contrast
    for y in range(128):
        for x in range(128):
            dist = np.sqrt((x - 64)**2 + (y - 64)**2)
            if dist < 45:
                base[y, x] = [210, 160, 135]
    # Eyes
    base[45:55, 40:52] = [40, 30, 25]
    base[45:55, 76:88] = [40, 30, 25]
    # Mouth
    base[85:95, 48:80] = [140, 60, 60]

    im = Image.fromarray(base)
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"


def test_identity_known_profile_match():
    """Verify standard positive identity match against verified enrolled subject."""
    res = identity_verification_module.predict({
        "reference_id": "REF-ID-98214",
        "test_scenario": "match",
    })
    assert res["match_status"] == "Verified Match"
    assert res["similarity_score"] >= 0.78
    assert res["confidence_level"] == "High"
    assert res["human_review_required"] is False
    assert res["subject_profile"]["name"] == "Sarah Chen"
    assert len(res["features_breakdown"]) == 4


def test_identity_known_profile_mismatch():
    """Verify mismatched facial comparison triggers rejection/flag."""
    res = identity_verification_module.predict({
        "reference_id": "REF-ID-98214",
        "test_scenario": "mismatch",
    })
    assert res["match_status"] == "Not Verified"
    assert res["similarity_score"] < 0.78
    assert res["confidence_level"] == "Low"
    assert res["human_review_required"] is True


def test_identity_custom_image_comparison():
    """Verify end-to-end multi-scale biometric comparison on identical synthetic images."""
    ref_b64 = _create_synthetic_face_image_b64(42)
    live_b64 = _create_synthetic_face_image_b64(42)

    res = identity_verification_module.predict({
        "reference_image_b64": ref_b64,
        "verification_image_b64": live_b64,
    })
    assert "similarity_score" in res
    assert res["similarity_score"] > 0.80
    assert res["match_status"] == "Verified Match"
    assert "features_breakdown" in res
    assert len(res["features_breakdown"]) == 4


def test_identity_missing_photo_validation():
    """Verify that providing only one photo raises an explicit ValueError."""
    ref_b64 = _create_synthetic_face_image_b64(42)
    with pytest.raises(ValueError) as excinfo:
        identity_verification_module.predict({
            "reference_image_b64": ref_b64,
            "verification_image_b64": "",
        })
    assert "Missing" in str(excinfo.value)
