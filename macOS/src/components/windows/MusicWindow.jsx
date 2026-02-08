import { useMemo, useState } from "react";



export default function MusicWindow({ uiTheme = "glass" }) {
  const isMac = uiTheme === "macos";
  const [activePlaylist, setActivePlaylist] = useState("lofi");

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

  return (
    <div className={`h-full flex flex-col ${styles.textMain}`}>
      <div className="px-6 pt-5 pb-3">
        <div className={`${styles.textStrong} text-lg font-semibold`}>
          Music App
        </div>
        <div className={`${styles.textSub} text-sm mt-1`}>
          Placeholder — later you’ll plug in Spotify embeds.
        </div>
        <div className={`mt-4 h-px ${styles.divider}`} />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-1 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          
        </div>

        <div className={`lg:col-span-2 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${styles.textSub} text-xs mb-2`}>Now Playing</div>
          <div className={`${styles.textStrong} font-semibold mb-4`}>
            {activePlaylist === "lofi" ? "Lo-Fi Beats" : activePlaylist === "deep" ? "Deep Work" : "Chill Vibes"}
          </div>
          
        </div>
      </div>
    </div>
  );
}
