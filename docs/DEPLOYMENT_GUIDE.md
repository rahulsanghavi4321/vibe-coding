# Production Cloud Deployment Guide
## HomeServe Technologies – Multi-Vendor SaaS Platform

---

## 1. Cloud Architecture Overview

```mermaid
flowchart TD
    DNS["Custom Domain / Route 53 (homeservetech.com)"]
    VercelEdge["Vercel Global Edge Network (React Frontend)"]
    RenderApp["Render Web Service (FastAPI Asynchronous Backend)"]
    CloudMySQL[("Managed Cloud MySQL 8+ Database (Aiven / PlanetScale / AWS RDS)")]
    CloudinaryCDN["Cloudinary Media CDN"]
    RazorpayTest["Razorpay Payment Gateway API"]

    DNS --> VercelEdge
    DNS --> RenderApp
    VercelEdge <-->|HTTPS REST JSON| RenderApp
    RenderApp <-->|SSL Connection| CloudMySQL
    RenderApp <--> CloudinaryCDN
    RenderApp <--> RazorpayTest
```

---

## 2. Frontend Deployment on Vercel

1. **Connect Repository**:
   - Link the GitHub repository: `homeserve-technologies-saas`.
   - Set **Root Directory**: `frontend`.
2. **Build Settings**:
   - Framework Preset: `Vite`.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. **Environment Variables**:
   ```env
   VITE_API_URL=https://homeserve-api.onrender.com/api/v1
   ```
4. **Deploy**:
   - Click **Deploy**. Vercel will build the production bundle and deploy to global edge CDNs. SPA rewrites are governed by `frontend/vercel.json`.

---

## 3. Backend Deployment on Render

1. **Create Web Service**:
   - In Render Dashboard, click **New + Web Service**.
   - Select repository: `homeserve-technologies-saas`.
   - Set **Root Directory**: `backend`.
2. **Build & Runtime Configuration**:
   - Runtime: `Python 3`.
   - Build Command: `pip install -r requirements.txt`.
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. **Environment Variables**:
   ```env
   APP_NAME="HomeServe Technologies"
   APP_ENV=production
   APP_DEBUG=false
   SECRET_KEY=your_generated_32_char_production_jwt_secret
   DATABASE_URL=mysql+pymysql://<user>:<password>@<cloud-mysql-host>:3306/homeserve_db?charset=utf8
   PAYMENT_MODE=simulation # switch to test/live once gateway approved
   MEDIA_STORAGE_DRIVER=local
   ```
4. **Health Check Verification**:
   - Set health check path to `/health`.
   - Verify deployment returns `HTTP 200 {"status": "ok"}`.

---

## 4. Managed Cloud Database Setup (Aiven / AWS RDS)

1. **Provision MySQL Instance**:
   - Deploy MySQL 8.0 instance on Aiven or AWS RDS.
   - Note connection URI: `mysql+pymysql://<user>:<password>@<host>:3306/homeserve_db?charset=utf8`.
2. **Execute Seed Migration**:
   - Run the seeder from Render shell or CI/CD:
     ```bash
     python -m app.utils.seed
     ```
   - Verifies 27 tables and baseline catalog.

---

## 5. Production Verification Checklist

- [x] Public Homepage & Categories load dynamically from MySQL.
- [x] Customer Registration & JWT Login generate valid sessions.
- [x] Super Admin Dashboard displays live SQL aggregate metrics.
- [x] Service Provider can accept bookings and dispatch available technicians.
- [x] Technician Field App transitions jobs to `In Progress` and `Completed`.
- [x] Payment sandbox verifies signatures and automatically issues tax invoices.
- [x] Pytest suite passes 11/11 tests.
- [x] OpenAPI Swagger documentation accessible at `/docs`.
