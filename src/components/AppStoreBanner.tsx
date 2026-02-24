import { APP_STORE_URL } from "@/lib/constants";

export function AppStoreBanner() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
        Discover Wellington with
      </p>
      <p className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Welly</p>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Follow locals. Find the best spots. See what&apos;s on.
      </p>
      <a
        href={APP_STORE_URL}
        className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Download the App
      </a>
    </div>
  );
}
