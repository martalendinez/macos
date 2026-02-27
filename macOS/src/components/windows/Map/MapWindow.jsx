// src/components/windows/Map/MapWindow.jsx
import "leaflet/dist/leaflet.css";
import "./macosMaps.css";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";

import { getTokens } from "../../../ui/themeTokens";
import { placeDetails } from "./data/placesData";
import Recenter from "./components/Recenter";
import PhotoRow from "./components/PhotoRow";
import PhotoViewer from "./components/PhotoViewer";
import { usePhotoViewer } from "./hooks/usePhotoViewer";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

// ✅ Tile URLs (switch in dark mode)
const LIGHT_TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export default function MapWindow({ uiTheme = "glass", glassContrast = "light", theme = "light" }) {
  const t = getTokens(uiTheme, glassContrast);
  const isMac = t.isMac;
  const isDark = theme === "dark";

  const [selected, setSelected] = useState("stockholm");
  const [query, setQuery] = useState("");

  const current = placeDetails[selected];
  const photos = current?.photos ?? [];
  const viewer = usePhotoViewer(photos);

  const places = useMemo(() => {
    return Object.entries(placeDetails).map(([key, v]) => ({
      key,
      label: v.label ?? v.title,
      title: v.title,
      year: v.year,
      description: v.description,
      coords: v.coords,
    }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return places;
    return places.filter(
      (p) => (p.label || "").toLowerCase().includes(q) || (p.title || "").toLowerCase().includes(q)
    );
  }, [places, query]);

  // ✅ surfaces that respect uiTheme
  const shell = isMac ? (isDark ? "bg-[#1c1c1e]" : "bg-white") : "";
  const sidebar = isMac
    ? isDark
      ? "bg-[#141416] border-r border-white/10"
      : "bg-[#f6f6f6] border-r border-black/10"
    : `${t.softCard} border-r ${t.divider}`;

  const mapFrame = isMac ? (isDark ? "bg-[#1c1c1e]" : "bg-white") : "";

  const textStrong = isMac ? (isDark ? "text-white/90" : "text-black/80") : "text-white/90";
  const textMuted = isMac ? (isDark ? "text-white/55" : "text-black/50") : "text-white/60";

  const listActive = isMac
    ? isDark
      ? "bg-white/10 border-white/10"
      : "bg-white border-black/10 shadow-sm"
    : "bg-white/12 border-white/12";

  const listIdle = isMac
    ? isDark
      ? "hover:bg-white/8 border-transparent"
      : "hover:bg-black/5 border-transparent"
    : "hover:bg-white/10 border-transparent";

  // ✅ choose map tiles by theme
  const tileUrl = useMemo(() => (isDark ? DARK_TILE_URL : LIGHT_TILE_URL), [isDark]);

  // ✅ optional: slightly different attribution if you want (kept simple)
  const tileAttribution = "&copy; OpenStreetMap &copy; CARTO";

  return (
    <div className={`h-full ${shell} ${t.textMain}`}>
      <div className="h-full grid grid-cols-[320px_1fr]">
        {/* LEFT SIDEBAR */}
        <aside className={`h-full ${sidebar} p-4 flex flex-col overflow-hidden`}>
          <div
            className={[
              "rounded-xl px-3 py-2 border",
              isMac
                ? isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-black/10"
                : `border ${t.cardBorder} ${t.cardBgSoft}`,
            ].join(" ")}
          >
            <div className={`text-[11px] ${textMuted} mb-1`}>Search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a place…"
              className={`w-full bg-transparent outline-none text-sm ${textStrong}`}
            />
          </div>

          {/* scroll area */}
          <div className="mt-4 flex-1 overflow-auto pr-1">
            <div className="flex items-center justify-between">
              <div className={`${textStrong} font-semibold`}>Places</div>
              <div className={`${textMuted} text-[11px]`}>{filtered.length} items</div>
            </div>

            <div className="mt-3 space-y-2">
              {filtered.map((p) => {
                const active = p.key === selected;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setSelected(p.key);
                      viewer.resetForPlaceChange();
                    }}
                    className={[
                      "w-full text-left rounded-2xl px-3 py-3 border transition",
                      active ? listActive : listIdle,
                      isMac ? "" : t.cardBorder,
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className={`${textStrong} text-sm font-semibold truncate`}>{p.label}</div>
                      <div className={`${textMuted} text-xs mt-1 line-clamp-2`}>{p.description}</div>
                      <div className={`${textMuted} text-[11px] mt-2`}>{p.year}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Place card */}
            <div
              className={[
                "mt-3 rounded-2xl border p-3",
                isMac
                  ? isDark
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-white"
                  : `${t.softCard}`,
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className={`${textStrong} text-sm font-semibold truncate`}>{current?.title}</div>

                <button
                  type="button"
                  onClick={() => viewer.setShowPhotos((v) => !v)}
                  className={`text-xs underline ${textMuted} hover:opacity-100 opacity-80 transition`}
                >
                  {viewer.showPhotos ? "Hide" : "Photos"}
                </button>
              </div>

              <div className={`${textMuted} text-xs mt-1`}>Fun facts</div>
              <ul className="list-disc ml-5 space-y-1 mt-2 text-xs">
                {(current?.funFacts ?? []).slice(0, 3).map((fact, i) => (
                  <li key={i} className={textMuted}>
                    {fact}
                  </li>
                ))}
              </ul>

              {viewer.showPhotos ? (
                <div className="mt-3">
                  <PhotoRow photos={photos} onOpen={viewer.openViewer} textSub={textMuted} />
                </div>
              ) : null}
            </div>

            <div className="h-2" />
          </div>
        </aside>

        {/* RIGHT MAP */}
        <section className={`relative h-full ${mapFrame}`}>
          <div className="absolute left-4 top-4 z-[999] flex items-center gap-2">
            <div
              className={[
                "rounded-2xl border px-3 py-2 text-xs shadow-sm",
                isMac
                  ? isDark
                    ? "border-white/10 bg-black/30 backdrop-blur-xl text-white/80"
                    : "border-black/10 bg-white/85 backdrop-blur-xl text-black/70"
                  : "border-white/10 bg-black/30 backdrop-blur-xl text-white/80",
              ].join(" ")}
            >
              <span className="opacity-70">Viewing:</span>{" "}
              <span className="font-semibold">{current?.label ?? current?.title}</span>
            </div>

            <button
              type="button"
              onClick={() => viewer.openViewer(0)}
              className={[
                "rounded-2xl border px-3 py-2 text-xs shadow-sm transition",
                isMac
                  ? isDark
                    ? "border-white/10 bg-black/30 hover:bg-black/40 backdrop-blur-xl text-white/85"
                    : "border-black/10 bg-white/85 hover:bg-white/95 backdrop-blur-xl text-black/70"
                  : "border-white/10 bg-black/30 hover:bg-black/40 backdrop-blur-xl text-white/85",
              ].join(" ")}
              title="Open photos"
            >
              📷
            </button>
          </div>

 <div className={`w-full h-full ${isDark ? "dark-mode-map" : ""}`}>
  <MapContainer
    center={current.coords}
    zoom={5}
    scrollWheelZoom
    zoomControl={false}
    className="w-full h-full macos-maps-leaflet"
  >
    <Recenter coords={current.coords} zoom={5} />

    <TileLayer url={tileUrl} attribution={tileAttribution} />

    <ZoomControl position="bottomright" />

    {Object.entries(placeDetails).map(([key, place]) => (
      <Marker key={key} position={place.coords}>
        <Popup className="macosMapsPopup">
          <div className="macosMapsPopupTitle">{place.title}</div>
          <div className="macosMapsPopupDesc">{place.description}</div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
</div>
        </section>
      </div>

      <PhotoViewer
        open={viewer.viewerOpen}
        photos={photos}
        index={viewer.viewerIndex}
        setIndex={viewer.setViewerIndex}
        zoomed={viewer.zoomed}
        setZoomed={viewer.setZoomed}
        onClose={viewer.closeViewer}
        onNext={viewer.next}
        onPrev={viewer.prev}
        theme={theme} // ✅ important for dark/light blur feel
      />
    </div>
  );
}