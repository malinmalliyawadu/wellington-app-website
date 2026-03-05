"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface CategoryFilterProps {
  categories: { value: string; label: string; color: string }[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const active = searchParams.get("category") ?? "";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const inactiveClass =
    "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700";

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
      <button
        onClick={() => select("")}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
          active === ""
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        }`}
      >
        All
      </button>
      {categories.map((cat) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => select(cat.value)}
            className={
              isActive
                ? "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors text-white"
                : inactiveClass
            }
            style={isActive ? { backgroundColor: cat.color } : undefined}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
