# Multi-Tenant Feature Flag Management System

This is a comprehensive multi-tenant feature flag management system built as a monorepo containing one backend and three independent frontends. The system uses custom JWT-based authentication to enforce strict role-based access control (RBAC) and tenant isolation.

## 🏗 Architecture & Tech Stack

- **Backend**: Node.js + Express (TypeScript), PostgreSQL (raw `pg` client).
- **Frontends**: React + Vite (TypeScript), Redux Toolkit for state management, React Router.
- **Monorepo Structure**:
  - `/backend` (Port 3001): Handles all business logic, DB interactions, and JWT auth.
  - `/frontend-super-admin` (Port 3002): For system administrators to manage organizations and their admins.
  - `/frontend-org-admin` (Port 3003): For organization administrators to manage feature flags.
  - `/frontend-end-user` (Port 3004): A simple public-facing test app simulating an end user checking feature flags.

### Security & Multi-Tenancy

- **Custom Auth:** Built entirely from scratch using `jsonwebtoken` and `bcrypt`. No third-party providers.
- **RBAC:** Two distinct roles: `super_admin` and `org_admin`.
- **Tenant Isolation:** Feature flags belong to an organization. When an `org_admin` makes API requests, the backend extracts the `org_id` strictly from the JWT payload to prevent cross-tenant data access. Organization isolation is strictly enforced at the database and controller levels.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### 1. Database Setup
1. Create a PostgreSQL database (e.g., `feature_flags_db`).
2. Update the `backend/.env` file with your database connection string (see `.env.example`).

### 2. Installation
Install dependencies for all 4 applications. From the root directory, you can run:

```bash
cd backend && npm install
cd ../frontend-super-admin && npm install
cd ../frontend-org-admin && npm install
cd ../frontend-end-user && npm install
```

### 3. Initialize & Seed Database
From the `backend` directory, run the initialization and seed scripts to create the schema and initial super admin account:

```bash
cd backend
npm run db:init
npm run db:seed
```

**Seed Credentials:**
- **Email:** super@admin.com
- **Password:** superpassword123

### 4. Running the Applications
Start each application in its own terminal window:

**Backend (Port 3001):**
```bash
cd backend
npm run dev
```

**Super Admin Frontend (Port 3002):**
```bash
cd frontend-super-admin
npm run dev
```

**Org Admin Frontend (Port 3003):**
```bash
cd frontend-org-admin
npm run dev
```

**End User Frontend (Port 3004):**
```bash
cd frontend-end-user
npm run dev
```

---

## 🧪 How to Test the System

1. **Super Admin Flow (Port 3002)**
   - Log in with the seeded credentials (`super@admin.com` / `superpassword123`).
   - Create a new Organization (e.g., "Acme Corp").
   - Create an Org Admin for that organization.

2. **Org Admin Flow (Port 3003)**
   - Log in with the newly created Org Admin credentials.
   - Create a feature flag (e.g., `new_checkout_flow`).
   - Toggle the flag on or off. Note the `org_id` in the URL or the Super Admin dashboard.

3. **End User Flow (Port 3004)**
   - Open the end user app.
   - Enter the `org_id` (copied from the Super Admin dashboard) and the `feature_key`.
   - Click "Check" to see if the feature is enabled for that organization.

## 📚 API Documentation

The backend includes Swagger/OpenAPI documentation.
While the backend is running, visit: `http://localhost:3001/api-docs` to view all endpoints and schemas.


<environment_details>
Current time: 2026-06-27T13:07:39+05:30
Working directory: F:\Feature Flag Management System
Workspace root folder: /
Active file: README.md
Visible files:
  README.md
Open tabs:
  README.md
</environment_details>
"# Feature-Flag-Management-System" 
"# Feature-Flag-Management-System" 
