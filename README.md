# HomeServe Technologies
## Enterprise Multi-Vendor Home Services Booking SaaS Platform

HomeServe Technologies is a commercial-grade, multi-vendor SaaS platform connecting residential and enterprise customers with certified service providers and technicians across 8 key home services categories (Electrical, Plumbing, AC Repair, Cleaning, Painting, Carpentry, Appliance Repair, and Pest Control).

---

## Architecture Overview

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Hook Form, Zod, Axios.
- **Backend**: Python 3.13, FastAPI (Asynchronous), SQLAlchemy 2.0 ORM, Pydantic v2, JWT Security, bcrypt.
- **Database**: MySQL 8+ / MySQL 5.1+ (local instance running on port 3306) with Alembic migrations and SQLite fallback.
- **Payments**: Razorpay Test Mode integration + Dev Simulation Mode.
- **Media**: Cloudinary asset storage + Local filesystem fallback driver.
- **Automated Testing**: Pytest (backend), Postman collection, Playwright E2E test suite.

---

## 4 Distinct Role Dashboards

1. **Super Admin Dashboard**: Full system oversight, provider verification & KYC approval, dynamic category/subcategory management, platform commission control, dispute adjudication, and revenue analytics.
2. **Customer Portal**: Service discovery, multi-vendor comparison, anti-collision booking wizard, live job tracking, secure payments, invoice downloads, and verified reviews.
3. **Service Provider Dashboard**: Company profile, custom pricing, service area configuration, booking request approval/rejection, technician dispatch, and earnings ledger.
4. **Technician Mobile Field App**: Task assignment inbox, GPS arrival trigger, job execution tracking (`In Progress`), proof-of-work photo upload, and job completion.

---

## Project Documentation Index

- [System Architecture](file:///c:/vibe-code/docs/ARCHITECTURE.md)
- [Software Requirements Specification (SRS)](file:///c:/vibe-code/docs/SRS.md)
- [Role-Based Access Control (RBAC) Matrix](file:///c:/vibe-code/docs/ROLE_PERMISSION_MATRIX.md)
- [Database ER Diagram & 27 Tables Design](file:///c:/vibe-code/docs/DATABASE_ER_DIAGRAM.md)
- [Complete Project Structure](file:///c:/vibe-code/docs/PROJECT_STRUCTURE.md)
- [9-Phase Implementation Roadmap](file:///c:/vibe-code/docs/IMPLEMENTATION_ROADMAP.md)
- [Dependencies & Credentials Matrix](file:///c:/vibe-code/docs/DEPENDENCIES_CREDENTIALS.md)
- [UI/UX Design System](file:///c:/vibe-code/docs/UI_UX_DESIGN_SYSTEM.md)
- [Current Development Status](file:///c:/vibe-code/PROJECT_STATUS.md)

---

## Quick Start (Local Development)

### 1. Database Setup
```bash
# Ensure MySQL is running on port 3306
# Create database (if not already created)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS homeserve_db CHARACTER SET utf8 COLLATE utf8_general_ci;"
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m app.utils.seed  # Resets DB and seeds baseline data
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Portal will be live at: `http://localhost:5173`

---

## Testing & Quality Assurance
- **Pytest**: `cd backend && pytest -v`
- **Playwright E2E**: `cd playwright-tests && npx playwright test`
- **Postman**: Import collections located under `postman/`
