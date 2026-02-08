import { useMemo } from "react";

export default function FunWindow({ uiTheme = "glass", onOpenWindow }) {
  const isMac = uiTheme === "macos";

  const styles = useMemo(() => {
    return {
      textMain: isMac ? "text-black/80" : "text-white/90",
      textStrong: isMac ? "text-black" : "text-white",
      textSub: isMac ? "text-black/60" : "text-white/70",

      cardBg: isMac ? "bg-white" : "bg-white/6",
      cardBgSoft: isMac ? "bg-black/5" : "bg-white/5",
      cardBorder: isMac ? "border-black/10" : "border-white/10",
      divider: isMac ? "bg-black/10" : "bg-white/10",

      btn: isMac
        ? "bg-black/10 border border-black/10 hover:bg-black/15 text-black/90"
        : "bg-white/15 border border-white/10 hover:bg-white/20 text-white",
    };
  }, [isMac]);

  return (
    <div className={`h-full flex flex-col ${styles.textMain}`}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className={`${styles.textStrong} text-lg font-semibold`}>
          Extras & Fun
        </div>
        <div className={`${styles.textSub} text-sm mt-1`}>
          Little interactive apps inside the portfolio OS.
        </div>
        <div className={`mt-4 h-px ${styles.divider}`} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AppCard
            styles={styles}
            emoji="🎵"
            title="Music"
            desc="Playlists + “Now Playing”"
            cta="Open Music"
            onClick={() => onOpenWindow?.("music")}
          />

          <AppCard
            styles={styles}
            emoji="🗺️"
            title="Interactive Map"
            desc="Where I’ve been (timeline + pins)"
            cta="Open Map"
            onClick={() => onOpenWindow?.("map")}
          />

          <AppCard
            styles={styles}
            emoji="🧑‍💻"
            title="Terminal"
            desc="Commands + ASCII mini-games"
            cta="Open Terminal"
            onClick={() => onOpenWindow?.("terminal")}
          />
        </div>

        {/* Optional: a second section */}
        <div className={`mt-6 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${styles.textStrong} font-semibold`}>Tip</div>
          <div className={`${styles.textSub} text-sm mt-1 leading-relaxed`}>
            You can keep Music open while exploring other windows — it’s designed
            to feel like a tiny OS.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI bits ---------------- */

function AppCard({ styles, emoji, title, desc, cta, onClick }) {
  return (
    <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5 flex flex-col`}>
      <div className={`rounded-2xl ${styles.cardBgSoft} border ${styles.cardBorder} p-4`}>
        <div className="text-2xl">{emoji}</div>
        <div className={`${styles.textStrong} font-semibold mt-2`}>{title}</div>
        <div className={`${styles.textSub} text-sm mt-1 leading-relaxed`}>{desc}</div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`mt-4 rounded-xl px-4 py-3 text-sm transition flex items-center justify-center gap-2 ${styles.btn}`}
      >
        <span>{cta}</span>
        <span className="opacity-70">↗</span>
      </button>
    </div>
  );
}
