"use client";

const steps = [
  {
    number: "01",
    title: "Tell us about your family",
    description:
      "Quick onboarding survey about your interests, favorite activities, and what you want more of. Takes 2 minutes.",
    color: "text-primary-500",
    bgColor: "bg-primary-50",
  },
  {
    number: "02",
    title: "Get personalized plans",
    description:
      "We find activities, parks, restaurants, and experiences near you based on what your family loves. Sorted by budget and distance.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    number: "03",
    title: "Schedule & invite",
    description:
      "Add activities to your shared calendar. Invite family members with one tap. Everyone gets notified and can RSVP.",
    color: "text-coral-500",
    bgColor: "bg-coral-50",
  },
  {
    number: "04",
    title: "Enjoy & repeat",
    description:
      "Show up and enjoy quality time together. The more you use FamilySync, the smarter your recommendations get.",
    color: "text-emerald-500",
    bgColor: "bg-green-50",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            How it works
          </h2>
          <p className="section-subheading mx-auto">
            From signup to quality family time in under 5 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-neutral-200 to-neutral-100" />
              )}
              <div
                className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <span className={`font-display font-extrabold text-xl ${step.color}`}>
                  {step.number}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-800 mb-2">
                {step.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
