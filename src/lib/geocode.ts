"use client";

// 用 OpenStreetMap Nominatim 把座標反查成可讀地址（免費、免金鑰）。
// 失敗時退回座標字串，不會中斷流程。

interface NominatimAddress {
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city_district?: string;
  city?: string;
  town?: string;
  county?: string;
  state?: string;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
      `&lat=${lat}&lon=${lng}&accept-language=zh-TW&zoom=18`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("geocode failed");
    const data = (await res.json()) as {
      display_name?: string;
      address?: NominatimAddress;
    };

    const a = data.address;
    if (a) {
      // 依台灣習慣由大到小組合：城市 + 行政區 + 路
      const city = a.city || a.town || a.county || a.state || "";
      const district = a.suburb || a.city_district || "";
      const road = a.road || a.neighbourhood || "";
      const composed = `${city}${district}${road}`.trim();
      if (composed) return composed;
    }
    return data.display_name || `目前位置 (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } catch {
    return `目前位置 (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
}
