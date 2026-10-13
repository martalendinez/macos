// src/components/windows/Fun/FunWindow.jsx
// Mac App Store-style launcher for the portfolio's extra apps and Terminal games.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { FEATURED, getFunApps } from "./data/funApps";
import { clearPendingCategory, onFunCategoryRequest, peekPendingCategory } from "./funBus";

const EASE = [0.22, 1, 0.36, 1];

const CATEGORIES = [
  { id: "discover", label: "Discover", tint: "#0a84ff", d: "M8 1.8l1.7 4.5 4.5 1.7-4.5 1.7L8 14.2l-1.7-4.5L1.8 8l4.5-1.7z" },
  { id: "fintech", label: "Fintech", tint: "#5e5ce6", d: "M2.5 12.5l3.5-4 3 2.5 4.5-6M10.5 5h3v3" },
  { id: "design", label: "Design", tint: "#ff9f0a", d: "M3 13l1.2-3.6L10.8 2.8a1.4 1.4 0 0 1 2 2L6.2 11.4z M9.5 4l2 2" },
  { id: "code", label: "Code", tint: "#30d158", d: "M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" },
  { id: "me", label: "Get to know me", tint: "#ff375f", d: "M8 7.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM3 13.8c0-2.6 2.2-4.2 5-4.2s5 1.6 5 4.2" },
  { id: "play", label: "Just for fun", tint: "#ff9f0a", d: "M5 3.5v9l7-4.5z" },
  { id: "mac", label: "This Mac", tint: "#5d6782", d: "M2.5 3.5h11v7.5h-11zM8 11v2.5M5 13.5h6" },
];

const SHELF_TITLES = { fintech: "Fintech", design: "Design", code: "Code", me: "Get to know Marta", play: "Just for fun", mac: "This Mac" };

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

// near-black tints (e.g. Notion) vanish on dark cards, so those fall back to grey text
const isVeryDark = (hex = "") => {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  if (Number.isNaN(n)) return false;
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 < 60;
};

function FeaturedBanner({ apps, t }) {
  const row = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const onScroll = () => {
    const el = row.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(onScroll, []);
  const page = (dir) => {
    const el = row.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  const arrow = (dir, disabled) => (
    <button
      type="button"
      onClick={() => page(dir)}
      disabled={disabled}
      aria-label={dir < 0 ? "Previous" : "Next"}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition disabled:opacity-30 ${t.isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-black/[0.05] hover:bg-black/[0.08] text-black"}`}
    >
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir < 0 ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} />
      </svg>
    </button>
  );
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`text-[19px] font-bold tracking-[-0.01em] ${t.textMain}`}>Featured</h2>
        <div className="flex gap-1.5">
          {arrow(-1, edge.start)}
          {arrow(1, edge.end)}
        </div>
      </div>
      <div ref={row} onScroll={onScroll} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {apps.map((app, i) => (
          <motion.button
            key={app.key}
            type="button"
            onClick={app.onClick}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.45, ease: EASE }}
            whileHover={{ y: -4 }}
            className="group relative snap-start shrink-0 w-[78%] @2xl:w-[calc((100%-2rem)/3)] h-[300px] rounded-[22px] overflow-hidden text-left"
            style={{
              background: t.isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
              boxShadow: t.isDark ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "inset 0 0 0 1px rgba(0,0,0,0.1)",
            }}
          >
            <div className="relative h-full p-5 flex flex-col">
              <img src={app.icon} alt="" draggable={false} className="w-16 h-16 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.22)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3" />
              <div className="mt-auto">
                <div className={`text-[10.5px] font-bold uppercase tracking-[0.12em] truncate ${t.isDark && isVeryDark(app.tint) ? t.textSub : ""}`} style={t.isDark && isVeryDark(app.tint) ? undefined : { color: app.tint }}>{app.subtitle}</div>
                <div className={`mt-1 text-[22px] font-bold tracking-[-0.02em] leading-tight ${t.textMain}`}>{app.title}</div>
                <p className={`mt-1.5 text-[13px] leading-snug line-clamp-3 ${t.textSub}`}>{app.blurb ?? app.subtitle}</p>
                <span className={`mt-3 inline-block px-4 py-1 rounded-full text-[12px] font-bold ${t.isDark ? "bg-white/[0.12] text-[#4aa3ff]" : "bg-black/[0.05] text-[#0a6fe0]"}`}>Open</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
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
  const [cat, setCat] = useState(() => peekPendingCategory() ?? "discover");
  useEffect(() => {
    clearPendingCategory();
    return onFunCategoryRequest(setCat);
  }, []);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () => (q ? apps.filter((a) => `${a.title} ${a.subtitle}`.toLowerCase().includes(q)) : []),
    [apps, q]
  );
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
                {results.length === 0 && <p className={`mt-6 text-[14px] ${t.textSub}`}>No apps found. Try “design”, “code” or “music”.</p>}
                {results.length > 0 && <Shelf title="Apps" apps={results} t={t} />}
              </>
            ) : cat === "discover" ? (
              <>
                <div className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${t.textSub}`}>
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <h1 className={`mb-5 text-[32px] font-bold tracking-[-0.03em] ${t.textMain}`}>Discover</h1>
                <FeaturedBanner apps={featured} t={t} />
                {["design", "code", "fintech", "mac", "me", "play"].map((c) => (
                  <Shelf key={c} title={SHELF_TITLES[c]} apps={byCat(c)} t={t} onSeeAll={() => setCat(c)} />
                ))}
              </>
            ) : (
              <>
                <h1 className={`text-[32px] font-bold tracking-[-0.03em] ${t.textMain}`}>{current?.label}</h1>
                <p className={`mt-1 text-[14px] ${t.textSub}`}>
                  {
                    {
                      fintech: "The fintech side of me: private markets, explained.",
                      design: "The craft: how I explore, test and systemise design.",
                      code: "How I build: repos, pull requests and the command line.",
                      me: "Apps that tell you who I am beyond the CV.",
                      play: "Little toys to make you smile.",
                      mac: "The apps that make up this OS: its design system, its processes, its terminal and your trophies.",
                    }[cat]
                  }
                </p>
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
