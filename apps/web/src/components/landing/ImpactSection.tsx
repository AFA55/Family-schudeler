"use client";

import Button from "@/components/ui/Button";

export default function ImpactSection() {
  return (
    <section id="impact" className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-coral-400 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 mb-8">
            <svg className="w-5 h-5 text-coral-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-sm font-medium text-white/90">Making a real difference</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Your family time{" "}
            <span className="text-coral-300">helps other families</span>
          </h2>

          <p className="text-xl text-primary-100 leading-relaxed mb-8">
            87% of our profits go directly to organizations helping less
            fortunate families around the world. When you sign up, you choose
            which communities to support — families in the US, Africa, Asia,
            Latin America, or the Middle East.
          </p>

          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="font-display text-3xl font-extrabold text-amber-300">87%</p>
              <p className="text-sm text-primary-200 mt-1">of profits donated</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="font-display text-3xl font-extrabold text-amber-300">6+</p>
              <p className="text-sm text-primary-200 mt-1">regions supported</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="font-display text-3xl font-extrabold text-amber-300">You</p>
              <p className="text-sm text-primary-200 mt-1">choose who to help</p>
            </div>
          </div>

          <Button
            variant="coral"
            size="lg"
            className="text-white"
          >
            Start Helping Families Today
          </Button>
        </div>
      </div>
    </section>
  );
}
