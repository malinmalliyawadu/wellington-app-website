import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Welly app.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-10 text-sm text-foreground/50">
        Last updated: 24 February 2026
      </p>

      <div className="space-y-8 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Introduction
          </h2>
          <p>
            Welly (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a
            map-based social app for discovering things to do in Wellington, New
            Zealand. This Privacy Policy explains how we collect, use, and
            protect your information when you use the Welly mobile app and
            website (collectively, the &quot;Service&quot;).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Information We Collect
          </h2>
          <h3 className="mb-1 font-semibold text-foreground">
            Account Information
          </h3>
          <p className="mb-3">
            When you create an account, we collect your name, email address,
            username, and profile photo. If you sign in with Apple, we receive
            the information you authorise Apple to share.
          </p>
          <h3 className="mb-1 font-semibold text-foreground">
            Content You Create
          </h3>
          <p className="mb-3">
            Posts, photos, videos, comments, and reviews you share on the
            Service are stored and displayed publicly to other users.
          </p>
          <h3 className="mb-1 font-semibold text-foreground">Location Data</h3>
          <p className="mb-3">
            With your permission, we collect your device location to show nearby
            places, power the map view, track exploration progress, and enable
            the fog-of-war feature. You can disable location access at any time
            in your device settings.
          </p>
          <h3 className="mb-1 font-semibold text-foreground">Usage Data</h3>
          <p>
            We collect information about how you interact with the Service, such
            as places you view, posts you like, and events you save.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Provide, maintain, and improve the Service</li>
            <li>Show you personalised recommendations and map content</li>
            <li>Display posts from people you follow</li>
            <li>Power exploration tracking and achievements</li>
            <li>Send notifications you have opted into</li>
            <li>Respond to support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Sharing Your Information
          </h2>
          <p>
            We do not sell your personal information. Your public profile,
            posts, and activity are visible to other users of the Service. We
            may share information with third-party service providers that help
            us operate the Service (e.g. hosting, analytics), but only as
            necessary to provide the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p>
            The Service uses third-party services including Supabase (hosting
            and authentication), Google Places API (place search and details),
            and Apple MapKit (map data). These services have their own privacy
            policies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Data Retention
          </h2>
          <p>
            We retain your information for as long as your account is active. If
            you delete your account, we will delete your personal data within 30
            days, except where we are required to retain it by law.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Your Rights
          </h2>
          <p>
            You can access, update, or delete your account information at any
            time through the app. You may also request a copy of your data or
            ask us to delete your account by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Children&apos;s Privacy
          </h2>
          <p>
            The Service is not intended for children under the age of 13. We do
            not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the updated policy on this
            page and updating the date above.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:hello@wellyapp.nz"
              className="underline hover:text-foreground"
            >
              hello@wellyapp.nz
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
