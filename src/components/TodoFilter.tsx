"use client";

import { FilterType } from "@/types/todo";

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: TodoFilterProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {activeCount} {activeCount === 1 ? "item" : "items"} left
      </span>

      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === value
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="text-sm text-gray-500 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:text-red-400"
      >
        Clear completed
      </button>
    </div>
  );
}
