# Pontifex Platform — Development Brief

**Date:** September 5, 2026
**Status:** Active Development
**Database:** Supabase (klatddoyncxidgqtcjnu) — 203 tables, 567 RLS policies, 74 triggers

---

## Current Sprint Backlog

### 1. Shop Clock-In Station (NFC + PIN Pad)
**Priority:** HIGH — Key differentiator, solves clock-in compliance

**What exists:**
- `nfc_tags` table with 1 test tag (PCC-NFC-001, tag_uid: 04:EF:E2:35:C9:2A:81)
- Timecard fields: `nfc_tag_id`, `nfc_tag_uid`, `nfc_tag_serial`, `nfc_clock_in`, `nfc_clock_out`
- Clock-in methods tracked: gps (348), field (40), remote (32), manual (12)
- Zero NFC clock-ins recorded yet

**What to build:**
- **Option A: NFC Tap Station** — Mount a cheap Android tablet by the shop door running the Pontifex app in "kiosk mode." Operators tap their phone (NFC) or a physical NFC tag assigned to them to clock in/out. Cost: ~$100 tablet + NFC tags (~$2 each).
- **Option B: PIN Pad Mode** — Same tablet, but operators enter a personal 4-6 digit PIN code instead of NFC. Simpler, no hardware beyond the tablet.
- **Option C: Both** — NFC primary, PIN as fallback (recommended).

**Implementation:**
- Build a "Shop Kiosk" screen in the mobile app (full-screen, locked to clock-in mode)
- NFC scan triggers clock-in via existing timecard API
- PIN entry as fallback — each operator gets a unique PIN stored in profiles
- Show last 5 clock-ins on the kiosk screen as confirmation
- Auto clock-out reminder at configurable time (e.g., 7 PM)

### 2. Project Manager Job Hub
**Priority:** HIGH — Clean PM dashboard for job oversight

**What exists:**
- `project_manager_id` field on job_orders (exists but underused)
- Utility waiver fields: `utility_waiver_signed`, `utility_waiver_signer_name`, `utility_waiver_signature_data`, `utility_waiver_signed_at`
- Escalating waiver notifications already working (due → follow-up → overdue)
- 1,960 notifications in the system

**What to build:**
- **PM Dashboard screen** showing only jobs assigned to this PM
- Clear visual status for each job: waiver signed (green check) / unsigned (red alert), completion status, crew assigned
- **One-tap notification button** — PM can send push notification to operator with preset messages ("Sign the waiver", "Submit your daily log", "Clock in now")
- **Manual notification composer** — free-text message to any operator on their crew
- Filter by: active / completed / will-call / on-hold
- Sort by: date, customer, status, waiver status

### 3. Bug Fixes (Pontifex Mobile)
**Priority:** HIGH — User-facing issues

- [ ] **View Ticket opens browser** — Map `action_url` web paths to mobile routes
- [ ] **Face ID triggers 3x** — Add `useRef` guard on biometric auth
- [ ] **Password remember broken** — Add `textContentType` + `autoComplete` props to login inputs
- [ ] **Will-call form validation** — Skip date requirement when `is_will_call` checked

### 4. Work Performed Workflow Improvements
**Priority:** MEDIUM — Come back to this after PM hub

**Current state:** Operators log work items (type, quantity, depth, etc.) but compliance is inconsistent.

**To analyze later:**
- What additional fields do operators need to fill in?
- Should we require photos before allowing completion?
- Auto-populate work type from job scope?
- Require accessibility rating before first work item?

### 5. Invoicing Pipeline
**Priority:** HIGH — #1 gap vs DSM and CenPoint

**What exists:**
- `invoices` table (1 record), `invoice_line_items` (1 record), `payments` (0 records)
- Job orders have: `billing_status`, `billing_type`, `total_revenue`, `invoice_number`, `invoiced_at`, `paid_at`, `labor_cost`, `material_cost`, `equipment_cost`, `total_cost`, `gross_profit`

**What to build:**
- Generate invoice from completed job (auto-populate line items from work_items)
- PDF invoice generation with company branding
- Email invoice to customer
- Payment tracking (mark paid, partial, overdue)
- QuickBooks integration (future)

### 6. Reporting & Exports
**Priority:** MEDIUM — Needed for business operations

- Weekly timecard report (admin export)
- Printable job ticket with full crew list
- Profitability dashboard (labor + materials + equipment = cost vs quote)
- Monthly revenue summary

---

## Competitive Position vs DSM & CenPoint

### Already Winning
- Mobile-first (they're Windows desktop with mobile add-ons)
- 74 automation triggers (they require manual everything)
- Safety compliance automation (escalating waiver reminders)
- Cloud-native with 567 RLS policies (they have no row-level security)
- Multi-tenant architecture (they're single-tenant)
- Auto crew assignment from timecards

### Gaps to Close
- Invoicing + QuickBooks (both competitors have this)
- Offline mode with queued sync (CenPoint's is broken — opportunity)
- AI scheduling (CenPoint has it, we can build it better)
- Printable reports and exports
- Certified payroll (CenPoint has this)

### Differentiators to Build
- NFC/PIN shop clock-in station (nobody has this)
- Customer portal (let GCs see job status, sign waivers remotely)
- Photo AI (auto-detect work type from job site photos)
- Profitability dashboard with real-time job costing

---

## Session History (Sep 5, 2026)

### Pontifex Fixes Applied
1. Backfilled 31 crew assignments from 542 ghost timecard hours
2. Created `trg_auto_crew_on_timecard` trigger (auto-adds crew on clock-in)
3. Created `trg_handle_will_call_date` trigger (auto-clears dates on will-call)
4. Merged Zack's demo account → real account (212 records migrated)
5. Analyzed Keon's NE Construction ticket (identified missing data)
6. Built Notification Hub artifact
7. Built Executive Brief artifact

### FamilySync Built (Complete)
- All 5 priorities (P1-P5) from Executive Summary
- 17 commits, 89 files, 30,667 lines, 184 tests passing
- PR #1 created for review
