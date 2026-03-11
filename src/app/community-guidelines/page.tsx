import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "Community Guidelines for the Welly app.",
};

export default function CommunityGuidelinesPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">Community Guidelines</h1>
      <p className="mb-10 text-sm text-foreground/50">
        Last updated: 11 March 2026
      </p>

      <div className="space-y-8 text-foreground/80 leading-relaxed">
        <section>
          <p>
            Welly is a community built around discovering and sharing the best
            of Wellington. To keep this a welcoming, safe, and useful space for
            everyone, we ask all users to follow these guidelines. Violations
            may result in content removal and account suspension or termination.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Zero Tolerance for Objectionable Content
          </h2>
          <p>
            Welly has a strict zero-tolerance policy for objectionable content.
            This includes, but is not limited to:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              <strong>Hate speech</strong> &mdash; Content that attacks or
              demeans individuals or groups based on race, ethnicity, national
              origin, religion, gender, gender identity, sexual orientation,
              disability, or age
            </li>
            <li>
              <strong>Harassment and bullying</strong> &mdash; Targeting other
              users with threats, intimidation, personal attacks, or unwanted
              repeated contact
            </li>
            <li>
              <strong>Violence and threats</strong> &mdash; Content that
              threatens, promotes, or glorifies violence against any person or
              group
            </li>
            <li>
              <strong>Sexually explicit content</strong> &mdash; Pornography,
              nudity, or sexually suggestive content
            </li>
            <li>
              <strong>Illegal content</strong> &mdash; Content that promotes or
              facilitates illegal activities, including drug use, theft, or fraud
            </li>
            <li>
              <strong>Self-harm</strong> &mdash; Content that promotes or
              glorifies self-harm or suicide
            </li>
            <li>
              <strong>Misinformation</strong> &mdash; Deliberately false or
              misleading content that could cause harm
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Zero Tolerance for Abusive Users
          </h2>
          <p>
            We do not tolerate abusive behaviour towards other users. This
            includes:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Sending harassing or threatening messages or comments</li>
            <li>
              Creating accounts for the purpose of harassing or targeting others
            </li>
            <li>Doxxing or sharing others&apos; private information</li>
            <li>Impersonating other users or public figures</li>
            <li>Coordinated inauthentic behaviour or brigading</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Content Standards
          </h2>
          <p>When sharing on Welly, please:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              Share genuine recommendations and honest reviews of places in
              Wellington
            </li>
            <li>
              Only post photos and videos you have the right to share
            </li>
            <li>Respect the privacy of others &mdash; don&apos;t share photos of people without their consent</li>
            <li>
              Keep reviews fair and constructive &mdash; critique is welcome, but
              personal attacks on business owners or staff are not
            </li>
            <li>
              Don&apos;t post spam, advertisements, or promotional content
              unrelated to Wellington places and experiences
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Reporting and Blocking
          </h2>
          <p className="mb-3">
            If you see content or behaviour that violates these guidelines, you
            can:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Report</strong> &mdash; Tap the three-dot menu on any
              post, comment, or user profile and select &quot;Report&quot;.
              Choose the reason that best describes the issue.
            </li>
            <li>
              <strong>Block</strong> &mdash; Block a user from their profile to
              immediately remove all their content from your feed and prevent
              them from seeing your content.
            </li>
            <li>
              <strong>Email</strong> &mdash; Contact us directly at{" "}
              <a
                href="mailto:hello@wellyapp.nz"
                className="underline hover:text-foreground"
              >
                hello@wellyapp.nz
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            How We Enforce These Guidelines
          </h2>
          <p className="mb-3">
            Our team reviews all reports within 24 hours. Depending on the
            severity of the violation, we may:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Remove the offending content</li>
            <li>Issue a warning to the user</li>
            <li>Temporarily suspend the user&apos;s account</li>
            <li>Permanently terminate the user&apos;s account</li>
            <li>Report the content to law enforcement if required by law</li>
          </ul>
          <p className="mt-3">
            Serious violations (threats of violence, exploitation, illegal
            content) will result in immediate account termination without
            warning.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Appeals
          </h2>
          <p>
            If you believe your content was removed or your account was
            suspended in error, you may contact us at{" "}
            <a
              href="mailto:hello@wellyapp.nz"
              className="underline hover:text-foreground"
            >
              hello@wellyapp.nz
            </a>{" "}
            to request a review. We will respond within 48 hours.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Changes to These Guidelines
          </h2>
          <p>
            We may update these guidelines from time to time. Material changes
            will be communicated through the app or by updating this page.
          </p>
        </section>
      </div>

      <div className="mt-12 flex justify-center">
        <ThemeToggle />
      </div>
    </main>
  );
}
