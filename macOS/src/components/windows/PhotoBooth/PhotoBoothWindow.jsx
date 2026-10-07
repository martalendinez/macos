// src/components/windows/PhotoBooth/PhotoBoothWindow.jsx
// Webcam with filters, 3-2-1 countdown, flash and a photo tray. Photos never leave the device.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FILTERS = [
  { id: "normal", label: "Normal", css: "none" },
  { id: "mono", label: "Black & White", css: "grayscale(1) contrast(1.1)" },
  { id: "sepia", label: "Sepia", css: "sepia(0.9) contrast(1.05)" },
  { id: "vivid", label: "Vivid", css: "saturate(2) contrast(1.15)" },
  { id: "thermal", label: "Thermal", css: "invert(1) hue-rotate(180deg) saturate(4) contrast(1.4)" },
  { id: "xray", label: "X-Ray", css: "grayscale(1) invert(1) contrast(1.3)" },
  { id: "pop", label: "Pop Art", css: "hue-rotate(90deg) saturate(4) contrast(1.6)" },
  { id: "dreamy", label: "Dreamy", css: "blur(2px) brightness(1.15) saturate(1.35)" },
  { id: "noir", label: "Noir", css: "grayscale(1) contrast(1.9) brightness(0.85)" },
];

function shutterSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = ctx.sampleRate * 0.12;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    src.buffer = buf;
    src.connect(gain).connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {
    /* audio not available */
  }
}

function LiveVideo({ stream, filter, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && stream) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      className={`w-full h-full object-cover ${className}`}
      style={{ filter, transform: "scaleX(-1)" }}
    />
  );
}

export default function PhotoBoothWindow({ unlockAchievement }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [showEffects, setShowEffects] = useState(false);
  const [count, setCount] = useState(null);
  const [flash, setFlash] = useState(false);
  const [photos, setPhotos] = useState([]); // { id, url }
  const [preview, setPreview] = useState(null);
  const [withFrame, setWithFrame] = useState(true);
  const mainVideo = useRef(null);
  const streamRef = useRef(null);

  async function startCamera() {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
      streamRef.current = s;
      setStream(s);
    } catch (e) {
      setError(e?.name === "NotAllowedError" ? "denied" : "unavailable");
    }
  }

  // stop the camera when the window closes
  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  useEffect(() => {
    if (mainVideo.current && stream) mainVideo.current.srcObject = stream;
  }, [stream, showEffects]);

  function capture() {
    const v = mainVideo.current;
    if (!v || !v.videoWidth) return;
    const w = v.videoWidth;
    const h = v.videoHeight;
    const pad = withFrame ? Math.round(w * 0.03) : 0;
    const strip = withFrame ? Math.round(h * 0.12) : 0;

    const c = document.createElement("canvas");
    c.width = w + pad * 2;
    c.height = h + pad * 2 + strip;
    const ctx = c.getContext("2d");

    if (withFrame) {
      ctx.fillStyle = "#fbfaf7";
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.save();
    if ("filter" in ctx) ctx.filter = filter.css;
    ctx.translate(pad + w, pad);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, w, h);
    ctx.restore();

    if (withFrame) {
      ctx.fillStyle = "#2b2b2b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${Math.round(strip * 0.32)}px -apple-system, "Inter", sans-serif`;
      ctx.fillText("visited marta’s portfolio ✨", c.width / 2, h + pad * 2 + strip * 0.42);
      ctx.font = `400 ${Math.round(strip * 0.2)}px -apple-system, "Inter", sans-serif`;
      ctx.fillStyle = "#8a8a8a";
      ctx.fillText(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), c.width / 2, h + pad * 2 + strip * 0.75);
    }

    const url = c.toDataURL("image/jpeg", 0.92);
    setPhotos((p) => [{ id: Date.now(), url }, ...p]);
    if (photos.length === 0) {
      unlockAchievement?.("say_cheese", "Achievement unlocked: Say Cheese!", "You took a selfie in Photo Booth 📸");
    }
  }

  function takePhoto() {
    if (count != null || !stream) return;
    let n = 3;
    setCount(n);
    const id = setInterval(() => {
      n -= 1;
      if (n > 0) setCount(n);
      else {
        clearInterval(id);
        setCount(null);
        setFlash(true);
        shutterSound();
        capture();
        setTimeout(() => setFlash(false), 450);
      }
    }, 800);
  }

  function download(p) {
    const a = document.createElement("a");
    a.href = p.url;
    a.download = `photo-booth-${p.id}.jpg`;
    a.click();
  }

  return (
    <div className="no-darkwin relative h-full flex flex-col bg-[#232325] text-white select-none">
      {/* stage */}
      <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden">
        {!stream ? (
          <div className="text-center px-8 max-w-md">
            <div className="text-6xl mb-4">📸</div>
            <div className="text-[18px] font-semibold">Photo Booth</div>
            <p className="mt-2 text-[13px] text-white/60 leading-relaxed">
              Take a selfie with fun filters. Your camera stays on your device: nothing is uploaded or saved anywhere.
            </p>
            {error && (
              <p className="mt-3 text-[13px] text-[#ff6961]">
                {error === "denied"
                  ? "Camera access was blocked. Allow it in your browser’s address bar and try again."
                  : "No camera was found on this device."}
              </p>
            )}
            <button onClick={startCamera} className="mt-5 px-5 py-2 rounded-full bg-[#ff3b30] hover:bg-[#ff5147] text-[14px] font-semibold">
              Turn on camera
            </button>
          </div>
        ) : showEffects ? (
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFilter(f);
                  setShowEffects(false);
                }}
                className={`relative overflow-hidden rounded-sm ${filter.id === f.id ? "ring-2 ring-[#0a84ff]" : ""}`}
              >
                <LiveVideo stream={stream} filter={f.css} />
                <span className="absolute bottom-1 inset-x-0 text-[12px] font-medium drop-shadow">{f.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <video
            ref={mainVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ filter: filter.css, transform: "scaleX(-1)" }}
          />
        )}

        <AnimatePresence>
          {count != null && (
            <motion.div
              key={count}
              className="absolute inset-0 flex items-center justify-center text-[160px] font-bold text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] pointer-events-none"
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {count}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {flash && (
            <motion.div className="absolute inset-0 bg-white pointer-events-none" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.45 }} />
          )}
        </AnimatePresence>

        {stream && !showEffects && filter.id !== "normal" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-[12px]">{filter.label}</div>
        )}
      </div>

      {/* toolbar */}
      <div className="shrink-0 h-[64px] px-4 grid grid-cols-[1fr_auto_1fr] items-center bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] border-t border-black/60">
        <label className="flex items-center gap-2 text-[12px] text-white/75">
          <input type="checkbox" checked={withFrame} onChange={(e) => setWithFrame(e.target.checked)} className="accent-[#ff3b30]" />
          Polaroid frame
        </label>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={takePhoto}
          disabled={!stream || count != null}
          className="w-12 h-12 rounded-full bg-[#ff3b30] disabled:opacity-40 flex items-center justify-center shadow-[inset_0_-3px_0_rgba(0,0,0,0.25),0_2px_6px_rgba(0,0,0,0.4)]"
          aria-label="Take photo"
          title="Take photo"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white" aria-hidden="true">
            <path d="M9 4.5 7.6 6.5H5A2.5 2.5 0 0 0 2.5 9v8.5A2.5 2.5 0 0 0 5 20h14a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 19 6.5h-2.6L15 4.5zM12 9a4.25 4.25 0 1 1 0 8.5A4.25 4.25 0 0 1 12 9z" />
          </svg>
        </motion.button>

        <div className="flex justify-end">
          <button
            onClick={() => setShowEffects((s) => !s)}
            disabled={!stream}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium border border-black/50 disabled:opacity-40 ${
              showEffects ? "bg-[#0a84ff]" : "bg-[#4a4a4c] hover:bg-[#555557]"
            }`}
          >
            Effects
          </button>
        </div>
      </div>

      {/* photo tray */}
      {photos.length > 0 && (
        <div className="shrink-0 h-[84px] px-3 py-2 flex gap-2 overflow-x-auto bg-[#1c1c1e] border-t border-black/60">
          <AnimatePresence initial={false}>
            {photos.map((p) => (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setPreview(p)}
                className="h-full aspect-[4/3] shrink-0 rounded overflow-hidden ring-1 ring-white/10 hover:ring-white/50"
              >
                <img src={p.url} alt="Your photo" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="absolute inset-0 z-10 bg-black/85 flex flex-col items-center justify-center gap-4 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
          >
            <motion.img
              src={preview.url}
              alt="Your photo"
              className="max-w-full max-h-[78%] rounded shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => download(preview)} className="px-4 py-1.5 rounded-md bg-[#0a84ff] text-[13px] font-medium">
                Download
              </button>
              <button
                onClick={() => {
                  setPhotos((ps) => ps.filter((x) => x.id !== preview.id));
                  setPreview(null);
                }}
                className="px-4 py-1.5 rounded-md bg-white/15 hover:bg-white/25 text-[13px] font-medium"
              >
                Delete
              </button>
              <button onClick={() => setPreview(null)} className="px-4 py-1.5 rounded-md bg-white/15 hover:bg-white/25 text-[13px] font-medium">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
