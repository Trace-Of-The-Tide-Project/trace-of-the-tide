"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DARK_TILE =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export type RouteMapPoint = {
  order: number;
  lat: number;
  lng: number;
};

function isValidCoord(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function numberedDivIcon(n: number) {
  return L.divIcon({
    className: "!m-0 !bg-transparent !border-0",
    html: `<div style="width:28px;height:28px;border-radius:9999px;background:#2a2a2a;border:2px solid #CBA158;color:#e5e5e5;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;font-family:system-ui,sans-serif;">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitRoute({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0]!, 11);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 14 });
  }, [map, points]);
  return null;
}

type TripPreviewRouteMapProps = {
  points: RouteMapPoint[];
  className?: string;
};

export default function TripPreviewRouteMap({ points, className = "" }: TripPreviewRouteMapProps) {
  const positions = useMemo(() => {
    return points
      .filter((p) => isValidCoord(p.lat, p.lng))
      .map((p) => ({ ...p, pos: [p.lat, p.lng] as [number, number] }));
  }, [points]);

  const linePositions = useMemo(
    () => positions.map((p) => p.pos),
    [positions],
  );

  const center: [number, number] = positions[0]?.pos ?? [46.6863, 7.8632];

  if (positions.length === 0) {
    return (
      <div
        className={`flex h-full min-h-[280px] items-center justify-center rounded-xl border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] text-center text-xs text-gray-500 ${className}`}
      >
        Add latitude and longitude to itinerary stops to show the route on the map.
      </div>
    );
  }

  return (
    <div className={`h-full min-h-[280px] w-full overflow-hidden rounded-xl border border-[var(--tott-card-border)] ${className}`}>
      <MapContainer
        center={center}
        zoom={11}
        className="h-full w-full"
        style={{ height: "100%", minHeight: 280 }}
        scrollWheelZoom
        attributionControl
      >
        <TileLayer attribution={TILE_ATTRIB} url={DARK_TILE} />
        {linePositions.length >= 2 && (
          <Polyline
            positions={linePositions}
            pathOptions={{
              color: "#CBA158",
              weight: 5,
              opacity: 0.95,
            }}
          />
        )}
        {positions.map((p) => (
          <Marker key={p.order} position={p.pos} icon={numberedDivIcon(p.order)} />
        ))}
        <FitRoute points={linePositions} />
      </MapContainer>
    </div>
  );
}
