import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Example import (add more as needed)
import spain1 from "../../imgs/map/canada1.jpg";
import spain2 from "../../imgs/map/canada2.jpg";

// Default Leaflet marker icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

// Recenter map when coords change
function Recenter({ coords }) {
  const map = useMap();
  map.setView(coords, 5, { animate: true });
  return null;
}

// Place data
const placeDetails = {
  spain: {
    title: "Spain",
    description: "Where I grew up — sunny, warm, and full of memories.",
    funFacts: [
      "Born and raised in a tiny village — the kind of place that makes you dream about seeing the world 🌍",
      "First wanted to become a pilot… until the news showed too many plane crashes lol",
      "Fell in love with design 🎨 early and started shaping my creative path",
      "Completed my bachelor thesis at PrideCom, working as a full‑stack intern 💻",
    ],
    year: "2002–2020",
    coords: [40.4168, -3.7038],
    photos: [spain1, spain2, spain1, spain2, spain1, spain1, spain2],
  },
  nl: {
    title: "Netherlands",
    description: "My university years — biking, canals, and design school.",
    funFacts: [
      "First time living abroad — honestly a rough start. Covid, distance, and homesickness… but those challenges shaped me more than anything.",
      "Started taking coding courses here and discovered I actually love programming 💻",
      "Completed a programming internship at Extra Nice — my first real step into creative tech 🚀",
    ],
    year: "2020–2024",
    coords: [52.3676, 4.9041],
    photos: [],
  },
  germany: {
    title: "Germany",
    description: "Exchange semester — research, tech, and pretzels.",
    funFacts: [
      "My first exchange semester — the moment I realized I loved living abroad. Made friends right away, felt like I found my place ✨",
      "This is where I learned I thrive in UI and programming — everything clicked here",
      "Developed a mild (okay, major) 🚌 FlixBus addiction",
    ],
    year: "2022–2023",
    coords: [52.52, 13.405],
    photos: [],
  },
  stockholm: {
    title: "Stockholm, Sweden",
    description: "My current home — design, fika, and snow.",
    funFacts: [
      "The first place where everything truly clicked — life, friends, career…",
      "Found friends who felt like family and a rhythm that finally felt like me 🤍",
      "Fika is a lifestyle 🧘‍♀️",
      "Where this OS was built!",
    ],
    year: "2024 →",
    coords: [59.3293, 18.0686],
    photos: [],
  },
  canada: {
    title: "Canada",
    description: "A short adventure abroad in 2015.",
    funFacts: [
      "My first time outside Europe, dealing with time zones like a champ (eventually)",
      "The most fun I’ve ever had — traveling across Canada, the US, and the Caribbean ✈️",
      "Lived with a lovely host family — including a dog and a tiny puppy who followed me everywhere 🐶",
    ],
    year: "2025",
    coords: [43.6532, -79.3832],
    photos: [],
  },
};

export default function MapWindow({ uiTheme = "glass" }) {
  const isMac = uiTheme === "macos";
  const [selected, setSelected] = useState("stockholm");

  const [showPhotos, setShowPhotos] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const styles = useMemo(() => {
    return {
      textMain: isMac ? "text-black/80" : "text-white/90",
      textStrong: isMac ? "text-black" : "text-white",
      textSub: isMac ? "text-black/60" : "text-white/70",
      cardBg: isMac ? "bg-white" : "bg-white/6",
      cardBorder: isMac ? "border-black/10" : "border-white/10",
      divider: isMac ? "bg-black/10" : "bg-white/10",
    };
  }, [isMac]);

  const places = [
    { key: "spain", label: "Madrid, Spain 🇪🇸", year: placeDetails.spain.year },
    { key: "nl", label: "Groningen, Netherlands 🇳🇱", year: placeDetails.nl.year },
    { key: "germany", label: "Stuttgart, Germany 🇩🇪", year: placeDetails.germany.year },
    { key: "canada", label: "Hamilton, Canada 🇨🇦", year: placeDetails.canada.year },
    { key: "stockholm", label: "Stockholm, Sweden 🇸🇪", year: placeDetails.stockholm.year },
  ];

  const current = placeDetails[selected];
  const photos = current.photos || [];

  const openViewer = (i) => {
    setViewerIndex(i);
    setZoomed(false);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setZoomed(false);
  };

  const next = () => {
    setViewerIndex((i) => (i + 1) % photos.length);
    setZoomed(false);
  };

  const prev = () => {
    setViewerIndex((i) => (i - 1 + photos.length) % photos.length);
    setZoomed(false);
  };

  return (
    <div className={`h-full flex flex-col ${styles.textMain}`}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className={`${styles.textStrong} text-lg font-semibold`}>
          Where I’ve lived & studied
        </div>
        <div className={`${styles.textSub} text-sm mt-1`}>
          Explore the places I’ve called home.
        </div>
        <div className={`mt-4 h-px ${styles.divider}`} />
      </div>

      {/* Layout */}
      <div className="flex-1 overflow-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LEFT SIDE */}
        <div
          className={`lg:col-span-2 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5 flex flex-col`}
        >
          <div className={`${styles.textSub} text-xs mb-3`}>Interactive map</div>

          {/* FIXED HEIGHT MAP — NO BORDER */}
          <div className="h-[260px] lg:h-[280px] rounded-xl overflow-hidden relative">
            <MapContainer
              center={current.coords}
              zoom={5}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <Recenter coords={current.coords} />

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

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
            <div className={`${styles.textStrong} text-sm mb-2`}>
              Fun facts — {current.title}
            </div>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {current.funFacts.map((fact, i) => (
                <li key={i} className={styles.textSub}>
                  {fact}
                </li>
              ))}
            </ul>
          </div>

         {/* SEE PHOTOS TOGGLE */}
<div className="mt-5">
  <button
    onClick={() => setShowPhotos(prev => !prev)}
    className="text-sm underline opacity-80 hover:opacity-100"
  >
    {showPhotos ? "Hide photos" : "See photos"}
  </button>

  {showPhotos && (
    <div className="mt-4">
      {photos.length === 0 ? (
        <div className={`${styles.textSub} text-xs opacity-70`}>
          No photos added yet.
        </div>
      ) : (
        <div
          id="photo-row"
          className="
            flex flex-nowrap 
            gap-3 
            overflow-x-auto 
            pb-2 
            whitespace-nowrap 
            snap-x snap-mandatory 
            scrollbar-none
          "
        >
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => openViewer(i)}
              className="
                w-32 h-24 
                rounded-xl 
                overflow-hidden 
                border border-black/10 
                hover:scale-[1.02] 
                transition 
                snap-start 
                shrink-0
              "
            >
              <img src={src} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )}
</div>




        </div>

        {/* RIGHT SIDE */}
        <div
          className={`lg:col-span-1 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5 flex flex-col`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`${styles.textStrong} font-semibold`}>Places</div>
            <div className={`${styles.textSub} text-[11px]`}>Tap to explore</div>
          </div>

          <div className="space-y-2">
            {places.map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  setSelected(p.key);
                  setShowPhotos(false);
                  setViewerOpen(false);
                }}
                className={`w-full text-left rounded-xl px-3 py-3 border ${styles.cardBorder} transition ${
                  selected === p.key
                    ? isMac
                      ? "bg-black/10"
                      : "bg-white/15"
                    : isMac
                    ? "hover:bg-black/5"
                    : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`${styles.textStrong} text-sm font-medium`}>
                    {p.label}
                  </div>
                  {selected === p.key && (
                    <span className="text-[10px] uppercase opacity-70">
                      Selected
                    </span>
                  )}
                </div>
                <div className={`${styles.textSub} text-xs mt-1`}>{p.year}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN VIEWER */}
      {viewerOpen && photos.length > 0 && (
        <div className="
  fixed inset-0 z-[9999]
  backdrop-blur-3xl 
  supports-[backdrop-filter]:backdrop-saturate-150
  bg-black/20
  flex flex-col
">

          
          {/* Close button */}
          <div className="flex justify-end px-6 pt-6">
            <button
              onClick={closeViewer}
              className="text-white text-2xl font-light hover:opacity-70 transition"
            >
              ×
            </button>
          </div>

          {/* Image + arrows */}
          <div className="flex-1 flex items-center justify-center px-6 pb-6">
            <button
              onClick={prev}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white mr-4"
            >
              ‹
            </button>

            <div
              className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center"
              onClick={() => setZoomed((z) => !z)}
            >
              <img
                src={photos[viewerIndex]}
                className={`rounded-2xl shadow-2xl transition-transform duration-300 ${
                  zoomed ? "scale-105" : "scale-100"
                } max-h-[65vh]
 w-auto object-contain`}
              />
            </div>

            <button
              onClick={next}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white ml-4"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center pb-6 gap-1">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setViewerIndex(i);
                  setZoomed(false);
                }}
                className={`w-2 h-2 rounded-full ${
                  i === viewerIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
