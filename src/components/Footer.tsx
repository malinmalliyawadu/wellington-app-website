import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-500">
      <p>Welly — Made in Wellington</p>
      <nav className="mt-2 flex items-center justify-center gap-4">
        <Link
          href="/privacy"
          className="underline hover:text-gray-600 dark:hover:text-gray-300"
        >
          Privacy
        </Link>
        <Link
          href="/support"
          className="underline hover:text-gray-600 dark:hover:text-gray-300"
        >
          Contact
        </Link>
      </nav>
    </footer>
  );
}
