"use client";

import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic family scheduling.",
    features: [
      "1 family calendar",
      "Up to 5 family members",
      "Basic event scheduling",
      "Email notifications",
      "Share calendar view (read-only)",
    ],
    cta: "Get Started Free",
    variant: "secondary" as const,
    highlighted: false,
  },
  {
    name: "Plus",
    price: "$4.99",
    period: "/month",
    description: "Everything you need for quality family time.",
    features: [
      "Everything in Free",
      "Ad-free experience",
      "Unlimited family members",
      "Smart activity recommendations",
      "Local search with reviews & filters",
      "Trending activities from social media",
      "Multi-family event coordination",
      "Google/Apple calendar sync",
      "Push notifications & reminders",
      "Choose your charity impact region",
    ],
    cta: "Start 14-Day Free Trial",
    variant: "primary" as const,
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
      "AI scheduling & smart suggestions",
      "Curated activity deals & discounts",
      "AI restaurant & reservation assistant",
      "Family analytics dashboard",
      "Connect up to 3 families",
      "In-app activity & game shop",
      "Priority support",
    ],
    cta: "Start 14-Day Free Trial",
    variant: "secondary" as const,
    highlighted: false,
    annual: "$59.99/year (save 37%)",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Simple, family-friendly pricing
          </h2>
          <p className="section-subheading mx-auto">
            Start free. Upgrade when you&apos;re ready. 87% of profits help families
            in need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 relative ${
                plan.highlighted
                  ? "bg-white shadow-xl shadow-primary-500/10 border-2 border-primary-200 scale-105"
                  : "bg-white shadow-sm border border-neutral-100"
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
                  <span className="text-neutral-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-neutral-500 text-sm mt-2">{plan.description}</p>
                {"annual" in plan && plan.annual && (
                  <p className="text-xs text-primary-500 font-semibold mt-2">{plan.annual}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-neutral-600">
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

              <Button variant={plan.variant} className="w-full">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-neutral-400 mt-8">
          All paid plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
