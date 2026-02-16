# Tiered Feature Gating - Implementation Walkthrough

This document outlines the complete implementation of tiered feature gating for SwitchQR, covering both backend enforcement and frontend restrictions.

## Summary

✅ **Backend Enforcement**: Created `planEnforcement.js` middleware and added it to 11 protected routes  
✅ **Frontend Gating**: Updated `planPermissions.js` with corrected limits and verified all page restrictions  
✅ **Configuration**: Updated `planManager.js` with corrected limits (Free: 3 QRs, not 5)  
✅ **Build Verification**: Frontend builds successfully with no errors

---

## 1. Backend Changes

### A. Plan Configuration Updates

Updated `server/utils/planManager.js`:

- **QR Limits**: Changed Free from 5 → **3**
- **Added New Limits**:
  - Scan limits: Free (500), Starter (100k), Pro (Unlimited)
  - Link update limits: Free (10), Starter (500), Pro (Unlimited)
  - Analytics history: Free (7 days), Starter (90 days), Pro (Unlimited)
- **Feature Corrections**:
  - Starter `advanced_analytics`: `true` → **`false`** (Basic analytics only)
  - Starter `csv_export`: Remains **`false`** (Pro-only)

### B. Enforcement Middleware

Created `server/middleware/planEnforcement.js`:

```javascript
// Key Functions:
- requireFeature(featureName) - Blocks requests if user lacks feature
- attachPlanInfo() - Attaches plan info for data filtering
- getRequiredPlan() - Returns minimum plan needed for a feature
```

**How It Works**:
1. Middleware intercepts request
2. Resolves user's plan via `resolveUserPlan(userId)`
3. Checks `planInfo.features[featureName]`
4. Returns 403 if access denied
5. Attaches `req.planInfo` for downstream use

### C. Protected Routes

Added `requireFeature` middleware to these routes:

| Route | Feature Check | Files Modified |
|:---|:---|:---|
| `GET /api/campaigns` | `campaigns` | [campaigns.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/campaigns.supabase.js#L35) |
| `GET /api/campaigns/:id` | `campaigns` | [campaigns.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/campaigns.supabase.js#L136) |
| `POST /api/campaigns` | `campaigns` | [campaigns.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/campaigns.supabase.js#L348) |
| `PUT /api/campaigns/:id` | `campaigns` | [campaigns.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/campaigns.supabase.js#L388) |
| `DELETE /api/campaigns/:id` | `campaigns` | [campaigns.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/campaigns.supabase.js#L415) |
| `POST /api/qrs/:id/variants` | `ab_testing` | [variants.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/variants.supabase.js#L83) |
| `PUT /api/qrs/:id/variants/:variantId` | `ab_testing` | [variants.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/variants.supabase.js#L123) |
| `PUT /api/qrs/:id/variants` | `ab_testing` | [variants.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/variants.supabase.js#L168) |
| `DELETE /api/qrs/:id/variants/:variantId` | `ab_testing` | [variants.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/variants.supabase.js#L228) |
| `POST /api/qrs/:id/schedules` | `scheduling` | [schedules.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/schedules.supabase.js#L82) |
| `DELETE /api/qrs/:id/schedules/:scheduleId` | `scheduling` | [schedules.supabase.js](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/schedules.supabase.js#L124) |

**QR Limit Enforcement** (already existed in `qrs.supabase.js`):
- Checks current QR count before creation
- Compares against `plan.qr_limit`
- Returns 403 with descriptive error if limit reached

---

## 2. Frontend Changes

### A. Configuration Updates

Updated `client/src/utils/planPermissions.js`:

**Key Changes**:
- Starter `EXPORT_DATA`: `true` → **`false`** (CSV export is Pro-only)
- All feature flags now match backend `planManager.js` exactly
- Improved inline comments for clarity

### B. Page-Level Gating (Already Implemented)

| Page | Gating Logic | File |
|:---|:---|:---|
| Dashboard | Export CSV button disabled for Free/Starter | [Dashboard.jsx](file:///Users/naveen-4684/Desktop/SwitchQR/client/src/pages/Dashboard.jsx) |
| QR Details | Analytics widgets locked per plan | [QRDetails.jsx](file:///Users/naveen-4684/Desktop/SwitchQR/client/src/pages/QRDetails.jsx) |
| Campaigns | Full page lock for Free/Starter | [Campaigns.jsx](file:///Users/naveen-4684/Desktop/SwitchQR/client/src/pages/Campaigns.jsx) |
| Create QR | Scan Tracking & A/B Testing toggles locked | [CreateQR.jsx](file:///Users/naveen-4684/Desktop/SwitchQR/client/src/pages/CreateQR.jsx) |
| Global Analytics | Page lock (Free), widget locks (Starter) | [GlobalAnalytics.jsx](file:///Users/naveen-4684/Desktop/SwitchQR/client/src/pages/GlobalAnalytics.jsx) |
| Layout (Sidebar) | Lock icons on restricted links | [Layout.jsx](file:///Users/naveen-4684/Desktop/SwitchQR/client/src/components/Layout.jsx) |

---

## 3. Feature Matrix

| Feature | Free | Starter | Pro |
|:---|:---:|:---:|:---:|
| **Usage Limits** | | | |
| Active QR Codes | **3** | 100 | 1,000 |
| Total Scans | 500 | 100k | Unlimited |
| Link Updates | 10 | 500 | Unlimited |
| Analytics History | 7 days | 90 days | Unlimited |
| **Global** | | | |
| Analytics Access | ❌ | ✅ Basic | ✅ Advanced |
| Campaign Folders | ❌ | ❌ | ✅ |
| Export CSV Data | ❌ | ❌ | ✅ |
| **QR Details** | | | |
| Performance Charts | ❌ | ❌ | ✅ |
| Device Analytics | ❌ | ❌ | ✅ |
| Recent Scans Log | ❌ | ❌ | ✅ |
| Scheduled Redirects | ❌ | ✅ | ✅ |
| A/B Testing | ❌ | ❌ | ✅ |
| **Creation** | | | |
| Scan Tracking | ❌ | ✅ | ✅ |
| A/B Experiment | ❌ | ❌ | ✅ |
| **Advanced Widgets** | | | |
| Peak Time Analysis | ❌ | ❌ | ✅ |
| Location Analytics | ❌ | ❌ | ✅ |

---

## 4. Testing Recommendations

### Backend API Tests

> [!IMPORTANT]
> **Critical Testing Required**
> 
> Test these scenarios with users on each plan level:

**Test 1: Campaigns (Pro-only)**
```bash
# As Free user:
curl -H "Authorization: Bearer <FREE_TOKEN>" https://api.example.com/api/campaigns
# Expected: 403 Forbidden

# As Pro user:
curl -H "Authorization: Bearer <PRO_TOKEN>" https://api.example.com/api/campaigns
# Expected: 200 OK with campaigns array
```

**Test 2: A/B Testing (Pro-only)**
```bash
# As Starter user:
curl -X POST -H "Authorization: Bearer <STARTER_TOKEN>" \
  https://api.example.com/api/qrs/123/variants \
  -d '{"name":"Variant A","destination_url":"https://example.com","weight":50}'
# Expected: 403 Forbidden

# As Pro user:
curl -X POST -H "Authorization: Bearer <PRO_TOKEN>" \
  https://api.example.com/api/qrs/123/variants \
  -d '{"name":"Variant A","destination_url":"https://example.com","weight":50}'
# Expected: 201 Created
```

**Test 3: Scheduling (Starter+)**
```bash
# As Free user:
curl -X POST -H "Authorization: Bearer <FREE_TOKEN>" \
  https://api.example.com/api/qrs/123/schedules \
  -d '{"destination_url":"https://example.com","start_time":"2024-01-01T00:00:00Z"}'
# Expected: 403 Forbidden

# As Starter user:
curl -X POST -H "Authorization: Bearer <STARTER_TOKEN>" \
  https://api.example.com/api/qrs/123/schedules \
  -d '{"destination_url":"https://example.com","start_time":"2024-01-01T00:00:00Z"}'
# Expected: 201 Created
```

**Test 4: QR Limit (Free: 3, Starter: 100, Pro: 1000)**
```bash
# As Free user with 3 existing QRs:
curl -X POST -H "Authorization: Bearer <FREE_TOKEN>" \
  https://api.example.com/api/qrs \
  -d '{"destination_url":"https://example.com"}'
# Expected: 403 "QR Limit Reached (3/3)"
```

### Frontend UI Tests

**Test 1: Dashboard Export**
1. Log in as Free user
2. Navigate to Dashboard
3. Verify: Export CSV button is disabled with lock icon

**Test 2: Create QR Toggles**
1. Log in as Starter user
2. Navigate to Create QR
3. Verify:
   - ✅ Scan Tracking toggle is enabled
   - ❌ A/B Testing toggle shows lock and redirects to billing

**Test 3: Campaigns Access**
1. Log in as Free or Starter user
2. Click "Campaigns" in sidebar (should show lock icon)
3. Navigate to `/campaigns`
4. Verify: Full-page lock overlay is displayed

### D. Scan Limit Enforcement

Implemented enforcement to prevent Free/Starter users from exceeding their scan quotas.

**Backend Logic**:
- In `server/routes/redirect.js`, before redirecting, the system counts total scans for the QR code's owner across all their QRs.
- If the count exceeds `PLAN_CONFIG.scanLimits[planType]`, the user is redirected to a public "Scan Limit Reached" landing page.

**Frontend Landing Page**:
- Created `client/src/pages/ScanLimitReached.jsx` with a premium design.
- Includes "Powered by SwitchQR" branding and a call-to-action to create their own QR code.
- Added a public route in `App.jsx` for `/scan-limit-reached`.

---

## 5. Build Verification

✅ **Frontend Build**: Successfully compiled with no errors

```
✓ 424 modules transformed
✓ built in 2.15s
```

---

## Summary of Changes

### Files Created
- [`server/middleware/planEnforcement.js`](file:///Users/naveen-4684/Desktop/SwitchQR/server/middleware/planEnforcement.js)

### Files Modified
- [`server/utils/planManager.js`](file:///Users/naveen-4684/Desktop/SwitchQR/server/utils/planManager.js) - Corrected limits and features
- [`client/src/utils/planPermissions.js`](file:///Users/naveen-4684/Desktop/SwitchQR/client/src/utils/planPermissions.js) - Matched backend config
- [`server/routes/campaigns.supabase.js`](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/campaigns.supabase.js) - Added `requireFeature('campaigns')`
- [`server/routes/variants.supabase.js`](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/variants.supabase.js) - Added `requireFeature('ab_testing')`
- [`server/routes/schedules.supabase.js`](file:///Users/naveen-4684/Desktop/SwitchQR/server/routes/schedules.supabase.js) - Added `requireFeature('scheduling')`

### Key Corrections
1. Free QR limit: 5 → **3**
2. Starter CSV export: ✅ → **❌** (Pro-only)
3. Starter advanced analytics: ✅ → **❌** (Basic only)
