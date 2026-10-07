// src/components/windows/Music/MusicWindow.jsx
import { useMemo, useRef, useState } from "react";
import { myPicks } from "./data/myPicks";
import MiniCover from "./components/MiniCover";
import useAudioPlayer from "./hooks/useAudioPlayer";
import { Equalizer, Icon, NowPlayingBar, SPOTIFY_GREEN, formatTime } from "./components/PlayerBits";

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

// give every track a stable id + its playlist
const PLAYLISTS = myPicks.map((p) => ({
  ...p,
  tracks: p.tracks.map((t, i) => ({ ...t, id: `${p.key}:${i}`, playlistKey: p.key })),
}));
const ALL_TRACKS = PLAYLISTS.flatMap((p) => p.tracks);

const styles = {
  shell: "bg-[#071613]",
  sideBg: "bg-[#06110F]",
  sideText: "text-white/75",
  topbarBg: "bg-[#071613]/75 backdrop-blur-xl",
  ghostBtn: "bg-white/0 hover:bg-white/10 text-white/80 border border-white/15",
  rowHover: "hover:bg-white/10",
  rowSelected: "bg-white/12",
  pill: "bg-white/10 text-white border-white/10",
};

const headerGradient = {
  background: "linear-gradient(90deg, rgba(12,74,54,0.95) 0%, rgba(7,22,19,0.98) 70%)",
};

function TrackRow({ tr, idx, isCurrent, isPlaying, onPlay, showAlbumDate = true }) {
  const playable = !!tr.previewUrl;
  const album = tr.album ?? fallbackAlbumFromArtist(tr.artist);
  const dateAdded = tr.addedAt ?? fallbackDate(idx);
  const duration = tr.durationSec != null ? formatTime(tr.durationSec) : "—";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => (playable ? onPlay(tr) : window.open(tr.url, "_blank", "noopener,noreferrer"))}
      onKeyDown={(e) => e.key === "Enter" && (playable ? onPlay(tr) : window.open(tr.url, "_blank", "noopener,noreferrer"))}
      className={[
        "group grid grid-cols-[40px_1.6fr_1fr_140px_88px] items-center gap-3 px-3 py-2 rounded-md transition cursor-default",
        styles.rowHover,
        isCurrent ? styles.rowSelected : "",
      ].join(" ")}
      title={playable ? "Play preview" : "Not available to preview. Open in Spotify"}
    >
      <div className="text-white/50 text-sm flex items-center justify-center">
        {isCurrent && isPlaying ? (
          <>
            <span className="group-hover:hidden"><Equalizer /></span>
            <Icon.Pause className="hidden group-hover:block w-3 h-3 text-white" />
          </>
        ) : (
          <>
            <span className={`group-hover:hidden ${isCurrent ? "text-[#1ed760]" : ""}`}>{idx + 1}</span>
            {playable ? (
              <Icon.Play className="hidden group-hover:block w-3 h-3 text-white" />
            ) : (
              <Icon.External className="hidden group-hover:block w-3.5 h-3.5 text-white" />
            )}
          </>
        )}
      </div>

      <div className={`min-w-0 flex items-center gap-3 ${playable ? "" : "opacity-55"}`}>
        <MiniCover title={tr.title} cover={tr.cover} cardBorder="border-white/10" cardBgSoft="bg-white/5" textSub2="text-white/50" />
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: isCurrent ? SPOTIFY_GREEN : "white" }}>
            {tr.title}
          </div>
          <div className="text-white/60 text-xs truncate">
            {tr.artist}
            {!playable && <span className="ml-2 text-[10px] uppercase tracking-wide text-white/45">Spotify only</span>}
          </div>
        </div>
      </div>

      <div className="hidden md:block text-white/60 text-sm truncate">{showAlbumDate ? album : ""}</div>
      <div className="hidden lg:block text-white/60 text-sm truncate">{showAlbumDate ? dateAdded : ""}</div>
      <div className="flex items-center justify-end gap-3 text-white/60 text-sm tabular-nums">
        <a
          href={tr.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 text-white/70 hover:text-[#1ed760] transition"
          title="Open in Spotify"
          aria-label={`Open ${tr.title} in Spotify`}
        >
          <Icon.Spotify className="w-4 h-4" />
        </a>
        {duration}
      </div>
    </div>
  );
}

export default function MusicWindow() {
  const player = useAudioPlayer();
  const searchRef = useRef(null);

  // simple back/forward history of opened playlists
  const [nav, setNav] = useState({ stack: [PLAYLISTS[0]?.key], pos: 0 });
  const activePlaylistKey = nav.stack[nav.pos];
  const playlist = PLAYLISTS.find((p) => p.key === activePlaylistKey) ?? PLAYLISTS[0];
  const tracks = playlist?.tracks ?? [];

  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      q
        ? ALL_TRACKS.filter((t) =>
            [t.title, t.artist, t.album].some((s) => (s ?? "").toLowerCase().includes(q))
          )
        : [],
    [q]
  );

  function openPlaylist(key) {
    setQuery("");
    if (key === activePlaylistKey) return;
    setNav(({ stack, pos }) => {
      const s = [...stack.slice(0, pos + 1), key];
      return { stack: s, pos: s.length - 1 };
    });
  }

  const isThisPlaylistPlaying = player.queueSource === playlist.key && player.isPlaying;

  function onBigPlay() {
    if (player.queueSource === playlist.key && player.current) player.togglePlay();
    else player.playQueue(tracks, null, playlist.key);
  }

  const playlistMosaic = mosaicCovers(tracks);
  const playableCount = tracks.filter((t) => t.previewUrl).length;

  return (
    <div className="h-full w-full flex flex-col no-darkwin">
      <div className={`flex-1 min-h-0 overflow-hidden ${styles.shell}`}>
        <div className="h-full grid grid-cols-[260px_1fr]">
          {/* LEFT SIDEBAR */}
          <aside className={`h-full overflow-y-auto ${styles.sideBg} border-r border-white/10 p-4`}>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => openPlaylist(PLAYLISTS[0].key)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 ${styles.rowHover} text-white`}
              >
                <span className="text-lg">⌂</span>
                <span className="text-sm font-semibold">Home</span>
              </button>
              <button
                type="button"
                onClick={() => searchRef.current?.focus()}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 ${styles.rowHover} text-white`}
              >
                <span className="text-lg">⌕</span>
                <span className="text-sm font-semibold">Search</span>
              </button>
            </div>

            <div className="my-4 h-px bg-white/10" />

            <div className={`${styles.sideText} text-xs font-semibold tracking-wide`}>YOUR LIBRARY</div>

            <div className="mt-3 space-y-2">
              {PLAYLISTS.map((p) => {
                const isActive = p.key === activePlaylistKey && !q;
                const isPlayingHere = player.queueSource === p.key && player.isPlaying;
                const covers = mosaicCovers(p.tracks);

                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => openPlaylist(p.key)}
                    className={[
                      "w-full text-left rounded-xl p-3 border border-white/10 transition",
                      styles.rowHover,
                      isActive ? "bg-white/10" : "bg-white/0",
                    ].join(" ")}
                    title={p.title}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0 grid grid-cols-2 grid-rows-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="w-full h-full bg-black/30">
                            {covers[i] ? <img src={covers[i]} alt="" className="w-full h-full object-cover" loading="lazy" /> : null}
                          </div>
                        ))}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate" style={{ color: isPlayingHere ? SPOTIFY_GREEN : "white" }}>
                          {p.title}
                        </div>
                        <div className="text-white/60 text-xs truncate">{p.subtitle}</div>
                      </div>
                      {isPlayingHere && <Equalizer />}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* MAIN AREA */}
          <main className={`h-full min-h-0 flex flex-col ${styles.shell}`}>
            {/* TOP BAR */}
            <div className={`shrink-0 z-20 ${styles.topbarBg} border-b border-white/10`}>
              <div className="px-5 py-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={nav.pos === 0}
                    onClick={() => setNav((n) => ({ ...n, pos: n.pos - 1 }))}
                    className={`w-9 h-9 rounded-full ${styles.ghostBtn} disabled:opacity-35`}
                    title="Back"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={nav.pos >= nav.stack.length - 1}
                    onClick={() => setNav((n) => ({ ...n, pos: n.pos + 1 }))}
                    className={`w-9 h-9 rounded-full ${styles.ghostBtn} disabled:opacity-35`}
                    title="Forward"
                  >
                    →
                  </button>
                </div>

                <div className="flex-1 flex items-center">
                  <div className="w-full max-w-xl flex items-center gap-2 rounded-full px-4 py-2 bg-white/10 border border-white/10 focus-within:border-white/40">
                    <span className="text-white/70">⌕</span>
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                      className="w-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/45"
                      placeholder="What do you want to play?"
                      aria-label="Search songs"
                    />
                    {query && (
                      <button type="button" onClick={() => setQuery("")} className="text-white/60 hover:text-white text-xs" aria-label="Clear search">
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10"
                  title="Open Spotify"
                >
                  <Icon.Spotify className="w-6 h-6 text-[#1ed760]" />
                </a>
              </div>
            </div>

            {/* SCROLL AREA */}
            <div className="flex-1 min-h-0 overflow-auto">
              {q ? (
                <div className="px-6 py-5">
                  <div className="text-white text-2xl font-bold">Songs</div>
                  <div className="mt-1 text-white/55 text-sm">
                    {results.length ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”` : `No songs match “${query}”`}
                  </div>
                  <div className="mt-4">
                    {results.map((tr, idx) => (
                      <TrackRow
                        key={tr.id}
                        tr={tr}
                        idx={idx}
                        isCurrent={player.current?.id === tr.id}
                        isPlaying={player.isPlaying}
                        onPlay={(t) =>
                          player.current?.id === t.id ? player.togglePlay() : player.playQueue(results, t, "search")
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* HEADER (gradient + huge title) */}
                  <div className="px-6 pt-8 pb-6" style={headerGradient}>
                    <div className="flex items-end gap-6">
                      <div className="w-44 h-44 rounded-md overflow-hidden shadow-2xl border border-white/10 bg-black/30 shrink-0 grid grid-cols-2 grid-rows-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="w-full h-full bg-black/30">
                            {playlistMosaic[i] ? (
                              <img src={playlistMosaic[i]} alt="" className="w-full h-full object-cover" loading="lazy" />
                            ) : null}
                          </div>
                        ))}
                      </div>

                      <div className="min-w-0 pb-1">
                        <div className="text-white/90 text-sm font-semibold">Public Playlist</div>
                        <div className="text-white text-5xl xl:text-6xl font-black tracking-tight truncate mt-2">{playlist?.title}</div>
                        <div className="mt-4 text-white/80 text-sm">
                          <span className="font-semibold">martalendi</span>
                          <span className="text-white/60"> • </span>
                          <span className="text-white/70">{tracks.length} songs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION ROW */}
                  <div className="px-6 py-4 flex items-center gap-4 bg-[#06110F]/85 border-b border-white/10">
                    <button
                      type="button"
                      onClick={onBigPlay}
                      disabled={!playableCount}
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-black hover:scale-105 active:scale-95 transition"
                      style={{ background: SPOTIFY_GREEN }}
                      aria-label={isThisPlaylistPlaying ? "Pause" : `Play ${playlist.title}`}
                      title={isThisPlaylistPlaying ? "Pause" : "Play"}
                    >
                      {isThisPlaylistPlaying ? <Icon.Pause className="w-5 h-5" /> : <Icon.Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => player.setShuffle((s) => !s)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                        player.shuffle ? "text-[#1ed760]" : "text-white/70 hover:text-white"
                      }`}
                      aria-pressed={player.shuffle}
                      title="Shuffle"
                    >
                      <Icon.Shuffle className="w-6 h-6" />
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                      <span className={`text-xs px-3 py-2 rounded-full border ${styles.pill}`}>{playlist?.subtitle}</span>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="px-6 py-3">
                    <div className="grid grid-cols-[40px_1.6fr_1fr_140px_88px] items-center gap-3 px-3 py-2 text-xs text-white/50">
                      <div className="text-center">#</div>
                      <div>Title</div>
                      <div className="hidden md:block">Album</div>
                      <div className="hidden lg:block">Date added</div>
                      <div className="text-right">🕒</div>
                    </div>
                    <div className="h-px bg-white/10" />

                    <div className="mt-1">
                      {tracks.map((tr, idx) => (
                        <TrackRow
                          key={tr.id}
                          tr={tr}
                          idx={idx}
                          isCurrent={player.current?.id === tr.id}
                          isPlaying={player.isPlaying}
                          onPlay={(t) =>
                            player.current?.id === t.id ? player.togglePlay() : player.playQueue(tracks, t, playlist.key)
                          }
                        />
                      ))}
                    </div>

                    <div className="mt-4 px-3 text-[11px] text-white/40">
                      Plays 30-second previews. Tap the Spotify icon on a song to hear the full track.
                    </div>
                  </div>
                  <div className="h-6" />
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <NowPlayingBar player={player} />
    </div>
  );
}
