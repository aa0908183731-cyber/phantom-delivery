"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
} from "react-leaflet";
import type { LatLng } from "@/lib/fakeDelivery";

export default function TrackingMap({
  rider,
  destination,
  trail,
}: {
  rider: LatLng;
  destination: LatLng;
  trail: LatLng[];
}) {
  // 外送員：白底圓徽 + 粉色邊，套用平滑滑動的 CSS class
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

  // 你家：帶脈動光環的 home pin
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

  const trailPositions = trail.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <MapContainer
      center={[destination.lat, destination.lng]}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
      attributionControl
    >
      {/* CARTO Voyager 圖磚：乾淨、彩色，像真的外送 App */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* 你家周邊的範圍光暈 */}
      <Circle
        center={[destination.lat, destination.lng]}
        radius={180}
        pathOptions={{
          color: "#06c167",
          fillColor: "#06c167",
          fillOpacity: 0.12,
          weight: 1.5,
        }}
      />

      {/* 外送員殘影軌跡（粉色虛線） */}
      {trailPositions.length > 1 && (
        <Polyline
          positions={trailPositions}
          pathOptions={{
            color: "#e3006d",
            weight: 4,
            opacity: 0.6,
            lineCap: "round",
            lineJoin: "round",
            dashArray: "1 10",
          }}
        />
      )}

      <Marker position={[destination.lat, destination.lng]} icon={homeIcon} />
      <Marker position={[rider.lat, rider.lng]} icon={riderIcon} />
    </MapContainer>
  );
}
