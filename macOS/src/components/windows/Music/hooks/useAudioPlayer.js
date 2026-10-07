// src/components/windows/Music/hooks/useAudioPlayer.js
// Small audio engine for the Music window: queue, shuffle, repeat, seek, volume, Media Session.
import { useCallback, useEffect, useRef, useState } from "react";

export default function useAudioPlayer() {
  const [audio] = useState(() => (typeof Audio !== "undefined" ? new Audio() : null));

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
      setIndex(i);
      setTime(0);
      setDuration(0);
      audio.src = q[i].previewUrl;
      audio.currentTime = 0;
      audio.play().catch(() => setIsPlaying(false));
    },
    [audio]
  );

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
    const onTime = () => setTime(audio.currentTime);
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
    queueSource,
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
