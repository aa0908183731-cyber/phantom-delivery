import Image from "next/image";
import { notFound } from "next/navigation";
import { getRestaurantById } from "@/actions/getRestaurants";
import { getMenuItems, getReviews } from "@/actions/getMenuItems";
import TopBar from "@/components/TopBar";
import RestaurantMenu from "@/components/RestaurantMenu";
import CartSidebar from "@/components/CartSidebar";
import StarRating from "@/components/StarRating";
import { formatNT } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await getRestaurantById(id);
  if (!restaurant) notFound();

  const [menuItems, reviews] = await Promise.all([
    getMenuItems(id),
    getReviews(id),
  ]);

  return (
    <>
      <TopBar showBack />

      {/* Hero banner */}
      <div className="relative h-56 w-full sm:h-72">
        {restaurant.image_url && (
          <Image
            src={restaurant.image_url}
            alt={restaurant.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent" />
      </div>

      <main className="mx-auto -mt-12 max-w-3xl px-4 pb-28">
        {/* 店家資訊 */}
        <div className="card-glow rounded-2xl bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="mb-1 inline-block rounded-full bg-panda/15 px-2.5 py-0.5 text-xs font-medium text-panda">
                {restaurant.category}
              </span>
              <h1 className="text-2xl font-bold text-zinc-900">
                {restaurant.name}
              </h1>
            </div>
            <StarRating rating={restaurant.rating ?? 0} size="md" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
            <span>
              ⭐ {restaurant.rating?.toFixed(1)}（
              {(restaurant.review_count ?? 0).toLocaleString("zh-TW")} 則評論）
            </span>
            <span>🕒 {restaurant.delivery_time}</span>
            <span>💰 最低 {formatNT(restaurant.min_order ?? 0)}</span>
          </div>
        </div>

        {/* 菜單 */}
        <h2 className="mb-3 mt-7 text-lg font-bold">菜單</h2>
        <RestaurantMenu
          menuItems={menuItems}
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />

        {/* 評論 */}
        <h2 className="mb-3 mt-8 text-lg font-bold">顧客評論</h2>
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-800">
                  {rev.reviewer_name}
                </span>
                <span className="text-sm text-gold">
                  {"★".repeat(rev.rating ?? 0)}
                  <span className="text-zinc-300">
                    {"★".repeat(5 - (rev.rating ?? 0))}
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-sm text-zinc-500">{rev.content}</p>
            </div>
          ))}
        </div>

        <CartSidebar />
      </main>
    </>
  );
}
