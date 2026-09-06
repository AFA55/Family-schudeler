import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FamilySync — Family Planner & Calendar App",
  description:
    "Download FamilySync, the family planner and family calendar app. Discover activity ideas for kids, schedule family time, and coordinate busy schedules. Free family scheduler with smart recommendations.",
  keywords: [
    "family planner",
    "family calendar",
    "activity ideas for kids",
    "family scheduler",
    "family activities app",
    "family organizer",
    "shared calendar for families",
    "family event planner",
    "kids activity finder",
    "family time planner",
  ],
};

const features = [
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
    title: "Shared Family Calendar",
    description:
      "One calendar the whole family can see and edit. Color-coded by family member, with smart conflict detection.",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
        />
      </svg>
    ),
    title: "Activity Ideas for Kids",
    description:
      "Discover parks, trails, restaurants, and events near you. Personalized to your family's interests, ages, and budget.",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
    title: "AI Planning Assistant",
    description:
      "Ask for restaurant suggestions, activity ideas, or weekend plans. Our AI does the research and finds the best options.",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
    title: "Family Coordination",
    description:
      "Invite family members, coordinate schedules, and get RSVPs in one tap. Keep extended family in the loop too.",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
    title: "Smart Reminders",
    description:
      "Gentle push notifications for upcoming events. Never miss a planned family activity or important date again.",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
    title: "Give Back Together",
    description:
      "87% of our profits help families in need worldwide. Choose which communities to support when you sign up.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic family scheduling to get started.",
    features: [
      "1 family calendar",
      "Up to 5 family members",
      "Basic event scheduling",
      "Email notifications",
    ],
    highlighted: false,
  },
  {
    name: "Plus",
    price: "$4.99",
    period: "/month",
    description: "Everything you need for quality family time.",
    features: [
      "Unlimited family members",
      "Smart activity recommendations",
      "Local search with reviews",
      "Trending activities feed",
      "Calendar sync (Google/Apple)",
      "Push notifications",
    ],
    highlighted: true,
    badge: "Most Popular",
    annual: "$39.99/year (save 33%)",
  },
  {
    name: "Premium",
    price: "$7.99",
    period: "/month",
    description: "AI-powered planning for the ultimate family experience.",
    features: [
      "Everything in Plus",
      "AI scheduling assistant",
      "Curated deals & discounts",
      "Family analytics dashboard",
      "Priority support",
    ],
    highlighted: false,
    annual: "$59.99/year (save 37%)",
  },
];

export default function AppStorePage() {
  return (
    <main className="min-h-screen bg-warm-50">
      {/* Hero */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-80 h-80 bg-coral-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: App info */}
            <div>
              {/* App icon + name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-coral-500 rounded-[22px] flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <span className="text-white font-bold text-3xl font-display">
                    F
                  </span>
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-neutral-900">
                    FamilySync
                  </h1>
                  <p className="text-neutral-500 text-sm">
                    Family Planner & Calendar
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4">
                Quality family time,{" "}
                <span className="bg-gradient-to-r from-primary-500 via-coral-500 to-amber-500 bg-clip-text text-transparent">
                  effortlessly planned
                </span>
              </h2>

              {/* ASO description */}
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                The #1 family planner and family calendar app for busy parents.
                Stop spending hours figuring out what to do this weekend.
                FamilySync is a smart family scheduler that discovers activity
                ideas for kids, finds local experiences, and keeps your whole
                family in sync.
              </p>

              {/* Key selling points */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "Family Planner",
                  "Family Calendar",
                  "Activity Ideas for Kids",
                  "Family Scheduler",
                  "AI-Powered",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-3 bg-neutral-900 text-white rounded-2xl px-6 py-3.5 hover:bg-neutral-800 transition-colors"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none opacity-80">
                      Download on the
                    </div>
                    <div className="text-lg font-semibold leading-tight">
                      App Store
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-3 bg-neutral-900 text-white rounded-2xl px-6 py-3.5 hover:bg-neutral-800 transition-colors"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.39 12l2.308-2.492zM5.864 2.658L16.8 9.012l-2.302 2.302L5.864 2.658z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none opacity-80">
                      GET IT ON
                    </div>
                    <div className="text-lg font-semibold leading-tight">
                      Google Play
                    </div>
                  </div>
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-6 flex items-center gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 font-medium text-neutral-700">4.8</span>
                </div>
                <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                <span>Free with in-app purchases</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                <span>Ages 4+</span>
              </div>
            </div>

            {/* Right: Screenshot placeholders */}
            <div className="flex justify-center gap-4">
              {/* Phone mockup 1 */}
              <div className="w-48 md:w-56 flex-shrink-0">
                <div className="bg-white rounded-[2rem] shadow-xl shadow-primary-500/10 border border-neutral-200 overflow-hidden">
                  <div className="bg-gradient-to-br from-primary-50 to-warm-50 aspect-[9/19.5] flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-3">
                      <svg
                        className="w-6 h-6 text-primary-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-neutral-400 text-center font-medium">
                      Family Calendar
                    </p>
                    <p className="text-[10px] text-neutral-300 text-center mt-1">
                      Screenshot placeholder
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone mockup 2 */}
              <div className="w-48 md:w-56 flex-shrink-0 mt-8">
                <div className="bg-white rounded-[2rem] shadow-xl shadow-coral-500/10 border border-neutral-200 overflow-hidden">
                  <div className="bg-gradient-to-br from-coral-50 to-warm-50 aspect-[9/19.5] flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 bg-coral-100 rounded-2xl flex items-center justify-center mb-3">
                      <svg
                        className="w-6 h-6 text-coral-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-neutral-400 text-center font-medium">
                      Discover Activities
                    </p>
                    <p className="text-[10px] text-neutral-300 text-center mt-1">
                      Screenshot placeholder
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Store Long Description */}
      <section className="py-16 bg-white border-y border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-4 text-center">
            About FamilySync
          </h2>
          <p className="section-subheading mx-auto text-center mb-10">
            The family planner that does more than just scheduling
          </p>

          <div className="text-neutral-600 leading-relaxed space-y-4">
            <p>
              FamilySync is the all-in-one family planner, family calendar, and
              family scheduler designed for busy parents who want to spend more
              quality time together. Whether you are looking for activity ideas
              for kids this weekend or need to coordinate a multi-family event,
              FamilySync makes it effortless.
            </p>
            <p>
              Tired of the &quot;What should we do?&quot; conversation every
              Friday night? FamilySync&apos;s smart discovery engine finds
              parks, trails, restaurants, museums, and seasonal events near you,
              personalized to your family&apos;s interests and budget. From free
              outdoor adventures to curated dining experiences, discover
              activities your whole family will love.
            </p>
            <p>
              Our AI-powered planning assistant goes even further. Ask it to
              find a spacious restaurant for a birthday dinner, plan a rainy-day
              activity for three kids under 10, or organize a weekend camping
              trip. It handles the research so you can focus on being together.
            </p>
            <p>
              Best of all, FamilySync gives back. 87% of our profits are
              donated to family-focused charities around the world, including
              Save the Children, Family Promise, and World Vision. When you plan
              family time with FamilySync, you are helping families in need at
              the same time.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-4 text-center">
            Key Features
          </h2>
          <p className="section-subheading mx-auto text-center mb-12">
            Everything your family needs to plan, discover, and connect
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots placeholder */}
      <section className="py-16 bg-white border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-4 text-center">Screenshots</h2>
          <p className="section-subheading mx-auto text-center mb-12">
            See FamilySync in action
          </p>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {[
              { label: "Calendar View", color: "from-primary-50 to-primary-100", border: "border-primary-200" },
              { label: "Discover Feed", color: "from-coral-50 to-coral-100", border: "border-coral-200" },
              { label: "Family Members", color: "from-amber-50 to-amber-100", border: "border-amber-200" },
              { label: "AI Assistant", color: "from-violet-50 to-violet-100", border: "border-violet-200" },
              { label: "Event Detail", color: "from-emerald-50 to-emerald-100", border: "border-emerald-200" },
            ].map((screen) => (
              <div
                key={screen.label}
                className="flex-shrink-0 snap-center"
              >
                <div
                  className={`w-52 bg-gradient-to-br ${screen.color} rounded-3xl border ${screen.border} aspect-[9/19.5] flex flex-col items-center justify-center p-6`}
                >
                  <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-neutral-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-neutral-500 text-center">
                    {screen.label}
                  </p>
                  <p className="text-[10px] text-neutral-400 text-center mt-1">
                    Screenshot placeholder
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's New */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-4 text-center">
            What&apos;s New
          </h2>
          <p className="section-subheading mx-auto text-center mb-10">
            Version 1.0 — Initial Release
          </p>
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
            <ul className="space-y-3 text-neutral-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                Shared family calendar with color-coded members
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                Discover local activities, parks, trails, and restaurants
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                AI Planning Assistant for restaurant and activity suggestions
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                Family chat with in-app messaging
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                Push notification reminders for events
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                87% of profits donated to family charities worldwide
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-4 text-center">
            Simple, family-friendly pricing
          </h2>
          <p className="section-subheading mx-auto text-center mb-12">
            Start free. Upgrade when you&apos;re ready. 87% of profits help
            families in need.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-3xl p-8 relative ${
                  plan.highlighted
                    ? "bg-white shadow-xl shadow-primary-500/10 border-2 border-primary-200 scale-105"
                    : "bg-warm-50 shadow-sm border border-neutral-100"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-coral-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-neutral-800">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-extrabold text-neutral-900">
                      {plan.price}
                    </span>
                    <span className="text-neutral-400 text-sm">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-sm mt-2">
                    {plan.description}
                  </p>
                  {"annual" in plan && plan.annual && (
                    <p className="text-xs text-primary-500 font-semibold mt-2">
                      {plan.annual}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-neutral-600"
                    >
                      <svg
                        className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className={`block w-full text-center px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 hover:-translate-y-0.5"
                      : "bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50"
                  }`}
                >
                  {plan.highlighted
                    ? "Start 14-Day Free Trial"
                    : plan.price === "$0"
                    ? "Get Started Free"
                    : "Start 14-Day Free Trial"}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-400 mt-8">
            All paid plans include a 14-day free trial. No credit card required
            to start.
          </p>
        </div>
      </section>

      {/* App Info */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-8 text-center">App Information</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-neutral-400 mb-1">Developer</p>
                <p className="text-neutral-800 font-medium">FamilySync</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Category</p>
                <p className="text-neutral-800 font-medium">
                  Lifestyle / Productivity
                </p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Compatibility</p>
                <p className="text-neutral-800 font-medium">
                  iOS 15.0+ / Android 10+
                </p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Languages</p>
                <p className="text-neutral-800 font-medium">English</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Age Rating</p>
                <p className="text-neutral-800 font-medium">4+</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Price</p>
                <p className="text-neutral-800 font-medium">
                  Free (in-app purchases)
                </p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Version</p>
                <p className="text-neutral-800 font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Size</p>
                <p className="text-neutral-800 font-medium">~45 MB</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to plan more family time?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of families who use FamilySync to discover
            activities, coordinate schedules, and make every moment count.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white text-primary-700 font-semibold rounded-2xl px-8 py-4 hover:bg-primary-50 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for iOS
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white/10 text-white font-semibold rounded-2xl px-8 py-4 hover:bg-white/20 transition-colors border border-white/20"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.39 12l2.308-2.492zM5.864 2.658L16.8 9.012l-2.302 2.302L5.864 2.658z" />
              </svg>
              Download for Android
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-coral-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-display font-bold text-white">
                FamilySync
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
            </div>

            <p className="text-xs">
              &copy; {new Date().getFullYear()} FamilySync. All rights reserved.
            </p>
          </div>

          <p className="text-center text-xs text-coral-400 mt-6">
            87% of profits help families in need worldwide.
          </p>
        </div>
      </footer>
    </main>
  );
}
