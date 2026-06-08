"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import type { LatLng } from "@/lib/fakeDelivery";
import { TAIPEI_CENTER } from "@/lib/fakeDelivery";

export default function TrackingMap({
  rider,
  destination,
  trail,
}: {
  rider: LatLng;
  destination: LatLng;
  trail: LatLng[];
}) {
  const riderIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div class="rider-trail" style="font-size:30px;line-height:1">🛵</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    [],
  );

  const homeIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div style="font-size:26px;line-height:1">🏠</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      }),
    [],
  );

  const trailPositions = trail.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <MapContainer
      center={[TAIPEI_CENTER.lat, TAIPEI_CENTER.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />

      {/* 外送員殘影軌跡 */}
      {trailPositions.length > 1 && (
        <Polyline
          positions={trailPositions}
          pathOptions={{ color: "#e3006d", weight: 3, opacity: 0.55 }}
        />
      )}

      <Marker position={[destination.lat, destination.lng]} icon={homeIcon} />
      <Marker position={[rider.lat, rider.lng]} icon={riderIcon} />
    </MapContainer>
  );
}
