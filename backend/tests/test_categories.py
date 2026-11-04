def test_get_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 8

    slugs = [c["slug"] for c in categories]
    assert "electrical-services" in slugs
    assert "plumbing-services" in slugs
    assert "ac-repair-maintenance" in slugs
    assert "home-cleaning" in slugs

def test_get_services_catalog(client):
    response = client.get("/api/v1/services")
    assert response.status_code == 200
    services = response.json()
    assert len(services) > 0

    # Filter by category
    r_filtered = client.get("/api/v1/services?cat_slug=electrical-services")
    assert r_filtered.status_code == 200
    filtered_services = r_filtered.json()
    assert len(filtered_services) > 0
    for s in filtered_services:
        assert s["category_slug"] == "electrical-services"
