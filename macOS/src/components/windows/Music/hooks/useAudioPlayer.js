// src/components/windows/Music/hooks/useAudioPlayer.js
// Small audio engine for the Music window: queue, shuffle, repeat, seek, volume, Media Session,
// a Web Audio analyser for the visualizer, and a listening-time counter for "Wrapped".
import { useCallback, useEffect, useRef, useState } from "react";

export default function useAudioPlayer() {
  const [audio] = useState(() => {
    if (typeof Audio === "undefined") return null;
    const a = new Audio();
    a.crossOrigin = "anonymous"; // previews send CORS headers, so the analyser can read them
    return a;
  });
  const graph = useRef(null); // { ctx, analyser }
  const [listened, setListened] = useState(0); // seconds actually played this session
  const lastT = useRef(0);

  const [queue, setQueue] = useState([]); // playable tracks
  const [queueSource, setQueueSource] = useState(null); // e.g. playlist key or "search"
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off"); // "off" | "all" | "one"

  const current = index >= 0 ? queue[index] : null;

  // latest state for event handlers
  const live = useRef({});
  live.current = { queue, index, shuffle, repeat };

  const load = useCallback(
    (q, i) => {
      if (!audio || !q[i]) return;
      ensureGraph();
      setIndex(i);
      lastT.current = 0;
      setTime(0);
      setDuration(0);
      audio.src = q[i].previewUrl;
      audio.currentTime = 0;
      audio.play().catch(() => setIsPlaying(false));
    },
    [audio]
  );

  // Web Audio graph, created on the first user-initiated play (browsers require a gesture)
  function ensureGraph() {
    if (graph.current || !audio) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      ctx.createMediaElementSource(audio).connect(analyser);
      analyser.connect(ctx.destination);
      graph.current = { ctx, analyser };
    } catch {
      /* Web Audio unavailable: visualizer falls back to an animation */
    }
  }
  const getAnalyser = useCallback(() => {
    if (graph.current?.ctx.state === "suspended") graph.current.ctx.resume();
    return graph.current?.analyser ?? null;
  }, []);

  /** Insert a track to play right after the current one (Spotify's "Add to queue"). */
  const addToQueue = useCallback(
    (track) => {
      if (!track?.previewUrl) return;
      const { queue: q, index: i } = live.current;
      if (i < 0) {
        setQueue([track]);
        setQueueSource("queue");
        load([track], 0);
        return;
      }
      setQueue([...q.slice(0, i + 1), { ...track, queued: true, id: `${track.id}#q${Date.now()}` }, ...q.slice(i + 1)]);
    },
    [load]
  );

  const playAt = useCallback((i) => load(live.current.queue, i), [load]);

  const playQueue = useCallback(
    (tracks, startTrack, source) => {
      const q = tracks.filter((t) => t.previewUrl);
      if (!q.length) return;
      const i = Math.max(0, startTrack ? q.findIndex((t) => t.id === startTrack.id) : 0);
      setQueue(q);
      setQueueSource(source ?? null);
      load(q, i);
    },
    [load]
  );

  const togglePlay = useCallback(() => {
    if (!audio || !audio.src) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [audio]);

  const next = useCallback(
    (auto = false) => {
      const { queue: q, index: i, shuffle: sh, repeat: rp } = live.current;
      if (!q.length) return;
      if (auto && rp === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      let n;
      if (sh && q.length > 1) {
        do n = Math.floor(Math.random() * q.length);
        while (n === i);
      } else {
        n = i + 1;
      }
      if (n >= q.length) {
        if (rp === "all" || !auto) n = 0;
        else {
          audio.pause();
          audio.currentTime = 0;
          return;
        }
      }
      load(q, n);
    },
    [audio, load]
  );

  const prev = useCallback(() => {
    const { queue: q, index: i } = live.current;
    if (!q.length) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    load(q, i > 0 ? i - 1 : q.length - 1);
  }, [audio, load]);

  const seek = useCallback(
    (ratio) => {
      if (!audio || !Number.isFinite(audio.duration)) return;
      audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
      setTime(audio.currentTime);
    },
    [audio]
  );

  const setVolume = useCallback((v) => {
    setVolumeState(Math.max(0, Math.min(1, v)));
    setMuted(false);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  // audio element events
  useEffect(() => {
    if (!audio) return;
    const onTime = () => {
      const d = audio.currentTime - lastT.current;
      if (d > 0 && d < 2 && !audio.paused) setListened((s) => s + d);
      lastT.current = audio.currentTime;
      setTime(audio.currentTime);
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => next(true);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audio, next]);

  useEffect(() => {
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [audio, volume, muted]);

  // stop when the window closes
  useEffect(() => {
    return () => {
      if (!audio) return;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      graph.current?.ctx.close();
    };
  }, [audio]);

  // OS "Now Playing" integration (media keys, lock screen, macOS Control Center)
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    const art = current.cover ? [{ src: new URL(current.cover, window.location.href).href, sizes: "512x512" }] : [];
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: current.title,
      artist: current.artist,
      album: current.album ?? "",
      artwork: art,
    });
    const set = (a, fn) => {
      try {
        navigator.mediaSession.setActionHandler(a, fn);
      } catch {
        /* unsupported action */
      }
    };
    set("play", () => audio.play());
    set("pause", () => audio.pause());
    set("nexttrack", () => next());
    set("previoustrack", () => prev());
  }, [audio, current, next, prev]);

  return {
    current,
    queue,
    index,
    queueSource,
    listened,
    getAnalyser,
    addToQueue,
    playAt,
    isPlaying,
    time,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    playQueue,
    togglePlay,
    next: () => next(false),
    prev,
    seek,
    setVolume,
    setMuted,
    setShuffle,
    cycleRepeat,
  };
}
