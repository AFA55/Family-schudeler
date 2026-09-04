import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — FamilySync",
  description:
    "FamilySync privacy policy. Learn how we collect, use, and protect your family's data.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
            {/* Introduction */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                1. Introduction
              </h2>
              <p>
                FamilySync (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
                protecting the privacy of you and your family. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our mobile application and web
                services (collectively, the &quot;Service&quot;).
              </p>
              <p className="mt-3">
                By accessing or using the Service, you agree to this Privacy
                Policy. If you do not agree with the terms of this Privacy
                Policy, please do not access the Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                2.1 Information You Provide Directly
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> Name, email address,
                  and password when you create an account.
                </li>
                <li>
                  <strong>Profile Information:</strong> Family member names,
                  ages, interests, and preferences provided during onboarding.
                </li>
                <li>
                  <strong>Calendar and Event Data:</strong> Events, schedules,
                  RSVPs, and activity plans you create or participate in.
                </li>
                <li>
                  <strong>Chat Messages:</strong> Messages sent within family
                  chat rooms and to the AI planning assistant.
                </li>
                <li>
                  <strong>Payment Information:</strong> Billing details
                  processed through our third-party payment processor, Stripe.
                  We do not store your complete credit card number on our
                  servers.
                </li>
                <li>
                  <strong>Charity Preferences:</strong> Your selection of
                  communities and regions you wish to support.
                </li>
              </ul>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                2.2 Information Collected Automatically
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Device Information:</strong> Device type, operating
                  system, unique device identifiers, and mobile network
                  information.
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, features used,
                  interactions with the app, session duration, and crash
                  reports.
                </li>
                <li>
                  <strong>Location Data:</strong> With your permission, we
                  collect approximate or precise location data to suggest
                  nearby family activities, restaurants, parks, and
                  experiences. You can disable location services at any time
                  through your device settings.
                </li>
                <li>
                  <strong>Push Notification Tokens:</strong> If you enable push
                  notifications, we store your device token to deliver event
                  reminders and family updates.
                </li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Provide, maintain, and improve the Service, including
                  calendar management, event scheduling, and family
                  coordination.
                </li>
                <li>
                  Deliver personalized activity recommendations based on your
                  family&apos;s interests, location, and preferences.
                </li>
                <li>
                  Process subscription payments and manage your account.
                </li>
                <li>
                  Power the AI Planning Assistant to find restaurants, venues,
                  and activities matching your criteria.
                </li>
                <li>
                  Send push notifications for event reminders, RSVP updates,
                  and family member activity.
                </li>
                <li>
                  Curate trending activities from social media platforms in
                  your area.
                </li>
                <li>
                  Allocate charitable contributions to your selected
                  organizations.
                </li>
                <li>
                  Analyze usage patterns to improve the Service and develop
                  new features.
                </li>
                <li>
                  Detect, prevent, and address technical issues, fraud, or
                  security concerns.
                </li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                4. Third-Party Services
              </h2>
              <p>
                We integrate with the following third-party services, each
                governed by their own privacy policies:
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.1 Google Places API
              </h3>
              <p>
                We use the Google Places API to provide location-based activity
                recommendations, restaurant information, and local experience
                suggestions. Data shared with Google is governed by{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.2 Stripe (Payment Processing)
              </h3>
              <p>
                Payment processing is handled by Stripe, Inc. When you
                subscribe to a paid plan, your payment information is collected
                and processed directly by Stripe. We receive only a
                confirmation of payment status and a truncated card identifier.
                Review{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Stripe&apos;s Privacy Policy
                </a>
                .
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.3 YouTube Data API
              </h3>
              <p>
                We use the YouTube Data API to surface trending family-friendly
                video content and activity ideas. By using this feature, you
                are also bound by{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                . You can revoke FamilySync&apos;s access to YouTube data
                via the{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Google security settings page
                </a>
                .
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.4 TikTok oEmbed API
              </h3>
              <p>
                We use the TikTok oEmbed API to display previews of
                family-activity content shared by users and trending on the
                platform. We do not access your TikTok account or personal
                TikTok data. Review{" "}
                <a
                  href="https://www.tiktok.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  TikTok&apos;s Privacy Policy
                </a>
                .
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.5 Affiliate Partners
              </h3>
              <p>
                When you click on recommended products or experiences (such as
                through Amazon Associates, Viator, or GetYourGuide), you may
                be redirected to a third-party website. These sites have their
                own privacy practices. We may receive anonymized conversion
                data to track affiliate commissions.
              </p>

              <h3 className="font-display text-xl font-semibold text-neutral-800 mt-6 mb-3">
                4.6 Anthropic (AI Assistant)
              </h3>
              <p>
                Our AI Planning Assistant is powered by Anthropic&apos;s Claude API.
                When you use the AI assistant, your messages and relevant
                context (such as location and preferences) are sent to
                Anthropic for processing. We do not send your personally
                identifiable information (such as your name or email) to
                Anthropic. Review{" "}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Anthropic&apos;s Privacy Policy
                </a>
                .
              </p>
            </section>

            {/* Children's Privacy (COPPA) */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                5. Children&apos;s Privacy (COPPA Compliance)
              </h2>
              <p>
                FamilySync is designed for families, including families with
                children. We take the privacy of children under 13 very
                seriously and comply with the Children&apos;s Online Privacy
                Protection Act (COPPA).
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Account Creation:</strong> Only parents or legal
                  guardians (age 18 or older) may create FamilySync accounts.
                  Children under 13 cannot create accounts independently.
                </li>
                <li>
                  <strong>Children&apos;s Data:</strong> A parent or guardian may
                  add children as family members. We collect only the
                  child&apos;s first name and age range as provided by the
                  parent. We do not collect email addresses, phone numbers, or
                  other personal information directly from children.
                </li>
                <li>
                  <strong>Parental Control:</strong> Parents can view, modify,
                  or delete their child&apos;s information at any time through
                  the family management settings.
                </li>
                <li>
                  <strong>No Direct Marketing to Children:</strong> We do not
                  target advertisements or marketing communications to
                  children under 13.
                </li>
                <li>
                  <strong>Consent:</strong> By adding a child to FamilySync, a
                  parent or guardian provides verifiable consent for us to
                  collect and use the child&apos;s limited information as
                  described in this policy.
                </li>
              </ul>
              <p className="mt-3">
                If you believe a child under 13 has provided personal
                information to us without parental consent, please contact us
                immediately at{" "}
                <a
                  href="mailto:privacy@familysync.com"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  privacy@familysync.com
                </a>
                , and we will promptly delete such information.
              </p>
            </section>

            {/* Location Data */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                6. Location Data
              </h2>
              <p>
                FamilySync requests access to your device&apos;s location
                services to provide location-based features:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Suggesting nearby family activities, parks, restaurants, and
                  experiences.
                </li>
                <li>Providing relevant local event recommendations.</li>
                <li>
                  Powering the AI Planning Assistant&apos;s local search
                  capabilities.
                </li>
              </ul>
              <p className="mt-3">
                Location data is collected only when the app is in use
                (&quot;while using&quot;) and is not tracked in the background.
                You may disable location services at any time in your device
                settings. Disabling location access may limit certain features
                such as local activity discovery.
              </p>
            </section>

            {/* Push Notifications */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                7. Push Notifications
              </h2>
              <p>
                With your permission, we send push notifications for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Upcoming event reminders.</li>
                <li>
                  Family member RSVP updates and schedule changes.
                </li>
                <li>New chat messages from family members.</li>
                <li>
                  Smart recommendations for activities and local events.
                </li>
              </ul>
              <p className="mt-3">
                You can manage or disable push notifications at any time
                through your device settings or the FamilySync app&apos;s
                notification preferences.
              </p>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                8. Data Sharing and Disclosure
              </h2>
              <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>With Your Family:</strong> Calendar events, chat
                  messages, and family profiles are shared with members of your
                  family group as you configure them.
                </li>
                <li>
                  <strong>Service Providers:</strong> We share data with
                  third-party service providers who assist in operating the
                  Service (hosting, payment processing, analytics). These
                  providers are contractually obligated to protect your data.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information if required by law, court order, or governmental
                  regulation, or to protect the rights, property, or safety of
                  FamilySync, our users, or others.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a
                  merger, acquisition, or sale of assets, your information may
                  be transferred. We will notify you before your personal
                  information becomes subject to a different privacy policy.
                </li>
                <li>
                  <strong>Aggregated Data:</strong> We may share anonymized,
                  aggregated data that cannot reasonably be used to identify
                  you for research, analytics, or business purposes.
                </li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                9. Data Retention
              </h2>
              <p>
                We retain your personal information for as long as your account
                is active or as needed to provide the Service. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Account Data:</strong> Retained until you delete your
                  account.
                </li>
                <li>
                  <strong>Event and Calendar Data:</strong> Retained until you
                  delete the events or your account.
                </li>
                <li>
                  <strong>Chat Messages:</strong> Retained for the duration of
                  your account. You may delete individual messages.
                </li>
                <li>
                  <strong>Payment Records:</strong> Retained for up to 7 years
                  as required for tax and legal compliance.
                </li>
                <li>
                  <strong>Usage Analytics:</strong> Aggregated and anonymized
                  analytics data is retained indefinitely. Personally
                  identifiable usage data is deleted within 90 days of account
                  deletion.
                </li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                10. Your Rights and Choices
              </h2>
              <p>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Access:</strong> Request a copy of the personal
                  information we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Request that we correct
                  inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Deletion:</strong> Request that we delete your
                  personal information. You can delete your account at any time
                  from your profile settings, which will initiate deletion of
                  your data within 30 days.
                </li>
                <li>
                  <strong>Data Portability:</strong> Request a machine-readable
                  copy of your data.
                </li>
                <li>
                  <strong>Opt-Out:</strong> Opt out of promotional
                  communications at any time by using the unsubscribe link in
                  our emails or adjusting your notification settings.
                </li>
                <li>
                  <strong>Restrict Processing:</strong> Request that we limit
                  how we use your data.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:privacy@familysync.com"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  privacy@familysync.com
                </a>
                . We will respond within 30 days.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                11. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect
                your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Encryption of data in transit (TLS/SSL) and at rest.</li>
                <li>Secure password hashing and authentication tokens.</li>
                <li>
                  Regular security audits and vulnerability assessments.
                </li>
                <li>Access controls limiting employee access to user data.</li>
                <li>
                  Secure, SOC 2-compliant hosting infrastructure.
                </li>
              </ul>
              <p className="mt-3">
                While we strive to protect your personal information, no method
                of transmission or storage is 100% secure. If you believe your
                account has been compromised, contact us immediately.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                12. International Users
              </h2>
              <p>
                FamilySync is operated from the United States. If you are
                accessing the Service from outside the United States, please be
                aware that your information may be transferred to, stored, and
                processed in the United States, where data protection laws may
                differ from those of your jurisdiction.
              </p>
              <p className="mt-3">
                For users in the European Economic Area (EEA), United Kingdom,
                or other regions with data protection laws, we process your
                data based on your consent, contractual necessity, or our
                legitimate interests in providing the Service.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                13. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by posting the updated policy
                with a new &quot;Last Updated&quot; date and, where appropriate,
                by sending you an in-app notification or email. Your continued
                use of the Service after such changes constitutes acceptance of
                the updated Privacy Policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                14. Contact Us
              </h2>
              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 bg-primary-50 rounded-2xl p-6 border border-primary-100">
                <p className="font-semibold text-neutral-900">FamilySync</p>
                <p className="mt-1">
                  Email:{" "}
                  <a
                    href="mailto:privacy@familysync.com"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    privacy@familysync.com
                  </a>
                </p>
                <p className="mt-1">
                  General inquiries:{" "}
                  <a
                    href="mailto:hello@familysync.com"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    hello@familysync.com
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
            <a href="/terms" className="hover:text-neutral-600 transition-colors">
              Terms of Service
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
