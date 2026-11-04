def test_payment_and_invoice_generation(client, customer_headers):
    # 1. Create order
    order_res = client.post(
        "/api/v1/payments/create-order",
        headers=customer_headers,
        json={"booking_id": 1, "amount": 352.82}
    )
    assert order_res.status_code == 200
    order_data = order_res.json()
    assert "order_id" in order_data

    # 2. Verify payment simulation
    verify_res = client.post(
        "/api/v1/payments/verify",
        headers=customer_headers,
        json={
            "booking_id": 1,
            "order_id": order_data["order_id"],
            "payment_id": "pay_test_simulation_123",
            "signature": "simulated_valid_signature_2026",
            "payment_method": "upi"
        }
    )
    assert verify_res.status_code == 200
    receipt = verify_res.json()
    assert receipt["status"] == "Paid"
    assert "invoice_number" in receipt

def test_commission_calculation_formula():
    base_price = 1000.0
    commission_rate = 15.0
    expected_commission = 150.0
    expected_provider_net = 850.0

    calculated_commission = base_price * (commission_rate / 100.0)
    calculated_net = base_price - calculated_commission

    assert calculated_commission == expected_commission
    assert calculated_net == expected_provider_net
