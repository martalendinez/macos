import { useMemo, useState } from "react";
import { getTokens } from "../../../ui/themeTokens";
import { myPicks } from "./data/myPicks";
import MiniCover from "./components/MiniCover";

export default function MusicWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const t = getTokens(uiTheme, glassContrast);
  const [activePick, setActivePick] = useState("locked-in");

  const styles = useMemo(() => {
    const isMac = t.isMac;

    return {
      cardBg: isMac ? "bg-white" : "bg-white/6",
      cardBorder: isMac ? "border-black/10" : "border-white/10",
      cardBgSoft: isMac ? "bg-black/5" : "bg-white/5",
      textStrong: isMac ? "text-black" : "text-white",
      textSub2: isMac ? "text-black/50" : "text-white/60",

      hover: isMac ? "hover:bg-[hsl(var(--accent)/0.12)] hover:border-[hsl(var(--accent)/0.35)]" : "hover:bg-white/10",
      selected: isMac ? "bg-[hsl(var(--accent)/0.12)] border-[hsl(var(--accent)/0.35)]" : "bg-white/15",
    };
  }, [t.isMac]);

  const currentPick = myPicks.find((p) => p.key === activePick) ?? myPicks[0];

  return (
    <div className={`h-full flex flex-col ${t.textMain}`}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className={`${styles.textStrong} text-lg font-semibold`}>My picks</div>
        <div className={`${t.textSub} text-sm mt-1`}>Explore my tracks for every mood and moment!</div>
        <div className={`mt-4 h-px ${t.divider}`} />
      </div>

      {/* Layout */}
      <div className="flex-1 overflow-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: categories */}
        <div className={`lg:col-span-1 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${t.textSub} text-xs mb-3`}>Categories</div>

          <div className="space-y-2">
            {myPicks.map((p) => {
              const active = activePick === p.key;
              const base = `w-full text-left rounded-xl px-3 py-3 border transition`;

              const cls = active
                ? t.isMac
                  ? `${base} ${styles.selected}`
                  : `${base} ${styles.selected} ${styles.cardBorder}`
                : t.isMac
                ? `${base} border-black/10 ${styles.hover}`
                : `${base} ${styles.cardBorder} ${styles.hover}`;

              return (
                <button key={p.key} onClick={() => setActivePick(p.key)} className={cls} type="button">
                  <div className={`${styles.textStrong} text-sm font-medium`}>{p.title}</div>
                  <div className={`${t.textSub} text-xs mt-1`}>{p.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: tracks */}
        <div className={`lg:col-span-2 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${t.textSub} text-xs mb-2`}>Now browsing</div>
          <div className={`${styles.textStrong} font-semibold`}>{currentPick.title}</div>
          <div className={`${t.textSub} text-sm mt-1 mb-4`}>{currentPick.subtitle}</div>

          <div className="space-y-2">
            {currentPick.tracks.map((tr, idx) => (
              <a
                key={idx}
                href={tr.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 border ${styles.cardBorder} transition ${styles.hover}`}
                title="Open in Spotify"
              >
                <MiniCover
                  title={tr.title}
                  cover={tr.cover}
                  cardBorder={styles.cardBorder}
                  cardBgSoft={styles.cardBgSoft}
                  textSub2={styles.textSub2}
                />

                <div className="min-w-0 flex-1">
                  <div className={`${styles.textStrong} text-sm font-medium truncate`}>{tr.title}</div>
                  <div className={`${t.textSub} text-xs mt-1 truncate`}>{tr.artist}</div>
                </div>

                <div className={`${t.textSub} text-xs opacity-70 group-hover:opacity-100 transition`}>↗</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}