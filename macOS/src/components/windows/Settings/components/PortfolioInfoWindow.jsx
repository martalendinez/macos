// src/components/windows/Settings/components/PortfolioInfoWindow.jsx
// "About This Mac"-style window for the portfolio itself.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../../Projects/caseStudy/useCaseStudyTheme";
import { getApps } from "../../../../config/apps";

const DEFAULT_WALLPAPER = { light: "/wallpapers/glass/glass2.jpeg", dark: "/wallpapers/glass/glass2dark.jpeg" };
const REPO = "https://github.com/martalendinez/macOS";
const EASE = [0.22, 1, 0.36, 1];

const STACK = [
  { name: "React", version: "18.3", what: "Component-based UI", tint: "#61dafb" },
  { name: "Vite", version: "5.4", what: "Dev server & production builds", tint: "#a259ff" },
  { name: "Tailwind CSS", version: "4.1", what: "Styling + theme tokens for light/dark & glass", tint: "#38bdf8" },
  { name: "Framer Motion", version: "12", what: "Window, Dock & UI animations", tint: "#ff4ecd" },
  { name: "Leaflet", version: "1.9", what: "The Maps app", tint: "#34c759" },
];

const SERVICES = [
  ["Open-Meteo", "Live weather (no API key)"],
  ["iTunes Search", "30-second music previews"],
  ["Esri basemaps", "Map & satellite tiles"],
];

// ✏️ keep these in sync with the portfolios that inspired you
const INSPIRATION = [
  {
    name: "Dustin Brett",
    url: "https://dustinbrett.com",
    text: "One of my biggest inspirations was Dustin Brett, who created a full Windows-style portfolio filled with apps, videos, and interactive windows.",
  },
  {
    name: "You Zhang",
    url: "https://atom63.io",
    text: "I was also inspired by You Zhang, who built a macOS-style portfolio with beautifully crafted motion design. Their attention to transitions and interaction flow had a huge influence on how I approached movement in my own work.",
  },
  {
    name: "Aakash Sharma",
    url: "https://aakash-sharma.vercel.app",
    text: "Another designer who really inspired me took the macOS concept even further by recreating an entire desktop filled with functional mini-apps: things like a VS Code window, a Spotify player, and other playful system elements.",
  },
];

const CHANGELOG = [
  {
    version: "2.0",
    date: "October 2026",
    items: [
      "macOS-faithful shell: menu bar, Dock magnification, traffic lights, genie minimize, Spotlight, lock screen",
      "Redesigned case studies, Projects, About me, Recruiter Mode and System Settings",
      "Apple Maps-style Maps with a journey tour, and a working Music player",
      "New apps: Instagram, Messages, Photo Booth, Notes, Weather, Stickies, Calculator, Paint",
    ],
  },
  { version: "1.0", date: "February 2026", items: ["First release of the window-based portfolio"] },
];

const TABS = ["Overview", "Built with", "Inspiration", "Changelog"];

function MacBook({ src }) {
  return (
    <div className="relative mx-auto w-[220px]">
      <div className="rounded-t-[12px] bg-[#1d1d1f] p-[6px] pb-[8px] shadow-[0_20px_40px_-18px_rgba(0,0,0,0.5)]">
        <div className="relative aspect-[16/10] rounded-[5px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${src})` }}>
          <div className="absolute inset-x-0 top-0 h-[7px] bg-white/35 backdrop-blur-sm" />
          <motion.div
            className="absolute left-[22%] top-[24%] w-[50%] h-[46%] rounded-[3px] bg-white shadow-lg"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="flex gap-[2px] p-[3px]">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} className="w-[3px] h-[3px] rounded-full" style={{ background: c }} />
              ))}
            </div>
          </motion.div>
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[26%] h-[8%] rounded-[2px] bg-white/40 backdrop-blur-sm" />
        </div>
      </div>
      <div className="relative -mx-[14px] h-[10px] rounded-b-[10px] bg-gradient-to-b from-[#d6d6db] to-[#a9a9ae]">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[44px] h-[4px] rounded-b-[4px] bg-[#9a9aa0]" />
      </div>
    </div>
  );
}

function SpecRow({ t, label, children }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-1 text-[13px]">
      <span className={`text-right ${t.textSub}`}>{label}</span>
      <span className={`font-medium ${t.textMain}`}>{children}</span>
    </div>
  );
}

export default function PortfolioInfoWindow({ uiTheme = "glass", glassContrast = "light", theme = "light", wallpaperUrl, onOpenWindow }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance: theme });
  const [tab, setTab] = useState("Overview");
  const appCount = getApps("glass").filter((a) => a.kind === "app").length;
  const screen = wallpaperUrl ?? (theme === "dark" ? DEFAULT_WALLPAPER.dark : DEFAULT_WALLPAPER.light);
  const group = t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.07]" : "bg-[#f5f5f7]";

  return (
    <div className={`no-darkwin h-full overflow-y-auto ${t.windowBg}`}>
      <div className="max-w-[620px] mx-auto px-6 py-8">
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
          <MacBook src={screen} />
        </motion.div>
        <div className="mt-6 text-center">
          <h1 className={`text-[30px] font-bold tracking-[-0.03em] ${t.textMain}`}>Marta’s Portfolio</h1>
          <div className={`text-[13px] ${t.textSub}`}>Version 2.0 · Built as an interactive window-based system, not just a static website.</div>
        </div>

        {/* TABS */}
        <div className="mt-6 flex justify-center">
          <div className={`flex rounded-[8px] p-0.5 text-[12px] font-medium ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            {TABS.map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`relative px-3.5 py-1 rounded-[6px] ${tab === k ? t.textMain : t.textSub}`}>
                {tab === k && <motion.span layoutId="pi-tab" className={`absolute inset-0 rounded-[6px] ${t.isDark ? "bg-white/20" : "bg-white shadow-sm"}`} />}
                <span className="relative">{k}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {tab === "Overview" && (
              <>
                <SpecRow t={t} label="Designed & built by">Marta Lendínez</SpecRow>
                <SpecRow t={t} label="Concept">A macOS desktop in the browser</SpecRow>
                <SpecRow t={t} label="Apps">{appCount} apps + case studies</SpecRow>
                <SpecRow t={t} label="Built with">React · Vite · Tailwind CSS · Framer Motion</SpecRow>
                <SpecRow t={t} label="Hosting">Static build via Vite</SpecRow>
                <SpecRow t={t} label="Last updated">October 2026</SpecRow>
                <div className="mt-6 flex justify-center gap-2">
                  <a href={REPO} target="_blank" rel="noopener noreferrer" className={`px-4 py-1.5 rounded-lg text-[13px] font-medium ${t.primaryButtonClass}`}>
                    View source on GitHub
                  </a>
                  <button onClick={() => onOpenWindow?.("about")} className={`px-4 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
                    About the designer
                  </button>
                </div>
              </>
            )}

            {tab === "Built with" && (
              <>
                <div className={`rounded-xl divide-y ${group} ${t.isDark ? "divide-white/[0.07]" : "divide-black/[0.06]"}`}>
                  {STACK.map((s, i) => (
                    <motion.div key={s.name} className="flex items-center gap-3 px-4 py-3" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <span className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[13px] font-bold text-white" style={{ background: s.tint }}>
                        {s.name[0]}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-[13px] font-semibold ${t.textMain}`}>{s.name}</span>
                        <span className={`block text-[12px] ${t.textSub}`}>{s.what}</span>
                      </span>
                      <span className={`text-[12px] tabular-nums ${t.textSub}`}>v{s.version}</span>
                    </motion.div>
                  ))}
                </div>
                <div className={`mt-6 px-1 text-[13px] font-semibold ${t.textMain}`}>Free services</div>
                <div className={`mt-2 rounded-xl divide-y ${group} ${t.isDark ? "divide-white/[0.07]" : "divide-black/[0.06]"}`}>
                  {SERVICES.map(([name, what]) => (
                    <div key={name} className="flex justify-between gap-4 px-4 py-2.5 text-[13px]">
                      <span className={t.textMain}>{name}</span>
                      <span className={t.textSub}>{what}</span>
                    </div>
                  ))}
                </div>
                <p className={`mt-4 px-1 text-[12px] leading-relaxed ${t.textSub}`}>
                  Styling uses Tailwind plus shared theme tokens, so every window supports light/dark mode, the accent color and both window styles.
                </p>
              </>
            )}

            {tab === "Inspiration" && (
              <>
                <p className={`text-[14px] leading-relaxed ${t.textBody}`}>
                  Before defining my own visual language, I explored several portfolios to understand how other designers communicate their identity. These three stood out the most:
                </p>
                <div className="mt-5 space-y-3">
                  {INSPIRATION.map((p, i) => (
                    <motion.a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block rounded-xl p-4 ${group} transition hover:-translate-y-0.5`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={`text-[15px] font-semibold ${t.textMain}`}>{p.name}</span>
                        <span className={`text-[12px] ${t.accentText}`}>
                          {p.url.replace("https://", "")} <span className="inline-block transition group-hover:translate-x-0.5">↗</span>
                        </span>
                      </div>
                      <p className={`mt-1.5 text-[13px] leading-relaxed ${t.textSub}`}>{p.text}</p>
                    </motion.a>
                  ))}
                </div>
              </>
            )}

            {tab === "Changelog" && (
              <div className="relative pl-6">
                <div className={`absolute left-[5px] top-2 bottom-2 w-px ${t.isDark ? "bg-white/12" : "bg-black/10"}`} />
                {CHANGELOG.map((c, i) => (
                  <div key={c.version} className="relative pb-7 last:pb-0">
                    <span className={`absolute -left-6 top-1 w-[11px] h-[11px] rounded-full ring-4 ${i === 0 ? "bg-[hsl(var(--accent))]" : t.isDark ? "bg-white/30" : "bg-black/20"} ${t.isDark ? "ring-[#1e1e20]" : "ring-white"}`} />
                    <div className="flex items-baseline gap-2">
                      <span className={`text-[16px] font-semibold ${t.textMain}`}>Version {c.version}</span>
                      {i === 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white bg-[hsl(var(--accent))]">Latest</span>}
                      <span className={`text-[12px] ${t.textSub}`}>{c.date}</span>
                    </div>
                    <ul className={`mt-2 space-y-1.5 text-[13px] leading-relaxed ${t.textBody}`}>
                      {c.items.map((it) => (
                        <li key={it} className="flex gap-2.5">
                          <span className="mt-[0.6em] w-1 h-1 rounded-full shrink-0 bg-[hsl(var(--accent))]" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className={`mt-10 text-center text-[11px] ${t.textSub}`}>© 2026 Marta Lendínez · Designed and built in Stockholm</div>
      </div>
    </div>
  );
}
