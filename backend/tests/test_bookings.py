import datetime
import uuid

def test_booking_workflow_lifecycle(client, customer_headers, provider_headers, technician_headers):
    # 1. Create booking with unique future date to avoid slot collisions
    import random
    random_days = random.randint(15, 60)
    booking_date = str(datetime.date.today() + datetime.timedelta(days=random_days))
    time_slot = f"{random.randint(1, 9)}:00 PM - {random.randint(1, 9) + 1}:00 PM"

    res = client.post(
        "/api/v1/bookings",
        headers=customer_headers,
        json={
            "provider_id": 1,
            "service_id": 1,
            "booking_date": booking_date,
            "time_slot": time_slot,
            "problem_description": "Ceiling fan regulator sparking.",
            "base_price": 299.0,
            "tax_amount": 53.82,
            "discount_amount": 0.0,
            "total_amount": 352.82
        }
    )
    assert res.status_code == 201, res.text
    booking_id = res.json()["id"]
    booking_ref = res.json()["booking_ref"]
    assert res.json()["status"] == "Pending"

    # 2. Provider accepts booking
    r_accept = client.patch(
        f"/api/v1/bookings/{booking_id}/status",
        headers=provider_headers,
        json={"status": "Confirmed"}
    )
    assert r_accept.status_code == 200
    assert r_accept.json()["status"] == "Confirmed"

    # 3. Provider assigns technician
    r_assign = client.post(
        f"/api/v1/bookings/{booking_id}/assign",
        headers=provider_headers,
        json={"technician_id": 1}
    )
    assert r_assign.status_code == 200
    assert r_assign.json()["status"] == "Provider Assigned"

    # 4. Technician marks In Progress
    r_progress = client.patch(
        f"/api/v1/technicians/jobs/{booking_id}/status",
        headers=technician_headers,
        json={"status": "In Progress"}
    )
    assert r_progress.status_code == 200
    assert r_progress.json()["status"] == "In Progress"

    # 5. Technician marks Completed with remarks
    r_complete = client.patch(
        f"/api/v1/technicians/jobs/{booking_id}/status",
        headers=technician_headers,
        json={
            "status": "Completed",
            "completion_remarks": "Regulator replaced with brand new 5-step electronic regulator."
        }
    )
    assert r_complete.status_code == 200
    assert r_complete.json()["status"] == "Completed"

def test_prevent_past_date_booking(client, customer_headers):
    past_date = str(datetime.date.today() - datetime.timedelta(days=1))
    res = client.post(
        "/api/v1/bookings",
        headers=customer_headers,
        json={
            "provider_id": 1,
            "service_id": 1,
            "booking_date": past_date,
            "time_slot": "10:00 AM - 11:00 AM",
            "base_price": 299.0,
            "tax_amount": 53.82,
            "discount_amount": 0.0,
            "total_amount": 352.82
        }
    )
    assert res.status_code == 400
    assert "cannot be in the past" in res.json()["detail"]

