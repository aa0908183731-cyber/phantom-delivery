"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import type { LatLng } from "@/lib/fakeDelivery";

// 自動把「餐廳 → 你家」整條路線框進畫面（像 Uber Eats 一打開就看到全程）
function FitRoute({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48], animate: false });
  }, [map, points]);
  return null;
}

export default function TrackingMap({
  rider,
  destination,
  origin,
  route,
  dark = false,
}: {
  rider: LatLng;
  destination: LatLng;
  /** 餐廳位置（路線起點） */
  origin?: LatLng;
  /** 餐廳→你家的導航線 */
  route?: LatLng[];
  dark?: boolean;
}) {
  const riderIcon = useMemo(
    () =>
      L.divIcon({
        className: "rider-marker",
        html: `<div class="rider-badge">🛵</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
    [],
  );

  const homeIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div class="home-pin"><span class="home-pulse"></span><span class="home-emoji">🏠</span></div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      }),
    [],
  );

  const restoIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div class="resto-pin">🏪</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
    [],
  );

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const routeLine = route ?? (origin ? [origin, destination] : []);
  const routePos = routeLine.map((p) => [p.lat, p.lng] as [number, number]);
  const fitPoints = routeLine.length >= 2 ? routeLine : [rider, destination];

  return (
    <MapContainer
      center={[destination.lat, destination.lng]}
      zoom={14}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        key={dark ? "dark" : "light"}
        url={tileUrl}
        attribution="&copy; OpenStreetMap &copy; CARTO"
        subdomains="abcd"
        maxZoom={20}
      />

      <FitRoute points={fitPoints} />

      {/* 你家周邊的範圍光暈 */}
      <Circle
        center={[destination.lat, destination.lng]}
        radius={150}
        pathOptions={{
          color: "#06c167",
          fillColor: "#06c167",
          fillOpacity: 0.12,
          weight: 1.5,
        }}
      />

      {/* 導航路線：先畫白/黑底casing，再畫主線（Uber Eats 風） */}
      {routePos.length > 1 && (
        <>
          <Polyline
            positions={routePos}
            pathOptions={{
              color: dark ? "#000000" : "#ffffff",
              weight: 9,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Polyline
            positions={routePos}
            pathOptions={{
              color: dark ? "#e5e7eb" : "#1f2430",
              weight: 5,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </>
      )}

      {origin && <Marker position={[origin.lat, origin.lng]} icon={restoIcon} />}
      <Marker position={[destination.lat, destination.lng]} icon={homeIcon} />
      <Marker position={[rider.lat, rider.lng]} icon={riderIcon} />
    </MapContainer>
  );
}
