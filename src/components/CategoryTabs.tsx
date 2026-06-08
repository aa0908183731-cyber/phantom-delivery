"use client";

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: readonly string[];
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      {categories.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-uber text-black"
                : "bg-surface-2 text-zinc-600 hover:bg-border"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
