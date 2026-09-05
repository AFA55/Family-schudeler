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

### 1. Shop Clock-In Station — Hardware + Software
**Priority:** HIGH — Key differentiator, nobody else has this

#### Hardware Recommendation (Order from Amazon)

**RECOMMENDED: Option A — Android Tablet + Kiosk Mode ($120-180 total)**

Buy a basic Android tablet, mount it by the shop door, run Pontifex in kiosk mode. Operators enter their 4-digit PIN to clock in/out. This is the fastest path — software is already built.

Suggested hardware:
- **Tablet:** Samsung Galaxy Tab A9 (~$130) or Lenovo Tab M10 (~$150) — both have WiFi, decent screens, long battery or plug in
- **Wall mount:** AboveTEK tablet wall mount (~$25) or PADHOLDR tablet holder
- **Power:** USB-C cable + wall plug (keep it plugged in 24/7)
- **Total: ~$155-175**

The `kiosk_clock_in()` function is already built and tested in Supabase. The kiosk screen in the app just needs to call this function.

**ALTERNATIVE: Option B — Dedicated Time Clock Device ($80-200)**

Standalone devices with PIN + fingerprint + RFID. The problem: these run their own proprietary software and export data via USB/CSV. They DON'T integrate with Pontifex directly — you'd need a manual data sync process.

Products:
- NGTeco W3 WiFi Fingerprint Clock (~$90) — has WiFi but no open API
- uAttend BN6500 (~$200) — cloud-based but requires uAttend subscription ($20/mo)

**NOT recommended** because of the integration gap. Option A gives you native integration for less money.

**FUTURE: Option C — NFC Tags + Tablet ($175-200 total)**

Same tablet as Option A, but add NFC tags (~$2 each) assigned to each operator. They tap their tag on the tablet instead of entering a PIN. More like a "badge scan" experience.

Hardware:
- Same tablet as Option A
- NTAG215 NFC tags/keyfobs (25-pack ~$15 on Amazon)
- The `nfc_tags` table and `kiosk_clock_in()` NFC path are already built

This requires the tablet to have NFC (Samsung Tab A9 does, Lenovo Tab M10 does NOT). Check specs before ordering.

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

## Next Session Planning

### Immediate (requires Pontifex repo access)
1. Build Kiosk Clock-In screen (PIN pad UI)
2. Build PM Job Hub dashboard screen
3. Fix 4 mobile bugs (view ticket, Face ID, password, will-call form)

### Short-term (1-2 weeks)
4. Invoice generation flow + PDF
5. Printable job ticket with crew list
6. Offline mode with queued sync

### Medium-term (2-4 weeks)
7. AI scheduling (operator skills + equipment + drive distance optimization)
8. Customer portal (GCs view job status, sign waivers remotely)
9. QuickBooks integration
10. Weekly timecard report exports
