import pytest
from starlette.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="session")
def admin_headers(client):
    r = client.post("/api/v1/auth/login", json={"email": "admin@homeservetech.com", "password": "Password@123"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def customer_headers(client):
    r = client.post("/api/v1/auth/login", json={"email": "customer@gmail.com", "password": "Password@123"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def provider_headers(client):
    r = client.post("/api/v1/auth/login", json={"email": "provider@apexservices.com", "password": "Password@123"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def technician_headers(client):
    r = client.post("/api/v1/auth/login", json={"email": "technician@apexservices.com", "password": "Password@123"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

