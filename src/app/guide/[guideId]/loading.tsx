export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Cover image */}
      <div className="aspect-video w-full animate-pulse bg-gray-200 dark:bg-gray-800" />

      {/* Header */}
      <div className="flex flex-col gap-3 px-4 py-5">
        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Places list */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="px-4 pt-4 pb-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
