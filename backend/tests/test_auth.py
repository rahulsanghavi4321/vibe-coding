import uuid

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"

def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@gmail.com", "password": "Password@123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "customer"

def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@gmail.com", "password": "WrongPassword999"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_customer_registration(client):
    rand_email = f"user_{uuid.uuid4().hex[:6]}@example.com"
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test User",
            "email": rand_email,
            "phone": f"+91 {uuid.uuid4().int % 9000000000 + 1000000000}",
            "password": "Password@123",
            "role": "customer"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == rand_email
    assert data["user"]["role"] == "customer"

