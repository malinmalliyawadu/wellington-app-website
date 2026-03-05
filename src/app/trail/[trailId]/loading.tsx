export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex flex-col gap-3 px-4 py-5">
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="flex gap-4">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 px-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Place */}
      <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900">
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}
