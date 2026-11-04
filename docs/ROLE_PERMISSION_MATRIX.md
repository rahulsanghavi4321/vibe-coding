# Role-Based Access Control (RBAC) Matrix
## HomeServe Technologies – SaaS Authorization Specifications

---

## 1. Overview of Roles

The platform defines four discrete primary roles:
1. **Super Admin (`super_admin`)**: Unrestricted administrative authority over system configurations, catalogs, user accounts, dispute resolution, and system reporting.
2. **Customer (`customer`)**: End-user authority to browse catalogs, manage addresses, book services, pay invoices, submit reviews, and file complaints.
3. **Service Provider (`service_provider`)**: Business authority to manage company profile, catalog listings, team of technicians, job requests, and financial earnings.
4. **Technician (`technician`)**: Field worker authority restricted exclusively to viewing and updating assigned jobs, marking arrivals, and uploading completion photos.

---

## 2. Comprehensive Permissions Matrix

| Functional Capability | Super Admin | Customer | Service Provider | Technician | Public / Guest |
|---|:---:|:---:|:---:|:---:|:---:|
| **Authentication & Profile** | | | | | |
| View Public Landing & Services |  |  |  |  |  |
| Register as Customer |  |  |  |  |  |
| Register as Service Provider |  |  |  |  |  |
| Login & Receive JWT |  |  |  |  |  |
| Manage Own Profile & Password |  |  |  |  |  |
| Manage Multiple Addresses |  |  (Own) |  |  |  |
| Enable / Disable User Accounts |  |  |  |  |  |
| **Service Catalog & Categories** | | | | | |
| Browse Categories & Services |  |  |  |  |  |
| Create / Edit / Delete Categories |  |  |  |  |  |
| Create / Edit / Delete Subcategories |  |  |  |  |  |
| Add / Configure Provider Services |  |  |  (Own) |  |  |
| Configure Service Coverage Areas |  |  |  (Own) |  |  |
| **Provider KYC & Verification** | | | | | |
| Upload Verification Documents |  |  |  (Own) |  |  |
| Review & Approve / Reject Providers |  |  |  |  |  |
| Manage Provider Working Hours |  |  |  (Own) |  |  |
| Manage Provider Blackout Dates |  |  |  (Own) |  |  |
| **Booking Operations** | | | | | |
| Create Booking Request |  |  |  |  |  |
| View Booking Details |  (All) |  (Own) |  (Own) |  (Assigned) |  |
| Cancel Booking |  (Any) |  (Own - Rules) |  |  |  |
| Accept / Reject Booking Request |  |  |  (Own) |  |  |
| Assign Technician to Booking |  |  |  (Own) |  |  |
| Reassign Technician |  |  |  (Own) |  |  |
| Mark Technician Arrival |  |  |  |  (Assigned) |  |
| Start Service (`In Progress`) |  |  |  |  (Assigned) |  |
| Upload Completion Photos |  |  |  |  (Assigned) |  |
| Mark Service `Completed` |  |  |  |  (Assigned) |  |
| View Complete Booking Audit Log |  (All) |  (Own) |  (Own) |  |  |
| **Payments & Invoicing** | | | | | |
| Initiate Payment for Booking |  |  (Own) |  |  |  |
| Verify Payment & Webhooks |  |  |  |  |  |
| Configure Platform Commission % |  |  |  |  |  |
| View Provider Net Earnings |  (All) |  |  (Own) |  |  |
| Download Invoices & Receipts |  (All) |  (Own) |  (Own) |  |  |
| Manage Coupons & Discounts |  |  |  |  |  |
| Process Refunds |  |  |  |  |  |
| **Reviews & Complaints** | | | | | |
| Post Rating & Review |  |  (Completed Jobs) |  |  |  |
| Respond to Customer Review |  |  |  (Own) |  |  |
| Moderate / Remove Reviews |  |  |  |  |  |
| File Formal Dispute / Complaint |  |  (Own) |  |  |  |
| Update Complaint Resolution Status |  |  |  |  |  |
| View Complaint Status History |  (All) |  (Own) |  |  |  |
| **Notifications & Announcements** | | | | | |
| Receive Targeted Notifications |  |  |  |  |  |
| Mark Notifications as Read |  |  |  |  |  |
| Broadcast System Announcements |  |  |  |  |  |
| **Analytics & Reporting** | | | | | |
| View System Revenue & Trends |  |  |  |  |  |
| View Provider Sales & Tech Metrics |  |  |  (Own) |  |  |
| Export Analytical Reports to CSV |  |  |  (Own) |  |  |

---

## 3. Data Scoping & Multi-Tenancy Rules

1. **Horizontal Data Isolation**:
   - Every read/write query for customers filters by `customer_id = current_user.customer.id`.
   - Every read/write query for service providers filters by `provider_id = current_user.provider.id`.
   - Every query for technicians filters by `assigned_technician_id = current_user.technician.id`.
2. **Strict Guard Middleware**:
   - If a technician attempts to access another technician's booking: `403 Forbidden: Access Denied`.
   - If a provider attempts to approve another provider's booking: `403 Forbidden: Unauthorized Provider Access`.
3. **Admin Escalation**:
   - Super admin users bypass owner filtering for read/audit purposes, but all admin actions are logged with administrative user IDs.
