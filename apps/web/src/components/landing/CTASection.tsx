"use client";

import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6 leading-tight">
          Ready to make family time{" "}
          <span className="bg-gradient-to-r from-primary-500 to-coral-500 bg-clip-text text-transparent">
            effortless?
          </span>
        </h2>
        <p className="text-xl text-neutral-500 mb-10 max-w-2xl mx-auto">
          Join thousands of families who stopped stressing about plans and started
          enjoying time together. Your 14-day free trial starts now.
        </p>
        <Button variant="primary" size="lg">
          Start Your Free Trial Today
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        <p className="text-sm text-neutral-400 mt-4">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
