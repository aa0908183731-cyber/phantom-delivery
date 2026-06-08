"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Restaurant } from "@/types/database.types";
import StarRating from "./StarRating";
import { formatNT } from "@/lib/format";
import { useFavoritesStore } from "@/store/favoritesStore";

export default function RestaurantCard({
  restaurant,
  index = 0,
}: {
  restaurant: Restaurant;
  index?: number;
}) {
  const favorited = useFavoritesStore((s) => Boolean(s.ids[restaurant.id]));
  const toggleFav = useFavoritesStore((s) => s.toggle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/restaurant/${restaurant.id}`} className="block">
        <motion.article
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="card-glow overflow-hidden rounded-2xl bg-surface"
        >
          <div className="relative h-40 w-full overflow-hidden">
            {restaurant.image_url && (
              <Image
                src={restaurant.image_url}
                alt={restaurant.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-panda px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              幻想專屬・免運
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFav(restaurant.id);
              }}
              aria-label={favorited ? "取消收藏" : "加入收藏"}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-base backdrop-blur transition hover:scale-110 active:scale-90"
            >
              {favorited ? "❤️" : "🤍"}
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              {restaurant.delivery_time}
            </span>
          </div>

          <div className="space-y-1.5 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-zinc-900">
                {restaurant.name}
              </h3>
              <StarRating rating={restaurant.rating ?? 0} />
            </div>
            <p className="text-xs text-zinc-500">
              {restaurant.category} ・ 評論{" "}
              {(restaurant.review_count ?? 0).toLocaleString("zh-TW")}+
            </p>
            <p className="text-xs text-zinc-500">
              最低訂購 {formatNT(restaurant.min_order ?? 0)}
            </p>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
