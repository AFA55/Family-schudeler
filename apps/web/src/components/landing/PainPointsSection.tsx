"use client";

const painPoints = [
  {
    emoji: "😩",
    problem: "\"I don't have time to plan activities\"",
    solution: "FamilySync recommends activities based on your interests and finds everything nearby — zero research needed.",
    color: "from-coral-50 to-coral-100",
    borderColor: "border-coral-200",
  },
  {
    emoji: "📱",
    problem: "\"Everyone's on a different schedule\"",
    solution: "One shared calendar the whole family can see. Send invites, get RSVPs, and stay in sync instantly.",
    color: "from-primary-50 to-primary-100",
    borderColor: "border-primary-200",
  },
  {
    emoji: "🤷",
    problem: "\"We never know what to do together\"",
    solution: "Smart suggestions based on what your family loves — from hiking trails to game nights, personalized for you.",
    color: "from-amber-50 to-amber-100",
    borderColor: "border-amber-200",
  },
  {
    emoji: "💸",
    problem: "\"Finding affordable family activities is hard\"",
    solution: "Filter by budget, discover free local activities, and find deals on experiences near you.",
    color: "from-green-50 to-green-100",
    borderColor: "border-green-200",
  },
];

export default function PainPointsSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Sound familiar?
          </h2>
          <p className="section-subheading mx-auto">
            Busy families everywhere struggle with the same thing. We built
            FamilySync to solve it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 bg-gradient-to-br ${point.color} border ${point.borderColor}`}
            >
              <span className="text-3xl mb-3 block">{point.emoji}</span>
              <p className="font-display font-bold text-lg text-neutral-800 mb-2">
                {point.problem}
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {point.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
