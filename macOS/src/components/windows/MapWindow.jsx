import { useMemo, useState } from "react";

export default function MapWindow({ uiTheme = "glass" }) {
  const isMac = uiTheme === "macos";
  const [selected, setSelected] = useState("stockholm");

  const styles = useMemo(() => {
    return {
      textMain: isMac ? "text-black/80" : "text-white/90",
      textStrong: isMac ? "text-black" : "text-white",
      textSub: isMac ? "text-black/60" : "text-white/70",
      cardBg: isMac ? "bg-white" : "bg-white/6",
      cardBorder: isMac ? "border-black/10" : "border-white/10",
      divider: isMac ? "bg-black/10" : "bg-white/10",
      chip: isMac ? "bg-black/5 border-black/10" : "bg-white/5 border-white/10",
    };
  }, [isMac]);

  const places = [
    { key: "stockholm", label: "Stockholm, Sweden", year: "2024 →" },
    { key: "germany", label: "Germany", year: "2022–2024" },
    { key: "nl", label: "Netherlands", year: "2020–2022" },
    { key: "canada", label: "Canada", year: "2019" },
  ];

  return (
    <div className={`h-full flex flex-col ${styles.textMain}`}>
      <div className="px-6 pt-5 pb-3">
        <div className={`${styles.textStrong} text-lg font-semibold`}>
          Interactive Map
        </div>
        <div className={`${styles.textSub} text-sm mt-1`}>
          Placeholder — later: map pins + route line + timeline slider.
        </div>
        <div className={`mt-4 h-px ${styles.divider}`} />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${styles.textSub} text-xs mb-3`}>Map canvas placeholder</div>
          <div className={`rounded-xl border ${styles.chip} p-6`}>
            <div className={`${styles.textSub} text-sm`}>
              Here you’ll render:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Clickable pins</li>
                <li>Animated route line</li>
                <li>Timeline slider</li>
                <li>“View Photos” panel</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-1 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${styles.textStrong} font-semibold mb-2`}>Places</div>
          <div className="space-y-2">
            {places.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setSelected(p.key)}
                className={`w-full text-left rounded-xl px-3 py-3 border ${styles.cardBorder} transition ${
                  selected === p.key ? (isMac ? "bg-black/10" : "bg-white/15") : (isMac ? "hover:bg-black/5" : "hover:bg-white/10")
                }`}
              >
                <div className={`${styles.textStrong} text-sm font-medium`}>{p.label}</div>
                <div className={`${styles.textSub} text-xs mt-1`}>{p.year}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
