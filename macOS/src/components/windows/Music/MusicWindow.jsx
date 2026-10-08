// src/components/windows/Music/MusicWindow.jsx
// Spotify-style player: Home, playlists, Liked Songs, search, queue, Now Playing view with a live
// visualizer, and "Marta's Wrapped". Plays 30-second previews; full songs open in Spotify.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { myPicks } from "./data/myPicks";
import MiniCover from "./components/MiniCover";
import Visualizer from "./components/Visualizer";
import Wrapped from "./components/Wrapped";
import useAudioPlayer from "./hooks/useAudioPlayer";
import useCoverColor, { rgba } from "./hooks/useCoverColor";
import useLocalState from "../../../hooks/useLocalState";
import { Equalizer, Icon, NowPlayingBar, SPOTIFY_GREEN, formatTime } from "./components/PlayerBits";

const PLAYLISTS = myPicks.map((p) => ({
  ...p,
  tracks: p.tracks.map((t, i) => ({ ...t, id: `${p.key}:${i}`, playlistKey: p.key })),
}));
const ALL_TRACKS = PLAYLISTS.flatMap((p) => p.tracks);
const byId = (id) => ALL_TRACKS.find((t) => t.id === String(id).split("#")[0]);
const baseId = (id) => String(id).split("#")[0];
const mosaic = (tracks) => (tracks ?? []).slice(0, 4).map((x) => x.cover).filter(Boolean);
const greeting = () => {
  const h = Number(new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Europe/Stockholm" }));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

function Mosaic({ tracks, className = "", liked }) {
  if (liked)
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ background: "linear-gradient(135deg,#450af5,#c4efd9)" }}>
        <Icon.Heart filled className="w-1/2 h-1/2 [&_path]:fill-white [&_path]:stroke-white" />
      </div>
    );
  const covers = mosaic(tracks);
  return (
    <div className={`grid grid-cols-2 grid-rows-2 bg-black/30 ${className}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-black/30 overflow-hidden">{covers[i] && <img src={covers[i]} alt="" className="w-full h-full object-cover" loading="lazy" />}</div>
      ))}
    </div>
  );
}

function PlayFab({ playing, onClick, size = 48, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-full flex items-center justify-center text-black shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
      style={{ width: size, height: size, background: SPOTIFY_GREEN }}
      aria-label={label}
      title={label}
    >
      {playing ? <Icon.Pause className="w-[38%] h-[38%]" /> : <Icon.Play className="w-[38%] h-[38%] ml-[6%]" />}
    </motion.button>
  );
}

function TrackRow({ tr, idx, isCurrent, isPlaying, onPlay, liked, onLike, onQueue }) {
  const playable = !!tr.previewUrl;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => (playable ? onPlay(tr) : window.open(tr.url, "_blank", "noopener,noreferrer"))}
      onKeyDown={(e) => e.key === "Enter" && (playable ? onPlay(tr) : window.open(tr.url, "_blank", "noopener,noreferrer"))}
      className={`group grid grid-cols-[28px_1fr_96px] @2xl:grid-cols-[36px_1.6fr_1fr_120px] items-center gap-3 px-3 py-2 rounded-md cursor-default hover:bg-white/10 ${isCurrent ? "bg-white/[0.08]" : ""}`}
      title={playable ? "Play preview" : "Not available to preview. Opens in Spotify"}
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
            {playable ? <Icon.Play className="hidden group-hover:block w-3 h-3 text-white" /> : <Icon.External className="hidden group-hover:block w-3.5 h-3.5 text-white" />}
          </>
        )}
      </div>
      <div className={`min-w-0 flex items-center gap-3 ${playable ? "" : "opacity-55"}`}>
        <MiniCover title={tr.title} cover={tr.cover} cardBorder="border-white/10" cardBgSoft="bg-white/5" textSub2="text-white/50" />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: isCurrent ? SPOTIFY_GREEN : "white" }}>
            {tr.title}
          </div>
          <div className="text-white/60 text-xs truncate">
            {tr.artist}
            {!playable && <span className="ml-2 text-[10px] uppercase tracking-wide text-white/45">Spotify only</span>}
          </div>
        </div>
      </div>
      <div className="hidden @2xl:block text-white/60 text-sm truncate">{tr.album ?? tr.artist}</div>
      <div className="flex items-center justify-end gap-2.5 text-white/60 text-sm tabular-nums">
        {playable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQueue(tr);
            }}
            className="opacity-0 group-hover:opacity-100 hover:text-white"
            title="Add to queue"
            aria-label={`Add ${tr.title} to queue`}
          >
            <Icon.Queue className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(tr.id);
          }}
          className={`${liked ? "opacity-100" : "opacity-0 group-hover:opacity-100"} hover:scale-110 transition`}
          title={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          aria-label={liked ? `Unlike ${tr.title}` : `Like ${tr.title}`}
        >
          <Icon.Heart filled={liked} className="w-4 h-4" />
        </button>
        <span className="w-9 text-right">{tr.durationSec != null ? formatTime(tr.durationSec) : "—"}</span>
      </div>
    </div>
  );
}

export default function MusicWindow({ unlockAchievement }) {
  const player = useAudioPlayer();
  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const [liked, setLiked] = useLocalState("portfolio.music.liked", []);
  const [recent, setRecent] = useLocalState("portfolio.music.recent", []);
  const [view, setView] = useState({ kind: "home" }); // home | playlist | liked | search
  const [history, setHistory] = useState({ stack: [{ kind: "home" }], pos: 0 });
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState(null); // null | "queue" | "now"
  const [wrapped, setWrapped] = useState(false);
  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const likedTracks = liked.map(byId).filter(Boolean);
  const isLiked = (id) => liked.includes(baseId(id));
  const current = player.current;

  // recently played
  useEffect(() => {
    if (!current) return;
    const id = baseId(current.id);
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  function flash(msg) {
    setToast(msg);
    clearTimeout(flash.t);
    flash.t = setTimeout(() => setToast(null), 1800);
  }
  function toggleLike(id) {
    const b = baseId(id);
    setLiked((l) => {
      const next = l.includes(b) ? l.filter((x) => x !== b) : [b, ...l];
      flash(l.includes(b) ? "Removed from Liked Songs" : "Added to Liked Songs 💚");
      return next;
    });
  }
  function queueTrack(t) {
    player.addToQueue(t);
    flash(`Added “${t.title}” to queue`);
  }
  function go(v) {
    setView(v);
    setHistory(({ stack, pos }) => {
      const s = [...stack.slice(0, pos + 1), v];
      return { stack: s, pos: s.length - 1 };
    });
    scrollRef.current?.scrollTo({ top: 0 });
  }
  function nav(d) {
    setHistory((h) => {
      const pos = Math.max(0, Math.min(h.stack.length - 1, h.pos + d));
      setView(h.stack[pos]);
      return { ...h, pos };
    });
  }

  // keyboard: space play/pause, arrows skip, L like
  function onKeyDown(e) {
    if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.key === " ") {
      e.preventDefault();
      player.togglePlay();
    } else if (e.key === "ArrowRight" && current) player.next();
    else if (e.key === "ArrowLeft" && current) player.prev();
    else if (e.key.toLowerCase() === "l" && current) toggleLike(current.id);
  }

  const q = query.trim().toLowerCase();
  const results = useMemo(() => (q ? ALL_TRACKS.filter((t) => [t.title, t.artist, t.album].some((s) => (s ?? "").toLowerCase().includes(q))) : []), [q]);
  const playlist = view.kind === "playlist" ? PLAYLISTS.find((p) => p.key === view.key) : null;
  const listTracks = view.kind === "liked" ? likedTracks : playlist?.tracks ?? [];
  const sourceKey = view.kind === "liked" ? "liked" : playlist?.key;
  const headerColor = useCoverColor(view.kind === "liked" ? null : (playlist?.tracks[0]?.cover ?? current?.cover ?? PLAYLISTS[0].tracks[0].cover));
  const nowColor = useCoverColor(current?.cover);
  const isSourcePlaying = player.isPlaying && player.queueSource === sourceKey;

  function playList(tracks, key, startAt) {
    if (player.queueSource === key && player.current && !startAt) return player.togglePlay();
    player.playQueue(tracks, startAt ?? null, key);
  }

  const upNext = player.queue.slice(player.index + 1);
  const headerBg = view.kind === "liked" ? "rgb(80,56,160)" : rgba(headerColor, 1);

  const sidebarItem = (active) => `w-full flex items-center gap-3 rounded-md p-2 text-left transition ${active ? "bg-white/10" : "hover:bg-white/[0.06]"}`;

  return (
    <div ref={rootRef} tabIndex={0} onKeyDown={onKeyDown} className="no-darkwin relative h-full w-full flex flex-col bg-black text-white outline-none select-none">
      <div className="flex-1 min-h-0 flex gap-2 p-2">
        {/* SIDEBAR */}
        <aside className="hidden @3xl:flex w-[250px] shrink-0 flex-col gap-2">
          <div className="rounded-lg bg-[#121212] p-2 space-y-0.5">
            {[
              ["home", "⌂", "Home"],
              ["search", "⌕", "Search"],
            ].map(([k, ic, l]) => (
              <button key={k} onClick={() => go({ kind: k })} className={`w-full flex items-center gap-4 px-3 py-2 rounded-md text-[14px] font-bold ${view.kind === k ? "text-white" : "text-white/60 hover:text-white"}`}>
                <span className="text-[18px] w-5 text-center">{ic}</span> {l}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 rounded-lg bg-[#121212] p-2 overflow-y-auto">
            <div className="px-2 py-2 text-[14px] font-bold text-white/70">Your Library</div>
            <button onClick={() => go({ kind: "liked" })} className={sidebarItem(view.kind === "liked")}>
              <Mosaic liked className="w-12 h-12 rounded-md shrink-0 overflow-hidden" />
              <span className="min-w-0">
                <span className={`block text-[14px] font-semibold truncate ${player.queueSource === "liked" ? "text-[#1ed760]" : ""}`}>Liked Songs</span>
                <span className="block text-[12px] text-white/60">📌 Playlist · {likedTracks.length} song{likedTracks.length === 1 ? "" : "s"}</span>
              </span>
            </button>
            {PLAYLISTS.map((p) => (
              <button key={p.key} onClick={() => go({ kind: "playlist", key: p.key })} className={sidebarItem(view.kind === "playlist" && view.key === p.key)}>
                <Mosaic tracks={p.tracks} className="w-12 h-12 rounded-md shrink-0 overflow-hidden" />
                <span className="min-w-0 flex-1">
                  <span className={`block text-[14px] font-semibold truncate ${player.queueSource === p.key ? "text-[#1ed760]" : ""}`}>{p.title}</span>
                  <span className="block text-[12px] text-white/60 truncate">Playlist · martalendi</span>
                </span>
                {player.queueSource === p.key && player.isPlaying && <Equalizer />}
              </button>
            ))}
            <button onClick={() => setWrapped(true)} className="mt-3 w-full rounded-lg p-3 text-left" style={{ background: "linear-gradient(135deg,#ff4fa3,#7b2ff7,#1ed760)" }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">New</div>
              <div className="text-[15px] font-black">Marta’s Wrapped 🎁</div>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="relative flex-1 min-w-0 rounded-lg bg-[#121212] overflow-hidden">
          {/* top bar */}
          <div className="absolute top-0 inset-x-0 z-10 h-14 px-4 flex items-center gap-2 transition-colors" style={{ background: scrolled ? rgba(view.kind === "liked" ? [80, 56, 160] : headerColor, 0.92) : "transparent" }}>
            <button disabled={history.pos === 0} onClick={() => nav(-1)} className="w-8 h-8 rounded-full bg-black/60 disabled:opacity-40" aria-label="Back">
              ‹
            </button>
            <button disabled={history.pos >= history.stack.length - 1} onClick={() => nav(1)} className="w-8 h-8 rounded-full bg-black/60 disabled:opacity-40" aria-label="Forward">
              ›
            </button>
            <div className="flex-1 max-w-[360px] flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 focus-within:ring-2 ring-white px-3 h-9">
              <span className="text-white/60">⌕</span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (view.kind !== "search") go({ kind: "search" });
                }}
                onFocus={() => view.kind !== "search" && go({ kind: "search" })}
                placeholder="What do you want to play?"
                aria-label="Search songs"
                className="flex-1 min-w-0 bg-transparent outline-none text-[13px] placeholder:text-white/50"
              />
            </div>
            <div className="flex-1" />
            <button onClick={() => setWrapped(true)} className="hidden @lg:block px-3 h-8 rounded-full bg-white text-black text-[12px] font-bold hover:scale-105 transition">
              🎁 Wrapped
            </button>
            <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center" title="Open Spotify">
              <Icon.Spotify className="w-5 h-5 text-[#1ed760]" />
            </a>
          </div>

          <div ref={scrollRef} className="h-full overflow-y-auto" onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 40)}>
            <AnimatePresence mode="wait">
              <motion.div key={view.kind + (view.key ?? "")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                {view.kind === "home" && (
                  <div className="px-5 pt-16 pb-8" style={{ background: `linear-gradient(180deg, ${rgba(headerColor, 0.55)} 0%, #121212 260px)` }}>
                    <h1 className="text-[28px] font-black tracking-[-0.02em]">{greeting()}</h1>
                    <div className="mt-4 grid grid-cols-1 @lg:grid-cols-2 gap-2">
                      {[{ key: "liked", title: "Liked Songs", liked: true, tracks: likedTracks }, ...PLAYLISTS].map((p) => (
                        <div
                          key={p.key}
                          role="button"
                          tabIndex={0}
                          onClick={() => go(p.liked ? { kind: "liked" } : { kind: "playlist", key: p.key })}
                          className="group relative flex items-center gap-3 rounded-md bg-white/[0.07] hover:bg-white/[0.15] overflow-hidden transition cursor-default"
                        >
                          <Mosaic tracks={p.tracks} liked={p.liked} className="w-14 h-14 shrink-0" />
                          <span className="flex-1 min-w-0 text-[14px] font-bold truncate">{p.title}</span>
                          <span className="mr-3 opacity-0 group-hover:opacity-100 transition">
                            {p.tracks.length > 0 && <PlayFab size={34} playing={player.isPlaying && player.queueSource === p.key} onClick={() => playList(p.tracks, p.key)} label={`Play ${p.title}`} />}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 rounded-xl p-5 flex items-center gap-5 cursor-default" style={{ background: "linear-gradient(120deg,#ff4fa3,#7b2ff7 55%,#1ed760)" }} onClick={() => setWrapped(true)} role="button" tabIndex={0}>
                      <div className="text-[42px]">🎁</div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">Your year in music</div>
                        <div className="text-[22px] font-black leading-tight">Marta’s Wrapped is here</div>
                        <div className="text-[13px] text-white/85">Top artists, playlist moods and your listening this visit.</div>
                      </div>
                    </div>

                    {recent.length > 0 && (
                      <>
                        <h2 className="mt-8 text-[20px] font-bold">Recently played</h2>
                        <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
                          {recent.map(byId).filter(Boolean).map((t) => (
                            <div key={t.id} role="button" tabIndex={0} onClick={() => player.playQueue([t], t, "recent")} className="group shrink-0 w-[150px] rounded-lg p-3 hover:bg-white/[0.07] transition cursor-default">
                              <div className="relative">
                                <img src={t.cover} alt="" className="w-full aspect-square rounded-md object-cover shadow-lg" />
                                <span className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                                  <PlayFab size={40} playing={player.isPlaying && current && baseId(current.id) === t.id} onClick={() => (current && baseId(current.id) === t.id ? player.togglePlay() : player.playQueue([t], t, "recent"))} label={`Play ${t.title}`} />
                                </span>
                              </div>
                              <div className="mt-2 text-[13px] font-semibold truncate">{t.title}</div>
                              <div className="text-[12px] text-white/60 truncate">{t.artist}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <h2 className="mt-8 text-[20px] font-bold">Made by Marta</h2>
                    <div className="mt-3 grid grid-cols-2 @2xl:grid-cols-4 gap-4">
                      {PLAYLISTS.map((p) => (
                        <div key={p.key} role="button" tabIndex={0} onClick={() => go({ kind: "playlist", key: p.key })} className="group rounded-lg p-3 bg-white/[0.03] hover:bg-white/[0.08] transition cursor-default">
                          <div className="relative">
                            <Mosaic tracks={p.tracks} className="w-full aspect-square rounded-md overflow-hidden shadow-lg" />
                            <span className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                              <PlayFab size={40} playing={player.isPlaying && player.queueSource === p.key} onClick={() => playList(p.tracks, p.key)} label={`Play ${p.title}`} />
                            </span>
                          </div>
                          <div className="mt-2 text-[13px] font-bold truncate">{p.title}</div>
                          <div className="text-[12px] text-white/60 line-clamp-2">{p.subtitle}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(view.kind === "playlist" || view.kind === "liked") && (
                  <div>
                    <div className="px-5 pt-16 pb-6 flex items-end gap-5" style={{ background: `linear-gradient(180deg, ${headerBg} 0%, ${view.kind === "liked" ? "rgba(80,56,160,0.55)" : rgba(headerColor, 0.55)} 100%)` }}>
                      <Mosaic tracks={listTracks} liked={view.kind === "liked"} className="w-[150px] h-[150px] @2xl:w-[190px] @2xl:h-[190px] shrink-0 rounded-md overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)]" />
                      <div className="min-w-0 pb-1">
                        <div className="text-[12px] font-semibold">Playlist</div>
                        <div className="text-[34px] @2xl:text-[56px] font-black tracking-[-0.04em] leading-[1.02] truncate">{view.kind === "liked" ? "Liked Songs" : playlist?.title}</div>
                        <div className="mt-2 text-[13px] text-white/80 truncate">{view.kind === "liked" ? "Songs you’ve hearted, saved in this browser" : playlist?.subtitle}</div>
                        <div className="mt-1 text-[13px]">
                          <b>martalendi</b> <span className="text-white/70">· {listTracks.length} song{listTracks.length === 1 ? "" : "s"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-4 flex items-center gap-5" style={{ background: `linear-gradient(180deg, ${view.kind === "liked" ? "rgba(80,56,160,0.25)" : rgba(headerColor, 0.25)} 0%, transparent 100%)` }}>
                      <PlayFab size={54} playing={isSourcePlaying} onClick={() => listTracks.length && playList(listTracks, sourceKey)} label={isSourcePlaying ? "Pause" : "Play"} />
                      <button onClick={() => player.setShuffle((s) => !s)} className={player.shuffle ? "text-[#1ed760]" : "text-white/60 hover:text-white"} title="Shuffle" aria-pressed={player.shuffle}>
                        <Icon.Shuffle className="w-7 h-7" />
                      </button>
                    </div>
                    <div className="px-3 pb-8">
                      {listTracks.length === 0 ? (
                        <div className="py-16 text-center">
                          <div className="text-[40px]">💚</div>
                          <div className="mt-2 text-[20px] font-bold">Songs you like will appear here</div>
                          <div className="text-[13px] text-white/60">Save songs by tapping the heart icon.</div>
                        </div>
                      ) : (
                        listTracks.map((t, i) => (
                          <TrackRow
                            key={t.id}
                            tr={t}
                            idx={i}
                            isCurrent={current && baseId(current.id) === t.id}
                            isPlaying={player.isPlaying}
                            liked={isLiked(t.id)}
                            onLike={toggleLike}
                            onQueue={queueTrack}
                            onPlay={(tr) => (current && baseId(current.id) === tr.id ? player.togglePlay() : player.playQueue(listTracks, tr, sourceKey))}
                          />
                        ))
                      )}
                      <div className="mt-4 px-3 text-[11px] text-white/40">30-second previews. Use the Spotify button for full songs.</div>
                    </div>
                  </div>
                )}

                {view.kind === "search" && (
                  <div className="px-5 pt-16 pb-8">
                    {!q ? (
                      <>
                        <h1 className="text-[24px] font-bold">Browse all</h1>
                        <div className="mt-4 grid grid-cols-2 @2xl:grid-cols-3 gap-4">
                          {PLAYLISTS.map((p, i) => (
                            <button
                              key={p.key}
                              onClick={() => go({ kind: "playlist", key: p.key })}
                              className="relative h-[120px] rounded-lg overflow-hidden p-3 text-left text-[20px] font-black"
                              style={{ background: ["#e13300", "#1e3264", "#8d67ab", "#148a08"][i % 4] }}
                            >
                              {p.title}
                              <img src={p.tracks[0]?.cover} alt="" className="absolute -right-3 -bottom-2 w-[80px] h-[80px] object-cover rotate-[25deg] shadow-xl" />
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <h1 className="text-[24px] font-bold">Songs</h1>
                        <div className="mt-3">
                          {results.length === 0 && <div className="py-10 text-white/60">No results for “{query}”</div>}
                          {results.map((t, i) => (
                            <TrackRow
                              key={t.id}
                              tr={t}
                              idx={i}
                              isCurrent={current && baseId(current.id) === t.id}
                              isPlaying={player.isPlaying}
                              liked={isLiked(t.id)}
                              onLike={toggleLike}
                              onQueue={queueTrack}
                              onPlay={(tr) => player.playQueue(results, tr, "search")}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT PANEL: queue / now playing */}
        <AnimatePresence>
          {panel && (
            <motion.aside
              key={panel}
              className="hidden @4xl:flex w-[300px] shrink-0 rounded-lg bg-[#121212] flex-col overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="h-12 shrink-0 px-4 flex items-center justify-between">
                <span className="text-[15px] font-bold">{panel === "queue" ? "Queue" : current?.title ?? "Now playing"}</span>
                <button onClick={() => setPanel(null)} className="text-white/60 hover:text-white" aria-label="Close panel">
                  ✕
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4">
                {panel === "queue" ? (
                  <>
                    <div className="px-2 text-[13px] font-bold text-white/70">Now playing</div>
                    {current ? (
                      <div className="mt-1 flex items-center gap-3 p-2 rounded-md">
                        <img src={current.cover} alt="" className="w-11 h-11 rounded object-cover" />
                        <span className="min-w-0">
                          <span className="block text-[13px] font-semibold text-[#1ed760] truncate">{current.title}</span>
                          <span className="block text-[12px] text-white/60 truncate">{current.artist}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="px-2 py-2 text-[12px] text-white/50">Nothing playing</div>
                    )}
                    <div className="mt-4 px-2 text-[13px] font-bold text-white/70">Next up</div>
                    {upNext.length === 0 && <div className="px-2 py-2 text-[12px] text-white/50">Add songs with the queue icon on any track.</div>}
                    {upNext.map((t, k) => (
                      <button key={t.id} onClick={() => player.playAt(player.index + 1 + k)} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/[0.07] text-left">
                        <img src={t.cover} alt="" className="w-11 h-11 rounded object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold truncate">{t.title}</span>
                          <span className="block text-[12px] text-white/60 truncate">{t.artist}</span>
                        </span>
                        {t.queued && <span className="text-[10px] font-bold text-[#1ed760]">QUEUED</span>}
                      </button>
                    ))}
                  </>
                ) : current ? (
                  <div className="rounded-xl p-3" style={{ background: `linear-gradient(180deg, ${rgba(nowColor, 0.9)}, ${rgba(nowColor, 0.25)})` }}>
                    <motion.img key={current.cover} src={current.cover} alt="" className="w-full aspect-square rounded-lg object-cover shadow-2xl" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />
                    <div className="mt-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[18px] font-black truncate">{current.title}</div>
                        <div className="text-[13px] text-white/75 truncate">{current.artist}</div>
                      </div>
                      <button onClick={() => toggleLike(current.id)} className="mt-1" aria-label="Like">
                        <Icon.Heart filled={isLiked(current.id)} className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-3">
                      <Visualizer getAnalyser={player.getAnalyser} playing={player.isPlaying} color="#ffffff" height={56} />
                    </div>
                    <div className="mt-2 text-[11px] text-white/70">{current.album}</div>
                  </div>
                ) : (
                  <div className="px-2 text-[12px] text-white/50">Play something to see it here.</div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <NowPlayingBar
        player={player}
        liked={current ? isLiked(current.id) : false}
        onLike={() => current && toggleLike(current.id)}
        queueOpen={panel === "queue"}
        onQueue={() => setPanel((p) => (p === "queue" ? null : "queue"))}
        nowOpen={panel === "now"}
        onNow={() => setPanel((p) => (p === "now" ? null : "now"))}
      />

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="absolute left-1/2 bottom-[92px] z-40 px-4 py-2 rounded-lg bg-[#2e77d0] text-[13px] font-semibold shadow-xl" style={{ x: "-50%" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {wrapped && (
          <Wrapped
            playlists={PLAYLISTS}
            listened={player.listened}
            likedCount={likedTracks.length}
            playedCount={recent.length}
            onClose={() => {
              setWrapped(false);
              unlockAchievement?.("wrapped", "🏆 Achievement unlocked: Wrapped Up", "You watched Marta’s Wrapped 🎁");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
