import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with the Welly app.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">Support</h1>
      <p className="mb-10 text-foreground/50">
        Need help with Welly? We&apos;re here for you.
      </p>

      <div className="space-y-8 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Contact Us
          </h2>
          <p>
            For any questions, issues, or feedback, email us at{" "}
            <a
              href="mailto:hello@wellyapp.nz"
              className="underline hover:text-foreground"
            >
              hello@wellyapp.nz
            </a>
            . We aim to respond within 48 hours.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">
                How do I create an account?
              </h3>
              <p>
                Download Welly from the App Store and sign in with your Apple
                account. Your account is created automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                How do I delete my account?
              </h3>
              <p>
                Go to your Profile tab, tap the settings icon, and select
                &quot;Delete Account&quot;. Your data will be removed within 30
                days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Why does Welly need my location?
              </h3>
              <p>
                Location is used to show you nearby places on the map, power
                exploration tracking, and unlock achievements as you visit new
                spots. You can use the app without location access, but some
                features will be limited.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                How do I report inappropriate content?
              </h3>
              <p>
                Tap the three-dot menu on any post and select
                &quot;Report&quot;. You can also email us directly at{" "}
                <a
                  href="mailto:hello@wellyapp.nz"
                  className="underline hover:text-foreground"
                >
                  hello@wellyapp.nz
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Is Welly available outside Wellington?
              </h3>
              <p>
                Welly is designed specifically for Wellington, New Zealand. We
                focus on one city to provide the best local discovery experience.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Bug Reports
          </h2>
          <p>
            Found a bug? Please email{" "}
            <a
              href="mailto:hello@wellyapp.nz"
              className="underline hover:text-foreground"
            >
              hello@wellyapp.nz
            </a>{" "}
            with a description of the issue, your device model, and iOS version.
            Screenshots are always helpful.
          </p>
        </section>
      </div>
    </main>
  );
}
