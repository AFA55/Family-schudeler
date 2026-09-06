# Pontifex Platform — Development Brief

**Date:** September 5, 2026
**Status:** Active Development
**Database:** Supabase (klatddoyncxidgqtcjnu) — 203 tables, 567 RLS policies, 74 triggers
**Repo:** AFA55/PontifexIndustriesSoftware (GitHub App installed, all repos access)

---

## Session Summary — What Was Done (Sep 5, 2026)

### Supabase Database — Deployed & Tested

| Deliverable | Status | Details |
|-------------|--------|---------|
| Crew assignment backfill | LIVE | 31 records created from 542 ghost timecard hours across 8 operators |
| Auto-crew trigger | LIVE | `trg_auto_crew_on_timecard` — any timecard clock-in auto-adds to crew roster |
| Will-call date trigger | LIVE | `trg_handle_will_call_date` — clears date on will-call, clears will-call on date set |
| Zack account merge | DONE | 212 records migrated from demo (zack@demopontifex.com) to real (zacharylamb94@gmail.com) |
| PM Job Hub view | LIVE | `pm_job_hub` — aggregates waiver status, crew count, hours, work items, missing logs per job |
| PM notification sender | LIVE | `send_pm_notification()` — preset types: sign_waiver, submit_daily_log, clock_in, complete_ticket |
| Kiosk clock-in function | LIVE | `kiosk_clock_in()` — accepts PIN or NFC tag, auto-detects clock-in vs clock-out |
| Shop PIN codes | LIVE | All 10 operators assigned PINs (1001-1010), `shop_pin` column + format constraint on profiles |
| Keon ticket analysis | DONE | NE Construction job: identified missing work_performed, completion sig, flagged timecard discrepancy |

### Artifacts Published

| Artifact | URL |
|----------|-----|
| Notification Hub | https://claude.ai/code/artifact/0e54840b-27aa-458f-9447-831ff8c3c395 |
| Executive Brief | https://claude.ai/code/artifact/15c7fe14-fc31-4507-88d9-c97b1c657619 |

### FamilySync — Complete Build

17 commits, 89 files, 30,667 lines, 184 tests passing. PR #1 created.
See EXECUTIVE_SUMMARY.md for full details.

---

## Current Sprint Backlog

### 1. Shop Clock-In Station — Software First, Hardware Later
**Priority:** HIGH — Key differentiator, nobody else has this

#### Strategy: Digital First, Hardware as Premium Add-On

**Phase 1 (NOW): Digital clock-in via the app.** Operators already have PINs (1001-1010). The `kiosk_clock_in()` backend function is built and tested. Just need the kiosk screen in the Pontifex mobile app. Zero hardware cost.

**Phase 2 (LATER): Physical kiosk as optional upgrade.** Mount a spare phone or cheap tablet by the shop door running the Pontifex app locked to the kiosk screen. This becomes a premium feature for customers — "Pontifex Kiosk" add-on.

#### Why NOT a Standalone Hardware Device

Researched every option on Amazon (NGTeco, uAttend, standalone keypad devices). The problem with all of them: **they run their own closed software with no API.** Data exports via USB/CSV only. You'd have timecards in two places and manually reconcile them. That defeats the purpose.

The only hardware that integrates directly is something running YOUR app — which means a phone/tablet.

#### Hardware Options (When Ready for Phase 2)

| Option | Cost | What It Is |
|--------|------|------------|
| **Spare old phone** | $0 + $25 wall mount | Mount by door, plug in, lock to kiosk screen |
| **Cheap Android tablet** | ~$130 + $25 mount | Samsung Galaxy Tab A9 or similar, wall mounted |
| **Tablet + NFC tags** | ~$170 total | Same tablet + NTAG215 keyfobs ($2 each) — operators tap to clock in |
| **ESP32 DIY keypad** | ~$30 parts | Custom firmware needed — weeks of embedded dev, not worth it now |

**Recommendation:** Use a spare phone for now ($0). Order a Samsung Galaxy Tab A9 when you want the polished kiosk experience. NFC tags are a future upgrade on top of that.

#### For Customers (Future Revenue Opportunity)

The kiosk hardware becomes a product offering:
- **Pontifex Kiosk Kit:** tablet + wall mount + NFC tags, pre-configured with your software
- Sell it as an add-on to your software subscription
- Neither DSM nor CenPoint offer anything like this

#### Database Status
- `kiosk_clock_in(pin, tenant_id, nfc_tag_uid)` — LIVE, tested, works
- `shop_pin` on profiles — LIVE, all 10 operators assigned (1001-1010)
- `nfc_tags` table — EXISTS, 1 test tag registered

#### What to Build (Frontend — in Pontifex repo)
- Kiosk screen: full-screen PIN entry pad, large "CLOCK IN" / "CLOCK OUT" buttons
- Show operator name + timestamp on success
- Show last 5 clock-ins as confirmation feed
- Lock tablet to this screen (Android kiosk mode / guided access)

### 2. Project Manager Job Hub
**Priority:** HIGH — PM dashboard for job oversight

#### Database Status
- `pm_job_hub` view — LIVE, returns all job data with waiver_status, crew_count, hours, work items
- `send_pm_notification()` — LIVE, tested, sends preset notifications to operators
- `project_manager_id` on job_orders — EXISTS but null on all current jobs

#### What to Build (Frontend — in Pontifex repo)
- PM Dashboard screen showing only jobs assigned to this PM
- Each job card shows:
  - Job number, customer, date, status badge
  - Waiver status: green check (signed) / red alert (overdue) / yellow (pending)
  - Crew members assigned
  - Hours logged / work items completed
  - Missing daily logs count
- Quick-action buttons per job:
  - "Send Waiver Reminder" → calls `send_pm_notification(pm_id, operator_id, job_id, msg, 'sign_waiver')`
  - "Remind to Log Work" → same with 'submit_daily_log'
  - "Send Clock-In Reminder" → same with 'clock_in'
  - Custom message composer
- Filter: active / completed / will-call / on-hold / overdue waivers
- Assign PM to jobs (update `project_manager_id`)

### 3. Bug Fixes (Pontifex Mobile)
**Priority:** HIGH — User-facing issues

- [ ] **View Ticket opens browser** — Map `action_url` web paths to mobile routes instead of `Linking.openURL()`
- [ ] **Face ID triggers 3x** — Add `useRef` guard so biometric auth only attempts once per mount
- [ ] **Password remember broken** — Add `textContentType="password"` (iOS) and `autoComplete="password"` (Android) to login inputs
- [ ] **Will-call form validation** — Skip date requirement when `is_will_call` is checked (DB trigger is ready)

### 4. Work Performed Workflow
**Priority:** MEDIUM — Return to after PM hub

Current state: Operators log work items but compliance is inconsistent. Need to analyze:
- What additional fields operators need to fill in
- Whether to require photos before completion
- Auto-populating work type from job scope
- Requiring accessibility rating before first work item

### 5. Invoicing Pipeline
**Priority:** HIGH — #1 competitive gap vs DSM and CenPoint

What exists in DB:
- `invoices` table (1 record), `invoice_line_items` (1 record), `payments` (0 records)
- Job orders have: `billing_status`, `billing_type`, `total_revenue`, `labor_cost`, `total_cost`, `gross_profit`

What to build:
- Generate invoice from completed job (auto-populate from work_items)
- PDF generation with company branding
- Email invoice to customer
- Payment tracking (mark paid, partial, overdue)
- QuickBooks integration (future phase)

### 6. Reporting & Exports
**Priority:** MEDIUM

- Weekly timecard report (admin export to PDF/CSV)
- Printable job ticket with full crew list
- Profitability dashboard (labor + materials + equipment vs quote)
- Monthly revenue summary

---

## Competitive Analysis: Pontifex vs DSM vs CenPoint

### Where Pontifex Already Wins
- **Mobile-first** — DSM (est. 1993) and CenPoint are Windows desktop apps with mobile add-ons
- **74 automation triggers** — competitors require manual data entry for everything
- **Safety compliance built-in** — escalating waiver reminders (due → follow-up → overdue), silica plans
- **567 RLS policies** — modern row-level security; competitors have none
- **Multi-tenant** — can serve multiple companies; competitors are single-tenant
- **Auto crew assignment** — nobody else does this
- **Cloud-native** — no installation, works from any device
- **Shop kiosk clock-in** (PIN + NFC) — nobody else has this

### Where CenPoint Beats Us (for now)
- AI Scheduler — CenPoint has it, we should build it better
- Certified Payroll — CenPoint supports it
- Invoicing + QuickBooks — both competitors have full invoicing

### CenPoint's Known Weaknesses (opportunity)
- Mobile app rated 3.36/5 on App Store
- "In the field the app is useless unless you have FULL signal"
- "Offline mode never works"
- "Haven't had a correct paycheck since" implementation
- Windows-first architecture

### DSM's Known Weaknesses
- Been around since 1993 — legacy Windows architecture
- Mobile is a bolt-on, not native
- No NFC, no GPS clock-in verification
- No automated safety compliance

---

## Operator PIN Directory

| PIN | Operator | Role |
|-----|----------|------|
| 1001 | Keontre Mcknight | Operator |
| 1002 | Conrade Richardson | Operator |
| 1003 | Dante Burgess | Operator |
| 1004 | Zachary Lamb | Operator |
| 1005 | Aiden | Operator |
| 1006 | Axel Valverde | Apprentice |
| 1007 | Devin Scroggs | Operator |
| 1008 | Micah Rentz | Apprentice |
| 1009 | Javier Muniz Rodriguez | Apprentice |
| 1010 | Lucas Duffey | Apprentice |

---

## Database Functions Reference

| Function | Purpose | Status |
|----------|---------|--------|
| `kiosk_clock_in(pin, tenant_id, nfc_tag_uid)` | PIN/NFC clock-in/out from shop tablet | LIVE |
| `send_pm_notification(sender_id, recipient_id, job_id, message, type)` | PM sends notification to operator | LIVE |
| `auto_add_crew_on_timecard()` | Trigger: auto-adds crew on timecard clock-in | LIVE |
| `handle_will_call_date()` | Trigger: manages date ↔ will-call state | LIVE |
| `auto_color_code_job()` | Trigger: sets schedule color by category | LIVE |
| `calculate_job_durations()` | Trigger: computes drive/production/total time | LIVE |

## Database Views

| View | Purpose | Status |
|------|---------|--------|
| `pm_job_hub` | PM dashboard: jobs + waiver status + crew + hours + missing logs | LIVE |

---

## Next Session — Exact Task List

**Repo:** `AFA55/PontifexIndustriesSoftware` (private, TypeScript, React Native + Supabase)
**Supabase Project:** `klatddoyncxidgqtcjnu` (pontifex-platform)
**Tenant ID:** `ee3d8081-cec2-47f3-ac23-bdc0bb2d142d`

### TASK 1: Build Kiosk Clock-In Screen
**Files to create/edit in Pontifex repo**

Build a new screen in the mobile app for shop kiosk mode:
- Full-screen PIN entry keypad (large buttons, 0-9 + clear + enter)
- Shows "Enter Your PIN" prompt
- On valid PIN → calls Supabase RPC `kiosk_clock_in(pin, tenant_id, null)`
- Shows result: operator name + "CLOCKED IN" or "CLOCKED OUT" with timestamp
- Green flash for clock-in, red flash for clock-out
- Show last 5 clock-in/out events as a feed below the keypad
- Auto-clear display after 5 seconds, ready for next operator
- No navigation bar — this screen runs standalone on a shop device

Backend is DONE: `kiosk_clock_in()` is live and tested in Supabase.

### TASK 2: Build PM Job Hub Dashboard
**Files to create/edit in Pontifex repo**

Build a Project Manager dashboard screen:
- Query: `SELECT * FROM pm_job_hub WHERE project_manager_id = current_user_id OR project_manager_id IS NULL`
- Each job card shows: job_number, customer_name, status badge, scheduled_date
- Waiver indicator: green check (signed), red alert (overdue), yellow dot (pending), gray (not required)
- Crew count badge, total hours, work items count, missing daily logs count
- Quick-action buttons per job:
  - "Waiver Reminder" → `send_pm_notification(pm_id, assigned_to, job_id, message, 'sign_waiver')`
  - "Log Work" → same with type `'submit_daily_log'`
  - "Clock In" → same with type `'clock_in'`
  - Custom message → free text input
- Filter tabs: All / Active / Overdue Waivers / Will-Call / On Hold
- Tap job → navigate to existing job detail screen

Backend is DONE: `pm_job_hub` view and `send_pm_notification()` are live in Supabase.

### TASK 3: Fix 4 Mobile Bugs

**Bug 3a: View Ticket opens browser**
- Find where `Linking.openURL()` or `WebBrowser.openBrowserAsync()` is called for job/notification navigation
- Replace with in-app navigation using the router: map `/dashboard/my-jobs/:id` → the mobile job detail screen
- Check notification tap handlers — the `action_url` field contains web paths that need mapping

**Bug 3b: Face ID triggers 3 times**
- Find the biometric authentication `useEffect`
- Add a `useRef` guard: `const biometricAttempted = useRef(false)` → check and set before authenticating
- Ensure the effect dependency array is empty `[]`

**Bug 3c: Password remember broken**
- Find the login screen's TextInput components
- Add to email input: `textContentType="emailAddress"` (iOS), `autoComplete="email"` (Android)
- Add to password input: `textContentType="password"` (iOS), `autoComplete="password"` (Android), ensure `secureTextEntry={true}`

**Bug 3d: Will-call form validation**
- Find the job creation/edit form
- When `is_will_call` is toggled on, skip the `scheduled_date` required validation
- The database trigger `trg_handle_will_call_date` already handles clearing the date server-side

### TASK 4: Invoicing Pipeline (Database + Frontend)

**Supabase backend to build:**
- RPC function `generate_invoice_from_job(job_order_id)` that:
  - Pulls work_items for the job
  - Creates invoice record with auto-generated invoice number
  - Creates invoice_line_items from work_items (description, quantity, unit_price, total)
  - Updates job_orders.billing_status to 'invoiced'
  - Returns the invoice data

**Frontend to build:**
- Invoice generation button on completed jobs
- Invoice detail screen showing line items, totals, customer info
- PDF export (use a React Native PDF library or generate server-side)
- Email invoice to customer_email on job_orders
- Invoice list screen for admin with status filters (unbilled, invoiced, paid, overdue)

### TASK 5: Printable Job Ticket
- Create a formatted view/PDF of a job ticket that includes:
  - Job number, customer, location, dates
  - Full crew list (from `job_crew_assignments`, not just `assigned_to`)
  - Work performed items with quantities
  - Hours worked per crew member
  - Signatures (waiver, completion)
  - This is what gets printed — the ticket that currently "doesn't tell you anything"

### TASK 6: Work Performed Workflow (Analyze First)
- Review the current operator workflow for logging work_items
- Identify what fields are being skipped
- Determine if we need: required photos, auto-populated work types from job scope, mandatory accessibility ratings
- Document findings before changing the flow

---

## Supabase Connection Details

**Project URL:** https://klatddoyncxidgqtcjnu.supabase.co
**Tenant ID:** ee3d8081-cec2-47f3-ac23-bdc0bb2d142d

### Live Functions (ready to call from frontend)
```sql
-- Clock in/out from kiosk
SELECT kiosk_clock_in('1001', 'ee3d8081-cec2-47f3-ac23-bdc0bb2d142d', NULL);

-- PM sends notification to operator
SELECT send_pm_notification(
  sender_uuid,      -- PM's user ID
  recipient_uuid,   -- operator's user ID  
  job_order_uuid,   -- job order ID
  'Your message',   -- message text
  'sign_waiver'     -- type: sign_waiver | submit_daily_log | clock_in | complete_ticket
);
```

### Live Views
```sql
-- PM dashboard data
SELECT * FROM pm_job_hub WHERE status NOT IN ('completed', 'cancelled', 'archived');
```

### Operator PINs (for kiosk testing)
1001=Keontre, 1002=Conrade, 1003=Dante, 1004=Zachary, 1005=Aiden,
1006=Axel, 1007=Devin, 1008=Micah, 1009=Javier, 1010=Lucas

---

## Also Completed This Session (FamilySync)

**Repo:** AFA55/Family-schudeler
**Branch:** claude/analyze-executive-summary-pGycz
**PR:** https://github.com/AFA55/Family-schudeler/pull/1

Built the entire FamilySync app from Executive Summary:
- 20 commits, 89+ files, 30,667+ lines
- 35 API routes, 22 mobile screens, 184 tests passing
- Production build verified (Next.js 15.3.3)
- All 5 priorities (P1-P5) complete
- Seed data: 6 charities, 40 activities across 5 launch cities

### FamilySync — Still Needs
- Push Prisma schema to Neon database (run `./scripts/setup.sh` locally)
- Deploy to Vercel
- Configure Stripe test keys
- EAS Build for TestFlight / Google Play Internal
- Choose brand name (BundleCal vs KithCal)
