// src/components/windows/Settings/SettingsWindow.jsx
// System Settings-style preferences: Appearance, Wallpaper, General + quick access to the portfolio's apps.
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { ACCENT_OPTIONS, GLASS_WALLPAPERS, MAC_WALLPAPERS } from "./constants";
import { downloadResume, sharePortfolio } from "./utils";
import { ACCENTS } from "../../../config/accents";
import { getApps, getIcons } from "../../../config/apps";
import avatar from "../../../imgs/avatar/profile-photo.jpg";

const EASE = [0.22, 1, 0.36, 1];
const DEFAULT_PAIR = GLASS_WALLPAPERS[1]; // matches App's default wallpaper (glass2)

const PANES = [
  { id: "appearance", label: "Appearance", tint: "#1c1c1e", d: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 0v12" },
  { id: "wallpaper", label: "Wallpaper", tint: "#32ade6", d: "M2.5 3.5h11v9h-11zM2.5 10.5l3-3 3 3 2-2 3 3" },
  { id: "general", label: "General", tint: "#8e8e93", d: "M8 10.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1" },
];

const SHORTCUTS = [
  ["⌘K / Ctrl+K", "Open Spotlight search"],
  ["Double-click title bar", "Zoom a window"],
  ["Yellow traffic light", "Minimize into the Dock"],
  ["Right-click desktop", "Desktop menu"],
  ["Esc", "Close menus & dialogs"],
];

const accentColor = (key) => `hsl(${ACCENTS[key] ?? ACCENTS.sky})`;
const nameFromPath = (src) =>
  decodeURIComponent(String(src).split("/").pop().split(".")[0])
    .replace(/[-_]?dark$/i, "")
    .replace(/(\D)(\d)/, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());

function Glyph({ d }) {
  return (
    <svg viewBox="0 0 16 16" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Check() {
  return (
    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[hsl(var(--accent))] text-white flex items-center justify-center shadow ring-2 ring-white">
      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 6.3 5 8.6l4.5-5" />
      </svg>
    </span>
  );
}

/** Grouped inset list, like macOS System Settings */
function Group({ t, title, children }) {
  return (
    <section className="mt-6 first:mt-0">
      {title && <div className={`px-1 mb-2 text-[13px] font-semibold ${t.textMain}`}>{title}</div>}
      <div className={`rounded-xl ${t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.07]" : "bg-white ring-1 ring-black/[0.06]"}`}>{children}</div>
    </section>
  );
}

function Row({ t, label, sub, children, last }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 ${last ? "" : `border-b ${t.divider}`}`}>
      <div className="min-w-0">
        <div className={`text-[13px] ${t.textMain}`}>{label}</div>
        {sub && <div className={`text-[11px] mt-0.5 ${t.textSub}`}>{sub}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/** Tiny desktop mock: wallpaper + menu bar + window + dock */
function MiniDesktop({ src, dark, className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${src})` }}>
      <div className={`absolute inset-x-0 top-0 h-[7%] min-h-[4px] ${dark ? "bg-black/40" : "bg-white/40"} backdrop-blur-sm`} />
      <div className={`absolute left-[18%] top-[22%] w-[55%] h-[48%] rounded-[4px] shadow-lg ${dark ? "bg-[#1e1e20]" : "bg-white"}`}>
        <div className="flex gap-[2px] p-[3px]">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="w-[4px] h-[4px] rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className={`absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[30%] h-[9%] rounded-[3px] ${dark ? "bg-black/30" : "bg-white/40"} backdrop-blur-sm`} />
    </div>
  );
}

/* --------------------------------- Panes --------------------------------- */
function AppearancePane({ t, theme, setTheme, accent, setAccent, uiTheme, setUiTheme, iconTheme, setIconTheme, currentPair }) {
  const tileRing = (on) => (on ? "ring-[3px] ring-[hsl(var(--accent))]" : `ring-1 ${t.isDark ? "ring-white/15" : "ring-black/10"} hover:ring-2`);
  const glassIcons = getIcons("glass");
  const macIcons = getIcons("macos");

  return (
    <>
      <Group t={t}>
        <div className="px-4 pt-4 pb-3">
          <div className={`text-[13px] ${t.textMain}`}>Appearance</div>
          <div className="mt-3 flex gap-5">
            {[
              ["light", "Light", currentPair.light],
              ["dark", "Dark", currentPair.dark],
            ].map(([k, label, src]) => (
              <button key={k} onClick={() => setTheme?.(k)} className="flex flex-col items-center gap-2 group">
                <span className={`relative block rounded-[10px] overflow-hidden transition ${tileRing(theme === k)}`}>
                  <MiniDesktop src={src} dark={k === "dark"} className="w-[132px] h-[84px] transition duration-500 group-hover:scale-[1.04]" />
                </span>
                <span className={`text-[12px] ${theme === k ? `font-semibold ${t.textMain}` : t.textSub}`}>{label}</span>
              </button>
            ))}
          </div>
          <div className={`mt-2 text-[11px] ${t.textSub}`}>Switches automatically with the time in Stockholm (dark from 18:00 to 06:00).</div>
        </div>
      </Group>

      <Group t={t}>
        <Row t={t} label="Accent color" sub={ACCENT_OPTIONS.find((o) => o.key === accent)?.label}>
          <div className="flex gap-2">
            {ACCENT_OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => setAccent?.(o.key)}
                title={o.label}
                aria-label={`${o.label} accent`}
                className="relative w-[22px] h-[22px] rounded-full transition hover:scale-110"
                style={{ background: accentColor(o.key), boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }}
              >
                {accent === o.key && <span className="absolute inset-[7px] rounded-full bg-white" />}
              </button>
            ))}
          </div>
        </Row>
        <Row t={t} label="Highlight color" sub="Selection & focus rings follow the accent" last>
          <span className={`flex items-center gap-2 text-[12px] ${t.textSub}`}>
            <span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--accent))" }} /> Automatic
          </span>
        </Row>
      </Group>

      <Group t={t} title="Windows & icons">
        <div className={`px-4 pt-4 pb-3 border-b ${t.divider}`}>
          <div className={`text-[13px] ${t.textMain}`}>Window style</div>
          <div className="mt-3 flex gap-5">
            {[
              ["macos", "macOS", "Solid, crisp windows"],
              ["glass", "Glass", "Translucent, blurred windows"],
            ].map(([k, label, sub]) => (
              <button key={k} onClick={() => setUiTheme?.(k)} className="flex flex-col items-center gap-2 group">
                <span
                  className={`relative block w-[132px] h-[84px] rounded-[10px] overflow-hidden bg-cover bg-center transition ${tileRing(uiTheme === k)}`}
                  style={{ backgroundImage: `url(${currentPair.light})` }}
                >
                  <span
                    className={`absolute inset-[14px] rounded-[6px] shadow-lg transition duration-500 group-hover:scale-105 ${
                      k === "macos" ? "bg-white" : "bg-white/25 backdrop-blur-md ring-1 ring-white/50"
                    }`}
                  >
                    <span className="flex gap-[3px] p-[5px]">
                      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                        <span key={c} className="w-[5px] h-[5px] rounded-full" style={{ background: c }} />
                      ))}
                    </span>
                  </span>
                </span>
                <span className="text-center">
                  <span className={`block text-[12px] ${uiTheme === k ? `font-semibold ${t.textMain}` : t.textSub}`}>{label}</span>
                  <span className={`block text-[10px] ${t.textSub}`}>{sub}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pt-4 pb-4">
          <div className={`text-[13px] ${t.textMain}`}>Icon style</div>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              ["glass", "Glass", glassIcons],
              ["macos", "Classic", macIcons],
            ].map(([k, label, icons]) => (
              <button
                key={k}
                onClick={() => setIconTheme?.(k)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  iconTheme === k ? "ring-2 ring-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.08)]" : `ring-1 ${t.isDark ? "ring-white/10" : "ring-black/10"} ${t.hoverBg}`
                }`}
              >
                <span className="flex -space-x-2">
                  {[icons.about, icons.projects, icons.fun].map((src) => (
                    <img key={src} src={src} alt="" className="w-8 h-8 object-contain drop-shadow" />
                  ))}
                </span>
                <span className={`text-[12px] ${iconTheme === k ? `font-semibold ${t.textMain}` : t.textSub}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </Group>
    </>
  );
}

// module-level so tile clicks aren't lost to remounts
function WallpaperGrid({ t, title, pairs, isDark, isPicked, setWallpaperUrl }) {
  return (
    <Group t={t} title={title}>
      <div className="p-4 grid grid-cols-2 @lg:grid-cols-3 gap-4">
        {pairs.map((pair) => (
          <button key={pair.light} onClick={() => setWallpaperUrl?.(isDark ? pair.dark : pair.light)} className="group text-left">
            <span
              className={`relative block aspect-[16/10] rounded-[10px] overflow-hidden transition ${
                isPicked(pair) ? "ring-[3px] ring-[hsl(var(--accent))]" : `ring-1 ${t.isDark ? "ring-white/15" : "ring-black/10"}`
              }`}
            >
              {/* light/dark halves, like macOS dynamic wallpapers */}
              <img src={pair.light} alt="" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" />
              <img
                src={pair.dark}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}
              />
              {isPicked(pair) && <Check />}
            </span>
            <span className={`mt-1.5 block text-[11px] ${t.textSub}`}>{nameFromPath(pair.light)} · Dynamic</span>
          </button>
        ))}
      </div>
    </Group>
  );
}

function WallpaperPane({ t, theme, wallpaperUrl, setWallpaperUrl, currentPair }) {
  const isDark = theme === "dark";
  const current = isDark ? currentPair.dark : currentPair.light;
  const isPicked = (pair) => (wallpaperUrl ? wallpaperUrl === pair.light || wallpaperUrl === pair.dark : pair === DEFAULT_PAIR);


  return (
    <>
      <Group t={t}>
        <div className="p-4 flex flex-col @lg:flex-row items-start @lg:items-center gap-4 @lg:gap-5">
          <motion.div key={current} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <MiniDesktop src={current} dark={isDark} className="w-full max-w-[260px] aspect-[16/10] @lg:w-[220px] @lg:h-[138px] @lg:aspect-auto rounded-[10px] ring-1 ring-black/10 shadow-md" />
          </motion.div>
          <div className="min-w-0">
            <div className={`text-[15px] font-semibold ${t.textMain}`}>{nameFromPath(currentPair.light)}</div>
            <div className={`text-[12px] mt-0.5 ${t.textSub}`}>Dynamic: changes with light and dark mode</div>
            <button onClick={() => setWallpaperUrl?.(null)} className={`mt-3 px-3 py-1 rounded-md text-[12px] font-medium ${t.buttonClass}`}>
              Reset to default
            </button>
          </div>
        </div>
      </Group>
      <WallpaperGrid t={t} title="macOS" pairs={MAC_WALLPAPERS} isDark={isDark} isPicked={isPicked} setWallpaperUrl={setWallpaperUrl} />
      <WallpaperGrid t={t} title="Glass" pairs={GLASS_WALLPAPERS} isDark={isDark} isPicked={isPicked} setWallpaperUrl={setWallpaperUrl} />
    </>
  );
}

function GeneralPane({ t, onOpenWindow, resetLayout }) {
  const [shareLabel, setShareLabel] = useState("Share");
  const busy = useRef(false);

  async function share() {
    if (busy.current) return;
    busy.current = true;
    const res = await sharePortfolio();
    if (res.status === "copied") setShareLabel("Link copied ✓");
    else if (res.status === "failed") setShareLabel("Copy failed");
    setTimeout(() => setShareLabel("Share"), 1400);
    busy.current = false;
  }

  const btn = `px-3 py-1 rounded-md text-[12px] font-medium ${t.buttonClass}`;

  return (
    <>
      <Group t={t} title="Portfolio">
        <Row t={t} label="Share this portfolio" sub="Uses the share sheet, or copies the link">
          <button onClick={share} className={btn}>
            {shareLabel}
          </button>
        </Row>
        <Row t={t} label="Résumé" sub="Marta_Lendinez_Resume.pdf">
          <button onClick={downloadResume} className={btn}>
            Download
          </button>
        </Row>
        <Row t={t} label="Window layout" sub="Close all windows and start fresh">
          <button onClick={resetLayout} className={btn}>
            Reset
          </button>
        </Row>
        <Row t={t} label="About This Portfolio" sub="How this macOS-style portfolio was built" last>
          <button onClick={() => onOpenWindow?.("portfolioInfo")} className={btn}>
            Open
          </button>
        </Row>
      </Group>

      <Group t={t} title="Keyboard & mouse">
        {SHORTCUTS.map(([keys, what], i) => (
          <Row key={keys} t={t} label={what} last={i === SHORTCUTS.length - 1}>
            <kbd className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${t.isDark ? "bg-white/10 text-white/80" : "bg-black/[0.05] text-black/70"} ring-1 ring-inset ${t.isDark ? "ring-white/10" : "ring-black/10"}`}>
              {keys}
            </kbd>
          </Row>
        ))}
      </Group>
    </>
  );
}

/* --------------------------------- Window --------------------------------- */
function SideRow({ active, onClick, tint, icon, label, t, img }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-2.5 rounded-[7px] px-2 py-[5px] text-[13px] text-left ${active ? "text-white" : `${t.textMain} ${t.hoverBg}`}`}
    >
      {active && <motion.span layoutId="settings-nav" className="absolute inset-0 rounded-[7px] bg-[hsl(var(--accent))]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
      {img ? (
        <img src={img} alt="" className="relative w-[22px] h-[22px] object-contain" />
      ) : (
        <span className="relative w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-white shadow-sm" style={{ background: tint }}>
          {icon}
        </span>
      )}
      <span className="relative truncate">{label}</span>
    </button>
  );
}

export default function SettingsWindow({
  uiTheme,
  setUiTheme,
  iconTheme,
  setIconTheme,
  theme = "light",
  setTheme,
  wallpaperUrl,
  setWallpaperUrl,
  accent,
  setAccent,
  onOpenWindow,
  resetLayout,
  glassContrast = "light",
}) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance: theme });
  const [pane, setPane] = useState("appearance");
  const [query, setQuery] = useState("");

  const apps = useMemo(() => getApps(iconTheme).filter((a) => a.kind === "app" && !a.extra), [iconTheme]);

  const currentPair = useMemo(
    () => [...MAC_WALLPAPERS, ...GLASS_WALLPAPERS].find((p) => wallpaperUrl === p.light || wallpaperUrl === p.dark) ?? DEFAULT_PAIR,
    [wallpaperUrl]
  );

  const q = query.trim().toLowerCase();
  const panes = PANES.filter((p) => !q || p.label.toLowerCase().includes(q));
  const appRows = apps.filter((a) => !q || a.label.toLowerCase().includes(q));
  const current = PANES.find((p) => p.id === pane);

  const props = { t, theme, setTheme, accent, setAccent, uiTheme, setUiTheme, iconTheme, setIconTheme, wallpaperUrl, setWallpaperUrl, currentPair, onOpenWindow, resetLayout };

  return (
    <div className={`no-darkwin h-full w-full flex ${t.windowBg}`}>
      {/* SIDEBAR */}
      <aside className={`hidden @3xl:flex w-[230px] shrink-0 h-full flex-col border-r ${t.divider} ${t.sidebarBg}`}>
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
              aria-label="Search settings"
              className={`flex-1 min-w-0 bg-transparent outline-none text-[13px] ${t.textMain} ${t.isDark ? "placeholder:text-white/40" : "placeholder:text-black/40"}`}
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3">
          {/* account-style card, like the Apple ID row */}
          {!q && (
            <button onClick={() => onOpenWindow?.("about")} className={`w-full flex items-center gap-2.5 rounded-[9px] p-2 mb-3 text-left ${t.hoverBg}`}>
              <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <span className="min-w-0">
                <span className={`block text-[13px] font-semibold ${t.textMain}`}>Marta’s Portfolio</span>
                <span className={`block text-[11px] ${t.textSub}`}>About me</span>
              </span>
            </button>
          )}

          <div className="space-y-0.5">
            {panes.map((p) => (
              <SideRow key={p.id} t={t} active={pane === p.id} onClick={() => setPane(p.id)} tint={p.tint} icon={<Glyph d={p.d} />} label={p.label} />
            ))}
            {(!q || "about this portfolio".includes(q)) && (
              <SideRow t={t} onClick={() => onOpenWindow?.("portfolioInfo")} tint="#0a84ff" icon={<span className="text-[12px] font-bold">i</span>} label="About This Portfolio" />
            )}
          </div>

          {appRows.length > 0 && (
            <>
              <div className={`px-2 mt-5 mb-1 text-[11px] font-semibold ${t.textSub}`}>Apps</div>
              <div className="space-y-0.5">
                {appRows.map((a) => (
                  <SideRow key={a.id} t={t} onClick={() => onOpenWindow?.(a.windowId)} img={a.icon} label={a.label} />
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 min-w-0 h-full flex flex-col">
        <div className={`h-12 shrink-0 px-4 @3xl:px-6 flex items-center gap-3 border-b ${t.divider} ${t.toolbarBg} backdrop-blur-xl`}>
          <div className={`hidden @3xl:block text-[15px] font-semibold ${t.textMain}`}>{current?.label}</div>
          {/* narrow: segmented control instead of the sidebar */}
          <div className={`@3xl:hidden flex-1 flex rounded-[8px] p-0.5 text-[12px] font-medium ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            {PANES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPane(p.id)}
                className={`flex-1 py-1 rounded-[6px] transition ${pane === p.id ? (t.isDark ? "bg-white/20 text-white" : "bg-white shadow-sm text-black") : t.textSub}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className={`flex-1 min-h-0 overflow-y-auto ${t.isDark ? "" : "bg-[#f5f5f7]"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pane}
              className="max-w-[640px] mx-auto px-4 @lg:px-6 py-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {pane === "appearance" && <AppearancePane {...props} />}
              {pane === "wallpaper" && <WallpaperPane {...props} />}
              {pane === "general" && <GeneralPane {...props} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
