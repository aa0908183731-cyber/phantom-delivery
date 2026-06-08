"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem } from "@/types/database.types";
import MenuItemCard from "./MenuItemCard";
import CategoryTabs from "./CategoryTabs";

export default function RestaurantMenu({
  menuItems,
  restaurantId,
  restaurantName,
}: {
  menuItems: MenuItem[];
  restaurantId: string;
  restaurantName: string;
}) {
  // 依分類分組，保留出現順序
  const groups = useMemo(() => {
    const order: string[] = [];
    const map: Record<string, MenuItem[]> = {};
    for (const m of menuItems) {
      const c = m.category ?? "其他";
      if (!map[c]) {
        map[c] = [];
        order.push(c);
      }
      map[c].push(m);
    }
    return order.map((c) => ({ category: c, items: map[c] }));
  }, [menuItems]);

  const categories = groups.map((g) => g.category);
  const [active, setActive] = useState(categories[0] ?? "");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  // 點分類 → 平滑捲到該區
  function navTo(category: string) {
    setActive(category);
    refs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // 捲動高亮（scroll-spy）：哪一區進入頂部就高亮哪個 tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        const cat = top.target.getAttribute("data-cat");
        if (cat) setActive(cat);
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 },
    );
    const els = Object.values(refs.current).filter(Boolean) as HTMLElement[];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups]);

  return (
    <section>
      <div className="sticky top-14 z-30 -mx-4 bg-bg/90 px-4 py-2 backdrop-blur-md">
        <CategoryTabs categories={categories} active={active} onChange={navTo} />
      </div>

      <div className="mt-2 space-y-7">
        {groups.map((g) => (
          <div
            key={g.category}
            data-cat={g.category}
            ref={(el) => {
              refs.current[g.category] = el;
            }}
            className="scroll-mt-28"
          >
            <h3 className="mb-2.5 text-base font-bold text-zinc-900">
              {g.category}
              <span className="ml-2 text-xs font-normal text-zinc-400">
                {g.items.length} 項
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {g.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  restaurantId={restaurantId}
                  restaurantName={restaurantName}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
