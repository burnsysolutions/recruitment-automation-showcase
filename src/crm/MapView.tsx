import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface Pin {
  id: string;
  lat: number;
  lng: number;
  kind: "site" | "person" | "chosen" | "prospect";
  label: string;
  rank?: number;
}

const COLOURS = { site: "#DE1314", person: "#6b7f9e", chosen: "#002149", prospect: "#8a5a00" };

function icon(p: Pin) {
  if (p.kind === "site" || p.kind === "prospect") {
    return L.divIcon({
      className: "map-pin",
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      html: `<span style="display:block;width:22px;height:22px;border-radius:6px;background:${COLOURS[p.kind]};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>`,
    });
  }
  const size = p.rank ? 24 : 12;
  return L.divIcon({
    className: "map-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: p.rank
      ? `<span style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:999px;background:${COLOURS[p.kind]};color:#fff;font:600 11px Poppins,sans-serif;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)">${p.rank}</span>`
      : `<span style="display:block;width:12px;height:12px;border-radius:999px;background:${COLOURS[p.kind]};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.25)"></span>`,
  });
}

export function MapView({ pins, radius, center, height = 340 }: { pins: Pin[]; radius?: number; center?: { lat: number; lng: number }; height?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
    // Esri light grey canvas: base plus a separate label layer drawn above the pins' background
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16,
      attribution: "Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    }).addTo(map.current);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16,
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    g.clearLayers();
    if (center && radius) L.circle([center.lat, center.lng], { radius: radius * 1609.34, color: "#002149", weight: 1, fillColor: "#002149", fillOpacity: 0.04, dashArray: "4 4" }).addTo(g);
    const ordered = [...pins].sort((a, b) => (a.rank ? 100 - a.rank : 0) - (b.rank ? 100 - b.rank : 0));
    ordered.forEach((p) => L.marker([p.lat, p.lng], { icon: icon(p), zIndexOffset: p.kind === "site" ? 2000 : p.rank ? 1000 - p.rank * 20 : 0 }).bindTooltip(p.label, { direction: "top", offset: [0, -8] }).addTo(g));
    const pts = pins.map((p) => [p.lat, p.lng] as [number, number]);
    const focus = pins.filter((p) => p.kind === "site" || p.rank).map((p) => [p.lat, p.lng] as [number, number]);
    if (focus.length > 1) {
      m.fitBounds(L.latLngBounds(focus), { padding: [36, 36], maxZoom: 12 });
    } else if (center && radius) {
      m.fitBounds(L.latLng(center.lat, center.lng).toBounds(radius * 1609.34 * 2), { padding: [10, 10] });
    } else if (pts.length) {
      m.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 12 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pins), radius, center?.lat, center?.lng]);

  return <div ref={el} style={{ height }} className="w-full overflow-hidden" role="img" aria-label="Map of the site and the people near it" />;
}
