# FamilySync - Development Guide

## Project Overview
FamilySync is a family scheduling and activity planning app. Mobile-first (React Native/Expo) with a Next.js web landing page and API backend. All 5 development priorities are implemented and tested.

## Architecture
- **Monorepo** with npm workspaces
- `apps/mobile` - Expo/React Native mobile app (iOS + Android) — 22 screens
- `apps/web` - Next.js 15.3.3 App Router — 35 API routes, landing page, legal pages
- `packages/database` - Prisma ORM + Neon Postgres schema (20 models)
- `packages/shared` - Shared types, constants, validation (Zod)

## Tech Stack
- **Mobile:** React Native + Expo Router + Zustand (state) + SSE real-time
- **Web:** Next.js 15.3.3 App Router + Tailwind CSS (React 19)
- **Database:** Neon Postgres + Prisma ORM
- **Auth:** NextAuth.js (credentials + JWT)
- **Payments:** Stripe (subscriptions + 14-day trial)
- **Real-time:** Server-Sent Events (chat, calendar, notifications)
- **UI:** Custom component library (ErrorBoundary, LoadingSkeleton, RetryView, EmptyState)

## Key Commands
```bash
npm run dev:web      # Start Next.js dev server (localhost:3000)
npm run dev:mobile   # Start Expo dev server
npm run build:web    # Production build (verified passing)
npm test             # Run 184 tests (115 web + 69 mobile)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed charities + activities
./scripts/setup.sh   # One-command full setup
```

## API Routes (35 total)
- **Auth:** signup, [...nextauth]
- **Events:** CRUD + RSVP + SSE stream
- **Families:** CRUD + members + join via invite code
- **Chat:** rooms CRUD + messages (cursor pagination) + AI assistant
- **Notifications:** CRUD + mark read + SSE stream
- **Onboarding:** get/submit
- **Stripe:** checkout, portal, subscription, webhook
- **Discover:** feed (filtered/paginated) + trending + submit content
- **Affiliate:** link tracking + click logging
- **Creators:** CRUD + onboard + content linking
- **Recommendations:** filtered feed + view/click tracking

## Mobile Screens (22)
- Auth: welcome, signin, signup
- Onboarding: interests, goals, activities, location, charity, complete
- Tabs: calendar, discover, family, chat (with AI), profile
- Event: create, detail/RSVP
- All screens use LoadingSkeleton, RetryView, EmptyState components

## Color Palette
- Primary: Indigo (#6366F1)
- Secondary: Coral (#FF6B6B)
- Accent: Amber (#F59E0B)
- Background: Warm white (#FEFDFB)

## Business Model
- 87% of PROFIT donated to family charities worldwide
- Free ($0), Plus ($4.99/mo), Premium ($7.99/mo)
- 14-day free trial on paid plans
- Affiliate commissions: Amazon (4-5%), Viator (8-12%), GetYourGuide, Groupon (4-12%)

## Testing
- **Web API tests:** 115 tests across 8 suites (auth, events, families, chat, notifications, onboarding, discover, stripe) — mocked Prisma, no real DB needed
- **Mobile tests:** 69 tests across 4 suites (authStore, familyStore, onboardingStore, API client)
- **Quality:** ErrorBoundary wraps root layout, API client retries 3x on 5xx with exponential backoff

## Related Docs
- `EXECUTIVE_SUMMARY.md` — Full task briefing with implementation status
- `DEVELOPMENT_BRIEF.md` — Pontifex platform backlog + competitive analysis
- `BRANDING_REPORT.md` — Brand name research (BundleCal vs KithCal)
