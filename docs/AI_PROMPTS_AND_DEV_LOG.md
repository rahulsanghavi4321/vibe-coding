# AI Prompts, Engineering Methodology & Development Log
## HomeServe Technologies – Multi-Vendor SaaS Platform

**Developer:** Rahul Sanghavi  
**Methodology:** Advanced Agentic AI Pair Programming ("Vibe Coding") with Google Antigravity  
**Target Platform:** Multi-Vendor Home Services SaaS (React 18 + FastAPI + MySQL/Postgres)  
**Date:** November 2026

---

## 1. Development Methodology Overview

The HomeServe Technologies platform was engineered using an **AI-first, Agentic Pair-Programming approach** known as *Vibe Coding*. Rather than treating AI simply as an autocomplete assistant, the development process leveraged structured architectural prompting, iterative feedback loops, autonomous multi-phase execution, and rigorous automated verification.

### Core Principles Followed:
1. **Specification Before Code**: Detailed SRS, Architecture, 27-table ER diagrams, and RBAC matrices were fully formalized before scaffolding code.
2. **Modular Micro-Architecture**: Frontend and backend were constructed as decoupled, independently testable units.
3. **Automated Verification Loops**: Every phase concluded with automated Pytest unit tests, Playwright browser E2E journeys, and live HTTP health checks.
4. **Resilient Production Debugging**: Cloud platform anomalies (e.g. Windows backslash ZIP issues on Linux Netlify, Render free-tier subdomain patterns) were systematically investigated, diagnosed, and resolved through agentic tool execution.

---

## 2. Chronological Prompt Chains & SDLC Execution Log

### Phase 1: System Requirements, Architecture & Design System
- **Context & Objective**: Establish enterprise requirements for a commercial-grade multi-vendor home services platform connecting Customers, Service Providers, Field Technicians, and Super Admins.
- **Master Prompt**:
  > *"Act as a Principal Enterprise Software Architect. Design an end-to-end multi-vendor home services booking SaaS platform named 'HomeServe Technologies'. Generate a formal Software Requirements Specification (SRS), a normalized 27-table relational database ER diagram covering 8 home services categories, a comprehensive Role-Based Access Control (RBAC) matrix for 4 distinct user roles, and a Tailwind CSS enterprise design system."*
- **Key Deliverables Produced**:
  - `docs/SRS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DATABASE_ER_DIAGRAM.md`
  - `docs/ROLE_PERMISSION_MATRIX.md`
  - `docs/UI_UX_DESIGN_SYSTEM.md`

---

### Phase 2: Frontend Engineering & 4 Distinct Role Portals
- **Context & Objective**: Scaffold a modern React 18 Single Page Application using Vite, Tailwind CSS, Lucide icons, and Recharts.
- **Master Prompt**:
  > *"Scaffold a React 18 + Vite frontend with Tailwind CSS for HomeServe Technologies. Implement clean navigation and responsive UI for 4 distinct user roles: Super Admin (KYC approval, categories, analytics), Customer (booking wizard, tracking, invoices), Service Provider (technician fleet, booking requests, earnings), and Technician (GPS arrival, job execution, photo uploads). Include a 1-click demo evaluation login selector on the Sign In page."*
- **Key Deliverables Produced**:
  - `frontend/src/pages/` (23 complete views)
  - `frontend/src/components/` (Navigation, sidebars, modals, cards)
  - Role-based routing with protected route guards

---

### Phase 3: Database Engineering, ORM & Seeding Engine
- **Context & Objective**: Design SQLAlchemy 2.0 ORM models and idempotent database seeding scripts supporting both MySQL and PostgreSQL.
- **Master Prompt**:
  > *"Construct SQLAlchemy 2.0 models for the 27 database entities defined in our ER diagram. Ensure normalized foreign key relationships, cascade deletes, and check constraints. Implement an idempotent seed script (`app.utils.seed`) that populates the 8 core service categories (Electrical, Plumbing, AC Repair, Cleaning, Painting, Carpentry, Appliance, Pest Control), 24 subcategories, sample providers, technicians, and demo orders."*
- **Key Deliverables Produced**:
  - `backend/app/models/` (User, Provider, Technician, Booking, Payment, Invoice, Review, Category)
  - `backend/app/utils/seed.py`

---

### Phase 4 & 5: FastAPI Backend Services & End-to-End Integration
- **Context & Objective**: Build high-performance asynchronous REST microservices with JWT bearer security and anti-collision booking logic.
- **Master Prompt**:
  > *"Develop a modular FastAPI backend structured with 14 distinct routers under `/api/v1`. Implement bcrypt password hashing, HS256 JWT tokens with 24-hour expiration, and role-guarded dependency injection. Create a booking engine that detects technician schedule overlap and enforces working hour limits. Integrate Razorpay test payments and local simulation fallbacks."*
- **Key Deliverables Produced**:
  - `backend/app/routers/` (14 routers)
  - `backend/app/core/security.py`
  - `backend/app/services/booking_engine.py`

---

### Phase 6: Automated Testing & Quality Assurance
- **Context & Objective**: Implement unit, integration, and browser E2E test suites with 100% pass rates.
- **Master Prompt**:
  > *"Construct comprehensive automated test suites for HomeServe Technologies. 1) Pytest suite in `backend/tests/` covering authentication, booking lifecycle, commission calculation, and review submission. 2) Postman collections for API contract testing. 3) Playwright E2E suite to navigate and verify all 23 live routes in headless Chromium."*
- **Key Deliverables Produced**:
  - `backend/tests/` (11/11 tests passing)
  - `playwright-tests/tests/verify_live_site.js` (23/23 routes passing)
  - `postman/HomeServe_Technologies_API.postman_collection.json`

---

### Phase 7, 8 & 9: Security Hardening, GitHub Push & Production Cloud Deployment
- **Context & Objective**: Deploy backend to Render, database to managed PostgreSQL, frontend to Netlify, and push code to GitHub.
- **Master Prompt**:
  > *"Deploy HomeServe Technologies to production cloud infrastructure. Deploy the FastAPI backend on Render with PostgreSQL 16. Deploy the React SPA on Netlify with SPA redirect rules. Resolve any CORS, routing, or packaging issues. Add 'Developed By Rahul Sanghavi' to every page footer and sync the entire codebase to GitHub `rahulsanghavi4321/vibe-coding`."*
- **Debugging & Resolution Log**:
  1. *GitHub Large Push Buffering*: Resolved via HTTP/1.1 chunking and increased `postBuffer`.
  2. *Netlify Blank Screen*: Identified that Windows PowerShell `Compress-Archive` created backslashes (`\`) inside ZIP, preventing Linux Netlify from serving JS files under `/assets/`. Re-zipped using Python with POSIX `/` forward slashes.
  3. *Netlify Edge Access SSO*: Disabled default Netlify private SSO gate using API `PATCH /sites/{site_id}` with `{"sso_login": false}`.
  4. *Render Subdomain Suffix*: Configured `/` root route redirect to `/docs` on `homeserve-backend-ylqa.onrender.com`.

---

## 3. Key Takeaways & Best Practices

1. **Deterministic Verification**: Never assume deployment success without automated browser execution (Playwright) confirming DOM rendering and zero console errors.
2. **Infrastructure Idempotency**: Writing portable database seeders that function identically across local SQLite/MySQL and cloud PostgreSQL eliminates environment friction.
3. **Traceability**: Documenting every prompt, architectural decision, and debugging resolution produces verifiable enterprise software.
