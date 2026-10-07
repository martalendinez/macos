// src/components/windows/Map/MapWindow.jsx
// Apple Maps-style: full-bleed map, floating glass sidebar, photo pins, journey route and a fly-through tour.
import "leaflet/dist/leaflet.css";
import "./macosMaps.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { AnimatePresence, motion } from "framer-motion";

import { placeDetails } from "./data/placesData";
import PhotoViewer from "./components/PhotoViewer";
import { usePhotoViewer } from "./hooks/usePhotoViewer";
import { ATTRIBUTION, JOURNEY, MAP_STYLES, curvedRoute, flyToVisible, photoPin, placeName } from "./mapUtils";

const SIDEBAR_W = 330;
const CITY_ZOOM = 11;
const TOUR_MS = 4200;

const PLACES = JOURNEY.map((key) => ({ key, ...placeDetails[key], ...placeName(placeDetails[key]) }));
const ROUTE = curvedRoute(PLACES.map((p) => p.coords));

function Chevron({ dir = "right", className = "w-3 h-3" }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "right" ? "M4.5 2.5 8 6l-3.5 3.5" : "M7.5 2.5 4 6l3.5 3.5"} />
    </svg>
  );
}

function ActionButton({ icon, label, onClick, primary, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 rounded-[10px] py-2 text-[11px] font-medium transition active:scale-95 ${
        primary ? "bg-[#0a84ff] text-white hover:bg-[#2a95ff]" : isDark ? "bg-white/10 text-[#4aa3ff] hover:bg-white/15" : "bg-black/[0.05] text-[#0a6fe0] hover:bg-black/[0.08]"
      }`}
    >
      <span className="text-[17px] leading-none">{icon}</span>
      {label}
    </button>
  );
}

export default function MapWindow({ theme = "light", onOpenWindow }) {
  const isDark = theme === "dark";
  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState(null); // place key or null (= overview)
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("explore");
  const [tour, setTour] = useState(null); // index into PLACES while touring

  const place = PLACES.find((p) => p.key === selected) ?? null;
  const viewer = usePhotoViewer(place?.photos ?? []);
  const tourTimer = useRef(null);

  // ---------- camera ----------
  const showAll = useCallback(
    (animate = true) => {
      if (!map) return;
      map.flyToBounds(
        PLACES.map((p) => p.coords),
        { paddingTopLeft: [SIDEBAR_W + 40, 60], paddingBottomRight: [60, 60], duration: animate ? 1.4 : 0, maxZoom: 5 }
      );
    },
    [map]
  );

  const focus = useCallback(
    (key, opts) => {
      const p = PLACES.find((x) => x.key === key);
      if (!p || !map) return;
      setSelected(key);
      viewer.resetForPlaceChange?.();
      flyToVisible(map, p.coords, CITY_ZOOM, SIDEBAR_W, opts);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map]
  );

  // first view: the whole journey
  useEffect(() => {
    if (!map) return;
    const t = setTimeout(() => {
      map.invalidateSize();
      showAll(false);
    }, 50);
    return () => clearTimeout(t);
  }, [map, showAll]);

  // keep tiles filling the window while it is resized/zoomed
  useEffect(() => {
    if (!map) return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map]);

  // ---------- journey tour ----------
  const stopTour = useCallback(() => {
    clearTimeout(tourTimer.current);
    setTour(null);
  }, []);

  useEffect(() => {
    if (tour == null) return;
    if (tour >= PLACES.length) {
      // finale: back home
      focus("stockholm", { duration: 2.2 });
      setTour(null);
      return;
    }
    // zoom out between stops for that "flying over the world" feel
    const p = PLACES[tour];
    flyToVisible(map, p.coords, CITY_ZOOM - 1, SIDEBAR_W, { duration: tour === 0 ? 1.8 : 2.6 });
    setSelected(p.key);
    tourTimer.current = setTimeout(() => setTour((t) => (t == null ? t : t + 1)), TOUR_MS);
    return () => clearTimeout(tourTimer.current);
  }, [tour, map, focus]);

  // ---------- data ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PLACES;
    return PLACES.filter((p) => [p.city, p.country, p.description, p.year].join(" ").toLowerCase().includes(q));
  }, [query]);

  const icons = useMemo(
    () => Object.fromEntries(PLACES.map((p) => [p.key, photoPin(p, { selected: p.key === selected, dimmed: !!selected && p.key !== selected })])),
    [selected]
  );

  const style = MAP_STYLES[mode][isDark ? "dark" : "light"];
  const journeyIndex = place ? PLACES.findIndex((p) => p.key === place.key) : -1;
  const nextPlace = place ? PLACES[(journeyIndex + 1) % PLACES.length] : null;

  // ---------- styles ----------
  const glass = isDark
    ? "bg-[#1e1e20]/80 text-white ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
    : "bg-white/75 text-black ring-1 ring-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.18)]";
  const sub = isDark ? "text-white/55" : "text-black/50";
  const hover = isDark ? "hover:bg-white/10" : "hover:bg-black/[0.05]";
  const divider = isDark ? "border-white/10" : "border-black/10";
  const ctrl = `${glass} backdrop-blur-2xl backdrop-saturate-150`;

  return (
    <div className="no-darkwin relative h-full w-full overflow-hidden" style={{ background: isDark ? "#1b1b1d" : "#e8eef0" }}>
      {/* MAP */}
      <MapContainer
        ref={setMap}
        center={[50, 5]}
        zoom={4}
        zoomControl={false}
        scrollWheelZoom
        worldCopyJump
        minZoom={2}
        maxZoom={16}
        className={`absolute inset-0 w-full h-full apple-maps ${isDark && mode === "explore" ? "is-dark" : ""}`}
      >
        {style.map((url, i) => (
          <TileLayer key={url} url={url} maxZoom={16} attribution={i === 0 ? ATTRIBUTION : undefined} />
        ))}

        {/* journey route: soft halo + animated dashes */}
        <Polyline positions={ROUTE} pathOptions={{ color: "#ffffff", weight: 7, opacity: isDark ? 0.25 : 0.8 }} />
        <Polyline positions={ROUTE} pathOptions={{ color: "#0a84ff", weight: 3.5, dashArray: "2 10", lineCap: "round", className: "am-route" }} />

        {PLACES.map((p) => (
          <Marker
            key={p.key}
            position={p.coords}
            icon={icons[p.key]}
            zIndexOffset={p.key === selected ? 1000 : 0}
            eventHandlers={{
              click: () => {
                stopTour();
                focus(p.key);
              },
            }}
            title={`${p.city}, ${p.country}`}
          />
        ))}
      </MapContainer>

      {/* SIDEBAR */}
      <aside
        className={`absolute left-3 top-3 bottom-3 z-[500] rounded-2xl backdrop-blur-2xl backdrop-saturate-150 flex flex-col overflow-hidden ${glass}`}
        style={{ width: SIDEBAR_W - 12 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!place ? (
            <motion.div
              key="home"
              className="flex-1 min-h-0 flex flex-col"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              <div className="p-3">
                <div className={`flex items-center gap-2 rounded-[10px] px-2.5 h-8 ${isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
                  <svg viewBox="0 0 16 16" className={`w-3.5 h-3.5 ${sub}`} fill="none" aria-hidden="true">
                    <circle cx="6.8" cy="6.8" r="4.6" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M10.3 10.3l3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && filtered[0] && focus(filtered[0].key)}
                    placeholder="Search Maps"
                    aria-label="Search places"
                    className={`flex-1 bg-transparent outline-none text-[13px] ${isDark ? "placeholder:text-white/40" : "placeholder:text-black/40"}`}
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3">
                {/* Guide card */}
                {!query && (
                  <div className="rounded-xl overflow-hidden relative h-[150px] mb-4 group">
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px">
                      {PLACES.slice(0, 5).map((p, i) => (
                        <div
                          key={p.key}
                          className={`bg-cover bg-center ${i === 0 ? "row-span-2" : ""} group-hover:scale-105 transition duration-700`}
                          style={{ backgroundImage: `url(${p.photos[1] ?? p.photos[0]})` }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute left-3 right-3 bottom-3 text-white">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75">Guide</div>
                      <div className="text-[17px] font-bold leading-tight">Marta's Journey</div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[11px] text-white/80">
                          {PLACES.length} places · {PLACES[0].year.split("–")[0]} → today
                        </span>
                        <button
                          onClick={() => setTour(0)}
                          className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-semibold hover:bg-white/90 active:scale-95 transition"
                        >
                          ▶ Play Journey
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between px-1 mb-1">
                  <div className="text-[13px] font-bold">{query ? "Results" : "My Places"}</div>
                  {!query && (
                    <button onClick={() => showAll()} className="text-[12px] text-[#0a84ff] hover:underline">
                      Show all
                    </button>
                  )}
                </div>

                {filtered.length === 0 && <div className={`px-1 py-6 text-center text-[13px] ${sub}`}>No places match “{query}”</div>}

                {filtered.map((p) => (
                  <button key={p.key} onClick={() => focus(p.key)} className={`w-full flex items-center gap-3 rounded-[10px] p-2 text-left ${hover}`}>
                    <span className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 ring-2 ring-white shadow" style={{ backgroundImage: `url(${p.photos[0]})` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold truncate">
                        {p.city} <span className="font-normal">{p.flag}</span>
                      </span>
                      <span className={`block text-[11px] truncate ${sub}`}>
                        {p.year} · {p.description}
                      </span>
                    </span>
                    <Chevron className={`w-3 h-3 ${sub}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={place.key}
              className="flex-1 min-h-0 flex flex-col"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between px-2 pt-2">
                <button
                  onClick={() => {
                    stopTour();
                    setSelected(null);
                    showAll();
                  }}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[13px] text-[#0a84ff] hover:bg-[#0a84ff]/10"
                >
                  <Chevron dir="left" /> My Places
                </button>
                {tour != null && (
                  <span className={`text-[11px] font-medium ${sub}`}>
                    Stop {Math.min(tour + 1, PLACES.length)} of {PLACES.length}
                  </span>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
                <div className="pt-1">
                  <div className="text-[24px] font-bold leading-tight">{place.city}</div>
                  <div className={`text-[13px] ${sub}`}>
                    {place.flag} {place.country} · {place.year}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <ActionButton isDark={isDark} primary icon="🖼️" label="Photos" onClick={() => viewer.openViewer(0)} />
                  <ActionButton isDark={isDark} icon="◎" label="Stories" onClick={() => onOpenWindow?.("instagram")} />
                  <ActionButton
                    isDark={isDark}
                    icon="➜"
                    label="Next stop"
                    onClick={() => {
                      stopTour();
                      focus(nextPlace.key);
                    }}
                  />
                </div>

                {/* photo strip */}
                <div className="mt-3 -mx-4 px-4 scroll-px-4 flex gap-2 overflow-x-auto snap-x pb-1">
                  {place.photos.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => viewer.openViewer(i)}
                      className={`shrink-0 snap-start rounded-[10px] overflow-hidden bg-black/10 ${i === 0 ? "w-[180px]" : "w-[120px]"} h-[120px]`}
                    >
                      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    </button>
                  ))}
                </div>

                <div className={`mt-4 rounded-xl p-3 ${isDark ? "bg-white/[0.06]" : "bg-black/[0.035]"}`}>
                  <div className={`text-[11px] font-semibold uppercase tracking-wide ${sub}`}>About</div>
                  <div className="mt-1 text-[13px] leading-snug">{place.description}</div>
                </div>

                <div className="mt-3">
                  <div className={`px-1 text-[11px] font-semibold uppercase tracking-wide ${sub}`}>Fun facts</div>
                  <div className={`mt-1.5 rounded-xl divide-y ${isDark ? "bg-white/[0.06] divide-white/10" : "bg-black/[0.035] divide-black/10"}`}>
                    {place.funFacts.map((f) => (
                      <div key={f} className="px-3 py-2.5 text-[13px] leading-snug">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`mt-3 rounded-xl p-3 text-[12px] space-y-1.5 ${isDark ? "bg-white/[0.06]" : "bg-black/[0.035]"}`}>
                  <div className={`text-[11px] font-semibold uppercase tracking-wide ${sub}`}>Details</div>
                  <div className="flex justify-between">
                    <span className={sub}>Lived here</span>
                    <span className="font-medium">{place.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={sub}>Stop on the journey</span>
                    <span className="font-medium">
                      {journeyIndex + 1} of {PLACES.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={sub}>Coordinates</span>
                    <span className="font-medium tabular-nums">
                      {place.coords[0].toFixed(3)}° N, {Math.abs(place.coords[1]).toFixed(3)}° {place.coords[1] < 0 ? "W" : "E"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* MAP STYLE PICKER */}
      <div className={`absolute top-3 right-3 z-[500] rounded-[10px] p-0.5 flex text-[12px] font-medium ${ctrl}`}>
        {[
          ["explore", "Explore"],
          ["satellite", "Satellite"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            className={`px-3 py-1 rounded-[8px] transition ${mode === k ? (isDark ? "bg-white/20" : "bg-white shadow-sm") : "opacity-70 hover:opacity-100"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TOUR BANNER */}
      <AnimatePresence>
        {tour != null && (
          <motion.div
            className={`absolute top-3 left-1/2 z-[600] rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-3 text-[12px] ${ctrl}`}
            style={{ x: "-50%", marginLeft: SIDEBAR_W / 2 }}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
          >
            <span className="font-semibold">✈️ Playing Marta's Journey</span>
            <span className="flex gap-1">
              {PLACES.map((p, i) => (
                <span key={p.key} className={`w-1.5 h-1.5 rounded-full ${i <= tour ? "bg-[#0a84ff]" : isDark ? "bg-white/25" : "bg-black/20"}`} />
              ))}
            </span>
            <button onClick={stopTour} className="px-2.5 py-1 rounded-full bg-[#ff3b30] text-white font-semibold">
              Stop
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZOOM + HOME CONTROLS */}
      <div className="absolute right-3 bottom-8 z-[500] flex flex-col gap-2">
        <button
          onClick={() => {
            stopTour();
            focus("stockholm");
          }}
          className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-[15px] ${ctrl}`}
          title="Home: Stockholm"
          aria-label="Fly home to Stockholm"
        >
          🏠
        </button>
        <div className={`rounded-[10px] flex flex-col overflow-hidden ${ctrl}`}>
          <button onClick={() => map?.zoomIn()} className={`w-9 h-9 text-[18px] ${hover}`} aria-label="Zoom in">
            +
          </button>
          <div className={`h-px mx-2 ${isDark ? "bg-white/15" : "bg-black/10"}`} />
          <button onClick={() => map?.zoomOut()} className={`w-9 h-9 text-[18px] ${hover}`} aria-label="Zoom out">
            −
          </button>
        </div>
      </div>

      <PhotoViewer
        open={viewer.viewerOpen}
        photos={place?.photos ?? []}
        index={viewer.viewerIndex}
        setIndex={viewer.setViewerIndex}
        zoomed={viewer.zoomed}
        setZoomed={viewer.setZoomed}
        onClose={viewer.closeViewer}
        onNext={viewer.next}
        onPrev={viewer.prev}
        theme={theme}
      />
    </div>
  );
}
