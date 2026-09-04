import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — FamilySync",
  description:
    "FamilySync terms of service. Read about acceptable use, subscriptions, and your responsibilities.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-6 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to FamilySync
          </a>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-neutral-500 text-lg">
            Last updated: September 4, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 md:p-12">
          <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700 leading-relaxed">
            {/* Agreement */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using FamilySync (&quot;the Service&quot;),
                provided by FamilySync (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;), you agree to be bound by these Terms of
                Service (&quot;Terms&quot;). If you do not agree to these
                Terms, you may not use the Service.
              </p>
              <p className="mt-3">
                These Terms apply to all users of the Service, including
                without limitation users who are visitors, registered members,
                subscribers, and contributors of content.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                2. Eligibility
              </h2>
              <p>
                You must be at least 18 years of age to create an account and
                use the Service. By creating an account, you represent and
                warrant that you are at least 18 years old and have the legal
                capacity to enter into these Terms.
              </p>
              <p className="mt-3">
                Parents and legal guardians may add children under 18 as family
                members. The parent or guardian is responsible for all activity
                associated with their child&apos;s use of the Service and for
                ensuring compliance with applicable laws, including the
                Children&apos;s Online Privacy Protection Act (COPPA).
              </p>
            </section>

            {/* Account Responsibility */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                3. Account Registration and Responsibility
              </h2>
              <p>
                When you create an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Provide accurate, current, and complete information during
                  registration.
                </li>
                <li>
                  Maintain and promptly update your account information.
                </li>
                <li>
                  Maintain the security and confidentiality of your login
                  credentials.
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your
                  account.
                </li>
                <li>
                  Accept responsibility for all activities that occur under
                  your account.
                </li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate accounts that
                contain inaccurate information, or that we reasonably believe
                to be fraudulent.
              </p>
            </section>

            {/* Subscription Terms */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                4. Subscription Plans and Payment
              </h2>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.1 Plans
              </h3>
              <p>FamilySync offers the following subscription tiers:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Free:</strong> Basic family scheduling features at
                  no cost.
                </li>
                <li>
                  <strong>Plus ($4.99/month or $39.99/year):</strong> Enhanced
                  features including unlimited family members, smart activity
                  recommendations, calendar sync, and more.
                </li>
                <li>
                  <strong>Premium ($7.99/month or $59.99/year):</strong> All
                  Plus features plus AI-powered planning, curated deals,
                  family analytics, and priority support.
                </li>
              </ul>
              <p className="mt-3">
                We reserve the right to modify pricing with at least 30 days&apos;
                notice. Price changes will not affect your current billing
                cycle.
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.2 Free Trial
              </h3>
              <p>
                All paid plans include a <strong>14-day free trial</strong>. No
                credit card is required to start a trial. During the trial, you
                have full access to the features of your selected plan. If you
                do not subscribe before the trial ends, your account will
                revert to the Free plan and you will not be charged.
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.3 Billing and Renewal
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Subscriptions are billed in advance on a monthly or annual
                  basis, depending on the plan you select.
                </li>
                <li>
                  Subscriptions automatically renew at the end of each billing
                  period unless you cancel before the renewal date.
                </li>
                <li>
                  All payments are processed securely through Stripe. We do
                  not store your payment card details on our servers.
                </li>
                <li>
                  You may manage your subscription (upgrade, downgrade, or
                  cancel) at any time through your account settings or the
                  Stripe customer portal.
                </li>
              </ul>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.4 Refunds
              </h3>
              <p>
                Subscription fees are generally non-refundable. However, we may
                issue a refund at our discretion in the following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  You were charged after canceling your subscription due to a
                  billing error.
                </li>
                <li>
                  The Service experienced significant downtime or was
                  materially unavailable during your billing period.
                </li>
                <li>
                  You request a refund within 48 hours of your first paid
                  subscription charge (excluding trial-to-paid conversions
                  where you received advance notice).
                </li>
              </ul>
              <p className="mt-3">
                To request a refund, contact us at{" "}
                <a
                  href="mailto:support@familysync.com"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  support@familysync.com
                </a>
                .
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.5 Cancellation
              </h3>
              <p>
                You may cancel your subscription at any time. Upon
                cancellation:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  You will continue to have access to paid features until the
                  end of your current billing period.
                </li>
                <li>
                  Your account will then revert to the Free plan.
                </li>
                <li>
                  Your calendar data and family information will be retained
                  and accessible on the Free plan.
                </li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                5. Acceptable Use Policy
              </h2>
              <p>
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Use the Service for any illegal or unauthorized purpose.
                </li>
                <li>
                  Harass, abuse, threaten, or intimidate other users.
                </li>
                <li>
                  Post or transmit content that is obscene, defamatory,
                  discriminatory, or harmful.
                </li>
                <li>
                  Impersonate any person or entity or misrepresent your
                  affiliation with a person or entity.
                </li>
                <li>
                  Attempt to gain unauthorized access to the Service, other
                  user accounts, or our systems.
                </li>
                <li>
                  Use automated means (bots, scrapers, crawlers) to access or
                  collect data from the Service without our prior written
                  consent.
                </li>
                <li>
                  Interfere with or disrupt the Service, servers, or networks
                  connected to the Service.
                </li>
                <li>
                  Upload malicious code, viruses, or any other harmful
                  technology.
                </li>
                <li>
                  Use the Service to send unsolicited communications or spam.
                </li>
                <li>
                  Share content that exploits or endangers minors in any way.
                </li>
              </ul>
              <p className="mt-3">
                We reserve the right to investigate and take appropriate legal
                action against anyone who violates this section, including
                removing content, suspending or terminating accounts, and
                reporting activity to law enforcement.
              </p>
            </section>

            {/* Content Guidelines */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                6. User Content
              </h2>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                6.1 Your Content
              </h3>
              <p>
                You retain ownership of any content you create, upload, or
                share through the Service (including events, messages, photos,
                and activity suggestions). By posting content, you grant us a
                limited, non-exclusive, royalty-free license to use, display,
                and distribute your content solely for the purpose of
                operating and providing the Service.
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                6.2 Content Guidelines
              </h3>
              <p>
                Content shared through FamilySync must be appropriate for a
                family audience. You agree not to share content that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Contains explicit, violent, or adult material.</li>
                <li>
                  Promotes illegal activities, substance abuse, or dangerous
                  behavior.
                </li>
                <li>
                  Infringes on the intellectual property rights of others.
                </li>
                <li>
                  Contains personal information of others without their
                  consent.
                </li>
              </ul>
              <p className="mt-3">
                We reserve the right to remove content that violates these
                guidelines without notice.
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                6.3 Social Content Submissions
              </h3>
              <p>
                If you submit links to TikTok, YouTube, or Instagram content
                through our Discovery feature, you represent that you have the
                right to share such links and that the linked content does not
                violate our content guidelines.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                7. Intellectual Property
              </h2>
              <p>
                The Service, including its original content, features,
                functionality, design, and branding (excluding user-generated
                content), is and will remain the exclusive property of
                FamilySync and its licensors. The Service is protected by
                copyright, trademark, and other laws of the United States and
                foreign countries.
              </p>
              <p className="mt-3">
                You may not copy, modify, distribute, sell, or lease any part
                of the Service, nor may you reverse-engineer or attempt to
                extract the source code of the Service, unless applicable laws
                permit it or you have our written permission.
              </p>
            </section>

            {/* AI Assistant */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                8. AI Planning Assistant
              </h2>
              <p>
                FamilySync&apos;s AI Planning Assistant provides activity
                suggestions, restaurant recommendations, and scheduling
                assistance. You acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  AI-generated recommendations are informational and should
                  not be relied upon as the sole basis for decisions regarding
                  health, safety, or finances.
                </li>
                <li>
                  We do not guarantee the accuracy, availability, or quality
                  of third-party venues, restaurants, or activities recommended
                  by the AI.
                </li>
                <li>
                  You are responsible for verifying details (hours, pricing,
                  availability, allergen information) with the relevant
                  establishments before visiting.
                </li>
                <li>
                  AI responses may occasionally contain inaccuracies. We
                  encourage you to verify important information independently.
                </li>
              </ul>
            </section>

            {/* Charitable Giving */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                9. Charitable Impact Program
              </h2>
              <p>
                FamilySync donates 87% of its profits to family-focused
                charitable organizations. You acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Subscription fees are payments for the Service, not
                  charitable donations. Your subscription payment is not
                  tax-deductible.
                </li>
                <li>
                  The selection of charity partners and allocation of
                  contributions is at our sole discretion, though we consider
                  your regional preferences.
                </li>
                <li>
                  Charitable contributions are calculated on net profit after
                  operating expenses, not on gross revenue.
                </li>
                <li>
                  We will provide transparency reports on our charitable giving
                  on an annual basis.
                </li>
              </ul>
            </section>

            {/* Affiliate Links */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                10. Affiliate Links and Third-Party Products
              </h2>
              <p>
                The Service may contain links to third-party websites,
                products, and services (including through Amazon Associates,
                Viator, and GetYourGuide). These links may be affiliate links,
                meaning FamilySync may earn a commission if you make a
                purchase.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  We do not control third-party websites and are not
                  responsible for their content, products, or practices.
                </li>
                <li>
                  Your interactions with third-party sellers are solely between
                  you and the seller. We are not a party to those transactions.
                </li>
                <li>
                  Affiliate commissions do not increase the price you pay for
                  products or services.
                </li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                11. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL FAMILYSYNC, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
                SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3 uppercase text-sm">
                <li>
                  YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE
                  SERVICE.
                </li>
                <li>
                  ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE.
                </li>
                <li>
                  ANY CONTENT OBTAINED FROM THE SERVICE, INCLUDING AI-GENERATED
                  RECOMMENDATIONS.
                </li>
                <li>
                  UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR
                  TRANSMISSIONS OR CONTENT.
                </li>
              </ul>
              <p className="mt-3">
                Our total liability to you for all claims arising from or
                related to the Service shall not exceed the amount you paid us
                in the twelve (12) months preceding the claim, or one hundred
                dollars ($100), whichever is greater.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                12. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; BASIS WITHOUT ANY WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="mt-3">
                We do not warrant that the Service will be uninterrupted,
                timely, secure, or error-free, or that any defects will be
                corrected. We do not warrant the accuracy or reliability of any
                information, activity recommendations, or AI-generated content
                obtained through the Service.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                13. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless FamilySync
                and its officers, directors, employees, agents, and affiliates
                from and against any claims, damages, obligations, losses,
                liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your use of and access to the Service.</li>
                <li>Your violation of these Terms.</li>
                <li>
                  Your violation of any third-party right, including
                  intellectual property or privacy rights.
                </li>
                <li>
                  Any content you create, upload, or share through the Service.
                </li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                14. Termination
              </h2>
              <p>
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, for any
                reason, including if you breach these Terms.
              </p>
              <p className="mt-3">
                Upon termination:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Your right to use the Service will immediately cease.
                </li>
                <li>
                  If you have an active paid subscription, you will not be
                  charged for subsequent billing periods, but no refund will be
                  issued for the current period.
                </li>
                <li>
                  We may retain your data as required by law or legitimate
                  business purposes, subject to our Privacy Policy.
                </li>
              </ul>
              <p className="mt-3">
                You may delete your account at any time through the app&apos;s
                profile settings.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                15. Governing Law and Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Delaware, United States, without
                regard to its conflict of law provisions.
              </p>
              <p className="mt-3">
                Any disputes arising from or relating to these Terms or the
                Service shall first be attempted to be resolved through
                informal negotiation. If the dispute cannot be resolved
                informally within 30 days, either party may initiate binding
                arbitration in accordance with the rules of the American
                Arbitration Association. The arbitration shall take place in
                Wilmington, Delaware.
              </p>
              <p className="mt-3">
                You agree to resolve disputes on an individual basis and waive
                any right to participate in a class action lawsuit or class
                arbitration.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                16. Changes to These Terms
              </h2>
              <p>
                We reserve the right to modify or replace these Terms at any
                time. We will provide at least 30 days&apos; notice before
                material changes take effect, by posting the revised Terms with
                an updated date and notifying you via email or in-app
                notification.
              </p>
              <p className="mt-3">
                Your continued use of the Service after the effective date of
                any changes constitutes your acceptance of the revised Terms.
                If you do not agree to the new Terms, you must stop using the
                Service.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                17. Severability
              </h2>
              <p>
                If any provision of these Terms is held to be unenforceable or
                invalid, that provision will be modified to the minimum extent
                necessary to make it enforceable, and the remaining provisions
                of these Terms will continue in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                18. Entire Agreement
              </h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the
                entire agreement between you and FamilySync regarding the
                Service and supersede all prior and contemporaneous
                understandings, agreements, representations, and warranties.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                19. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="mt-4 bg-primary-50 rounded-2xl p-6 border border-primary-100">
                <p className="font-semibold text-neutral-900">FamilySync</p>
                <p className="mt-1">
                  Email:{" "}
                  <a
                    href="mailto:legal@familysync.com"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    legal@familysync.com
                  </a>
                </p>
                <p className="mt-1">
                  Support:{" "}
                  <a
                    href="mailto:support@familysync.com"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    support@familysync.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-400">
          <p>
            &copy; {new Date().getFullYear()} FamilySync. All rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <a href="/privacy" className="hover:text-neutral-600 transition-colors">
              Privacy Policy
            </a>
            <span className="w-1 h-1 bg-neutral-300 rounded-full" />
            <a href="/" className="hover:text-neutral-600 transition-colors">
              Home
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
