// src/components/windows/Music/MusicWindow.jsx
import { useMemo, useState } from "react";
import { getTokens } from "../../../ui/themeTokens";
import { myPicks } from "./data/myPicks";
import MiniCover from "./components/MiniCover";

function formatDuration(sec) {
  if (!Number.isFinite(sec)) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fallbackAlbumFromArtist(artist = "") {
  const a = (artist || "Unknown").split(",")[0].trim();
  return a ? `${a}` : "—";
}

function fallbackDate(idx) {
  const base = new Date("2024-08-01T00:00:00Z");
  base.setDate(base.getDate() + idx * 7);
  return base.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function mosaicCovers(tracks) {
  return (tracks ?? []).slice(0, 4).map((x) => x.cover).filter(Boolean);
}

function PlaylistMosaic({ covers, size = "lg" }) {
  const dim = size === "sm" ? "w-10 h-10" : "w-full h-full";
  return covers.length ? (
    <div className={`grid grid-cols-2 grid-rows-2 ${dim}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-full h-full bg-black/30">
          {covers[i] ? (
            <img src={covers[i]} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : null}
        </div>
      ))}
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">♪</div>
  );
}

export default function MusicWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const t = getTokens(uiTheme, glassContrast);

  const [activePlaylistKey, setActivePlaylistKey] = useState(myPicks[0]?.key ?? "locked-in");
  const [activeIdx, setActiveIdx] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);

  const playlist = myPicks.find((p) => p.key === activePlaylistKey) ?? myPicks[0];
  const tracks = playlist?.tracks ?? [];
  const activeTrack = tracks[activeIdx] ?? tracks[0];
  const playlistMosaic = mosaicCovers(tracks);

  const headerGradient = {
    background: "linear-gradient(180deg, rgba(12,74,54,0.95) 0%, rgba(7,22,19,0.98) 100%)",
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#071613] overflow-hidden">

      {/* ── DESKTOP LAYOUT (md+) ──────────────────────────────────── */}
      <div className="hidden md:flex h-full w-full max-w-[1220px] mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#071613]">

        {/* Sidebar */}
        <aside className="h-full w-[280px] bg-[#06110F] border-r border-white/10 p-4 flex flex-col shrink-0">
          <div className="space-y-2">
            {[["⌂", "Home"], ["⌕", "Search"]].map(([icon, label]) => (
              <button key={label} type="button"
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/10 text-white">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-semibold">{label}</span>
              </button>
            ))}
          </div>

          <div className="my-4 h-px bg-white/10" />

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/75 text-xs font-semibold tracking-wide">YOUR LIBRARY</span>
            <button type="button" className="rounded-lg px-2 py-1 hover:bg-white/10 text-white/75">+</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {myPicks.map((p) => {
              const isActive = p.key === activePlaylistKey;
              const covers = mosaicCovers(p.tracks);
              return (
                <button key={p.key} type="button"
                  onClick={() => { setActivePlaylistKey(p.key); setActiveIdx(0); }}
                  className={[
                    "w-full text-left rounded-xl p-3 border border-white/10 transition hover:bg-white/10",
                    isActive ? "bg-white/10" : "bg-white/0",
                  ].join(" ")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                      <PlaylistMosaic covers={covers} size="sm" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{p.title}</div>
                      <div className="text-white/60 text-xs truncate">{p.subtitle}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 h-full overflow-hidden flex flex-col bg-[#071613]">
          {/* Topbar */}
          <div className="shrink-0 bg-[#071613]/75 backdrop-blur-xl border-b border-white/10 px-5 py-3 flex items-center gap-3">
            <div className="flex gap-2">
              {["←", "→"].map((arrow) => (
                <button key={arrow} type="button"
                  className="w-9 h-9 rounded-full bg-white/0 hover:bg-white/10 text-white/80 border border-white/15 flex items-center justify-center">
                  {arrow}
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-xl flex items-center gap-2 rounded-full px-4 py-2 bg-white/10 border border-white/10">
                <span className="text-white/70">⌕</span>
                <input className="w-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/45"
                  placeholder="What do you want to play?" onChange={() => {}} />
              </div>
            </div>
            <div className="flex gap-2">
              {["🔔", "M"].map((icon) => (
                <button key={icon} type="button"
                  className="w-9 h-9 rounded-full bg-white/0 hover:bg-white/10 text-white/80 border border-white/15 flex items-center justify-center text-sm">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto">
            <DesktopPlaylistHeader playlist={playlist} tracks={tracks} playlistMosaic={playlistMosaic}
              activeTrack={activeTrack} headerGradient={headerGradient} />
            <TrackTable tracks={tracks} activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
            <div className="h-10" />
          </div>
        </main>
      </div>

      {/* ── MOBILE LAYOUT (< md) ─────────────────────────────────── */}
      <div className="flex md:hidden flex-col h-full w-full overflow-hidden">

        {/* Mobile top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 pt-safe pt-4 pb-3 bg-[#071613]/90 backdrop-blur-xl border-b border-white/10">
          <button type="button"
            onClick={() => setShowLibrary(true)}
            className="flex items-center gap-2 text-white/80 active:opacity-60 transition-opacity">
            <span className="text-lg">☰</span>
            <span className="text-sm font-semibold">Library</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white text-sm font-bold tracking-tight">Musik</span>
          </div>

          <button type="button" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
            M
          </button>
        </div>

        {/* Mobile search bar */}
        <div className="shrink-0 px-4 py-2 bg-[#071613]">
          <div className="flex items-center gap-2 rounded-full px-4 py-2.5 bg-white/10 border border-white/10">
            <span className="text-white/50 text-sm">⌕</span>
            <input className="w-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/45"
              placeholder="What do you want to play?" onChange={() => {}} />
          </div>
        </div>

        {/* Mobile playlist header */}
        <div className="shrink-0 px-4 pt-4 pb-3" style={headerGradient}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-xl border border-white/10 bg-black/30 shrink-0">
              <PlaylistMosaic covers={playlistMosaic} size="lg" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white/60 text-xs font-medium uppercase tracking-wider">Public Playlist</div>
              <div className="text-white text-xl font-black tracking-tight truncate mt-0.5">{playlist?.title}</div>
              <div className="mt-1 text-white/70 text-xs">
                <span className="font-semibold text-white/90">martalendi</span>
                <span className="text-white/40"> · </span>
                <span>{tracks.length} songs</span>
              </div>
            </div>
          </div>

          {/* Action row */}
          <div className="mt-4 flex items-center gap-3">
            <a href={activeTrack?.url} target="_blank" rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black shadow-lg bg-green-500 text-black active:scale-95 transition-transform"
              title="Open in Spotify">
              ▶
            </a>
            <button type="button" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/0 hover:bg-white/10 text-white/80 border border-white/15 active:scale-95 transition-transform">⇄</button>
            <button type="button" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/0 hover:bg-white/10 text-white/80 border border-white/15 active:scale-95 transition-transform">⬇</button>
            <button type="button" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/0 hover:bg-white/10 text-white/80 border border-white/15 active:scale-95 transition-transform">⋯</button>
            <span className="ml-auto text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/10 text-white truncate max-w-[100px]">
              {playlist?.subtitle}
            </span>
          </div>
        </div>

        {/* Mobile table header */}
        <div className="shrink-0 grid grid-cols-[1fr_56px] items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#06110F]">
          <span className="text-xs text-white/50 font-medium">Title</span>
          <span className="text-xs text-white/50 text-right">🕒</span>
        </div>

        {/* Mobile track list */}
        <div className="flex-1 overflow-y-auto bg-[#071613]">
          {tracks.map((tr, idx) => {
            const selected = idx === activeIdx;
            const duration = tr.durationSec != null ? formatDuration(tr.durationSec) : "—";
            return (
              <a key={`${tr.title}-${idx}`}
                href={tr.url} target="_blank" rel="noopener noreferrer"
                onTouchStart={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                className={[
                  "flex items-center gap-3 px-4 py-3 active:bg-white/15 transition-colors border-b border-white/5",
                  selected ? "bg-white/8" : "",
                ].join(" ")}>
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  {tr.cover
                    ? <img src={tr.cover} alt="" className="w-full h-full object-cover" loading="lazy" />
                    : <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">♪</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className={["text-sm font-semibold truncate", selected ? "text-green-400" : "text-white"].join(" ")}>
                    {tr.title}
                  </div>
                  <div className="text-white/55 text-xs truncate">{tr.artist}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {selected && <span className="text-green-400 text-xs">▶</span>}
                  <span className="text-white/50 text-sm tabular-nums">{duration}</span>
                </div>
              </a>
            );
          })}
          {/* safe-area bottom padding */}
          <div className="h-8 pb-safe" />
        </div>

        {/* ── LIBRARY DRAWER (mobile) ─────────────────────────── */}
        {showLibrary && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#06110F]">
            {/* Drawer header */}
            <div className="shrink-0 flex items-center justify-between px-4 pt-safe pt-5 pb-4 border-b border-white/10">
              <span className="text-white font-bold text-lg">Your Library</span>
              <button type="button" onClick={() => setShowLibrary(false)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-lg active:bg-white/20">
                ✕
              </button>
            </div>

            {/* Playlist list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {myPicks.map((p) => {
                const isActive = p.key === activePlaylistKey;
                const covers = mosaicCovers(p.tracks);
                return (
                  <button key={p.key} type="button"
                    onClick={() => { setActivePlaylistKey(p.key); setActiveIdx(0); setShowLibrary(false); }}
                    className={[
                      "w-full text-left rounded-2xl p-4 border border-white/10 transition active:scale-[0.98]",
                      isActive ? "bg-green-900/30 border-green-500/30" : "bg-white/5",
                    ].join(" ")}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                        <PlaylistMosaic covers={covers} size="sm" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={["font-semibold truncate", isActive ? "text-green-400" : "text-white"].join(" ")}>
                          {p.title}
                        </div>
                        <div className="text-white/55 text-sm truncate">{p.subtitle}</div>
                        <div className="text-white/35 text-xs mt-0.5">{p.tracks?.length ?? 0} songs</div>
                      </div>
                      {isActive && <span className="text-green-400 shrink-0">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="h-8 pb-safe" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Sub-components used only by desktop layout
──────────────────────────────────────────────── */

function DesktopPlaylistHeader({ playlist, tracks, playlistMosaic, activeTrack, headerGradient }) {
  return (
    <div>
      <div className="px-6 pt-8 pb-6" style={headerGradient}>
        <div className="flex items-end gap-6">
          <div className="w-44 h-44 rounded-md overflow-hidden shadow-2xl border border-white/10 bg-black/30 shrink-0">
            <PlaylistMosaic covers={playlistMosaic} size="lg" />
          </div>
          <div className="min-w-0 pb-1">
            <div className="text-white/90 text-sm font-semibold">Public Playlist</div>
            <div className="text-white text-6xl font-black tracking-tight truncate mt-2">
              {playlist?.title ?? "playlist"}
            </div>
            <div className="mt-4 text-white/80 text-sm">
              <span className="font-semibold">martalendi</span>
              <span className="text-white/60"> • </span>
              <span className="text-white/70">{tracks.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center gap-3 bg-[#06110F]/85 border-b border-white/10">
        <a href={activeTrack?.url} target="_blank" rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shadow-lg bg-green-500 text-black hover:bg-green-400"
          title="Open selected track in Spotify">
          ▶
        </a>
        {["⇄", "⬇", "⋯"].map((icon) => (
          <button key={icon} type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/0 hover:bg-white/10 text-white/80 border border-white/15">
            {icon}
          </button>
        ))}
        <div className="ml-auto">
          <span className="text-xs px-3 py-2 rounded-full border border-white/10 bg-white/10 text-white">
            {playlist?.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}

function TrackTable({ tracks, activeIdx, setActiveIdx }) {
  return (
    <div className="px-6 py-3">
      <div className="grid grid-cols-[48px_1.6fr_1fr_160px_80px] items-center gap-3 px-3 py-2 text-xs text-white/50">
        <div>#</div><div>Title</div>
        <div className="hidden md:block">Album</div>
        <div className="hidden lg:block">Date added</div>
        <div className="text-right">🕒</div>
      </div>
      <div className="h-px bg-white/10" />
      <div className="mt-1">
        {tracks.map((tr, idx) => {
          const selected = idx === activeIdx;
          const album = tr.album ?? (tr.artist ?? "Unknown").split(",")[0].trim();
          const dateAdded = tr.addedAt ?? fallbackDate(idx);
          const duration = tr.durationSec != null ? formatDuration(tr.durationSec) : "—";
          return (
            <a key={`${tr.title}-${idx}`}
              href={tr.url} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setActiveIdx(idx)}
              className={[
                "group grid grid-cols-[48px_1.6fr_1fr_160px_80px] items-center gap-3 px-3 py-2 rounded-md transition hover:bg-white/10",
                selected ? "bg-white/[0.12]" : "",
              ].join(" ")}>
              <div className="text-white/50 text-sm">
                <span className="group-hover:hidden">{idx + 1}</span>
                <span className="hidden group-hover:inline text-white/90">▶</span>
              </div>
              <div className="min-w-0 flex items-center gap-3">
                <MiniCover title={tr.title} cover={tr.cover}
                  cardBorder="border-white/10" cardBgSoft="bg-white/5" textSub2="text-white/50" />
                <div className="min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{tr.title}</div>
                  <div className="text-white/60 text-xs truncate">{tr.artist}</div>
                </div>
              </div>
              <div className="hidden md:block text-white/60 text-sm truncate">{album}</div>
              <div className="hidden lg:block text-white/60 text-sm truncate">{dateAdded}</div>
              <div className="text-right text-white/60 text-sm">{duration}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}