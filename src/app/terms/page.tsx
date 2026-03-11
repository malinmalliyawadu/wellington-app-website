import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the Welly app.",
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-10 text-sm text-foreground/50">
        Last updated: 11 March 2026
      </p>

      <div className="space-y-8 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By creating an account or using the Welly mobile app and website
            (collectively, the &quot;Service&quot;), you agree to be bound by
            these Terms of Service (&quot;Terms&quot;). If you do not agree to
            these Terms, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            2. Eligibility
          </h2>
          <p>
            You must be at least 13 years old to use the Service. By using the
            Service, you represent that you meet this age requirement.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            3. Your Account
          </h2>
          <p>
            You are responsible for maintaining the security of your account and
            for all activity that occurs under it. You must provide accurate
            information when creating your account. You may not impersonate
            another person or create accounts for the purpose of violating these
            Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            4. User-Generated Content
          </h2>
          <p className="mb-3">
            You may post photos, videos, text reviews, guides, comments, and
            other content (&quot;User Content&quot;) on the Service. You retain
            ownership of your User Content, but by posting it you grant Welly a
            non-exclusive, worldwide, royalty-free licence to use, display, and
            distribute your User Content in connection with the Service.
          </p>
          <p>
            You are solely responsible for your User Content. You must not post
            content that violates these Terms or our{" "}
            <a
              href="/community-guidelines"
              className="underline hover:text-foreground"
            >
              Community Guidelines
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            5. Prohibited Conduct
          </h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Post objectionable, offensive, abusive, hateful, threatening,
              harassing, or sexually explicit content
            </li>
            <li>
              Post content that promotes violence, discrimination, or illegal
              activities
            </li>
            <li>Harass, bully, intimidate, or abuse other users</li>
            <li>Impersonate any person or entity</li>
            <li>Post spam, scams, or misleading content</li>
            <li>
              Use the Service to collect personal information about other users
              without their consent
            </li>
            <li>
              Attempt to gain unauthorised access to the Service or other
              users&apos; accounts
            </li>
            <li>
              Use automated means (bots, scrapers) to access the Service without
              permission
            </li>
            <li>Violate any applicable law or regulation</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            6. Content Moderation and Enforcement
          </h2>
          <p className="mb-3">
            Welly has zero tolerance for objectionable content or abusive
            behaviour. We reserve the right to:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Remove any content that violates these Terms or our Community
              Guidelines
            </li>
            <li>
              Suspend or permanently terminate accounts that violate these Terms
            </li>
            <li>
              Take action on reported content within 24 hours of receiving a
              report
            </li>
            <li>
              Report illegal content to the appropriate law enforcement
              authorities
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            7. Reporting and Blocking
          </h2>
          <p>
            If you encounter objectionable content or abusive users, you can
            report them directly within the app using the report feature on any
            post, comment, or user profile. You may also block any user to
            prevent them from viewing your content and to remove their content
            from your feed. Reports are reviewed by our team within 24 hours.
            You may also report content by emailing{" "}
            <a
              href="mailto:hello@wellyapp.nz"
              className="underline hover:text-foreground"
            >
              hello@wellyapp.nz
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            8. Intellectual Property
          </h2>
          <p>
            The Service, including its design, features, and original content
            (excluding User Content), is owned by Welly and protected by
            intellectual property laws. You may not copy, modify, or distribute
            any part of the Service without our permission.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            9. Disclaimers
          </h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any
            kind. We do not guarantee the accuracy of user-generated content,
            place information, or event details. We are not responsible for any
            interactions between users, either online or in person.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            10. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Welly shall not be liable
            for any indirect, incidental, special, or consequential damages
            arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            11. Termination
          </h2>
          <p>
            You may delete your account at any time through the app settings. We
            may suspend or terminate your account if you violate these Terms.
            Upon termination, your right to use the Service ceases immediately.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            12. Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. We will notify you of
            material changes by posting the updated Terms on this page and
            updating the date above. Continued use of the Service after changes
            constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            13. Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of New Zealand. Any disputes
            shall be resolved in the courts of New Zealand.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            14. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
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

      <div className="mt-12 flex justify-center">
        <ThemeToggle />
      </div>
    </main>
  );
}
