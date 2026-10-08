// src/components/windows/Music/components/Wrapped.jsx
// "Marta's Wrapped": a Spotify Wrapped-style story built only from Marta's real playlists
// plus what the visitor did this session.
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SLIDE_MS = 5200;

export default function Wrapped({ playlists, listened, likedCount, playedCount, onClose }) {
  const tracks = playlists.flatMap((p) => p.tracks);

  const topArtists = useMemo(() => {
    const m = new Map();
    tracks.forEach((t) => {
      const a = t.artist.split(",")[0].trim();
      const e = m.get(a) ?? { name: a, n: 0, cover: t.cover };
      e.n += 1;
      m.set(a, e);
    });
    return [...m.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name)).slice(0, 5);
  }, [tracks]);

  const minutes = (tracks.reduce((a, t) => a + (t.durationSec ?? 0), 0) / 60).toFixed(0);
  const locked = playlists.find((p) => p.key === "locked-in");

  const slides = [
    {
      bg: "linear-gradient(160deg,#1ed760 0%,#0b6b3a 60%,#062b1a 100%)",
      body: (
        <>
          <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-black/60">Your look at</div>
          <div className="mt-2 text-[44px] font-black leading-[0.95] tracking-[-0.04em] text-black">Marta’s<br />Wrapped 🎁</div>
          <div className="mt-6 text-[15px] font-semibold text-black/75">The soundtrack behind this portfolio.</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(160deg,#ff4fa3 0%,#7b2ff7 100%)",
      body: (
        <>
          <div className="text-[15px] font-bold">{playlists.length} playlists. {playlists.length} moods.</div>
          <div className="mt-5 space-y-3">
            {playlists.map((p, i) => (
              <motion.div key={p.key} className="flex items-center gap-3" initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
                <img src={p.tracks[0]?.cover} alt="" className="w-12 h-12 rounded-md object-cover shadow-lg" />
                <div className="min-w-0">
                  <div className="text-[17px] font-black truncate">{p.title}</div>
                  <div className="text-[12px] opacity-80 truncate">{p.subtitle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ),
    },
    {
      bg: "linear-gradient(160deg,#ffb800 0%,#ff5e00 100%)",
      body: (
        <>
          <div className="text-[15px] font-bold">Top artists</div>
          <div className="mt-4 space-y-2.5">
            {topArtists.map((a, i) => (
              <motion.div key={a.name} className="flex items-center gap-3" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 + i * 0.12, type: "spring" }}>
                <span className="w-7 text-[26px] font-black tabular-nums">{i + 1}</span>
                <img src={a.cover} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-white/50" />
                <span className="text-[18px] font-black truncate">{a.name}</span>
                {a.n > 1 && <span className="ml-auto text-[12px] font-bold bg-black/20 rounded-full px-2 py-0.5">×{a.n}</span>}
              </motion.div>
            ))}
          </div>
        </>
      ),
    },
    {
      bg: "linear-gradient(160deg,#1d1b5e 0%,#3b37c9 100%)",
      body: (
        <>
          <div className="text-[56px]">🎬</div>
          <div className="mt-2 text-[34px] font-black leading-tight tracking-[-0.03em]">Focus mode = film scores</div>
          <div className="mt-3 text-[15px] opacity-85">
            Every track on <b>{locked?.title ?? "Locked In"}</b> is a movie soundtrack. {locked?.tracks.map((t) => t.artist).join(", ")}. Epic music for epic bug fixing.
          </div>
        </>
      ),
    },
    {
      bg: "linear-gradient(160deg,#00c2a8 0%,#005c97 100%)",
      body: (
        <>
          <div className="text-[15px] font-bold">Your visit, wrapped</div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              [Math.floor(listened / 60) + ":" + String(Math.floor(listened % 60)).padStart(2, "0"), "listened"],
              [playedCount, "songs played"],
              [likedCount, "liked songs"],
              [`${minutes} min`, "of music in her playlists"],
            ].map(([v, l], i) => (
              <motion.div key={l} className="rounded-2xl bg-white/15 p-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.12 }}>
                <div className="text-[28px] font-black tabular-nums leading-none">{v}</div>
                <div className="mt-1 text-[12px] opacity-85">{l}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-[13px] opacity-85">{listened > 30 ? "You’ve got great taste 😌" : "Press play and come back. Your stats will grow!"}</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(160deg,#121212 0%,#1ed760 180%)",
      body: (
        <>
          <div className="text-[40px] font-black leading-tight tracking-[-0.03em]">Thanks for listening 💚</div>
          <div className="mt-3 text-[15px] opacity-85">Now go open a case study. It pairs well with “Locked In”.</div>
          <div className="mt-6 flex gap-2">
            <button onClick={() => window.dispatchEvent(new CustomEvent("wrapped:replay"))} className="px-5 py-2 rounded-full bg-white text-black text-[14px] font-bold">
              Replay
            </button>
            <button onClick={onClose} className="px-5 py-2 rounded-full bg-white/15 text-[14px] font-bold">
              Done
            </button>
          </div>
        </>
      ),
    },
  ];

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const replay = () => setI(0);
    window.addEventListener("wrapped:replay", replay);
    return () => window.removeEventListener("wrapped:replay", replay);
  }, []);
  useEffect(() => {
    if (paused || i >= slides.length - 1) return;
    const id = setTimeout(() => setI((x) => x + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [i, paused, slides.length]);

  return (
    <motion.div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button onClick={onClose} className="absolute top-3 right-4 text-white/70 hover:text-white text-[22px]" aria-label="Close Wrapped">
        ✕
      </button>
      <div
        className="relative h-[92%] aspect-[9/16] max-w-[92%] rounded-2xl overflow-hidden text-white shadow-2xl"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="popLayout">
          <motion.div key={i} className="absolute inset-0 p-7 pt-12 flex flex-col justify-center" style={{ background: slides[i].bg }} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            {slides[i].body}
          </motion.div>
        </AnimatePresence>
        <div className="absolute top-3 inset-x-3 flex gap-1 z-10">
          {slides.map((_, k) => (
            <div key={k} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
              {k < i && <div className="h-full w-full bg-white" />}
              {k === i && <motion.div key={`${i}-${paused}`} className="h-full bg-white" initial={{ width: "0%" }} animate={{ width: paused || i === slides.length - 1 ? undefined : "100%" }} transition={{ duration: SLIDE_MS / 1000, ease: "linear" }} />}
            </div>
          ))}
        </div>
        {/* tap zones (not on the last slide, which has its own buttons) */}
        {i < slides.length - 1 && (
          <>
            <button className="absolute left-0 top-10 bottom-0 w-1/3 z-10" onClick={() => setI((x) => Math.max(0, x - 1))} aria-label="Previous slide" />
            <button className="absolute right-0 top-10 bottom-0 w-2/3 z-10" onClick={() => setI((x) => x + 1)} aria-label="Next slide" />
          </>
        )}
      </div>
    </motion.div>
  );
}
