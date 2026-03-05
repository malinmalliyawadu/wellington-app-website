export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-3 border-b border-gray-100 px-4 py-8 dark:border-gray-800">
        <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3.5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="flex gap-6 pt-2">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>
    </div>
  );
}
