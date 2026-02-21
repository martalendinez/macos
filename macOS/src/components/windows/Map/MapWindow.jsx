import "leaflet/dist/leaflet.css";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  const [selected, setSelected] = useState("stockholm");

  const current = placeDetails[selected];
  const photos = current?.photos ?? [];

  const viewer = usePhotoViewer(photos);

  const places = useMemo(() => {
    return Object.entries(placeDetails).map(([key, v]) => ({
      key,
      label: v.label ?? v.title,
      year: v.year,
    }));
  }, []);

  const cardClass = `${t.softCard} p-5`; // uses border + bg from tokens

  return (
    <div className={`h-full flex flex-col ${t.textMain}`}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className={`${t.isMac ? "text-black" : "text-white"} text-lg font-semibold`}>Where I’ve lived & studied</div>
        <div className={`${t.textSub} text-sm mt-1`}>Explore the places I’ve called home.</div>
        <div className={`mt-4 h-px ${t.divider}`} />
      </div>

      {/* Layout */}
      <div className="flex-1 overflow-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className={`lg:col-span-2 rounded-2xl ${cardClass} flex flex-col`}>
          <div className={`${t.textSub} text-xs mb-3`}>Interactive map</div>

          {/* Map */}
          <div className="h-[260px] lg:h-[280px] rounded-xl overflow-hidden relative">
            <MapContainer center={current.coords} zoom={5} scrollWheelZoom={false} className="w-full h-full">
              <Recenter coords={current.coords} zoom={5} />

              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

              {Object.entries(placeDetails).map(([key, place]) => (
                <Marker key={key} position={place.coords}>
                  <Popup>
                    <strong>{place.title}</strong>
                    <br />
                    {place.description}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Fun facts */}
          <div className="mt-5">
            <div className={`${t.isMac ? "text-black" : "text-white"} text-sm mb-2`}>Fun facts — {current.title}</div>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {current.funFacts.map((fact, i) => (
                <li key={i} className={t.textSub}>
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Photos toggle */}
          <div className="mt-5">
            <button
              onClick={() => viewer.setShowPhotos((p) => !p)}
              className="text-sm underline opacity-80 hover:opacity-100 transition"
              type="button"
            >
              {viewer.showPhotos ? "Hide photos" : "See photos"}
            </button>

            {viewer.showPhotos ? (
              <div className="mt-4">
                <PhotoRow photos={photos} onOpen={viewer.openViewer} textSub={t.textSub} />
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT */}
        <div className={`lg:col-span-1 rounded-2xl ${cardClass} flex flex-col`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`${t.isMac ? "text-black" : "text-white"} font-semibold`}>Places</div>
            <div className={`${t.textSub} text-[11px]`}>Tap to explore</div>
          </div>

          <div className="space-y-2">
            {places.map((p) => {
              const active = selected === p.key;

              const activeClass = t.isMac
                ? "bg-[hsl(var(--accent)/0.12)] border-[hsl(var(--accent)/0.35)]"
                : "bg-white/15 border-white/10";

              const idleClass = t.isMac ? "border-black/10 hover:bg-black/5" : "border-white/10 hover:bg-white/10";

              return (
                <button
                  key={p.key}
                  onClick={() => {
                    setSelected(p.key);
                    viewer.resetForPlaceChange();
                  }}
                  className={`w-full text-left rounded-xl px-3 py-3 border transition ${active ? activeClass : idleClass}`}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <div className={`${t.isMac ? "text-black" : "text-white"} text-sm font-medium`}>{p.label}</div>
                    {active ? (
                      <span className="text-[10px] uppercase text-[hsl(var(--accent))] opacity-80">Selected</span>
                    ) : null}
                  </div>
                  <div className={`${t.textSub} text-xs mt-1`}>{p.year}</div>
                </button>
              );
            })}
          </div>
        </div>
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