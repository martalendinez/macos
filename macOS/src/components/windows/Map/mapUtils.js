// src/components/windows/Map/mapUtils.js
import L from "leaflet";
import { placeDetails } from "./data/placesData";

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";

// Free Esri basemaps (no API key). Labels come from separate layers.
export const MAP_STYLES = {
  explore: {
    light: [`${ESRI}/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`],
    dark: [
      `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
      `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    ],
  },
  satellite: {
    light: [
      `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
      `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`,
    ],
  },
};
MAP_STYLES.satellite.dark = MAP_STYLES.satellite.light;

export const ATTRIBUTION = "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, USGS, &copy; OpenStreetMap contributors";

// Chronological journey (by start year)
export const JOURNEY = ["spain", "nl", "germany", "stockholm", "canada"].filter((k) => placeDetails[k]);

export function placeName(p) {
  // "Madrid, Spain 🇪🇸" -> { city: "Madrid", country: "Spain", flag: "🇪🇸" }
  const label = p.label ?? p.title;
  const flag = (label.match(/\p{Regional_Indicator}{2}/u) ?? [""])[0];
  const clean = label.replace(flag, "").trim();
  const [city, country] = clean.split(",").map((s) => s.trim());
  return { city, country: country ?? "", flag };
}

/** Round photo pin with a little tail; the selected one grows and shows its name. */
export function photoPin(place, { selected = false, dimmed = false } = {}) {
  const { city } = placeName(place);
  const size = selected ? 56 : 42;
  return L.divIcon({
    className: "am-pin-wrap",
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    html: `
      <div class="am-pin ${selected ? "is-selected" : ""} ${dimmed ? "is-dimmed" : ""}" style="--s:${size}px">
        <div class="am-pin-photo" style="background-image:url('${place.photos?.[0] ?? ""}')"></div>
        <div class="am-pin-tail"></div>
        ${selected ? `<div class="am-pin-label">${city}</div>` : ""}
      </div>`,
  });
}

/** Gently curved line between two points (sampled quadratic Bézier). */
export function curvedRoute(points, bend = 0.18, steps = 32) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [aLat, aLng] = points[i];
    const [bLat, bLng] = points[i + 1];
    const mLat = (aLat + bLat) / 2;
    const mLng = (aLng + bLng) / 2;
    // control point pushed perpendicular to the segment
    const cLat = mLat + (bLng - aLng) * bend;
    const cLng = mLng - (bLat - aLat) * bend;
    for (let t = 0; t <= 1; t += 1 / steps) {
      const u = 1 - t;
      out.push([u * u * aLat + 2 * u * t * cLat + t * t * bLat, u * u * aLng + 2 * u * t * cLng + t * t * bLng]);
    }
  }
  return out;
}

/** Fly so the point lands in the middle of the area NOT covered by the sidebar. */
export function flyToVisible(map, latlng, zoom, sidebarW, opts = {}) {
  const z = zoom ?? map.getZoom();
  const p = map.project(latlng, z).subtract([sidebarW / 2, 0]);
  map.flyTo(map.unproject(p, z), z, { duration: 1.6, easeLinearity: 0.2, ...opts });
}
