# HomeServe Technologies – REST API Specification & Documentation
## Enterprise Multi-Vendor Home Services SaaS Platform

**Base Production URL:** `https://homeserve-backend-ylqa.onrender.com/api/v1`  
**Interactive Swagger UI:** [https://homeserve-backend-ylqa.onrender.com/docs](https://homeserve-backend-ylqa.onrender.com/docs)  
**OpenAPI Specification JSON:** `https://homeserve-backend-ylqa.onrender.com/openapi.json`  
**Authentication Standard:** HTTP Bearer JSON Web Token (`Authorization: Bearer <JWT_TOKEN>`)  
**Developer:** Rahul Sanghavi

---

## 1. Authentication & Security Architecture

### Request Headers
Every protected endpoint requires the standard `Authorization` header containing the JWT token received from `/auth/login`:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

### Standard Response Structure
Successful responses return standard JSON structures with appropriate HTTP status codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or business constraint violation.
- `401 Unauthorized`: Token missing, invalid, or expired.
- `403 Forbidden`: Authenticated user lacks required role permissions.
- `404 Not Found`: Target resource does not exist.
- `409 Conflict`: Scheduling collision or duplicate entry.
- `422 Unprocessable Entity`: Pydantic payload validation error.

---

## 2. API Endpoint Catalog by Module

### 2.1 Authentication Router (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/auth/register` | Public | Register a new user (`customer`, `service_provider`, or `technician`). |
| `POST` | `/auth/login` | Public | Authenticate credentials and receive Bearer JWT token + user profile. |
| `GET` | `/auth/me` | Authenticated | Retrieve profile details of currently authenticated user. |

#### Example: Login Request
```bash
curl -X POST "https://homeserve-backend-ylqa.onrender.com/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@gmail.com",
    "password": "Password@123"
  }'
```

---

### 2.2 Categories & Services Catalog (`/api/v1/categories`, `/api/v1/services`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/categories/` | Public | List all 8 active root service categories. |
| `GET` | `/categories/{id}/subcategories` | Public | List dynamic subcategories belonging to a category. |
| `POST` | `/categories/` | Super Admin | Create new dynamic category with icon and metadata. |
| `GET` | `/services/` | Public | Search and filter catalog services by category, price, or keywords. |
| `GET` | `/services/{id}` | Public | Detailed service specifications, inclusions, exclusions, and base rates. |

---

### 2.3 Bookings Engine (`/api/v1/bookings`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/bookings/` | Customer | Create service booking with concurrency lock & time slot verification. |
| `GET` | `/bookings/customer/me` | Customer | List bookings history, active dispatches, and statuses for current customer. |
| `GET` | `/bookings/provider/me` | Provider | List incoming job requests and bookings assigned to the provider company. |
| `GET` | `/bookings/{id}` | Authenticated | Get full details of a specific booking order and audit history. |
| `PATCH` | `/bookings/{id}/status` | Role-Guarded | Transition status (`Confirmed`, `In Progress`, `Completed`, `Cancelled`). |
| `POST` | `/bookings/{id}/assign-technician`| Provider | Assign available certified technician with collision detection. |

---

### 2.4 Payment & Invoice Gateway (`/api/v1/payments`, `/api/v1/invoices`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/payments/create-order` | Customer | Generate Razorpay / Simulation payment order for a booking. |
| `POST` | `/payments/verify` | Customer | Verify HMAC-SHA256 signature and credit transaction. |
| `GET` | `/payments/booking/{booking_id}`| Authenticated | Get payment transaction details and breakdown. |
| `GET` | `/invoices/booking/{booking_id}`| Authenticated | Retrieve generated GST tax invoice with line-item breakdown. |

---

### 2.5 Field Operations & Technicians (`/api/v1/technicians`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/technicians/me/tasks` | Technician | View assigned active tasks, scheduled time slots, and customer location. |
| `PATCH` | `/technicians/me/tasks/{id}/arrive` | Technician | Mark GPS arrival at customer premises. |
| `PATCH` | `/technicians/me/tasks/{id}/start` | Technician | Transition booking status to `In Progress`. |
| `POST` | `/technicians/me/tasks/{id}/complete`| Technician | Complete job, record diagnostic notes, and upload proof-of-work. |

---

### 2.6 Service Provider Management (`/api/v1/providers`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/providers/me/overview` | Provider | Real-time operations summary (active jobs, total revenue, technician fleet). |
| `GET` | `/providers/me/technicians`| Provider | List field technicians employed by the provider company. |
| `POST` | `/providers/me/technicians`| Provider | Add a new certified technician to the provider's fleet. |
| `GET` | `/providers/me/earnings` | Provider | Financial earnings ledger, platform fee deductions (15%), and net payouts. |

---

### 2.7 Reviews & Dispute Management (`/api/v1/reviews`, `/api/v1/complaints`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/reviews/` | Customer | Submit verified 1-5 star review and feedback after job completion. |
| `GET` | `/reviews/service/{service_id}`| Public | List verified customer reviews for a service. |
| `POST` | `/complaints/` | Customer | Open support ticket / dispute regarding a booking order. |
| `GET` | `/complaints/my` | Customer | List status of opened customer dispute tickets. |
| `PATCH` | `/complaints/{id}/resolve`| Super Admin | Adjudicate dispute, issue refunds, or apply provider penalties. |

---

### 2.8 Super Admin Oversight & Analytics (`/api/v1/admin`, `/api/v1/analytics`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/admin/metrics` | Super Admin | Real-time platform KPI metrics (GMV, commissions, active providers, volume). |
| `GET` | `/admin/providers/pending` | Super Admin | Review pending provider registrations and KYC verification documents. |
| `PATCH` | `/admin/providers/{id}/kyc` | Super Admin | Approve or reject provider operating license and KYC status. |
| `GET` | `/analytics/financials` | Super Admin | Platform financial audit ledger, monthly revenue aggregates, and payouts. |

---

## 3. Postman Collection & Integration Tests

The complete Postman test suite is version-controlled in the repository:
- **Collection File:** `postman/HomeServe_Technologies_API.postman_collection.json`
- **Environment File:** `postman/HomeServe_Technologies.postman_environment.json`
- **Pre-Configured Environments:** `Localhost` (`http://localhost:8000/api/v1`) and `Production` (`https://homeserve-backend-ylqa.onrender.com/api/v1`).
