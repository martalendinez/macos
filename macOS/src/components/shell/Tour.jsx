// src/components/shell/Tour.jsx
// In-place guided tour: a spotlight glides between real parts of the desktop (data-tour targets)
// with a callout next to each. Work first (projects, recruiter path), then the tools, then the fun.
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export const DESKTOP_STEPS = [
  {
    targets: ["projects"],
    eyebrow: "Start here 👇",
    title: "My projects",
    text: "Four case studies, each with the research, the decisions and the code behind them. Double-click or tap to open.",
    action: ["Open Projects", "projects"],
  },
  {
    targets: ["recruiter", "resume"],
    eyebrow: "Short on time? ⏱️",
    title: "The 2-minute version",
    text: "Recruiter Mode puts who I am and my best work on one page. My résumé is right below it.",
    action: ["Open Recruiter Mode", "recruiter"],
  },
  {
    targets: ["dock-stack-design", "dock-stack-code", "dock-stack-finance"],
    eyebrow: "How I work 🛠️",
    title: "Real tools, real files",
    text: "Figma, Notion, VS Code, Claude, GitHub and Excel. Each case study opens them on that project, so you can see how I went from research to code.",
  },
  {
    targets: ["dock-stack-mac", "dock-stack-play", "dock-fun"],
    eyebrow: "Then, have fun 🎮",
    title: "Extras & play",
    text: "Photos, music and the places I’ve lived, plus the apps that run this OS, like Accessibility.",
  },
  {
    targets: ["search"],
    eyebrow: "Lost? 🔎",
    title: "Search anything",
    text: "Press ⌘K to find any app, project or case study. You can replay this tour from Help.",
  },
];

const PAD = 10;
const query = (id) => (id === "search" ? document.querySelector('[aria-label="Spotlight Search"]') : document.querySelector(`[data-tour="${id}"]`));

function unionRect(ids) {
  const rs = ids.map(query).filter(Boolean).map((el) => el.getBoundingClientRect()).filter((r) => r.width && r.height);
  if (!rs.length) return null;
  const x = Math.min(...rs.map((r) => r.left));
  const y = Math.min(...rs.map((r) => r.top));
  const r = Math.max(...rs.map((r) => r.right));
  const b = Math.max(...rs.map((r) => r.bottom));
  const top = Math.max(3, y - PAD);
  return { x: x - PAD, y: top, w: r - x + PAD * 2, h: b + PAD - top };
}

export default function Tour({ open, onClose, onOpenWindow, isDark, steps: STEPS = DESKTOP_STEPS, label = "Guided tour", finishLabel = "Start exploring" }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  const S = STEPS[step];

  const measure = useCallback(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    setRect(unionRect(STEPS[step].targets));
  }, [step, STEPS]);

  // bring the target into view inside its scrolling window
  useEffect(() => {
    if (!open) return;
    query(STEPS[step].targets[0])?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [open, step, STEPS]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    measure();
    // the Dock magnifies on hover and icons animate in, so re-measure briefly
    const id = setInterval(measure, 400);
    window.addEventListener("resize", measure);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const finish = (win) => {
    onClose();
    if (typeof win === "function") win();
    else if (win) setTimeout(() => onOpenWindow?.(win), 300);
  };
  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : finish());

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  // place the callout beside the spotlight: below if there's room, otherwise above; right of left-side targets
  const CW = 320;
  let pos = { left: vp.w / 2 - CW / 2, top: vp.h / 2 - 90 };
  if (rect) {
    const below = rect.y + rect.h + 16;
    const fitsBelow = below + 230 < vp.h;
    if (rect.x < 200 && rect.y < vp.h / 2) pos = { left: rect.x + rect.w + 18, top: Math.max(40, rect.y) };
    else pos = { left: rect.x + rect.w / 2 - CW / 2, top: fitsBelow ? below : rect.y - 16 - 210 };
    pos.left = Math.max(12, Math.min(vp.w - CW - 12, pos.left));
    pos.top = Math.max(40, Math.min(vp.h - 240, pos.top));
  }
  const panel = isDark ? "bg-[#1f1f23]/95 text-white ring-white/10" : "bg-white/95 text-[#1d1d1f] ring-black/5";
  const sub = isDark ? "text-white/65" : "text-black/60";

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[10050]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={label}>
          {/* click-catcher (clicking the dim area moves on) */}
          <div className="absolute inset-0" onClick={next} />

          {/* spotlight: a transparent box whose huge shadow dims everything else */}
          <motion.div
            className="absolute rounded-[18px] pointer-events-none"
            initial={false}
            animate={rect ? { left: rect.x, top: rect.y, width: rect.w, height: rect.h, opacity: 1 } : { left: vp.w / 2, top: vp.h / 2, width: 0, height: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
            style={{ boxShadow: "0 0 0 9999px rgba(8,10,20,0.68)" }}
          >
            <motion.span
              key={step}
              className="absolute inset-0 rounded-[18px] ring-2 ring-[hsl(var(--accent))]"
              initial={{ opacity: 0.9, scale: 1 }}
              animate={{ opacity: [0.9, 0.2, 0.9], scale: [1, 1.04, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* callout */}
          <motion.div
            className={`absolute w-[320px] rounded-[18px] p-5 ring-1 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl ${panel}`}
            initial={false}
            animate={{ left: pos.left, top: pos.top }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--accent))]">{S.eyebrow}</span>
                  <span className={`text-[11.5px] tabular-nums ${sub}`}>
                    {step + 1} / {STEPS.length}
                  </span>
                </div>
                <div className="mt-1 text-[18px] font-bold tracking-[-0.01em]">{S.title}</div>
                <p className={`mt-1 text-[13.5px] leading-snug ${sub}`}>{S.text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex items-center gap-2">
              <button type="button" onClick={() => finish()} className={`mr-auto text-[12.5px] font-medium ${sub} hover:underline`}>
                Skip tour
              </button>
              {S.action && (
                <button type="button" onClick={() => finish(S.action[1])} className={`px-3 py-1.5 rounded-full text-[12.5px] font-semibold ${isDark ? "bg-white/10 hover:bg-white/15" : "bg-black/[0.06] hover:bg-black/10"}`}>
                  {S.action[0]}
                </button>
              )}
              <button type="button" onClick={next} className="px-4 py-1.5 rounded-full text-[12.5px] font-semibold text-white bg-[hsl(var(--accent))] hover:brightness-110">
                {step < STEPS.length - 1 ? "Next" : finishLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
