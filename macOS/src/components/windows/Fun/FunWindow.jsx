// src/components/windows/Fun/FunWindow.jsx
// Mac App Store-style launcher for the portfolio's extra apps and Terminal games.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { FEATURED, GAMES, getFunApps } from "./data/funApps";
import { requestTerminalGame } from "../terminal/terminalBus";

const EASE = [0.22, 1, 0.36, 1];

const CATEGORIES = [
  { id: "discover", label: "Discover", tint: "#0a84ff", d: "M8 1.8l1.7 4.5 4.5 1.7-4.5 1.7L8 14.2l-1.7-4.5L1.8 8l4.5-1.7z" },
  { id: "fintech", label: "Fintech", tint: "#5e5ce6", d: "M2.5 12.5l3.5-4 3 2.5 4.5-6M10.5 5h3v3" },
  { id: "design", label: "Design & Build", tint: "#ff9f0a", d: "M3 13l1.2-3.6L10.8 2.8a1.4 1.4 0 0 1 2 2L6.2 11.4z M9.5 4l2 2" },
  { id: "me", label: "Get to know me", tint: "#ff375f", d: "M8 7.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM3 13.8c0-2.6 2.2-4.2 5-4.2s5 1.6 5 4.2" },
  { id: "play", label: "Just for fun", tint: "#ff9f0a", d: "M5 3.5v9l7-4.5z" },
  { id: "tools", label: "Utilities", tint: "#8e8e93", d: "M10.5 2.5a3 3 0 0 0-3.4 4L2.8 10.8a1.3 1.3 0 0 0 1.9 1.9L9 8.4a3 3 0 0 0 4-3.4l-1.8 1.8-1.7-.4-.4-1.7z" },
  { id: "games", label: "Games", tint: "#34c759", d: "M4.5 5h7a2.5 2.5 0 0 1 2.4 3.2l-.8 2.7a1.6 1.6 0 0 1-2.7.6L9 10H7l-1.4 1.5a1.6 1.6 0 0 1-2.7-.6l-.8-2.7A2.5 2.5 0 0 1 4.5 5zM5.5 6.8v2M4.5 7.8h2" },
];

const SHELF_TITLES = { design: "Design & Build", me: "Get to know Marta", play: "Just for fun", tools: "Utilities" };

/** Fintech gets a feature card: the simulator, the fintech notes and Marta's role at ROYC. */
function FintechSection({ t, apps, onOpenWindow }) {
  const sim = apps.find((a) => a.key === "fundsim");
  const tiles = [
    { title: "Fund Quest", sub: "Learn private markets, game-style", icon: "/icons/apps/fundquest.svg", open: () => onOpenWindow?.("fundquest") },
    { title: "Fund Simulator", sub: "Play with the J-curve, IRR & TVPI", icon: sim?.icon, open: () => onOpenWindow?.("fundsim") },
    { title: "Designing for fintech", sub: "My principles, in Notes", emoji: "💳", open: () => onOpenWindow?.("notes") },
    { title: "My role at ROYC", sub: "Design Engineer · private markets", emoji: "💼", open: () => onOpenWindow?.("about") },
  ];
  return (
    <section className="mt-9">
      <div className={`flex items-baseline justify-between border-t pt-4 ${t.divider}`}>
        <h2 className={`text-[19px] font-bold tracking-[-0.01em] ${t.textMain}`}>Fintech</h2>
      </div>
      <div
        className="mt-3 rounded-[20px] p-5 @2xl:p-6 text-white relative overflow-hidden"
        style={{ background: "radial-gradient(120% 140% at 100% 0%, #5e5ce6 0%, #2a2f6b 45%, #11142b 100%)" }}
      >
        <div className="absolute -right-10 -bottom-16 w-64 h-64 rounded-full bg-[#30d158]/20 blur-3xl" />
        <div className="relative max-w-[460px]">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">Private markets · B2B SaaS</div>
          <div className="mt-1 text-[24px] font-bold tracking-[-0.02em] leading-tight">I design the operating system for private markets</div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/80">
            At ROYC I work on a white-label platform that lets banks, wealth and asset managers launch and run funds. Here’s that side of me.
          </p>
        </div>
        <div className="relative mt-5 grid grid-cols-1 @2xl:grid-cols-2 gap-2.5">
          {tiles.map((x) => (
            <button key={x.title} onClick={x.open} className="group flex items-center gap-3 rounded-2xl p-3 text-left bg-white/10 hover:bg-white/[0.16] backdrop-blur-md transition">
              {x.icon ? (
                <img src={x.icon} alt="" className="w-10 h-10 shrink-0" />
              ) : (
                <span className="w-10 h-10 shrink-0 rounded-[11px] bg-white/15 flex items-center justify-center text-[20px]">{x.emoji}</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold">{x.title}</span>
                <span className="block text-[11px] text-white/70 truncate">{x.sub}</span>
              </span>
              <span className="text-white/60 transition group-hover:translate-x-0.5">›</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Glyph({ d }) {
  return (
    <svg viewBox="0 0 16 16" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function OpenPill({ t, onClick, label = "Open" }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`shrink-0 px-4 py-1 rounded-full text-[12px] font-bold transition active:scale-95 ${
        t.isDark ? "bg-white/[0.12] text-[#4aa3ff] hover:bg-white/20" : "bg-black/[0.06] text-[#0a6fe0] hover:bg-black/10"
      }`}
    >
      {label}
    </button>
  );
}

function AppRow({ app, t, i = 0 }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={app.onClick}
      onKeyDown={(e) => e.key === "Enter" && app.onClick?.()}
      className={`group flex items-center gap-3.5 rounded-xl p-2 -mx-2 cursor-pointer ${t.hoverBg}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.035, duration: 0.35, ease: EASE }}
    >
      <img src={app.icon} alt="" draggable={false} className="w-14 h-14 object-contain drop-shadow-[0_3px_5px_rgba(0,0,0,0.18)] transition duration-300 group-hover:scale-105" />
      <div className={`flex-1 min-w-0 flex items-center gap-3 self-stretch border-b ${t.divider} group-last:border-b-0`}>
        <div className="flex-1 min-w-0">
          <div className={`text-[14px] font-semibold truncate ${t.textMain}`}>{app.title}</div>
          <div className={`text-[12px] truncate ${t.textSub}`}>{app.subtitle}</div>
        </div>
        <OpenPill t={t} onClick={app.onClick} />
      </div>
    </motion.div>
  );
}

function Shelf({ title, apps, t, onSeeAll }) {
  return (
    <section className="mt-9">
      <div className={`flex items-baseline justify-between border-t pt-4 ${t.divider}`}>
        <h2 className={`text-[19px] font-bold tracking-[-0.01em] ${t.textMain}`}>{title}</h2>
        {onSeeAll && (
          <button onClick={onSeeAll} className={`text-[13px] font-medium hover:underline ${t.accentText}`}>
            See All
          </button>
        )}
      </div>
      <div className="mt-2 grid grid-cols-1 @2xl:grid-cols-2 gap-x-8">
        {apps.map((a, i) => (
          <AppRow key={a.key} app={a} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

function GameCard({ g, onPlay, i }) {
  return (
    <motion.button
      onClick={onPlay}
      className="group relative text-left rounded-2xl overflow-hidden p-4 h-[150px] flex flex-col justify-between text-white shadow-[0_14px_30px_-16px_rgba(0,0,0,0.5)]"
      style={{ background: `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, ease: EASE }}
      whileHover={{ y: -3 }}
    >
      <span className="absolute -right-3 -bottom-4 text-[84px] leading-none opacity-90 transition duration-500 group-hover:rotate-12 group-hover:scale-110">{g.emoji}</span>
      <span className="relative text-[10px] font-bold uppercase tracking-[0.1em] text-white/75">Arcade · in Terminal</span>
      <span className="relative">
        <span className="block text-[20px] font-bold leading-tight">{g.title}</span>
        <span className="block text-[12px] text-white/80">{g.subtitle}</span>
        <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-white/25 backdrop-blur text-[11px] font-bold">▶ Play</span>
      </span>
    </motion.button>
  );
}

/** App Store-style shelf: 3 games per page, slide with arrows, dots or a swipe. */
function GameCarousel({ games, t, onPlay, onSeeAll }) {
  const sectionRef = useRef(null);
  const [PER, setPer] = useState(3);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPer(e.contentRect.width < 560 ? 1 : 3));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pages = Math.ceil(games.length / PER);
  const [page, setPage] = useState(0);
  const dragged = useRef(false);
  const go = (p) => setPage(Math.max(0, Math.min(pages - 1, p)));
  useEffect(() => setPage((p) => Math.min(p, pages - 1)), [pages]);
  const arrow = (dir, disabled) => (
    <button
      onClick={() => go(page + dir)}
      disabled={disabled}
      aria-label={dir < 0 ? "Previous games" : "Next games"}
      className={`w-7 h-7 rounded-full flex items-center justify-center transition disabled:opacity-30 ${t.isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/[0.06] hover:bg-black/10"} ${t.textMain}`}
    >
      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir < 0 ? "M7.5 2.5 4 6l3.5 3.5" : "M4.5 2.5 8 6l-3.5 3.5"} />
      </svg>
    </button>
  );

  return (
    <section ref={sectionRef} className="mt-9">
      <div className={`flex items-center justify-between border-t pt-4 ${t.divider}`}>
        <h2 className={`text-[19px] font-bold tracking-[-0.01em] ${t.textMain}`}>Arcade</h2>
        <div className="flex items-center gap-2">
          <button onClick={onSeeAll} className={`mr-2 text-[13px] font-medium hover:underline ${t.accentText}`}>
            See All
          </button>
          {arrow(-1, page === 0)}
          {arrow(1, page === pages - 1)}
        </div>
      </div>

      <div className="mt-3 py-2 overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `${-page * 100}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragStart={() => (dragged.current = true)}
          onClickCapture={(e) => {
            // a swipe shouldn't launch the game under the cursor
            if (dragged.current) {
              e.stopPropagation();
              e.preventDefault();
              dragged.current = false;
            }
          }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(page + 1);
            else if (info.offset.x > 60) go(page - 1);
          }}
        >
          {Array.from({ length: pages }).map((_, p) => (
            <div key={p} className={`w-full shrink-0 grid gap-4 pr-[1px] ${PER === 3 ? "grid-cols-3" : "grid-cols-1"}`}>
              {games.slice(p * PER, p * PER + PER).map((g, i) => (
                <GameCard key={g.key} g={g} i={i} onPlay={() => onPlay(g.key)} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {Array.from({ length: pages }).map((_, p) => (
          <button
            key={p}
            onClick={() => go(p)}
            aria-label={`Page ${p + 1}`}
            className={`h-1.5 rounded-full transition-all ${p === page ? "w-5 bg-[hsl(var(--accent))]" : `w-1.5 ${t.isDark ? "bg-white/25" : "bg-black/20"}`}`}
          />
        ))}
      </div>
    </section>
  );
}

function FeaturedBanner({ apps, t }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % apps.length), 5000);
    return () => clearInterval(id);
  }, [paused, apps.length]);

  const app = apps[i];
  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative h-[230px] rounded-[20px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={app.key}
            className="absolute inset-0 p-7 flex items-center gap-7 cursor-pointer"
            style={{ background: `radial-gradient(120% 140% at 85% 20%, ${app.tint}cc, ${app.tint}55 45%, #111 120%)` }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={app.onClick}
          >
            <div className="flex-1 min-w-0 text-white">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">Featured app</div>
              <div className="mt-1 text-[34px] font-bold tracking-[-0.03em] leading-none">{app.title}</div>
              <p className="mt-2 max-w-[360px] text-[14px] leading-snug text-white/85">{app.blurb ?? app.subtitle}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  app.onClick();
                }}
                className="mt-4 px-5 py-1.5 rounded-full bg-white text-[13px] font-bold text-black/85 hover:bg-white/90 active:scale-95 transition"
              >
                Open
              </button>
            </div>
            <motion.img
              src={app.icon}
              alt=""
              className="w-[130px] h-[130px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)] hidden @lg:block"
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: -6, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {apps.map((a, idx) => (
          <button
            key={a.key}
            onClick={() => setI(idx)}
            aria-label={`Show ${a.title}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-[hsl(var(--accent))]" : `w-1.5 ${t.isDark ? "bg-white/25" : "bg-black/20"}`}`}
          />
        ))}
      </div>
    </div>
  );
}

function SideRow({ c, active, onSelect, t }) {
  return (
    <button
      onClick={() => onSelect(c.id)}
      className={`relative w-full flex items-center gap-2.5 rounded-[7px] px-2 py-[5px] text-[13px] text-left ${active ? "text-white" : `${t.textMain} ${t.hoverBg}`}`}
    >
      {active && <motion.span layoutId="fun-nav" className="absolute inset-0 rounded-[7px] bg-[hsl(var(--accent))]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
      <span className="relative w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-white shadow-sm" style={{ background: c.tint }}>
        <Glyph d={c.d} />
      </span>
      <span className="relative">{c.label}</span>
    </button>
  );
}

export default function FunWindow({ uiTheme = "glass", glassContrast = "light", theme = "light", iconTheme = "glass", onOpenWindow }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance: theme });
  const apps = useMemo(() => getFunApps(onOpenWindow, iconTheme), [onOpenWindow, iconTheme]);
  const [cat, setCat] = useState("discover");
  const [query, setQuery] = useState("");

  const playGame = (key) => {
    onOpenWindow?.("terminal");
    requestTerminalGame(key);
  };

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () => (q ? apps.filter((a) => `${a.title} ${a.subtitle}`.toLowerCase().includes(q)) : []),
    [apps, q]
  );
  const gameResults = q ? GAMES.filter((g) => `${g.title} ${g.subtitle} game`.toLowerCase().includes(q)) : [];
  const byCat = (c) => apps.filter((a) => a.category === c);
  const featured = FEATURED.map((k) => apps.find((a) => a.key === k)).filter(Boolean);
  const current = CATEGORIES.find((c) => c.id === cat);

  return (
    <div className={`no-darkwin h-full w-full flex flex-col @3xl:flex-row ${t.windowBg}`}>
      {/* narrow windows & phones: search + category chips */}
      <div className={`@3xl:hidden shrink-0 border-b ${t.divider} ${t.sidebarBg}`}>
        <div className="px-4 pt-3">
          <div className={`flex items-center gap-1.5 rounded-[9px] px-2.5 h-8 ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            <svg viewBox="0 0 16 16" className={`w-3.5 h-3.5 ${t.textSub}`} fill="none" aria-hidden="true">
              <circle cx="6.8" cy="6.8" r="4.6" stroke="currentColor" strokeWidth="1.7" />
              <path d="M10.3 10.3l3.6 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps & games"
              aria-label="Search apps"
              className={`flex-1 min-w-0 bg-transparent outline-none text-[14px] ${t.textMain} ${t.isDark ? "placeholder:text-white/40" : "placeholder:text-black/40"}`}
            />
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setQuery("");
                setCat(c.id);
              }}
              className={`shrink-0 flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-[13px] font-medium transition ${
                !q && cat === c.id ? "bg-[hsl(var(--accent))] text-white" : `${t.textMain} ${t.isDark ? "bg-white/[0.07]" : "bg-black/[0.05]"}`
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: c.tint }}>
                <Glyph d={c.d} />
              </span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`hidden @3xl:flex w-[210px] shrink-0 h-full flex-col border-r ${t.divider} ${t.sidebarBg}`}>
        <div className="p-3">
          <div className={`flex items-center gap-1.5 rounded-[7px] px-2 h-7 ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            <svg viewBox="0 0 16 16" className={`w-3 h-3 ${t.textSub}`} fill="none" aria-hidden="true">
              <circle cx="6.8" cy="6.8" r="4.6" stroke="currentColor" strokeWidth="1.7" />
              <path d="M10.3 10.3l3.6 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search apps"
              className={`flex-1 min-w-0 bg-transparent outline-none text-[13px] ${t.textMain} ${t.isDark ? "placeholder:text-white/40" : "placeholder:text-black/40"}`}
            />
          </div>
        </div>
        <nav className="px-2 space-y-0.5" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <SideRow
              key={c.id}
              c={c}
              t={t}
              active={!q && cat === c.id}
              onSelect={(id) => {
                setQuery("");
                setCat(id);
              }}
            />
          ))}
        </nav>
        <div className="flex-1" />
        <div className={`m-3 rounded-xl p-3 text-[11px] leading-snug ${t.isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"} ${t.textSub}`}>
          <span className={`font-semibold ${t.textMain}`}>Psst…</span> try typing <code className={t.accentText}>cowsay hi</code> in Terminal 🐮
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={q ? "search" : cat}
            className="max-w-[860px] mx-auto px-4 @lg:px-7 py-6 @lg:py-7"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {q ? (
              <>
                <h1 className={`text-[28px] font-bold tracking-[-0.02em] ${t.textMain}`}>Results for “{query}”</h1>
                {results.length === 0 && gameResults.length === 0 && <p className={`mt-6 text-[14px] ${t.textSub}`}>No apps found. Try “photo”, “music” or “game”.</p>}
                {results.length > 0 && <Shelf title="Apps" apps={results} t={t} />}
                {gameResults.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 @lg:grid-cols-3 gap-4">
                    {gameResults.map((g, i) => (
                      <GameCard key={g.key} g={g} i={i} onPlay={() => playGame(g.key)} />
                    ))}
                  </div>
                )}
              </>
            ) : cat === "discover" ? (
              <>
                <div className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${t.textSub}`}>
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <h1 className={`mb-5 text-[32px] font-bold tracking-[-0.03em] ${t.textMain}`}>Discover</h1>
                <FeaturedBanner apps={featured} t={t} />
                <FintechSection t={t} apps={apps} onOpenWindow={onOpenWindow} />
                {["design", "me", "play", "tools"].map((c) => (
                  <Shelf key={c} title={SHELF_TITLES[c]} apps={byCat(c)} t={t} onSeeAll={() => setCat(c)} />
                ))}
                <GameCarousel games={GAMES} t={t} onPlay={playGame} onSeeAll={() => setCat("games")} />
              </>
            ) : cat === "games" ? (
              <>
                <h1 className={`text-[32px] font-bold tracking-[-0.03em] ${t.textMain}`}>Games</h1>
                <p className={`mt-1 text-[14px] ${t.textSub}`}>Six neon arcade games running right inside Terminal. Your best scores are saved. Press Esc to quit a game.</p>
                <div className="mt-6 grid grid-cols-1 @lg:grid-cols-3 gap-4">
                  {GAMES.map((g, i) => (
                    <GameCard key={g.key} g={g} i={i} onPlay={() => playGame(g.key)} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <h1 className={`text-[32px] font-bold tracking-[-0.03em] ${t.textMain}`}>{current?.label}</h1>
                <p className={`mt-1 text-[14px] ${t.textSub}`}>
                  {
                    {
                      fintech: "The fintech side of me: private markets, explained.",
                      design: "The craft: my design system and the tools I build with.",
                      me: "Apps that tell you who I am beyond the CV.",
                      play: "Little toys to make you smile.",
                      tools: "Small, real utilities, rebuilt for the web.",
                    }[cat]
                  }
                </p>
                {cat === "fintech" && <FintechSection t={t} apps={apps} onOpenWindow={onOpenWindow} />}
                <div className="mt-6 grid grid-cols-2 @4xl:grid-cols-3 gap-4">
                  {byCat(cat).map((a, i) => (
                    <motion.button
                      key={a.key}
                      onClick={a.onClick}
                      className={`group text-left rounded-2xl p-4 ${t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.08]" : "bg-white ring-1 ring-black/[0.06]"} hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.35)] transition-shadow`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, ease: EASE }}
                      whileHover={{ y: -3 }}
                    >
                      <span className="block h-1 w-10 rounded-full mb-4" style={{ background: a.tint }} />
                      <img src={a.icon} alt="" className="w-16 h-16 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] transition duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                      <span className={`mt-3 block text-[15px] font-semibold ${t.textMain}`}>{a.title}</span>
                      <span className={`block text-[12px] ${t.textSub}`}>{a.subtitle}</span>
                      <span
                        className={`mt-3 inline-block px-4 py-1 rounded-full text-[12px] font-bold ${
                          t.isDark ? "bg-white/[0.12] text-[#4aa3ff]" : "bg-black/[0.06] text-[#0a6fe0]"
                        }`}
                      >
                        Open
                      </span>
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
