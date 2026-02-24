import Image from "next/image";
import { APP_STORE_URL } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        {/* Logo */}
        <Image
          src="/icon.png"
          alt="Welly"
          width={80}
          height={80}
          className="mb-8 rounded-2xl shadow-lg shadow-[#00A5E0]/20"
        />

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Discover Wellington
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-gray-500">
          Follow locals you trust. See their favourite spots on a map. Find
          what&apos;s happening around town.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={APP_STORE_URL}
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700"
          >
            Download for iOS
          </a>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A5E0]/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00A5E0"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Follow Locals</h3>
            <p className="text-sm text-gray-500">
              Friends, food bloggers, event promoters — follow the people who
              know Wellington best.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A5E0]/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00A5E0"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Map-Based Discovery</h3>
            <p className="text-sm text-gray-500">
              See recommendations on a map. Browse what&apos;s nearby or explore
              different neighbourhoods.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A5E0]/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00A5E0"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Events</h3>
            <p className="text-sm text-gray-500">
              Gigs, markets, comedy nights — find what&apos;s on in Wellington
              this week.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>Welly — Made in Wellington</p>
        <nav className="mt-2 flex justify-center gap-4">
          <a href="/privacy" className="underline hover:text-gray-600">
            Privacy
          </a>
          <a href="/support" className="underline hover:text-gray-600">
            Contact
          </a>
        </nav>
      </footer>
    </div>
  );
}
