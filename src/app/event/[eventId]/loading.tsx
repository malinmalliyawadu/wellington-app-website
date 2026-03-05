export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="aspect-video w-full animate-pulse bg-gray-200 dark:bg-gray-800" />

      {/* Info strip */}
      <div className="flex gap-3 px-5 pt-5">
        <div className="h-20 w-16 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        <div className="flex flex-1 flex-col justify-center gap-2.5">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Place card */}
      <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl border border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 px-5 pt-5">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}
