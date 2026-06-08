import {
  getRestaurants,
  getRestaurantSearchIndex,
} from "@/actions/getRestaurants";
import TopBar from "@/components/TopBar";
import HomeClient from "@/components/HomeClient";

// 餐廳資料每次請求重新讀取（seed/DB 皆可）
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [restaurants, searchIndex] = await Promise.all([
    getRestaurants(),
    getRestaurantSearchIndex(),
  ]);

  return (
    <>
      <TopBar showLocation />
      <HomeClient restaurants={restaurants} searchIndex={searchIndex} />
    </>
  );
}
