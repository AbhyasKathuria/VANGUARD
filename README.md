# VANGUARD — Rural Service Routing Platform (MVP)

> **Core Concept**: A rural citizen submits a service request (health, civic, emergency, or farming) in plain text. The platform automatically maps category to priority, runs a deterministic rule-based routing algorithm to find the nearest available verified worker/volunteer, and provides role-enforced dashboards with an audit timeline for every status transition.

---

## 🚀 Instant Quickstart & Demo Setup

### Prerequisites
- Node.js v18+ or v20+
- npm v10+

### 1. Install & Setup Database
```bash
# 1. Install dependencies
npm install

# 2. Push Prisma SQLite schema
npm run prisma:push

# 3. Seed demo accounts & sample workflow requests
npm run prisma:seed
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login)

The home and login pages include **1-Click Demo Login buttons** for instant evaluation of all user roles. You can also sign in manually with phone and password:

| Role | Name | Phone Number | Password | Verification Status & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Ramesh Sharma | `9876543210` | `password123` | Submit requests, view own requests, inspect assigned helper trust card & live timeline |
| **Worker (Verified)** | Sunil Electrician | `9876543211` | `password123` | **Verified**: Receives auto-routed jobs in Rampur, updates status to *In Progress* / *Resolved* |
| **Volunteer (Verified)** | Pooja (Rural Care NGO) | `9876543212` | `password123` | **Verified**: Receives emergency alerts in Rampur, claims open community pool tasks |
| **Local Authority** | Officer Suresh Verma | `9876543213` | `password123` | **Authority**: Full triage matrix, manual dispatch, verify/revoke worker & volunteer credentials |
| **Worker (Unverified)** | Manoj Plumber | `9876543214` | `password123` | **Unverified**: Gated by routing engine (skipped until Authority verifies in dashboard) |
| **Volunteer (Unverified)**| Vikas Volunteer | `9876543215` | `password123` | **Unverified**: Gated by routing engine in Sitapur until verified |

---

## 🛡️ Verification Gate & Helper Trust Architecture

### 1. Verification Gate
- The routing engine queries candidate workers and volunteers matching `where: { availability: true, verified: true }`.
- Requests raised in areas where only unverified personnel exist (e.g. Sitapur) are skipped by the auto-router and left in `OPEN` status, queued for the Local Authority.
- Local Authorities can verify personnel with 1 click in `/authority/dashboard` under the **Manage Personnel Verification** tab, after which candidate matching activates.

### 2. Assigned Helper Trust Story
- On the Citizen Tracking page ([`/citizen/request/[id]`](file:///c:/Users/kathu/Desktop/projects/VANGUARD/src/app/citizen/request/[id]/page.tsx)), citizens see an **Assigned Service Handler** trust card displaying:
  - **Full Name** (`assignedTo.name`)
  - **Role Badge** (`Worker` or `Volunteer`)
  - **Profession / Organization** (`Electrician`, `Rural Care NGO`)
  - **Direct Contact Link** (`tel:...`) to call the handler directly.

---

## 🧪 Testing the End-to-End Workflow

Run the automated E2E integration test suite:
```bash
npx tsx scratch/test_routing_and_roles.ts
```
*(21 test assertions verifying priority mapping, verified routing, unverified gating, authority verification toggle, and citizen helper exposure).*

---

## 📄 License
MIT License
