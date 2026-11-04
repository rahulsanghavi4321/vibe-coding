# Complete Project Layout & Code Organization
## HomeServe Technologies – Enterprise Codebase Architecture

---

## 1. Monorepo Repository Structure

```
c:\vibe-code\
├── .gitignore                      # Git exclusion rules
├── .env.example                    # Template environment variables
├── README.md                       # Comprehensive setup and run guide
├── PROJECT_STATUS.md               # Continuous SDLC phase tracking
├── docker-compose.yml              # Local container orchestration
│
├── docs/                           # Architecture, SRS, DB Specs, API contracts
│   ├── ARCHITECTURE.md
│   ├── SRS.md
│   ├── ROLE_PERMISSION_MATRIX.md
│   ├── DATABASE_ER_DIAGRAM.md
│   ├── PROJECT_STRUCTURE.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── DEPENDENCIES_CREDENTIALS.md
│   └── UI_UX_DESIGN_SYSTEM.md
│
├── database/                       # Database DDL, Seeds & Migrations
│   ├── schema.sql                  # Raw MySQL 8+ DDL
│   ├── seed_data.sql               # Baseline categories, services, demo users
│   └── reset_db.py                 # Automated DB reset & seed script
│
├── backend/                        # FastAPI Application Service
│   ├── requirements.txt            # Pinned Python dependencies
│   ├── pytest.ini                  # Pytest configuration
│   ├── alembic.ini                 # Alembic migration configuration
│   ├── migrations/                 # Alembic migration versions
│   │   ├── env.py
│   │   └── versions/
│   │
│   ├── app/
│   │   ├── main.py                 # FastAPI application factory & routes
│   │   │
│   │   ├── core/                   # Application configs & core primitives
│   │   │   ├── config.py           # Pydantic Settings
│   │   │   ├── security.py         # JWT token generator, bcrypt password hasher
│   │   │   ├── permissions.py      # RBAC dependencies & guards
│   │   │   └── logging.py          # Structured logging
│   │   │
│   │   ├── database/               # Database connectivity
│   │   │   ├── connection.py       # Engine, SessionLocal, get_db yield
│   │   │   └── base.py             # DeclarativeBase & model imports
│   │   │
│   │   ├── models/                 # SQLAlchemy 2.0 ORM Models (27 Tables)
│   │   │   ├── user.py             # User, Customer, Provider, Technician
│   │   │   ├── category.py         # Category, Subcategory, Service, ProviderService
│   │   │   ├── booking.py          # Booking, Assignment, History, Images
│   │   │   ├── payment.py          # Payment, Invoice, Coupon, Earning
│   │   │   ├── feedback.py         # Review, Complaint, ComplaintHistory
│   │   │   └── operational.py      # Address, Area, Slot, Notif, Plan, Announcement
│   │   │
│   │   ├── schemas/                # Pydantic v2 validation schemas
│   │   │   ├── auth.py             # Login, Register, TokenPayload
│   │   │   ├── user.py             # Profile, Address, PasswordUpdate
│   │   │   ├── category.py         # CategoryCreate, ServiceDetail
│   │   │   ├── booking.py          # BookingCreate, BookingStatusUpdate, Assignment
│   │   │   ├── payment.py          # PaymentOrder, VerifyPayment, Invoice
│   │   │   ├── feedback.py         # ReviewCreate, ComplaintCreate
│   │   │   └── analytics.py        # Admin & Provider metrics DTOs
│   │   │
│   │   ├── routers/                # REST API Routers (/api/v1/...)
│   │   │   ├── auth.py             # Authentication & session endpoints
│   │   │   ├── users.py            # User management & addresses
│   │   │   ├── categories.py       # Dynamic category catalog endpoints
│   │   │   ├── services.py         # Services & provider pricing endpoints
│   │   │   ├── providers.py        # Provider profiles, hours, document upload
│   │   │   ├── technicians.py      # Technician job list & task execution
│   │   │   ├── bookings.py         # Booking workflow & anti-collision logic
│   │   │   ├── payments.py         # Razorpay checkout & simulation hooks
│   │   │   ├── invoices.py         # Invoicing & tax summaries
│   │   │   ├── reviews.py          # Rating & review operations
│   │   │   ├── complaints.py       # Dispute management & resolution
│   │   │   ├── notifications.py    # Notification center endpoints
│   │   │   ├── analytics.py        # Dynamic database-driven dashboard queries
│   │   │   └── admin.py            # Super Admin back-office controls
│   │   │
│   │   ├── services/               # Reusable business logic services
│   │   │   ├── booking_service.py  # Slot checking & state machine transitions
│   │   │   ├── payment_service.py  # Gateway signature check & simulation
│   │   │   ├── invoice_service.py  # Invoice computation & generation
│   │   │   ├── media_service.py    # Local file / Cloudinary integration
│   │   │   └── notification_service.py # Event dispatcher
│   │   │
│   │   └── utils/                  # Helper utilities & constants
│   │       ├── calculation.py      # Tax, commission, coupon discount formulas
│   │       └── seed.py             # Comprehensive database seeder
│   │
│   └── tests/                      # Automated Backend Test Suite
│       ├── conftest.py             # Pytest fixtures & test SQLite/MySQL engine
│       ├── test_auth.py            # JWT & RBAC tests
│       ├── test_categories.py      # Category CRUD tests
│       ├── test_bookings.py        # Booking lifecycle & collision tests
│       ├── test_payments.py        # Payment verification & formula tests
│       └── test_reviews.py         # Review constraints & complaints
│
├── frontend/                       # React 18 + Vite SPA
│   ├── package.json                # Dependencies (Tailwind, Lucide, Recharts, Axios)
│   ├── vite.config.js              # Vite configuration with proxy
│   ├── tailwind.config.js          # Tailwind theme & enterprise colors
│   ├── postcss.config.js           # PostCSS setup
│   ├── index.html                  # HTML entry point with HomeServe branding
│   │
│   ├── src/
│   │   ├── main.jsx                # Root React render
│   │   ├── App.jsx                 # Router & provider hierarchy
│   │   ├── index.css               # Global Tailwind directives & custom classes
│   │   │
│   │   ├── api/                    # Centralized Axios HTTP client
│   │   │   ├── client.js           # Interceptors for JWT & error toast
│   │   │   └── endpoints.js        # Strongly typed API endpoints
│   │   │
│   │   ├── context/                # React Context Providers
│   │   │   ├── AuthContext.jsx     # User session, JWT decode, login/logout
│   │   │   └── NotificationContext.jsx # Real-time alerts & unread badge
│   │   │
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── common/             # Navbar, Footer, Button, Card, Modal, Badge, Loader
│   │   │   ├── layout/             # DashboardLayout, Sidebar, TopHeader
│   │   │   ├── booking/            # BookingCard, SlotPicker, StatusStepper
│   │   │   └── ui/                 # Table, Dropdown, Alert, StarRating, ImageUpload
│   │   │
│   │   └── pages/                  # Page Views (Public, Customer, Provider, Tech, Admin)
│   │       ├── public/             # Home, About, Services, HowItWorks, Login, Register
│   │       ├── customer/           # CustomerDashboard, MyBookings, BookingFlow, Invoices
│   │       ├── provider/           # ProviderDashboard, Requests, Techs, Earnings, Hours
│   │       ├── technician/         # TechnicianDashboard, JobDetail, StatusUpdate
│   │       └── admin/              # AdminDashboard, Verifications, Categories, Complaints
│   │
├── postman/                        # Postman Collection & Environments
│   ├── HomeServe_Technologies.postman_collection.json
│   └── HomeServe_Environment.postman_environment.json
│
└── playwright-tests/               # End-to-End Test Automation
    ├── package.json
    ├── playwright.config.js
    └── tests/
        ├── e2e_booking_journey.spec.js   # Full 18-step customer-provider-tech-admin flow
        └── negative_scenarios.spec.js    # Invalid auth, collision, unauthorized routes
```

