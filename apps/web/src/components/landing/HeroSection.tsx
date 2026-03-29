"use client";

import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-coral-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-coral-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-700">
              87% of profits help families in need worldwide
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Quality family time,{" "}
            <span className="bg-gradient-to-r from-primary-500 via-coral-500 to-amber-500 bg-clip-text text-transparent">
              effortlessly planned
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-neutral-500 leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Stop spending hours figuring out what to do. FamilySync plans
            activities, finds local experiences, and keeps your whole family in
            sync — so you can focus on being together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="primary" size="lg">
              Start Your 14-Day Free Trial
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button variant="secondary" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-400 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>No credit card required</span>
            </div>
            <span className="w-1 h-1 bg-neutral-300 rounded-full" />
            <span>Free for 14 days</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full" />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* App preview mockup */}
        <div className="mt-20 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-neutral-200">
            {/* Browser chrome */}
            <div className="bg-neutral-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-coral-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-neutral-400 text-center">
                  app.familysync.com
                </div>
              </div>
            </div>
            {/* App mockup content */}
            <div className="bg-gradient-to-br from-warm-50 to-primary-50 p-8 md:p-12 min-h-[400px]">
              <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto">
                {/* Calendar header */}
                <div className="col-span-7 text-center mb-4">
                  <h3 className="font-display font-bold text-2xl text-neutral-800">March 2026</h3>
                </div>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-neutral-400 py-2">
                    {day}
                  </div>
                ))}
                {/* Calendar days mock */}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 0; // offset for March 2026
                  const isToday = day === 28;
                  const hasEvent = [5, 8, 12, 15, 18, 22, 25, 29].includes(day);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative ${
                        isToday
                          ? "bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/30"
                          : day > 0 && day <= 31
                          ? "hover:bg-white/80 text-neutral-700 cursor-pointer"
                          : "text-neutral-300"
                      }`}
                    >
                      {day > 0 && day <= 31 ? day : ""}
                      {hasEvent && !isToday && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-primary-400" />
                          <div className="w-1 h-1 rounded-full bg-coral-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Event preview cards */}
              <div className="mt-6 flex gap-3 justify-center flex-wrap">
                <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border border-primary-100 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Family Hike</p>
                    <p className="text-xs text-neutral-400">Sat 10:00 AM · Blue Ridge Trail</p>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border border-coral-100 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-coral-500" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Game Night</p>
                    <p className="text-xs text-neutral-400">Fri 7:00 PM · Home</p>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border border-amber-100 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Italian Dinner</p>
                    <p className="text-xs text-neutral-400">Sun 6:30 PM · Olive Garden</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
