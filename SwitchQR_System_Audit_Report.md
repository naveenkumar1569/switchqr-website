# System Audit & Forensic Analysis Report
**Date:** 2026-02-02
**Subject:** SwitchQR System Architecture & State Analysis
**Scope:** Frontend (Client), Backend (Server), Supabase (Auth/DB), Deployment

---

## 1. Change Log Reconstruction

### Timeline & Rationale
| Timestamp (Approx) | Change | Driver / Symptom | Side Effect |
|:--- |:--- |:--- |:--- |
| **Initial** | Created base scaffold | Project Start | N/A |
| **Pre-Feb 2** | Implemented `vercel.json` rewrites | Fix 404 on SPA Fresh/Direct navigation | None (Correct fix) |
| **Pre-Feb 2** | Added `VITE_SUPABASE_` env vars | Fix Blank Screen / Auth Failures | None (Required for functioning app) |
| **Pre-Feb 2** | `AuthContext` try/finally block | Fix "Stuck Loading" screen | **Potential Flicker**: UI renders before async user/plan data arrives |
| **Recent** | `redirect.supabase.js` Priority Logic | Feature: Scheduling & A/B Testing support | Increased complexity in redirect latency |
| **Recent** | `qrs.supabase.js` Campaign ID Sanitization | Fix "Invalid UUID" error on update | None (Stability improvement) |
| **Latest** | `QRDetails.jsx` Static -> Dynamic Fix | **Critical**: QR was encoding raw URL (Static) | **Caching Risk**: Old cached JS may still generate static QRs for users |

---

## 2. System Architecture (AS-IS)

### Frontend (Client)
- **Framework**: React 19 + Vite.
- **Routing**: Client-side `react-router-dom`.
- **Hosting**: Vercel (Static Web App).
- **SPA Fallback**: Configured via `client/vercel.json` -> matches `/(.*)` to `/index.html`.
- **Auth State**:
  - Managed by `AuthContext.jsx`.
  - **Hydration**: Pulls `token` from `localStorage` synchronously.
  - **Verification**: Verifies token validity Asynchronously via `/api/users/profile`.
- **Trust Boundary**: Client is **untrusted**. All sensitive operations (QR Create, Edit, Delete) go to Backend API.

### Backend (Server)
- **Runtime**: Node.js 20.x.
- **Framework**: Express.
- **Role**:
  1.  **API Gateway**: Proxies requests to Supabase (with RLS context).
  2.  **Redirect Engine**: Handles public `/r/:shortCode` resolution.
- **Trust Boundary**:
  - **Redirect Engine**: Uses `SUPABASE_SERVICE_ROLE_KEY` (Admin). **Bypasses RLS** to resolve redirects for public users.
  - **API Routes**: Uses `SUPABASE_SERVICE_ROLE_KEY` to mint RLS-compatible clients or accesses DB directly.
  - **Current Deviation**: Some routes in `qrs.supabase.js` manually extract User ID and check ownership, acting as an application-layer RLS.

### Supabase
- **Auth**: Identity Provider (Google OAuth + Email).
- **Database**: PostgreSQL.
- **RLS**: Enabled on tables (`qrs`, `scans`, etc.).
- **Relationship**:
  - Frontend talks to `auth` directly.
  - Backend talks to `db` using Admin key.

---

## 3. App Lifecycle Trace

### A. Cold Load (Hard Refresh)
1.  **Browser**: Fetches `index.html`.
2.  **Vercel**: Serve static asset.
3.  **React**: Mounts.
4.  **AuthContext**:
    -   Reads `token` from `localStorage` (Sync).
    -   Sets `loading = true`.
    -   `useEffect` triggers `initializeAuth`.
    -   **IF Token Exists**:
        -   Starts Async fetch: `GET /api/plan`.
        -   Starts Async fetch: `GET /api/users/profile`.
        -   **Crucial Step**: `setLoading(false)` fires in `finally`.
5.  **Render**:
    -   If Async fetch is slower than UI render cycle (typical), `planInfo` is `null`.
    -   **Result**: App renders in "Free Plan" state (default fallback).
6.  **Async Completion**:
    -   Fetch returns `200 OK`.
    -   `setPlanInfo(data)`.
    -   **Re-render**: UI updates to "Pro/Starter Plan". mechanism -> **FLICKER**.

### B. Login (Google OAuth)
1.  **User**: Clicks "Continue with Google".
2.  **Supabase SDK**: Redirects to `accounts.google.com`.
3.  **Google**: Redirects back to `app.switch-qr.com` with `#access_token=...`.
4.  **AuthContext**:
    -   `onAuthStateChange` listener fires.
    -   Captures session.
    -   Updates `token` state.
    -   Writes to `localStorage`.
    -   Triggers `initializeAuth` (See Step A).

### C. Dashboard Render
1.  **Layout**: Checks `planInfo` to show/hide features (Schedules, A/B).
2.  **Data Fetch**:
    -   `useEffect` calls `/api/qrs`.
    -   Shows `Loading...` spinner for table.
    -   Populates table.

---

## 4. State & Source-of-Truth Analysis

| Entity | Origin | Owner | Trusted When | Stale When |
|:--- |:--- |:--- |:--- |:--- |
| **User Identity** | Supabase Auth (JWT) | Supabase | Verified by Backend Middleware | Client verifies via Profile API |
| **User Plan** | `profiles` table | Backend / DB | Fetched fresh from `/api/plan` | During initial load (race condition) |
| **QR ID** | Database (UUID) | DB | Always (Immutable) | Never |
| **Destination URL** | `qrs.destination_url` | DB | On Redirect Resolution | **Client-side**: If user has outdated Tab open |
| **QR Image** | Generated on Client | **Client Logic** | **Only if Client Code is Fresh** | **CACHE RISK**: If browser caches old JS, it generates Static QR |
| **Scan Counts** | `scans` table (Aggregation) | DB | Fetched via `/api/stats` | Real-time (approx 5-10s delay depending on caching) |

---

## 5. Product Contract Verification

### 1. "Static QR, Dynamic Destination"
-   **Contract**: QR Pattern must Encode `/r/shortCode`. Must NEVER change after creation.
-   **Status**: **VIOLATED (Historically)** / **HONORED (Codebase)**.
-   **Violation Mechanism**: Previous code encoded `destination_url` directly.
-   **Current State**: Codebase uses `VITE_API_BASE_URL + '/r/' + shortCode`.
-   **Residual Risk**: Browsers running cached JS will continue to violate this contract until hard refresh.

### 2. "Plan-based Feature Gating"
-   **Contract**: Free users cannot use Scheduling/AB.
-   **Status**: **HONORED**.
-   **Mechanism**:
    -   **Frontend**: UI hides buttons based on `planInfo`.
    -   **Backend**: `qrs.supabase.js` enforces check on CREATE/UPDATE.
    -   **Flicker Issue**: Frontend momentarily forgets plan on reload, exposing UI (but backend rejects actions).

### 3. "Accurate Scan Tracking"
-   **Contract**: Every scan is counted.
-   **Status**: **HONORED**.
-   **Mechanism**: `redirect.supabase.js` calls `logScan` asynchronously.
-   **Caveat**: "Async fire-and-forget" means rare scans *could* be lost if server crashes mid-request, but prevents redirect latency.

---

## 6. Performance & UX Pathology

### Why the Flicker?
**Diagnosis**: `AuthContext` initialization strategy.
-   It uses a "optimistic loading" approach where `token` availability implies "Logged In", but `planInfo` availability implies "Tiered User".
-   The default state for `planInfo` is `null`.
-   The UI treats `planInfo === null` as "Free Tier".
-   **Pathology**: Token exists -> App renders (Authenticated) -> Plan is Null (Free) -> Fetch completes -> Plan is Pro (Update).

### Why is it sluggish?
**Diagnosis**: Sequential blocking & duplicate fetching.
1.  **Multiple Round-trips**: Dashboard fetches QRs, then Stats, then something else.
2.  **Supabase Cold Starts**: If using Supabase Serverless execution, connections can be slow.
3.  **Client-Side Waterfall**: `QRDetails` fetches `qrs/:id`, THEN `variants`, THEN `schedules` (mostly parallel, but `stats` waits).

---

## 7. Risk Register

| Risk | Severity | Description |
|:--- |:--- |:--- |
| **Old Client Code Caching** | **CRITICAL** | Users may still be generating Static QRs because their browser hasn't refreshed the JS bundle. This permanently breaks those QRs. |
| **Plan State Race Condition** | **HIGH** | Users seeing "Free Plan" UI on reload creates trust issues and "Upgrade" panic. |
| **Redirect Latency** | **MEDIUM** | The `redirect.supabase.js` performs 3 sequential DB lookups (QR -> Schedule -> Variant) before redirecting. Could be slow on weak connections. |
| **Env Var Dependency** | **MEDIUM** | Heavy reliance on `VITE_API_BASE_URL`. If this drifts between Client/Server/Website, redirects break. |

---

## 8. Known Unknowns

1.  **DB Indexing**: Are `qrs(short_code)` and `scans(qr_id)` indexed? If not, performance will degrade linearly with scale.
2.  **Supabase RLS Policies**: We know we use Admin key to bypass, but are the actual RLS policies secure for the `anon` key if it leaks?
3.  **Vercel Cache Settings**: How long does Vercel cache the `index.html` and JS bundles? This determines how long the "Static QR" bug persists in the wild.
