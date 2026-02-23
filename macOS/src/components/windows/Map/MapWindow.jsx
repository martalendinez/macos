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

// Default Leaflet marker icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const t = getTokens(uiTheme, glassContrast);
  const isMac = t.isMac;

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
      (p) =>
        (p.label || "").toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q)
    );
  }, [places, query]);

  // macOS Maps-ish surfaces
  const shell = isMac ? "bg-white" : "bg-black/25 backdrop-blur-xl";
  const sidebar = isMac ? "bg-[#f7f7f7] border-r border-black/10" : "bg-white/8 border-r border-white/10";
  const mapFrame = isMac ? "bg-white" : "bg-white/5";

  return (
    <div className={`h-full ${shell} ${t.textMain}`}>
      <div className="h-full grid grid-cols-[320px_1fr]">
        {/* LEFT SIDEBAR */}
        <aside className={`h-full ${sidebar} p-4 flex flex-col overflow-hidden`}>
          {/* Search */}
          <div
            className={`rounded-xl px-3 py-2 border ${
              isMac ? "border-black/10 bg-white" : "border-white/10 bg-white/10"
            }`}
          >
            <div className={`text-[11px] ${t.textSub} mb-1`}>Search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a place…"
              className={`w-full bg-transparent outline-none text-sm ${isMac ? "text-black" : "text-white"}`}
            />
          </div>

          {/* ✅ ONE scroll area so you can reach ALL places */}
          <div className="mt-4 flex-1 overflow-auto pr-1">
            {/* List header */}
            <div className="flex items-center justify-between">
              <div className={`${isMac ? "text-black" : "text-white"} font-semibold`}>Places</div>
              <div className={`${t.textSub} text-[11px]`}>{filtered.length} items</div>
            </div>

            {/* Places list */}
            <div className="mt-3 space-y-2">
              {filtered.map((p) => {
                const active = p.key === selected;

                const activeClass = isMac
                  ? "bg-white border-black/10 shadow-sm"
                  : "bg-white/15 border-white/10";

                const idleClass = isMac
                  ? "bg-transparent border-transparent hover:bg-black/5"
                  : "bg-transparent border-transparent hover:bg-white/10";

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
                      active ? activeClass : idleClass,
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={`${isMac ? "text-black" : "text-white"} text-sm font-semibold truncate`}>
                          {p.label}
                        </div>
                        <div className={`${t.textSub} text-xs mt-1 line-clamp-2`}>
                          {p.description}
                        </div>
                        <div className={`${t.textSub} text-[11px] mt-2`}>{p.year}</div>
                      </div>

                      {active ? (
                        <span
                          className="text-[10px] px-2 py-1 rounded-full border shrink-0"
                          style={{
                            borderColor: "hsl(var(--accent)/0.35)",
                            background: "hsl(var(--accent)/0.12)",
                            color: "hsl(var(--accent))",
                          }}
                        >
                          Selected
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Place card / Photos toggle */}
            <div
              className={`mt-3 rounded-2xl border p-3 ${
                isMac ? "border-black/10 bg-white" : "border-white/10 bg-white/8"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`${isMac ? "text-black" : "text-white"} text-sm font-semibold truncate`}>
                  {current?.title}
                </div>

                <button
                  type="button"
                  onClick={() => viewer.setShowPhotos((p) => !p)}
                  className={`text-xs underline ${t.textSub} hover:opacity-100 opacity-80 transition`}
                >
                  {viewer.showPhotos ? "Hide" : "Photos"}
                </button>
              </div>

              <div className={`${t.textSub} text-xs mt-1`}>Fun facts</div>
              <ul className="list-disc ml-5 space-y-1 mt-2 text-xs">
                {(current?.funFacts ?? []).slice(0, 3).map((fact, i) => (
                  <li key={i} className={t.textSub}>
                    {fact}
                  </li>
                ))}
              </ul>

              {viewer.showPhotos ? (
                <div className="mt-3">
                  <PhotoRow photos={photos} onOpen={viewer.openViewer} textSub={t.textSub} />
                </div>
              ) : null}
            </div>

            <div className="h-2" />
          </div>
        </aside>

        {/* RIGHT MAP */}
        <section className={`relative h-full ${mapFrame}`}>
          {/* Floating chip */}
          <div className="absolute left-4 top-4 z-[999] flex items-center gap-2">
            <div
              className={`rounded-2xl border px-3 py-2 text-xs shadow-sm ${
                isMac ? "border-black/10 bg-white/85 backdrop-blur-xl" : "border-white/10 bg-black/40 backdrop-blur-xl"
              }`}
            >
              <span className={`${t.textSub}`}>Viewing:</span>{" "}
              <span className={`${isMac ? "text-black" : "text-white"} font-semibold`}>
                {current?.label ?? current?.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => viewer.openViewer(0)}
              className={`rounded-2xl border px-3 py-2 text-xs shadow-sm transition ${
                isMac
                  ? "border-black/10 bg-white/85 hover:bg-white/95 backdrop-blur-xl"
                  : "border-white/10 bg-black/40 hover:bg-black/50 backdrop-blur-xl"
              }`}
              title="Open photos"
            >
              📷
            </button>
          </div>

          {/* Map */}
          <MapContainer
            center={current.coords}
            zoom={5}
            scrollWheelZoom
            zoomControl={false}
            className="w-full h-full macos-maps-leaflet"
          >
            <Recenter coords={current.coords} zoom={5} />

            {/* Apple-ish tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap &copy; CARTO"
            />

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
        </section>
      </div>

      {/* Fullscreen viewer */}
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
      />
    </div>
  );
}