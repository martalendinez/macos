// src/components/windows/FaceTime/FaceTimeWindow.jsx
// FaceTime-style "Book a call": ring Marta, then book / email / LinkedIn.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import avatar from "../../../imgs/avatar/profile-photo.jpg";
import { CONTACT, PROFILE } from "../About/aboutData";

// ✏️ Paste your Calendly / Cal.com / Google booking link here. Empty = "Book a call" opens a pre-filled email.
export const BOOKING_URL = "";

const MARTA_TZ = "Europe/Stockholm";
const linkedIn = CONTACT.links.find((l) => l.label === "LinkedIn")?.href;
const bookingHref =
  BOOKING_URL ||
  `mailto:${CONTACT.email}?subject=${encodeURIComponent("Let's book a call 📞")}&body=${encodeURIComponent(
    "Hi Marta,\n\nI found your portfolio and would love to set up a quick call.\nHere are a few times that work for me:\n\n- \n- \n\nBest,\n"
  )}`;

function timeIn(tz) {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz, hour12: false });
}

function offsetHours(tz) {
  const now = new Date();
  const a = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const b = new Date(now.toLocaleString("en-US"));
  return Math.round((a - b) / 36e5);
}

function ring() {
  // short two-tone ring with Web Audio (no audio files)
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.45].forEach((delay) => {
      [440, 480].forEach((f) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = f;
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + delay + 0.02);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.35);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + delay);
        o.stop(ctx.currentTime + delay + 0.4);
      });
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    /* audio unavailable */
  }
}

function Action({ icon, label, sub, onClick, href, primary }) {
  const cls = `group flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-left transition active:scale-[0.98] ${
    primary ? "bg-[#30d158] text-white hover:bg-[#28c24e]" : "bg-white/10 text-white hover:bg-white/[0.16] backdrop-blur-xl"
  }`;
  const body = (
    <>
      <span className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] ${primary ? "bg-white/25" : "bg-white/10"}`}>{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-semibold">{label}</span>
        {sub && <span className="block text-[12px] text-white/70 truncate">{sub}</span>}
      </span>
      <span className="text-white/60 transition group-hover:translate-x-0.5">›</span>
    </>
  );
  return href ? (
    <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className={cls} onClick={onClick}>
      {body}
    </a>
  ) : (
    <button className={cls} onClick={onClick}>
      {body}
    </button>
  );
}

export default function FaceTimeWindow({ onOpenWindow, unlockAchievement }) {
  const [state, setState] = useState("idle"); // idle | calling | missed
  const [, tick] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => {
      clearInterval(id);
      clearTimeout(timer.current);
    };
  }, []);

  function call() {
    setState("calling");
    ring();
    const again = setTimeout(ring, 1500);
    timer.current = setTimeout(() => {
      clearTimeout(again);
      setState("missed");
      unlockAchievement?.("lets_talk", "🏆 Achievement unlocked: Let’s Talk", "You called Marta 📞");
    }, 3600);
  }

  const diff = offsetHours(MARTA_TZ);
  const diffLabel = diff === 0 ? "same time as you" : `${Math.abs(diff)}h ${diff > 0 ? "ahead of" : "behind"} you`;

  return (
    <div className="no-darkwin relative h-full w-full overflow-hidden bg-black text-white">
      {/* blurred "video" background */}
      <motion.img
        src={avatar}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "blur(36px) saturate(1.3)", transform: "scale(1.25)" }}
        animate={{ opacity: state === "calling" ? 0.75 : 0.55 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />

      <div className="relative h-full overflow-y-auto flex flex-col items-center px-6 pt-10 pb-8">
        {/* avatar with pulsing rings while calling */}
        <div className="relative">
          <AnimatePresence>
            {state === "calling" &&
              [0, 0.6, 1.2].map((d) => (
                <motion.span
                  key={d}
                  className="absolute inset-0 rounded-full border-2 border-[#30d158]"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, delay: d, repeat: Infinity, ease: "easeOut" }}
                />
              ))}
          </AnimatePresence>
          <motion.img
            src={avatar}
            alt="Marta"
            className="relative w-[120px] h-[120px] rounded-full object-cover ring-4 ring-white/20 shadow-2xl"
            animate={state === "calling" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, repeat: state === "calling" ? Infinity : 0 }}
          />
        </div>

        <div className="mt-4 text-[26px] font-semibold tracking-[-0.02em]">{PROFILE.name}</div>
        <AnimatePresence mode="wait">
          <motion.div key={state} className="text-[14px] text-white/75" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {state === "idle" && `FaceTime Video · ${PROFILE.role} @ ${PROFILE.company.name}`}
            {state === "calling" && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>Calling…</motion.span>}
            {state === "missed" && "Marta is probably designing something right now 🎨"}
          </motion.div>
        </AnimatePresence>

        <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl px-3 py-1 text-[12px] text-white/80">
          <span>🕐</span> In Stockholm it’s <b className="text-white tabular-nums">{timeIn(MARTA_TZ)}</b>
          <span className="text-white/50">· {diffLabel}</span>
        </div>

        <div className="mt-8 w-full max-w-[380px] space-y-2.5">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div key="idle" className="flex flex-col items-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <motion.button
                  onClick={call}
                  whileTap={{ scale: 0.92 }}
                  className="w-[72px] h-[72px] rounded-full bg-[#30d158] flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(48,209,88,0.8)]"
                  aria-label="Call Marta"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white" aria-hidden="true">
                    <path d="M15 8.5a2 2 0 0 0-2-2H4.5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2H13a2 2 0 0 0 2-2v-1.8l4.2 2.9c.6.4 1.3 0 1.3-.7V8.1c0-.7-.7-1.1-1.3-.7L15 10.3z" />
                  </svg>
                </motion.button>
                <div className="mt-2 text-[12px] text-white/70">Tap to call</div>
                <div className="mt-6 w-full space-y-2.5">
                  <Action primary icon="📅" label="Book a call" sub={BOOKING_URL ? "Pick a time that suits you" : "Suggest a few times by email"} href={bookingHref} />
                </div>
              </motion.div>
            )}

            {state === "calling" && (
              <motion.div key="calling" className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.button
                  onClick={() => {
                    clearTimeout(timer.current);
                    setState("idle");
                  }}
                  whileTap={{ scale: 0.92 }}
                  className="w-[72px] h-[72px] rounded-full bg-[#ff3b30] flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(255,59,48,0.8)]"
                  aria-label="End call"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 rotate-[135deg]" fill="white" aria-hidden="true">
                    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
                  </svg>
                </motion.button>
              </motion.div>
            )}

            {state === "missed" && (
              <motion.div key="missed" className="space-y-2.5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center text-[13px] text-white/80 mb-3">No answer… but let’s find a time that works!</div>
                <Action primary icon="📅" label="Book a call" sub={BOOKING_URL ? "Pick a time that suits you" : "Suggest a few times by email"} href={bookingHref} />
                <Action icon="✉️" label="Send an email" sub={CONTACT.email} href={`mailto:${CONTACT.email}`} />
                {linkedIn && <Action icon="in" label="Message on LinkedIn" sub="Connect with me" href={linkedIn} />}
                <Action icon="💬" label="Ask the pre-recorded me" sub="Quick answers in Messages" onClick={() => onOpenWindow?.("messages")} />
                <button onClick={() => setState("idle")} className="w-full pt-2 text-[12px] text-white/60 hover:text-white">
                  Call again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
