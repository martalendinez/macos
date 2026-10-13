// src/components/shell/Seasonal.jsx
// Seasonal touches: a small emoji in the menu bar on special days (Swedish + Spanish ones),
// and gentle snow on the desktop in December. Preview any season with ?season=snow|halloween|…
import { useMemo } from "react";

const DAYS = [
  // [month (1-12), from day, to day, emoji, label, snow]
  [1, 1, 1, "🎆", "¡Feliz Año Nuevo! Gott nytt år!", true],
  [1, 5, 6, "👑", "Día de Reyes: the Three Kings bring the presents in Spain", true],
  [2, 10, 20, "🧁", "Semla season in Sweden. Cream everywhere.", false],
  [2, 14, 14, "💌", "Happy Valentine’s Day", false],
  [4, 23, 23, "🌹", "Sant Jordi: a book and a rose 📚", false],
  [6, 19, 25, "🌸", "Midsommar: flower crowns and herring 🇸🇪", false],
  [6, 23, 24, "🔥", "Noche de San Juan: bonfires on the beach 🇪🇸", false],
  [10, 24, 31, "🎃", "Spooky season. Even the pixels are scared.", false],
  [11, 1, 1, "🕯️", "Día de Todos los Santos", false],
  [12, 1, 12, "❄️", "It’s getting cold in Stockholm", true],
  [12, 13, 13, "🕯️", "Lucia: saffron buns and candles 🇸🇪", true],
  [12, 14, 23, "❄️", "Pepparkakor season", true],
  [12, 24, 26, "🎄", "God jul y feliz Navidad!", true],
  [12, 27, 31, "✨", "Almost a new year. 12 grapes ready? 🍇", true],
];
const PREVIEW = { snow: [12, 24, 24, "🎄", "God jul y feliz Navidad!", true], halloween: [10, 31, 31, "🎃", "Spooky season. Even the pixels are scared.", false], midsommar: DAYS[5], semla: DAYS[2] };

export function useSeason() {
  return useMemo(() => {
    const q = new URLSearchParams(window.location.search).get("season");
    if (q && PREVIEW[q]) return { emoji: PREVIEW[q][3], label: PREVIEW[q][4], snow: PREVIEW[q][5] };
    const d = new Date();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const hit = DAYS.find(([mm, a, b]) => mm === m && day >= a && day <= b);
    return hit ? { emoji: hit[3], label: hit[4], snow: hit[5] } : null;
  }, []);
}

/** Soft snowfall behind the windows. Hidden with reduce motion. */
export function Snow() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        left: (i * 37) % 100,
        size: 3 + ((i * 7) % 5),
        dur: 9 + ((i * 13) % 9),
        delay: -((i * 5) % 14),
        drift: ((i % 5) - 2) * 18,
        o: 0.45 + ((i * 3) % 5) / 10,
      })),
    []
  );
  return (
    <div className="seasonal-snow fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute -top-3 rounded-full bg-white"
          style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animation: `snowfall ${f.dur}s linear ${f.delay}s infinite`, "--drift": `${f.drift}px`, filter: "blur(0.5px)" }}
        />
      ))}
    </div>
  );
}
