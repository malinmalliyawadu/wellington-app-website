export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800"
            >
              <div className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-800" />
              <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
