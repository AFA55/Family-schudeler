# FamilySync - Development Guide

## Project Overview
FamilySync is a family scheduling and activity planning app. Mobile-first (React Native/Expo) with a Next.js web landing page and API backend.

## Architecture
- **Monorepo** with npm workspaces
- `apps/mobile` - Expo/React Native mobile app (iOS + Android)
- `apps/web` - Next.js 15 (landing page + API routes)
- `packages/database` - Prisma ORM + Neon Postgres schema
- `packages/shared` - Shared types, constants, validation (Zod)

## Tech Stack
- **Mobile:** React Native + Expo Router + Zustand (state)
- **Web:** Next.js 15 App Router + Tailwind CSS
- **Database:** Neon Postgres + Prisma ORM
- **Auth:** NextAuth.js (email + magic link)
- **Payments:** Stripe (subscriptions + 14-day trial)
- **UI:** Custom component library, warm family color palette

## Key Commands
```bash
npm run dev:web      # Start Next.js dev server
npm run dev:mobile   # Start Expo dev server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## Color Palette
- Primary: Indigo (#6366F1)
- Secondary: Coral (#FF6B6B)
- Accent: Amber (#F59E0B)
- Background: Warm white (#FEFDFB)

## Business Model
- 87% of PROFIT donated to family charities worldwide
- Free tier, Family ($7.99/mo), Family+ ($14.99/mo)
- 14-day free trial on paid plans
- Affiliate commissions on recommended activities/products
