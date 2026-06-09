"use client";

import "leaflet/dist/leaflet.css";
import { Fragment, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  Tooltip,
} from "react-leaflet";
import type { LatLng } from "@/lib/fakeDelivery";

export interface RiderDot {
  id: string;
  pos: LatLng;
  trail: LatLng[];
  label: string;
}

/** 一次顯示很多位外送員，全部繞著你家打轉（誰都不會到）。 */
export default function LiveRidersMap({
  riders,
  destination,
}: {
  riders: RiderDot[];
  destination: LatLng;
}) {
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
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
        subdomains="abcd"
        maxZoom={20}
      />

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

      {riders.map((r) => (
        <Fragment key={r.id}>
          {r.trail.length > 1 && (
            <Polyline
              positions={r.trail.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{
                color: "#e3006d",
                weight: 3.5,
                opacity: 0.5,
                lineCap: "round",
                lineJoin: "round",
                dashArray: "1 10",
              }}
            />
          )}
          <Marker position={[r.pos.lat, r.pos.lng]} icon={riderIcon}>
            <Tooltip
              direction="top"
              offset={[0, -18]}
              permanent={riders.length <= 5}
              className="rider-tip"
            >
              {r.label}
            </Tooltip>
          </Marker>
        </Fragment>
      ))}

      <Marker position={[destination.lat, destination.lng]} icon={homeIcon} />
    </MapContainer>
  );
}
