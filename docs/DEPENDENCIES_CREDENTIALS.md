# Dependencies, External Credentials & Fallback Matrix
## HomeServe Technologies – Operational Environment Specifications

---

## 1. System Runtime Requirements

| Dependency | Minimum Version | Verified Local Environment |
|---|---|---|
| **Operating System** | Windows 10/11, Ubuntu 20.04+, macOS | Windows 11 Enterprise |
| **Python** | Python 3.10+ | Python 3.13.7 |
| **Node.js** | Node.js 18.0+ LTS | Node.js v24.11.1 |
| **Package Manager** | npm 9+ | npm 11.6.2 |
| **Relational DB** | MySQL 8.0+ / MySQL 5.1+ / SQLite fallback | MySQL Server 5.1 running locally on port 3306 |
| **Git** | Git 2.30+ | Git 2.56.0.windows.2 |

---

## 2. Pinned Python Backend Dependencies (`backend/requirements.txt`)

```txt
fastapi>=0.115.0
uvicorn[standard]>=0.32.0
pydantic>=2.9.2
pydantic-settings>=2.6.0
sqlalchemy>=2.0.36
pymysql>=1.1.1
cryptography>=43.0.3
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
bcrypt>=4.0.1
python-multipart>=0.0.17
alembic>=1.13.3
httpx>=0.27.2
pytest>=8.3.3
pytest-asyncio>=0.24.0
razorpay>=1.4.1
cloudinary>=1.41.0
python-dotenv>=1.0.1
```

---

## 3. Pinned React Frontend Dependencies (`frontend/package.json`)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.27.0",
    "axios": "^1.7.7",
    "lucide-react": "^0.454.0",
    "recharts": "^2.13.0",
    "react-hook-form": "^7.53.1",
    "zod": "^3.23.8",
    "@hookform/resolvers": "^3.9.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3",
    "vite": "^5.4.10",
    "tailwindcss": "^3.4.14",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20"
  }
}
```

---

## 4. External Credentials & Safe Fallback Matrix

In accordance with strict enterprise standards, **no secret keys are hardcoded**. The system incorporates high-fidelity development simulation modes so that local testing and verification can be performed reliably even when external commercial credentials (like production Razorpay or Cloudinary accounts) are not configured.

| Integration | Required Env Variables | Purpose | Fallback / Simulation Mode |
|---|---|---|---|
| **MySQL Database** | `DATABASE_URL` | Relational persistence | Local MySQL 5.1 (`mysql+pymysql://root@localhost:3306/homeserve_db`) verified. In memory/file SQLite fallback available. |
| **Razorpay Payments** | `RAZORPAY_KEY_ID`<br/>`RAZORPAY_KEY_SECRET` | Real-time payment processing & test cards | **Simulation Mode (`PAYMENT_MODE=simulation`)**: Emulates Razorpay order creation, mock checkout modal, HMAC signature verification, and automated invoice triggering without requiring live bank credentials. |
| **Media Storage** | `CLOUDINARY_CLOUD_NAME`<br/>`CLOUDINARY_API_KEY`<br/>`CLOUDINARY_API_SECRET` | Cloud asset CDN | **Local Storage Driver (`MEDIA_STORAGE_DRIVER=local`)**: Automatically stores uploads in `backend/uploads/` and serves via FastAPI static files `/static/uploads/`. |
| **SMTP Mailer** | `SMTP_HOST`<br/>`SMTP_USER`<br/>`SMTP_PASSWORD` | External email notices | **In-App Notification Center**: Every event is stored in the database `notifications` table and delivered to the frontend notification bell counter. |

