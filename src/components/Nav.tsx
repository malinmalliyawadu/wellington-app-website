import Link from "next/link";
import { APP_STORE_URL } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            Welly
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <Link
              href="/events"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Events
            </Link>
            <Link
              href="/feed"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Feed
            </Link>
            <Link
              href="/map"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Map
            </Link>
            <Link
              href="/guides"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Guides
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={APP_STORE_URL}
            className="hidden rounded-full bg-[#00A5E0] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#0086B8] sm:inline-flex"
          >
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
