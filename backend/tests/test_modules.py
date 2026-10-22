"""Tests for the intelligence modules registry and module routes."""


def test_list_modules_endpoint(client):
    response = client.get("/api/v1/modules")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert data["total_modules"] == 5
    module_ids = [m["id"] for m in data["modules"]]
    assert "complaints" in module_ids
    assert "identity" in module_ids
    assert "threat-detection" in module_ids
    assert "crime-analysis" in module_ids
    assert "governance" in module_ids

    # Verify that models are accurately reported as not configured, not faked
    for m in data["modules"]:
        assert m["ml_status"] == "not_configured"


def test_unconfigured_module_call_returns_proper_contract(client):
    """Calling an unconfigured module endpoint should cleanly return error contract, not crash."""
    response = client.post(
        "/api/v1/complaints/classify",
        json={"title": "Test Title", "description": "Broken pipe outside"},
    )
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is False
    assert res["error"]["code"] == "MODEL_NOT_CONFIGURED"
