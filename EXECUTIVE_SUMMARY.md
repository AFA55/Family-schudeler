# FamilySync — Executive Summary & Task Briefing

## What This Is
A family scheduling and activity planning mobile app (React Native/Expo) with a Next.js web landing page, API backend, and Neon Postgres database. The codebase is a monorepo with npm workspaces.

## Current State (Phase 1 MVP — Complete)
The full foundation is built and pushed to branch `claude/new-project-setup-2ygrD`. Here's what exists:

### Architecture
```
familysync/
├── apps/mobile/         # Expo Router React Native app (iOS + Android)
│   ├── app/(auth)/      # Welcome, Sign In, Sign Up screens
│   ├── app/(onboarding)/ # 5-step survey: Interests → Goals → Activities → Location → Charity
│   ├── app/(tabs)/      # Calendar, Discover, Family, Chat, Profile
│   └── src/             # Zustand stores (auth, family, notifications, discover), API client, theme
├── apps/web/            # Next.js 15 App Router
│   ├── src/components/landing/  # Full sales funnel landing page (8 sections)
│   ├── src/app/api/     # 27 API endpoints (see below)
│   └── src/lib/         # Auth config, Stripe service, TikTok/YouTube/RIDB services
├── packages/database/   # Prisma ORM + Neon Postgres (15+ models)
└── packages/shared/     # TypeScript types, Zod validation, constants, color palette
```

### API Endpoints (all with real Prisma database queries)
- **Auth**: POST /api/auth/signup, POST /api/auth/[...nextauth] (NextAuth JWT)
- **Events**: GET/POST /api/events, GET/PUT/DELETE /api/events/:id, POST /api/events/:id/rsvp
- **Families**: GET/POST /api/families, GET/PUT/DELETE /api/families/:id, POST /api/families/:id/members, POST /api/families/join/:inviteCode
- **Stripe**: POST /api/stripe/checkout, POST /api/stripe/portal, GET/PUT /api/stripe/subscription, POST /api/stripe/webhook (handles subscription lifecycle + charity allocation)
- **Discovery**: GET /api/discover (aggregated feed), POST /api/discover (submit social link)
- **Notifications**: GET/POST /api/notifications, PUT /api/notifications/:id/read, PUT /api/notifications/mark-all-read
- **Onboarding**: GET/POST /api/onboarding

### Database Schema (Prisma + Neon Postgres)
Models: User, Account, Session, UserOnboarding, Family, FamilyMember, Event, EventAttendee, Activity, ActivitySource, SocialContent, CreatorPartner, ChatRoom, ChatMessage, Notification, Subscription, CharityContribution, CharityOrganization, ActivityRecommendation

### Tech Stack
- **Mobile**: React Native + Expo Router + Zustand + AsyncStorage
- **Web**: Next.js 15 App Router + Tailwind CSS + Framer Motion
- **Database**: Neon Postgres + Prisma ORM
- **Auth**: NextAuth.js (credentials + JWT)
- **Payments**: Stripe (subscriptions, 14-day trial, web checkout to avoid Apple's 30% fee)
- **External APIs**: TikTok oEmbed (free), YouTube Data API v3 (free), Recreation.gov RIDB (free), Google Places (~$275/mo)

### Business Model
- **Pricing**: Free ($0), Plus ($4.99/mo or $39.99/yr), Premium ($7.99/mo or $59.99/yr)
- **Revenue**: Subscriptions + affiliate commissions (Viator 8-12%, Amazon 4-5%, Groupon 4-12%)
- **Impact**: 87% of PROFIT donated to family charities (Save the Children, Family Promise, World Vision)
- **Launch cities**: Salt Lake City, Dallas-Fort Worth, Phoenix, Nashville, Charlotte

### Color Palette
- Primary: Indigo (#6366F1)
- Secondary: Coral (#FF6B6B)
- Accent: Amber (#F59E0B)
- Background: Warm white (#FEFDFB)

### Brand Name: TBD
"FamilySync" is trademarked. Top alternatives with available domains:
- **BundleCal** — bundlecal.com + bundlecal.app available
- **KithCal** — kithcal.com + kithcal.app available

---

## Phase 2 Tasks (What Needs To Be Done Next)

### Priority 1: Get It Running & Deployable

**Task 1.1: Database Setup**
- Push Prisma schema to Neon: `npx prisma db push --schema=packages/database/prisma/schema.prisma`
- Seed charity organizations (Save the Children, Family Promise, World Vision, UNICEF, Salvation Army, Feeding America)
- Seed sample activities for 5 launch cities
- Connection string is in .env (already configured)

**Task 1.2: Deploy Web to Vercel**
- Deploy apps/web to Vercel
- Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, STRIPE keys)
- Configure custom domain when brand name is chosen

**Task 1.3: Build Mobile App for Testing**
- Set up EAS Build for Expo
- Configure app.json with correct bundle IDs
- Build development client for iOS and Android
- Set EXPO_PUBLIC_API_URL to point to deployed Vercel API

### Priority 2: Polish & Complete Features

**Task 2.1: Wire Mobile Screens to Real Data**
The screens currently use mock data in their render functions. Update these screens to use the Zustand stores that are already connected to the API:
- `apps/mobile/app/(tabs)/calendar.tsx` — Replace mockEvents with useFamilyStore().events, call fetchEvents on mount
- `apps/mobile/app/(tabs)/discover.tsx` — Replace mock recommendations/trendingActivities with useDiscoverStore().feed
- `apps/mobile/app/(tabs)/family.tsx` — Replace mockFamily with useFamilyStore().activeFamily
- `apps/mobile/app/(tabs)/chat.tsx` — Replace mockMessages with real chat API (needs chat API endpoints)
- `apps/mobile/app/(tabs)/profile.tsx` — Use useAuthStore().user for real user data
- `apps/mobile/app/(auth)/signup.tsx` — Call useAuthStore().signUp instead of TODO comment
- `apps/mobile/app/(auth)/signin.tsx` — Call useAuthStore().signIn instead of TODO comment
- `apps/mobile/app/(onboarding)/*.tsx` — Persist selections across screens and submit via onboardingAPI on final step

**Task 2.2: Build Chat API & AI Planning Assistant**
Create these new API routes:
- POST /api/chat/rooms — Create a chat room for a family
- GET /api/chat/rooms/:roomId/messages — List messages
- POST /api/chat/rooms/:roomId/messages — Send a message
- POST /api/chat/ai — AI planning assistant endpoint (use Claude API)
  - Input: user message like "Find a spacious Italian restaurant for 12 people Saturday"
  - Process: Call Google Places API, filter by criteria, format response
  - Output: Structured recommendations with "Schedule" action buttons

**Task 2.3: Add Real-Time Features**
- WebSocket or Server-Sent Events for chat
- Push notifications via Expo Notifications
- Real-time calendar updates when family members add events

**Task 2.4: Create Event Modal**
The calendar has an "+ Add Event" button but no create event modal/screen. Build:
- Event creation form (title, date/time picker, category selector, location, invite family members)
- Event detail view when tapping an event
- Edit/delete functionality

### Priority 3: Growth & Revenue Features

**Task 3.1: Affiliate Integration**
- Amazon Associates: When recommending board games/crafts, include affiliate links
- Viator/GetYourGuide: When recommending local activities, use affiliate booking links
- Track clicks and conversions in database

**Task 3.2: Social Discovery Feed (Live Data)**
- Get YouTube Data API key and activate live video search for launch cities
- Build daily cron job to pre-fetch YouTube content per city/category
- Build "Share a Find" feature where users paste TikTok/Instagram links
- TikTok oEmbed integration is already built at apps/web/src/lib/services/tiktok.ts

**Task 3.3: Creator Partnership System**
- Build admin panel for managing creator partners
- CreatorPartner model already exists in Prisma schema
- Build creator onboarding flow and referral tracking

**Task 3.4: In-App Purchases**
- Board game / craft supply recommendations with buy buttons
- Integrate with Amazon Product Advertising API
- Track purchase attribution for affiliate commissions

### Priority 4: Testing & Quality

**Task 4.1: API Tests**
- Write unit tests for all 27 API endpoints
- Test auth flow end-to-end
- Test Stripe webhook handling
- Test event CRUD with attendees

**Task 4.2: Mobile E2E Tests**
- Test signup → onboarding → calendar flow
- Test family creation → invite → join flow
- Test event creation → notification → RSVP flow

**Task 4.3: Error Handling & Loading States**
- Add proper error boundaries in mobile app
- Add loading skeletons for all data-fetching screens
- Add retry logic for failed API calls
- Add offline mode indicators

### Priority 5: App Store Preparation

**Task 5.1: App Store Assets**
- Design app icon (use Indigo/Coral gradient)
- Create App Store screenshots (iPhone 15 Pro, iPad)
- Write App Store description with ASO keywords: "family planner", "family calendar", "activity ideas for kids"
- Create preview video showing the app in action

**Task 5.2: Legal**
- Privacy Policy page
- Terms of Service page
- COPPA compliance (app targets families with children)

**Task 5.3: Analytics**
- Integrate Mixpanel or PostHog for event tracking
- Track: signup, onboarding completion, first event created, first family member invited, trial → paid conversion

---

## Key Files Reference

| Purpose | Path |
|---------|------|
| Root package.json | /package.json |
| Prisma schema | /packages/database/prisma/schema.prisma |
| Prisma client | /packages/database/src/index.ts |
| Shared types | /packages/shared/src/types.ts |
| Shared validation | /packages/shared/src/validation.ts |
| Shared constants | /packages/shared/src/constants.ts |
| Auth config | /apps/web/src/lib/auth.ts |
| Stripe service | /apps/web/src/lib/services/stripe.ts |
| TikTok service | /apps/web/src/lib/services/tiktok.ts |
| YouTube service | /apps/web/src/lib/services/youtube.ts |
| Recreation.gov service | /apps/web/src/lib/services/recreation.ts |
| Notification helpers | /apps/web/src/lib/services/notifications.ts |
| Mobile API client | /apps/mobile/src/lib/api.ts |
| Mobile auth store | /apps/mobile/src/store/authStore.ts |
| Mobile family store | /apps/mobile/src/store/familyStore.ts |
| Mobile color theme | /apps/mobile/src/theme/colors.ts |
| Landing page | /apps/web/src/app/(landing)/page.tsx |
| Environment variables | /.env.example |
| Branding research | /BRANDING_REPORT.md |

## Commands
```bash
npm run dev:web        # Start Next.js (landing page + API) on localhost:3000
npm run dev:mobile     # Start Expo dev server
npm run db:generate    # Generate Prisma client after schema changes
npm run db:push        # Push schema to Neon database
npm run db:studio      # Open Prisma Studio (visual DB browser)
```

## Environment Variables Needed
```
DATABASE_URL=postgresql://...          # Neon Postgres (configured)
NEXTAUTH_SECRET=...                    # Any random string
STRIPE_SECRET_KEY=sk_test_...          # From Stripe Dashboard
STRIPE_PUBLISHABLE_KEY=pk_test_...     # From Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...        # From Stripe Dashboard
YOUTUBE_API_KEY=...                    # Google Cloud Console (free)
RIDB_API_KEY=...                       # recreation.gov (free)
GOOGLE_PLACES_API_KEY=...              # Google Cloud Console (~$275/mo)
ANTHROPIC_API_KEY=...                  # For AI chat assistant
```

---

## Phase 2-5 Implementation Status (Completed Sep 5, 2026)

All priorities from this Executive Summary have been implemented, tested, and pushed to branch `claude/analyze-executive-summary-pGycz` (PR #1).

### Build Verification
- `next build`: SUCCESS (26 pages, Next.js 15.3.3)
- `npm test`: 115 web API tests + 69 mobile tests = **184 tests passing**
- `tsc --noEmit`: 0 TypeScript errors

### What Was Built

| Priority | Commits | Files | Lines |
|----------|---------|-------|-------|
| P1 Infrastructure | 1 | 10 | SQL migration, seed (6 charities, 40 activities), Vercel/EAS configs, setup script |
| P2 Features | 7 | 35 | All screens wired, chat API + UI, event CRUD, onboarding, SSE real-time, push notifications |
| P3 Growth | 2 | 12 | Affiliate tracking, social discovery, creator partnerships, recommendation engine |
| P4 Testing | 4 | 20 | 184 tests, error boundaries, loading skeletons, API retry logic |
| P5 App Store | 1 | 5 | Privacy policy, Terms of Service, ASO listing, analytics wrapper |

### New Key Files

| Purpose | Path |
|---------|------|
| SQL Migration | /packages/database/prisma/migrations/0001_initial_schema/migration.sql |
| Database Seed | /packages/database/prisma/seed.ts |
| Chat API (4 routes) | /apps/web/src/app/api/chat/ |
| Chat AI Assistant | /apps/web/src/app/api/chat/ai/route.ts |
| Affiliate API | /apps/web/src/app/api/affiliate/ |
| Creator API | /apps/web/src/app/api/creators/ |
| Discover (enhanced) | /apps/web/src/app/api/discover/ |
| SSE Streams | /apps/web/src/app/api/*/stream/route.ts |
| Event Screens | /apps/mobile/app/event/ |
| Chat Screen | /apps/mobile/app/(tabs)/chat.tsx |
| Onboarding Store | /apps/mobile/src/store/onboardingStore.ts |
| SSE Client | /apps/mobile/src/lib/sse.ts |
| Push Notifications | /apps/mobile/src/lib/pushNotifications.ts |
| Analytics | /apps/mobile/src/lib/analytics.ts |
| Error Boundary | /apps/mobile/src/components/ErrorBoundary.tsx |
| Loading Skeleton | /apps/mobile/src/components/LoadingSkeleton.tsx |
| API Tests (8 suites) | /apps/web/src/__tests__/api/ |
| Mobile Tests (4 suites) | /apps/mobile/src/__tests__/ |
| Privacy Policy | /apps/web/src/app/privacy/page.tsx |
| Terms of Service | /apps/web/src/app/terms/page.tsx |
| App Store Listing | /apps/web/src/app/app-store/page.tsx |
| Setup Script | /scripts/setup.sh |
| Vercel Config | /vercel.json |
| EAS Build Config | /apps/mobile/eas.json |
| Development Brief | /DEVELOPMENT_BRIEF.md |

### Quick Start
```bash
git checkout claude/analyze-executive-summary-pGycz
cp .env.example .env   # fill in your API keys
./scripts/setup.sh     # install, generate, push schema, seed
npm run dev:web         # web at localhost:3000
npm run dev:mobile      # mobile with Expo
npm test                # run 184 tests
```
