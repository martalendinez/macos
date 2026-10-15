// src/components/shell/Welcome.jsx
// First-visit guide: who Marta is, the work first (projects + case studies), the fast path for
// recruiters, then where the fun extras live. Shown once; reopen from Help → Welcome guide.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "../windows/Projects/data/projectData";
import { PosterThumb } from "../windows/Projects/ui/ProjectCover";
import avatar from "../../imgs/avatar/profile-photo.jpg";
import { getIcons } from "../../config/apps";

const KEY = "portfolio.welcome.v1";
const CASE = { thesis: "thesisCaseStudy", employerBranding: "employerBrandingCaseStudy", kthTriviaApp: "triviaCaseStudy", restaurantCoordination: "groupDiningCaseStudy" };
const EASE = [0.22, 1, 0.36, 1];

export function shouldShowWelcome() {
  try {
    return !localStorage.getItem(KEY);
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* storage blocked */
  }
}

const STACKS = [
  ["Design", "Figma, Notion", "stackDesign"],
  ["Code", "VS Code, Claude, GitHub", "stackCode"],
  ["Finance", "Excel, Fund Simulator", "stackFinance"],
  ["This Mac", "Accessibility, Design System…", "stackMac"],
  ["Play & Me", "Photos, music, maps…", "stackPlay"],
];

export default function Welcome({ open, onClose, onOpenWindow, onOpenResume, onStartTour, isDark, iconTheme = "glass" }) {
  const icons = getIcons(iconTheme);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") setStep((s) => Math.min(3, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const finish = (win) => {
    markSeen();
    onClose();
    if (win === "resume") setTimeout(() => onOpenResume?.(), 250);
    else if (win) setTimeout(() => onOpenWindow?.(win), 250);
  };

  const c = isDark
    ? { panel: "rgba(30,30,34,0.86)", text: "text-white", sub: "text-white/60", card: "bg-white/[0.06] hover:bg-white/[0.1]", ring: "ring-white/10", dot: "bg-white/25" }
    : { panel: "rgba(255,255,255,0.86)", text: "text-[#1d1d1f]", sub: "text-black/55", card: "bg-black/[0.035] hover:bg-black/[0.06]", ring: "ring-black/[0.06]", dot: "bg-black/20" };
  const primary = "bg-[hsl(var(--accent))] text-white hover:brightness-110";
  const secondary = isDark ? "bg-white/10 text-white hover:bg-white/15" : "bg-black/[0.06] text-black hover:bg-black/10";

  const steps = [
    {
      body: (
        <div className="text-center">
          <motion.img src={avatar} alt="Marta Lendínez" className="mx-auto w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white/70" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} />
          <h1 className={`mt-5 text-[28px] @md:text-[32px] font-bold tracking-[-0.03em] ${c.text}`}>Hi, I’m Marta 👋</h1>
          <p className={`mt-2 text-[15px] leading-relaxed max-w-[420px] mx-auto ${c.sub}`}>
            Design Engineer at ROYC. I design products and build them. This portfolio works like a Mac: everything here is a real app you can open.
          </p>
          <p className={`mt-4 text-[13px] ${c.sub}`}>Here’s the 20-second version of where to look.</p>
        </div>
      ),
      actions: onStartTour
        ? [
            ["Explore on my own", () => finish(), secondary],
            ["Show me around", () => { markSeen(); onStartTour(); }, primary],
          ]
        : [["Show me around", () => setStep(1), primary]],
    },
    {
      body: (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--accent))]">Start here 👇</div>
          <h2 className={`mt-1 text-[24px] font-bold tracking-[-0.02em] ${c.text}`}>My projects</h2>
          <p className={`mt-1 text-[14px] ${c.sub}`}>Four case studies, each with the research, the decisions and the code behind them.</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {PROJECTS.map((p) => (
              <button key={p.id} type="button" onClick={() => finish(CASE[p.id])} className={`group text-left rounded-[14px] overflow-hidden ring-1 ${c.ring} ${c.card} transition`}>
                <span className="relative block w-full aspect-[520/240] overflow-hidden">
                  <PosterThumb project={p} />
                </span>
                <span className="block px-3 py-2">
                  <span className={`block text-[13px] font-semibold truncate ${c.text}`}>{p.shortTitle ?? p.title}</span>
                  <span className={`block text-[11.5px] truncate ${c.sub}`}>{p.meta?.slice(0, 2).join(" · ")}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ),
      actions: [
        ["Open Projects", () => finish("projects"), primary],
        ["Next", () => setStep(2), secondary],
      ],
    },
    {
      body: (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--accent))]">Short on time? ⏱️</div>
          <h2 className={`mt-1 text-[24px] font-bold tracking-[-0.02em] ${c.text}`}>The 2-minute version</h2>
          <div className="mt-4 space-y-2.5">
            {[
              ["recruiter", "/icons/glass/ProfileGlass.png", "Recruiter Mode", "Who I am, what I’m good at and my best work, on one page"],
              ["resume", "/icons/glass/MailGlass.png", "Résumé", "The PDF, ready to download"],
              ["about", "/icons/glass/me-512.png", "About me", "Experience, education and how to reach me"],
            ].map(([win, icon, title, desc]) => (
              <button key={win} type="button" onClick={() => finish(win)} className={`w-full flex items-center gap-3.5 rounded-[14px] p-3 text-left transition ${c.card}`}>
                <img src={icon} alt="" className="w-11 h-11 object-contain" />
                <span className="min-w-0 flex-1">
                  <span className={`block text-[14px] font-semibold ${c.text}`}>{title}</span>
                  <span className={`block text-[12.5px] ${c.sub}`}>{desc}</span>
                </span>
                <span className="text-[hsl(var(--accent))] text-[18px]">›</span>
              </button>
            ))}
          </div>
        </div>
      ),
      actions: [["Next", () => setStep(3), primary]],
    },
    {
      body: (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--accent))]">Then, have fun 🎮</div>
          <h2 className={`mt-1 text-[24px] font-bold tracking-[-0.02em] ${c.text}`}>The Dock is full of real apps</h2>
          <p className={`mt-1 text-[14px] ${c.sub}`}>Each folder in the Dock opens a set of apps. They show how I work, and some are just for fun.</p>
          <div className="mt-4 grid grid-cols-1 @md:grid-cols-2 gap-2">
            {STACKS.map(([name, desc, iconKey]) => (
              <div key={name} className={`flex items-center gap-3 rounded-[12px] p-2.5 ${isDark ? "bg-white/[0.04]" : "bg-black/[0.025]"}`}>
                <img src={icons[iconKey]} alt="" className="w-9 h-9 object-contain" />
                <span className="min-w-0">
                  <span className={`block text-[13.5px] font-semibold ${c.text}`}>{name}</span>
                  <span className={`block text-[12px] truncate ${c.sub}`}>{desc}</span>
                </span>
              </div>
            ))}
          </div>
          <p className={`mt-4 text-[12.5px] ${c.sub}`}>
            Tip: press <kbd className={`px-1.5 py-0.5 rounded-[5px] text-[11px] font-semibold ${secondary}`}>⌘K</kbd> to search for anything. You can reopen this guide from Help.
          </p>
        </div>
      ),
      actions: [
        ["See my projects", () => finish("projects"), primary],
        ["Explore on my own", () => finish(), secondary],
      ],
    },
  ];
  const S = steps[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[6000] flex items-center justify-center p-3 @container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Welcome">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[6px]" onClick={() => finish()} />
          <motion.div
            className="relative w-full max-w-[560px] max-h-full overflow-y-auto rounded-[26px] p-6 @md:p-8 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/30 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.55)]"
            style={{ background: c.panel }}
            initial={{ y: 24, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <button type="button" onClick={() => finish()} className={`absolute right-4 top-4 text-[12.5px] font-medium ${c.sub} hover:underline`}>
              Skip
            </button>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25, ease: EASE }}>
                {S.body}
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className={`flex gap-1.5 w-full justify-center mb-2 @md:w-auto @md:justify-start @md:mb-0 @md:mr-auto ${onStartTour ? "invisible" : ""}`}>
                {steps.map((_, i) => (
                  <button key={i} type="button" onClick={() => setStep(i)} aria-label={`Step ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === step ? "w-5 bg-[hsl(var(--accent))]" : `w-1.5 ${c.dot}`}`} />
                ))}
              </div>
              {step > 0 && (
                <button type="button" onClick={() => setStep(step - 1)} className={`mr-auto @md:mr-0 px-3 py-2 text-[13px] font-medium ${c.sub}`}>
                  Back
                </button>
              )}
              {S.actions.map(([label, fn, cls]) => (
                <button key={label} type="button" onClick={fn} className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition active:scale-95 ${cls}`}>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
