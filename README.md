# HomeServe Technologies
## Enterprise Multi-Vendor Home Services Booking SaaS Platform

[![Frontend Status](https://img.shields.io/badge/Frontend-Netlify%20Live-brightgreen?logo=netlify)](https://homeserve-app.netlify.app)
[![Backend Status](https://img.shields.io/badge/Backend-Render%20Live-46e3b7?logo=render)](https://homeserve-backend-ylqa.onrender.com)
[![Swagger Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-blue?logo=fastapi)](https://homeserve-backend-ylqa.onrender.com/docs)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?logo=postgresql)](https://render.com)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)]()

> **Developed By Rahul Sanghavi**  
> GitHub Repository: [https://github.com/rahulsanghavi4321/vibe-coding](https://github.com/rahulsanghavi4321/vibe-coding)

HomeServe Technologies is a commercial-grade, multi-vendor SaaS platform connecting residential and enterprise customers with certified service providers and technicians across 8 key home services categories (Electrical, Plumbing, AC Repair, Cleaning, Painting, Carpentry, Appliance Repair, and Pest Control).

---

## 📋 10 Required Project Deliverables Matrix

Every deliverable specified in the project requirements has been completed, verified, and committed to the repository:

| # | Required Deliverable | Status | Direct Deliverable Location / Documentation Link |
|:---:|:---|:---:|:---|
| **1** | **Complete source code** | 🟢 Complete | Full source code in repo: [`backend/`](file:///c:/vibe-code/backend), [`frontend/`](file:///c:/vibe-code/frontend), [`docker-compose.yml`](file:///c:/vibe-code/docker-compose.yml) |
| **2** | **GitHub repository** | 🟢 Complete | Clean, structured repository: [https://github.com/rahulsanghavi4321/vibe-coding](https://github.com/rahulsanghavi4321/vibe-coding) |
| **3** | **Live deployed application or deployment evidence** | 🟢 Complete | [Live Netlify Frontend](https://homeserve-app.netlify.app) + [Live Render Backend](https://homeserve-backend-ylqa.onrender.com) + [`docs/DEPLOYMENT_EVIDENCE.md`](file:///c:/vibe-code/docs/DEPLOYMENT_EVIDENCE.md) |
| **4** | **Database schema and ER diagram** | 🟢 Complete | [`docs/DATABASE_ER_DIAGRAM.md`](file:///c:/vibe-code/docs/DATABASE_ER_DIAGRAM.md) (27 Normalized Tables with Mermaid ER Diagram) |
| **5** | **API documentation** | 🟢 Complete | [Interactive Swagger OpenAPI UI](https://homeserve-backend-ylqa.onrender.com/docs) + [`docs/API_DOCUMENTATION.md`](file:///c:/vibe-code/docs/API_DOCUMENTATION.md) + Postman Collections |
| **6** | **Test cases and test reports** | 🟢 Complete | [`docs/TEST_CASES_AND_REPORTS.md`](file:///c:/vibe-code/docs/TEST_CASES_AND_REPORTS.md) (Pytest 11/11 & Playwright 23/23 live pages passed) |
| **7** | **Security checklist** | 🟢 Complete | [`docs/SECURITY_CHECKLIST.md`](file:///c:/vibe-code/docs/SECURITY_CHECKLIST.md) & [`docs/SECURITY_AUDIT.md`](file:///c:/vibe-code/docs/SECURITY_AUDIT.md) (OWASP Top 10 + PCI-DSS) |
| **8** | **Project documentation** | 🟢 Complete | Complete Architecture & Specifications: [`docs/SRS.md`](file:///c:/vibe-code/docs/SRS.md), [`docs/ARCHITECTURE.md`](file:///c:/vibe-code/docs/ARCHITECTURE.md), [`docs/PROJECT_STRUCTURE.md`](file:///c:/vibe-code/docs/PROJECT_STRUCTURE.md), [`docs/ROLE_PERMISSION_MATRIX.md`](file:///c:/vibe-code/docs/ROLE_PERMISSION_MATRIX.md) |
| **9** | **AI prompts and development log** | 🟢 Complete | [`docs/AI_PROMPTS_AND_DEV_LOG.md`](file:///c:/vibe-code/docs/AI_PROMPTS_AND_DEV_LOG.md) (Full Vibe Coding prompt chains & debugging logs) |
| **10** | **Final presentation** | 🟢 Complete | [`docs/FINAL_PRESENTATION.md`](file:///c:/vibe-code/docs/FINAL_PRESENTATION.md) (Comprehensive slide-by-slide executive pitch deck) |

---

## 🌐 Live Production Deployments

| Component | Platform | Live URL | Description |
|:---|:---|:---|:---|
| **Frontend Portal** | Netlify | [https://homeserve-app.netlify.app](https://homeserve-app.netlify.app) | Single Page Application (React 18 + Vite + Tailwind CSS) |
| **Backend REST API** | Render | [https://homeserve-backend-ylqa.onrender.com](https://homeserve-backend-ylqa.onrender.com) | FastAPI High-Performance Asynchronous Python Microservices |
| **Interactive API Docs** | Render / Swagger | [https://homeserve-backend-ylqa.onrender.com/docs](https://homeserve-backend-ylqa.onrender.com/docs) | Interactive OpenAPI 3.1 Documentation & Live API Playground |
| **Cloud Database** | Render PostgreSQL | `dpg-dblhcdgn74is73a51710-a` | PostgreSQL 16 Managed Instance with automatic relations & seeding |

---

## 🔑 Pre-Seeded Evaluation Credentials

For seamless evaluation, use the one-click demo role selector on the [Sign In Page](https://homeserve-app.netlify.app/login) or log in directly with any of the pre-seeded credentials below:

| Role | Email Address | Password | Accessible Dashboards & Capabilities |
|:---|:---|:---|:---|
| **Super Admin** | `admin@homeservetech.com` | `Password@123` | Full administrative control, KYC approvals, category management, platform commissions, financial audit ledger, dispute tickets. |
| **Customer** | `customer@gmail.com` | `Password@123` | Multi-category service search, anti-collision booking wizard, live order tracking, address book, invoice downloads, verified reviews. |
| **Service Provider** | `provider@apexservices.com` | `Password@123` | Business overview, booking requests management, technician dispatching, earnings settlement, weekly shift configuration. |
| **Field Technician** | `technician@apexservices.com` | `Password@123` | Field dispatch inbox, GPS check-in, live job status updates (`In Progress`), proof-of-work uploads, completion logs. |

---

## 🏗️ Architecture Overview

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Hook Form, Zod, Axios.
- **Backend**: Python 3.13, FastAPI (Asynchronous), SQLAlchemy 2.0 ORM, Pydantic v2, JWT Security, bcrypt.
- **Database**: PostgreSQL 16 (Production on Render) / MySQL 8+ / SQLite fallback with Alembic migrations.
- **Payments**: Razorpay Test Mode integration + Dev Simulation Mode.
- **Media**: Cloudinary asset storage + Local filesystem fallback driver.
- **Automated Testing**: Pytest (backend), Postman collection, Playwright E2E test suite (100% pass across all 23 routes).

---

## 👥 4 Distinct Role Dashboards & Portals

1. **Super Admin Dashboard**: Full system oversight, provider verification & KYC approval, dynamic category/subcategory management, platform commission control, dispute adjudication, and revenue analytics.
2. **Customer Portal**: Service discovery, multi-vendor comparison, anti-collision booking wizard, live job tracking, secure payments, invoice downloads, and verified reviews.
3. **Service Provider Dashboard**: Company profile, custom pricing, service area configuration, booking request approval/rejection, technician dispatch, and earnings ledger.
4. **Technician Mobile Field App**: Task assignment inbox, GPS arrival trigger, job execution tracking (`In Progress`), proof-of-work photo upload, and job completion.

---

## 📚 Complete Documentation Index

- [System Architecture](file:///c:/vibe-code/docs/ARCHITECTURE.md)
- [Software Requirements Specification (SRS)](file:///c:/vibe-code/docs/SRS.md)
- [Role-Based Access Control (RBAC) Matrix](file:///c:/vibe-code/docs/ROLE_PERMISSION_MATRIX.md)
- [Database ER Diagram & 27 Tables Design](file:///c:/vibe-code/docs/DATABASE_ER_DIAGRAM.md)
- [API Documentation & Endpoints Specification](file:///c:/vibe-code/docs/API_DOCUMENTATION.md)
- [Test Cases, Test Matrix & QA Reports](file:///c:/vibe-code/docs/TEST_CASES_AND_REPORTS.md)
- [Security Checklist & Compliance Audit](file:///c:/vibe-code/docs/SECURITY_CHECKLIST.md)
- [Security Audit & Vulnerability Assessment](file:///c:/vibe-code/docs/SECURITY_AUDIT.md)
- [Production Deployment Evidence](file:///c:/vibe-code/docs/DEPLOYMENT_EVIDENCE.md)
- [Production Cloud Deployment Guide](file:///c:/vibe-code/docs/DEPLOYMENT_GUIDE.md)
- [AI Prompts & Development Log](file:///c:/vibe-code/docs/AI_PROMPTS_AND_DEV_LOG.md)
- [Final Presentation & Pitch Deck](file:///c:/vibe-code/docs/FINAL_PRESENTATION.md)
- [Complete Project Structure](file:///c:/vibe-code/docs/PROJECT_STRUCTURE.md)
- [9-Phase Implementation Roadmap](file:///c:/vibe-code/docs/IMPLEMENTATION_ROADMAP.md)
- [Dependencies & Credentials Matrix](file:///c:/vibe-code/docs/DEPENDENCIES_CREDENTIALS.md)
- [UI/UX Design System](file:///c:/vibe-code/docs/UI_UX_DESIGN_SYSTEM.md)
- [Current Development Status](file:///c:/vibe-code/PROJECT_STATUS.md)

---

## 🚀 Quick Start (Local Development)

### 1. Database Setup
```bash
# Ensure MySQL is running on port 3306 or use SQLite/Render Postgres
mysql -u root -e "CREATE DATABASE IF NOT EXISTS homeserve_db CHARACTER SET utf8 COLLATE utf8_general_ci;"
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m app.utils.seed  # Seeds baseline categories, providers, users, and orders
uvicorn app.main:app --reload --port 8000
```
API Documentation live at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Portal live at: `http://localhost:5173`

---

## 🧪 Testing & Quality Assurance
- **Pytest**: `cd backend && pytest -v` (11/11 tests passing)
- **Playwright E2E**: `cd playwright-tests && node tests/verify_live_site.js` (23/23 live pages passing)
- **Postman**: Import collections located under `postman/`

---

## 👨‍💻 Developer Credit
**Developed By Rahul Sanghavi**  
HomeServe Technologies SaaS Platform © 2026. All rights reserved.
