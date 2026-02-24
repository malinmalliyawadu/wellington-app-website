"use client";

/* eslint-disable @next/next/no-img-element */

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-gray-950">
      <img
        src="/icon.png"
        alt="Welly"
        width={64}
        height={64}
        className="mb-6 rounded-2xl shadow-lg shadow-[#00A5E0]/20"
      />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We hit an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#00A5E0] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0086B8]"
      >
        Try again
      </button>
    </div>
  );
}
