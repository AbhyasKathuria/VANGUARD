# VANGUARD — Rural Service Routing Platform
## Complete User & Usage Guide

---

## ⚡ 1-Click Startup

Simply double-click **`start.bat`** in the project root directory.

The script automatically:
1. Verifies **Node.js** is installed.
2. Installs dependencies if `node_modules` is missing.
3. Initializes the **SQLite database** (`dev.db`) and seeds demo accounts if needed.
4. Opens **`http://localhost:3000`** in your default web browser.
5. Starts the **Next.js** local development server.

---

## 🔑 Pre-Seeded Demo Accounts & Logins

The application includes **1-Click Demo Login buttons** on the home page (`/`) and login page (`/login`). You can click any role button to log in immediately without typing passwords:

| Role | Name | Phone Number | Password | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Ramesh Sharma | `9876543210` | `password123` | Submit plain-text service requests, inspect assigned helper trust card, view live status timeline |
| **Worker (Verified)** | Sunil Electrician | `9876543211` | `password123` | View auto-assigned jobs in Rampur, start work, mark jobs resolved with notes |
| **Volunteer (Verified)** | Pooja (Rural Care NGO) | `9876543212` | `password123` | Handle assigned emergency tasks, claim open community pool requests |
| **Local Authority** | Officer Suresh Verma | `9876543213` | `password123` | Full district triage matrix, manual worker dispatch, toggle personnel verification |
| **Worker (Unverified)** | Manoj Plumber | `9876543214` | `password123` | Demonstrates verification gating (skipped by routing engine until verified) |
| **Volunteer (Unverified)** | Vikas Volunteer | `9876543215` | `password123` | Demonstrates verification gating in Sitapur |

---

## 🧭 Step-by-Step Live Demo Scenarios

### Scenario 1: Citizen Submits Request & Auto-Routing Assigns Worker
1. Open [http://localhost:3000](http://localhost:3000).
2. Click **"Citizen Demo"** (Ramesh Sharma).
3. Click **"Raise New Request"**.
4. Select **"Civic / Infrastructure"** (Notice the priority badge automatically maps to `MEDIUM`).
5. Enter Location: **`Rampur`**.
6. Enter Description: *"Streetlight cable snapped and hanging low near the village pond."*
7. Click **"Submit & Route Request"**.
8. **Result**: The routing engine searches Rampur, finds verified worker **Sunil Electrician**, automatically sets status to **`ASSIGNED`**, and redirects to the status timeline.
9. Inspect the **"Assigned Service Handler"** trust card: it displays Sunil's name, role, trade (Electrician), and direct call button.

---

### Scenario 2: Worker Accepts Task, Starts Work & Marks Complete
1. Log out (or click **"Worker Demo"** on `/login`).
2. On the Worker Dashboard (`/worker/dashboard`), view the assigned civic task.
3. Click **"Start Work"**, type an update note (*"Arrived with ladder and replacement insulation tape"*), and click **"Confirm & Update"**.
4. The status updates to **`IN PROGRESS`** and logs a new audit event.
5. Click **"Mark Complete"**, type a resolution note (*"Wire secured to pole and circuit tested safe"*), and submit.
6. The status updates to **`RESOLVED`**.

---

### Scenario 3: Citizen Reviews the Real-Time Audit Timeline
1. Log back in as **Citizen Demo**.
2. Open the request tracking page (`/citizen/request/[id]`).
3. Scroll through the **Status History & Audit Trail** timeline.
4. You will see every transition recorded in chronological order:
   - **Step 1 (Open)**: Request submitted by citizen Ramesh.
   - **Step 2 (Assigned)**: Auto-routed to verified worker Sunil Electrician.
   - **Step 3 (In Progress)**: Worker note with timestamp.
   - **Step 4 (Resolved)**: Completion note with timestamp.

---

### Scenario 4: Verification Gating & Local Authority Dispatch
1. Log in as **Citizen Demo** and raise a request in **`Sitapur`** (where only unverified personnel exist).
2. Submit: *"Water pipe burst near community clinic."*
3. **Result**: Because the Sitapur worker/volunteer is unverified (`verified: false`), the routing engine skips them and marks the request as **`OPEN`** (Queued for Local Authority triage).
4. Log in as **Authority Demo** (`/authority/dashboard`).
5. In the **Civic Triage & Dispatch** table, locate the `OPEN` Sitapur request.
6. Click **"Assign"**, select an available verified worker from the dropdown, add an official dispatch note, and confirm.
7. Switch to the **"Manage Personnel Verification"** tab:
   - Click **"Verify Personnel"** next to **Manoj Plumber** or **Vikas Volunteer** to activate them for future auto-matches!

---

### Scenario 5: Volunteer Claims an Unassigned Community Pool Request
1. Log in as **Volunteer Demo** (`/volunteer/dashboard`).
2. Click the **"Available / Unassigned Pool"** tab.
3. Browse open requests that were not automatically matched.
4. Click **"Claim Request"** on any open issue.
5. The request moves into your **"My Assigned Tasks"** tab with an audit message stating it was claimed by the volunteer.

---

## 🛠️ Handy Commands & Database Reset

If you ever want to reset the database back to clean baseline demo data:
```bash
# Re-seed demo database
npm run prisma:seed
```

To view the database in the visual Prisma Studio GUI:
```bash
npx prisma studio
```
(Opens interactive database editor on [http://localhost:5555](http://localhost:5555)).

To run the automated 21-point integration test suite:
```bash
npx tsx scratch/test_routing_and_roles.ts
```

---

## 🏗️ Technical Highlights for Reviewers

- **Zero ML/AI Flakiness**: 100% deterministic rule-based priority mapping and candidate matching.
- **Strict Multi-Tenant Role Isolation**: Citizen, Worker, Volunteer, and Authority routes are enforced at the API and middleware layer.
- **Audit Compliance**: Every single state change is recorded immutably in `request_updates` with user IDs, roles, and timestamps.
- **Zero-Dependency SQLite Stack**: Runs out-of-the-box on any machine without Docker or external DB services.
