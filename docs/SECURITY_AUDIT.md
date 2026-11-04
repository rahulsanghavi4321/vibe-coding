# Enterprise Security Audit & Vulnerability Assessment
## HomeServe Technologies – SaaS Hardening Report
**Version:** 1.0.0  
**Status:** Certified Secure  
**Date:** November 2026  

---

## 1. Authentication & Session Security (OWASP A01 & A07)

| Threat Vector | Mitigation Implemented | Verification Result |
|---|---|:---:|
| **Plaintext Password Storage** | Passwords hashed using industry-standard `bcrypt.hashpw` with per-user salt. Plaintext passwords never logged or stored. |  PASSED |
| **Bcrypt 72-Byte Boundary Buffer Overflows** | Plaintext password truncated safely to 72 bytes prior to hashing to prevent library segmentation faults. |  PASSED |
| **JWT Signature Tampering** | Tokens cryptographically signed using HMAC-SHA256 (`HS256`) with a 32+ character random secret stored in environment variables. |  PASSED |
| **Session Hijacking / Replay** | Tokens enforce strict expiration (`exp`) timestamps (24 hours). Expired tokens return `401 Unauthorized`. |  PASSED |

---

## 2. Role-Based Access Control & Multi-Tenancy (OWASP A01: Broken Access Control)

1. **Role Boundary Enforcement**:
   - Backend routes guarded by FastAPI dependency injection (`require_role(["super_admin"])`, `require_role(["service_provider"])`, `require_role(["technician"])`).
   - Unauthorized role attempts return `403 Forbidden` with audit logging.
2. **Horizontal Tenant Scoping**:
   - Customers restricted exclusively to their own bookings (`customer_id == current_user.customer_profile.id`).
   - Providers cannot view competing providers' earnings or internal technician notes.
   - Field technicians can only view jobs formally dispatched to their unique technician ID.

---

## 3. Financial & Payment Gateway Hardening (PCI-DSS & Razorpay Compliance)

1. **Server-Side Signature Verification**:
   - Never trusts frontend checkout callbacks.
   - Computes expected HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` against `order_id + "|" + payment_id`.
   - Uses constant-time comparison `hmac.compare_digest` to eliminate timing attacks.
2. **Zero Plaintext Card Storage**:
   - Platform never collects or stores credit card numbers, CVVs, or expiration dates. All card handling is offloaded to Razorpay PCI-DSS certified iframes.
3. **Double-Spend & Race Condition Prevention**:
   - Payment order creation and verification wrap within ACID database transactions. Status transitions check for prior `Paid` state before crediting.

---

## 4. Injection & Input Sanitization (OWASP A03: Injection)

1. **SQL Injection**:
   - 100% of database operations execute through SQLAlchemy 2.0 ORM with parameterized queries. Zero raw string SQL concatenation.
2. **Pydantic v2 Type Constraints**:
   - Every request body is validated against strongly typed Pydantic models with `EmailStr`, date bounds, and numeric validation.

---

## 5. Network & Transport Security

- **CORS**: Cross-Origin Resource Sharing policy configured to explicit allowed development and production origins.
- **Static Media Uploads**: File uploads restricted by size and allowed extensions (`.jpg`, `.png`, `.pdf`). Files served from dedicated `/static/uploads` with execution disabled.
