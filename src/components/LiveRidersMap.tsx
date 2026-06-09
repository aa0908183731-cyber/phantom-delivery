"use client";

import "leaflet/dist/leaflet.css";
import { Fragment, useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { LatLng } from "@/lib/fakeDelivery";

export interface RiderDot {
  id: string;
  pos: LatLng;
  origin: LatLng;
  route: LatLng[];
  label: string;
}

function FitAll({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), {
      padding: [44, 44],
      animate: false,
    });
  }, [map, points]);
  return null;
}

/** 一次顯示很多位外送員，全部沿著各自路線繞向你家（誰都不會到）。 */
export default function LiveRidersMap({
  riders,
  destination,
  dark = false,
}: {
  riders: RiderDot[];
  destination: LatLng;
  dark?: boolean;
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
  const restoIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div class="resto-dot">🏪</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    [],
  );

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const fitPoints = [destination, ...riders.map((r) => r.origin)];

  return (
    <MapContainer
      center={[destination.lat, destination.lng]}
      zoom={13}
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
      <FitAll points={fitPoints} />

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

      {riders.map((r) => (
        <Fragment key={r.id}>
          {r.route.length > 1 && (
            <Polyline
              positions={r.route.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{
                color: dark ? "#e5e7eb" : "#1f2430",
                weight: 3,
                opacity: 0.45,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          )}
          <Marker position={[r.origin.lat, r.origin.lng]} icon={restoIcon} />
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
