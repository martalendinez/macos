// src/components/windows/Music/components/PlayerBits.jsx
// Spotify-style controls: icons, scrub bar, equalizer, now-playing bar.
import { useRef, useState } from "react";

export const SPOTIFY_GREEN = "#1ed760";

export function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const P = { fill: "currentColor", "aria-hidden": true };

export const Icon = {
  Play: (props) => (
    <svg viewBox="0 0 16 16" {...P} {...props}>
      <path d="M3 1.7v12.6a.7.7 0 0 0 1.05.6l10.9-6.3a.7.7 0 0 0 0-1.2L4.05 1.1A.7.7 0 0 0 3 1.7z" />
    </svg>
  ),
  Pause: (props) => (
    <svg viewBox="0 0 16 16" {...P} {...props}>
      <rect x="3" y="1.5" width="3.6" height="13" rx=".7" />
      <rect x="9.4" y="1.5" width="3.6" height="13" rx=".7" />
    </svg>
  ),
  Next: (props) => (
    <svg viewBox="0 0 16 16" {...P} {...props}>
      <path d="M12.7 1a.7.7 0 0 1 .7.7v12.6a.7.7 0 0 1-1.4 0V1.7a.7.7 0 0 1 .7-.7zM2 2.1a.7.7 0 0 1 1.05-.6l8.1 5.9a.7.7 0 0 1 0 1.2l-8.1 5.9A.7.7 0 0 1 2 13.9z" />
    </svg>
  ),
  Prev: (props) => (
    <svg viewBox="0 0 16 16" {...P} {...props} style={{ transform: "scaleX(-1)" }}>
      <path d="M12.7 1a.7.7 0 0 1 .7.7v12.6a.7.7 0 0 1-1.4 0V1.7a.7.7 0 0 1 .7-.7zM2 2.1a.7.7 0 0 1 1.05-.6l8.1 5.9a.7.7 0 0 1 0 1.2l-8.1 5.9A.7.7 0 0 1 2 13.9z" />
    </svg>
  ),
  Shuffle: (props) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M1.5 4h2.2c1.1 0 2.1.6 2.7 1.5l3.2 5c.6.9 1.6 1.5 2.7 1.5h2.2M1.5 12h2.2c1.1 0 2.1-.6 2.7-1.5M9.6 5.5c.6-.9 1.6-1.5 2.7-1.5h2.2M12.5 2l2 2-2 2M12.5 10l2 2-2 2" />
    </svg>
  ),
  Repeat: (props) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 8V6.5A2.5 2.5 0 0 1 5.5 4h8M11.5 2l2 2-2 2M13 8v1.5A2.5 2.5 0 0 1 10.5 12h-8M4.5 14l-2-2 2-2" />
    </svg>
  ),
  Volume: ({ level = 1, ...props }) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2 6h2.5L8 3v10l-3.5-3H2z" fill="currentColor" />
      {level > 0 && <path d="M10.5 6a2.8 2.8 0 0 1 0 4" />}
      {level > 0.5 && <path d="M12.5 4a5.6 5.6 0 0 1 0 8" />}
      {level === 0 && <path d="M11 6l4 4M15 6l-4 4" />}
    </svg>
  ),
  External: (props) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9 2.5h4.5V7M13.5 2.5L7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
    </svg>
  ),
  Heart: ({ filled, ...props }) => (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M8 13.6S1.8 9.9 1.8 5.7A3.2 3.2 0 0 1 8 4.4a3.2 3.2 0 0 1 6.2 1.3C14.2 9.9 8 13.6 8 13.6z" fill={filled ? "#1ed760" : "none"} stroke={filled ? "#1ed760" : "currentColor"} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Queue: (props) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M2 3.5h12M2 7.5h12M2 11.5h7M12 10v4M10 12h4" />
    </svg>
  ),
  Expand: (props) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2.5" width="12" height="11" rx="2" />
      <path d="M5.5 9.5l2.5-2.5 2.5 2.5" />
    </svg>
  ),
  Spotify: (props) => (
    <svg viewBox="0 0 24 24" {...P} {...props}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14C9.6 9.9 15 10.56 18.72 12.84c.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  ),
};

/** Equalizer bars shown next to the playing track. */
export function Equalizer({ playing = true }) {
  return (
    <span className="inline-flex items-end gap-[2px] h-[12px]" aria-label="Now playing">
      {[0, 0.25, 0.5].map((d) => (
        <span
          key={d}
          className="w-[3px] h-full rounded-[1px] origin-bottom"
          style={{
            background: SPOTIFY_GREEN,
            animation: playing ? `music-eq 0.9s ${d}s ease-in-out infinite` : "none",
            transform: playing ? undefined : "scaleY(0.35)",
          }}
        />
      ))}
    </span>
  );
}

/** Thin bar that turns green and shows a knob on hover; click or drag to seek. */
export function ScrubBar({ value = 0, onChange, label, className = "" }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(null);
  const shown = drag ?? value;

  function ratioAt(e) {
    const r = ref.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  }

  return (
    <div
      ref={ref}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(shown * 100)}
      tabIndex={0}
      className={`group relative h-[14px] flex items-center cursor-pointer ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(ratioAt(e));
      }}
      onPointerMove={(e) => drag != null && setDrag(ratioAt(e))}
      onPointerUp={(e) => {
        if (drag == null) return;
        onChange?.(ratioAt(e));
        setDrag(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onChange?.(Math.min(1, value + 0.05));
        if (e.key === "ArrowLeft") onChange?.(Math.max(0, value - 0.05));
      }}
    >
      <div className="w-full h-[4px] rounded-full bg-white/25 overflow-hidden">
        <div
          className={`h-full rounded-full ${drag != null ? "bg-[#1ed760]" : "bg-white group-hover:bg-[#1ed760]"}`}
          style={{ width: `${shown * 100}%` }}
        />
      </div>
      <div
        className={`absolute w-[12px] h-[12px] rounded-full bg-white shadow -translate-x-1/2 ${
          drag != null ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ left: `${shown * 100}%` }}
      />
    </div>
  );
}

/** Bottom player bar. */
export function NowPlayingBar({ player, liked = false, onLike, queueOpen, onQueue, nowOpen, onNow }) {
  const { current, isPlaying, time, duration, volume, muted, shuffle, repeat } = player;
  const ctl = "w-8 h-8 flex items-center justify-center rounded-full transition disabled:opacity-30";
  const vol = muted ? 0 : volume;

  return (
    <div className="relative h-[76px] shrink-0 px-4 grid grid-cols-[1fr_auto] @2xl:grid-cols-[1fr_minmax(260px,1.4fr)_1fr] items-center gap-4 bg-black border-t border-white/10">
      {/* narrow: thin progress line along the top edge */}
      <div className="@2xl:hidden absolute left-0 top-0 h-[2px] bg-[#1ed760]" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
      {/* track */}
      <div className="min-w-0 flex items-center gap-3">
        {current ? (
          <>
            <button onClick={onNow} className="relative group shrink-0" aria-label="Open Now Playing" title="Now Playing">
              <img src={current.cover} alt="" className="w-12 h-12 rounded-md object-cover shadow-lg" />
              <span className="absolute inset-0 rounded-md bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                <Icon.Expand className="w-4 h-4" />
              </span>
            </button>
            <div className="min-w-0">
              <div className="text-white text-[13px] font-semibold truncate">{current.title}</div>
              <div className="text-white/60 text-[11px] truncate">{current.artist}</div>
            </div>
            <button onClick={onLike} className="shrink-0 w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:scale-110 transition" aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"} title={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}>
              <Icon.Heart filled={liked} className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="text-white/45 text-[12px]">Pick a song to start listening</div>
        )}
      </div>

      {/* transport */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => player.setShuffle((s) => !s)}
            className={`${ctl} relative hidden @2xl:flex ${shuffle ? "text-[#1ed760]" : "text-white/65 hover:text-white"}`}
            aria-label="Shuffle"
            aria-pressed={shuffle}
            title="Shuffle"
          >
            <Icon.Shuffle className="w-4 h-4" />
            {shuffle && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#1ed760]" />}
          </button>
          <button type="button" onClick={player.prev} disabled={!current} className={`${ctl} text-white/75 hover:text-white`} aria-label="Previous" title="Previous">
            <Icon.Prev className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={player.togglePlay}
            disabled={!current}
            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-40"
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Icon.Pause className="w-[14px] h-[14px]" /> : <Icon.Play className="w-[14px] h-[14px] ml-[2px]" />}
          </button>
          <button type="button" onClick={player.next} disabled={!current} className={`${ctl} text-white/75 hover:text-white`} aria-label="Next" title="Next">
            <Icon.Next className="w-4 h-4" />
          </button>
          <button type="button" onClick={onQueue} className={`${ctl} @2xl:hidden ${queueOpen ? "text-[#1ed760]" : "text-white/75"}`} aria-label="Queue" title="Queue">
            <Icon.Queue className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={player.cycleRepeat}
            className={`${ctl} relative hidden @2xl:flex ${repeat !== "off" ? "text-[#1ed760]" : "text-white/65 hover:text-white"}`}
            aria-label={`Repeat: ${repeat}`}
            title={repeat === "one" ? "Repeat one" : repeat === "all" ? "Repeat all" : "Repeat"}
          >
            <Icon.Repeat className="w-4 h-4" />
            {repeat === "one" && (
              <span className="absolute top-[3px] right-[3px] text-[8px] font-bold leading-none bg-[#1ed760] text-black rounded-full w-[10px] h-[10px] flex items-center justify-center">
                1
              </span>
            )}
            {repeat !== "off" && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#1ed760]" />}
          </button>
        </div>
        <div className="w-full hidden @2xl:flex items-center gap-2 text-[11px] text-white/60 tabular-nums">
          <span className="w-9 text-right">{formatTime(time)}</span>
          <ScrubBar label="Seek" value={duration ? time / duration : 0} onChange={player.seek} className="flex-1" />
          <span className="w-9">{formatTime(duration)}</span>
        </div>
      </div>

      {/* extras */}
      <div className="hidden @2xl:flex items-center justify-end gap-2">
        <button onClick={onNow} disabled={!current} className={`w-7 h-7 flex items-center justify-center disabled:opacity-30 ${nowOpen ? "text-[#1ed760]" : "text-white/70 hover:text-white"}`} aria-label="Now Playing view" title="Now Playing view">
          <Icon.Expand className="w-4 h-4" />
        </button>
        <button onClick={onQueue} className={`w-7 h-7 flex items-center justify-center ${queueOpen ? "text-[#1ed760]" : "text-white/70 hover:text-white"}`} aria-label="Queue" title="Queue">
          <Icon.Queue className="w-4 h-4" />
        </button>
        {current && (
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden @4xl:flex items-center gap-1.5 text-[11px] text-white/65 hover:text-white mr-2"
            title="Listen to the full song on Spotify"
          >
            <Icon.Spotify className="w-4 h-4 text-[#1ed760]" />
            Full song
          </a>
        )}
        <button
          type="button"
          onClick={() => player.setMuted((m) => !m)}
          className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white"
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute" : "Mute"}
        >
          <Icon.Volume level={vol} className="w-4 h-4" />
        </button>
        <ScrubBar label="Volume" value={vol} onChange={player.setVolume} className="w-24" />
      </div>
    </div>
  );
}
