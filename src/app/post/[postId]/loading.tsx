export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Author header */}
      <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </header>

      {/* Media */}
      <div className="aspect-square w-full animate-pulse bg-gray-200 dark:bg-gray-800" />

      {/* Content */}
      <div className="flex flex-col gap-4 px-4 py-5">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Place */}
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-900">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
