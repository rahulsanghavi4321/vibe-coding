def test_review_submission(client, customer_headers):
    # Booking 1 is Completed, test submitting review
    r = client.post(
        "/api/v1/reviews",
        headers=customer_headers,
        json={
            "booking_id": 1,
            "rating": 5,
            "comment": "Outstanding electrician. Highly punctual and respectful."
        }
    )
    # Either 200 or 400 if already reviewed during seeding
    assert r.status_code in [200, 400]
    if r.status_code == 200:
        assert r.json()["rating"] == 5
    else:
        assert "already been submitted" in r.json()["detail"]

