// src/components/phone/PhoneHome.jsx
// On phones the Mac becomes an iPhone: status bar, swipeable home screen pages, a folder, a Dock and a search pill.
// The layout lives in config/phoneHome.js. Apps still open in the shared windows (full screen, see MacWindow).
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PHONE_LABELS, PHONE_PAGES } from "../../config/phoneHome";
import { PROFILE } from "../windows/About/aboutData";
import avatar from "../../imgs/avatar/profile-photo.jpg";
import { PHONE_STATUS_H } from "../../config/shell";
import { ACHIEVEMENTS } from "../../config/achievements";
import { APP_ICONS, CASE_STUDY_ICONS } from "./PhoneIcons";
import DynamicIsland from "./DynamicIsland";
import Badge from "../ui/Badge";
import { setLaunchOrigin } from "../../config/launchOrigin";
import QuickActions, { actionsFor } from "./QuickActions";
import { getApps } from "../../config/apps";
import { MEMORIES, MiniJCurve, NowPlayingWidget, describe, useStockholmWeather } from "../shell/Widgets";
import { ACCENTS } from "../../config/accents";
import { simulate } from "../windows/FundSim/fundModel";

// the home screen always uses the normal (iPhone-style) icons; only the Dock follows the icon setting
const NORMAL_ICONS = Object.fromEntries(getApps("macos").map((a) => [a.id, a.icon]));
const FALLBACK_ICON = "/icons/mac/thisMac.svg";

/** The picture of an app: a drawn iOS-style icon for Marta's own apps and case studies, the real icon for brand apps. */
function IconArt({ app, size }) {
  const CaseIcon = CASE_STUDY_ICONS[app.id] || APP_ICONS[app.id];
  // drawn icons fill their box edge to edge; image icons have built-in padding, so match that
  if (CaseIcon)
    return (
      <span className="flex items-center justify-center" style={{ width: size, height: size }}>
        <CaseIcon size={Math.round(size * 0.86)} />
      </span>
    );
  return <img src={NORMAL_ICONS[app.id] || app.icon || FALLBACK_ICON} alt="" draggable={false} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" style={{ width: size, height: size }} />;
}

/* ---------- status bar ---------- */
function StatusBar({ time, appOpen, isDark, unread, onNotifications }) {
  const ink = appOpen && !isDark ? "text-black" : "text-white";
  return (
    <div
      className={`fixed inset-x-0 top-0 z-[8500] flex items-center justify-between px-7 select-none ${ink} ${appOpen ? (isDark ? "bg-[#1c1c1e]" : "bg-[#f6f6f6]") : ""}`}
      style={{ height: PHONE_STATUS_H, textShadow: appOpen ? "none" : "0 0 6px rgba(0,0,0,0.25)" }}
    >
      <span className="text-[15px] font-semibold tabular-nums tracking-[-0.01em]">{time}</span>
      <button type="button" onClick={onNotifications} className="relative flex items-center gap-[6px]" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
        {/* signal */}
        <svg viewBox="0 0 18 12" className="w-[17px] h-[11px]" fill="currentColor" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 16 12" className="w-[16px] h-[12px]" fill="none" aria-hidden="true">
          <path d="M1.2 4.2a9.8 9.8 0 0 1 13.6 0M3.6 6.7a6.4 6.4 0 0 1 8.8 0M6 9.2a3 3 0 0 1 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="8" cy="11" r="1.1" fill="currentColor" />
        </svg>
        {/* battery */}
        <svg viewBox="0 0 27 13" className="w-[25px] h-[12px]" fill="none" aria-hidden="true">
          <rect x="0.6" y="0.6" width="22.5" height="11.8" rx="3.6" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="2.4" y="2.4" width="18.9" height="8.2" rx="2.2" fill="currentColor" />
          <path d="M24.6 4.4v4.2c.9-.3 1.4-1.1 1.4-2.1s-.5-1.8-1.4-2.1z" fill="currentColor" fillOpacity="0.4" />
        </svg>
        {unread > 0 && <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#ff3b30]" />}
      </button>
    </div>
  );
}

/* ---------- app icon ---------- */
/** Long press (450ms without moving) opens the quick actions; a normal tap opens the app. */
function useLongPress(onLongPress) {
  const t = useRef(null);
  const start = useRef(null);
  const fired = useRef(false);
  const cancel = () => clearTimeout(t.current);
  return {
    fired,
    handlers: {
      onPointerDown: (e) => {
        fired.current = false;
        start.current = { x: e.clientX, y: e.clientY };
        const el = e.currentTarget;
        t.current = setTimeout(() => {
          fired.current = true;
          navigator.vibrate?.(8);
          onLongPress(el.getBoundingClientRect());
        }, 450);
      },
      onPointerMove: (e) => {
        if (start.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 8) cancel();
      },
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
      onContextMenu: (e) => e.preventDefault(),
    },
  };
}

function AppIcon({ app, label, onOpen, onLongPress, size = 60, showLabel = true, badge = 0 }) {
  const lp = useLongPress((rect) => onLongPress?.(app, rect));
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        if (lp.fired.current) return;
        // remember where the icon is, so the app zooms out of it
        setLaunchOrigin(app.windowId, e.currentTarget.firstElementChild?.getBoundingClientRect());
        onOpen();
      }}
      {...(onLongPress ? lp.handlers : {})}
      whileTap={{ scale: 0.88 }}
      className="flex flex-col items-center gap-1.5 min-w-0 select-none [-webkit-touch-callout:none]"
      aria-label={app.label}
    >
      <span className="relative">
        <IconArt app={app} size={size} />
        <Badge count={badge} />
      </span>
      {showLabel && <span className="max-w-full truncate text-[11.5px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">{label}</span>}
    </motion.button>
  );
}

/* ---------- folder ---------- */
function FolderIcon({ folder, apps, onOpen, iconTheme }) {
  const shown = folder.items.map((id) => apps[id]).filter(Boolean).slice(0, 9);
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.88 }} className="flex flex-col items-center gap-1.5 min-w-0" aria-label={`${folder.folder} folder`}>
      <span className="w-[60px] h-[60px] rounded-[15px] p-[7px] grid grid-cols-3 gap-[3px] bg-white/30 backdrop-blur-xl shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        {shown.map((a) => (
          <IconArt key={a.id} app={a} size={13} />
        ))}
      </span>
      <span className="max-w-full truncate text-[11.5px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">{folder.folder}</span>
    </motion.button>
  );
}

function FolderSheet({ folder, apps, onClose, launch, iconTheme, badges = {} }) {
  return (
    <motion.div className="fixed inset-0 z-[7000] flex flex-col items-center justify-center px-8 backdrop-blur-2xl bg-black/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="w-full max-w-[320px]" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 30 }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-center text-[26px] font-bold text-white tracking-[-0.02em] [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">{folder.folder}</div>
        <div className="rounded-[34px] bg-white/25 backdrop-blur-xl p-5 grid grid-cols-3 gap-x-3 gap-y-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
          {folder.items
            .map((id) => apps[id])
            .filter(Boolean)
            .map((a) => (
              <AppIcon
                key={a.id}
                app={a}
                label={PHONE_LABELS[a.id] ?? a.label}
                badge={badges[a.id]}
                iconTheme={iconTheme}
                onOpen={() => {
                  onClose();
                  launch(a);
                }}
              />
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- widgets ---------- */
const WIDGET_SURFACE = "rounded-[24px] text-left text-white bg-white/20 backdrop-blur-2xl shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.5),0_10px_30px_-12px_rgba(0,0,0,0.4)] overflow-hidden";
const SHADOW = "[text-shadow:0_1px_3px_rgba(0,0,0,0.3)]";

function ProfileWidget({ onOpen }) {
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.97 }} className={`${WIDGET_SURFACE} col-span-4 row-span-2 p-4 flex flex-col`} aria-label="About Marta">
      <div className="flex items-center gap-3">
        <img src={avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-white/60" />
        <div className="min-w-0">
          <div className={`text-[16px] font-bold leading-tight ${SHADOW}`}>{PROFILE.name}</div>
          <div className="text-[12.5px] text-white/85 leading-tight">
            {PROFILE.role} @ {PROFILE.company.name}
          </div>
        </div>
      </div>
      <div className={`mt-3 text-[13.5px] leading-snug ${SHADOW}`}>
        Designing the operating system for <b>private markets</b> 💳
      </div>
      <div className="flex-1" />
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75">
        <span>📍 Stockholm</span>
        <span>Tap to say hej 👋</span>
      </div>
    </motion.button>
  );
}

function ClockWidget({ onOpen }) {
  const weather = useStockholmWeather();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Stockholm", hour12: false });
  const day = now.toLocaleDateString("en-GB", { weekday: "long", timeZone: "Europe/Stockholm" });
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.96 }} className={`${WIDGET_SURFACE} col-span-2 row-span-2 p-3.5 flex flex-col`} aria-label="Stockholm time and weather">
      <span className="text-[11px] font-semibold text-white/80">Stockholm</span>
      <span className={`mt-0.5 text-[34px] font-light leading-none tabular-nums tracking-[-0.02em] ${SHADOW}`}>{time}</span>
      <span className="text-[11px] text-white/75">{day}</span>
      <span className="flex-1" />
      <span className="flex items-center gap-1.5 text-[14px] font-semibold">
        {weather && weather !== "error" ? (
          <>
            <span className="text-[20px]">{describe(weather.current.weather_code, weather.current.is_day)}</span>
            {Math.round(weather.current.temperature_2m)}°
            <span className="text-[11px] font-normal text-white/75">
              H:{Math.round(weather.daily.temperature_2m_max[0])}° L:{Math.round(weather.daily.temperature_2m_min[0])}°
            </span>
          </>
        ) : (
          <span className="text-[11px] font-normal text-white/75">{weather === "error" ? "Weather unavailable" : "…"}</span>
        )}
      </span>
    </motion.button>
  );
}

function FundWidget({ onOpen }) {
  const fund = useMemo(() => simulate("pe", "base", 10), []);
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.96 }} className={`${WIDGET_SURFACE} col-span-2 row-span-2 p-3.5 flex flex-col`} aria-label="Fund Simulator snapshot">
      <span className="flex items-center gap-1.5">
        <img src="/icons/apps/fundsim.svg" alt="" className="w-5 h-5" />
        <span className="text-[11px] font-semibold text-white/80">Fund snapshot</span>
      </span>
      <span className="mt-3 block">
        <MiniJCurve isDark />
      </span>
      <span className="flex-1" />
      <span className={`text-[14px] font-semibold tabular-nums ${SHADOW}`}>
        {(fund.irr * 100).toFixed(0)}% IRR · {fund.tvpi.toFixed(2)}x
      </span>
      <span className="text-[10.5px] text-white/75">PE buyout · the J-curve</span>
    </motion.button>
  );
}

function AchievementsWidget({ onOpen, unlocked = {} }) {
  const got = ACHIEVEMENTS.filter((a) => unlocked[a.key]).length;
  const next = ACHIEVEMENTS.find((a) => !unlocked[a.key] && !a.secret);
  const C = 2 * Math.PI * 30;
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.96 }} className={`${WIDGET_SURFACE} col-span-2 row-span-2 p-3.5 flex flex-col items-center justify-center text-center`} aria-label="Achievements progress">
      <span className="relative w-[72px] h-[72px]">
        <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8" />
          <circle cx="38" cy="38" r="30" fill="none" stroke="#ffd60a" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - got / ACHIEVEMENTS.length)} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[24px]">🏆</span>
      </span>
      <span className={`mt-2 text-[14px] font-semibold tabular-nums ${SHADOW}`}>
        {got}/{ACHIEVEMENTS.length} trophies
      </span>
      <span className="text-[10.5px] leading-tight text-white/75 line-clamp-2">{next ? `Next: ${next.hint}` : "All unlocked 👑"}</span>
    </motion.button>
  );
}

function MemoriesWidget({ onOpen }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % MEMORIES.length), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.96 }} className={`${WIDGET_SURFACE} relative col-span-2 row-span-2`} aria-label="Photos from places Marta has lived">
      {MEMORIES.map((p, k) => (
        <motion.img
          key={p.src}
          src={p.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={false}
          animate={{ opacity: k === i ? 1 : 0, scale: k === i ? 1.06 : 1 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 6, ease: "linear" } }}
        />
      ))}
      <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="absolute left-3 bottom-2.5 text-left">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-white/75">Memories</span>
        <span className="block text-[13px] font-semibold">📍 {MEMORIES[i]?.label}</span>
      </span>
    </motion.button>
  );
}

function DesignSystemWidget({ onOpen, accent }) {
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.96 }} className={`${WIDGET_SURFACE} col-span-2 row-span-2 p-3.5 flex flex-col`} aria-label="Design System">
      <span className="flex items-center gap-1.5">
        <img src="/icons/apps/designsystem.svg" alt="" className="w-5 h-5" />
        <span className="text-[11px] font-semibold text-white/80">Design System</span>
      </span>
      <span className="mt-3 grid grid-cols-5 gap-1.5">
        {Object.entries(ACCENTS).map(([k, v]) => (
          <span key={k} className={`aspect-square rounded-full ${accent === k ? "ring-2 ring-white ring-offset-1 ring-offset-transparent" : ""}`} style={{ background: `hsl(${v})` }} />
        ))}
      </span>
      <span className="flex-1" />
      <span className={`text-[26px] font-bold leading-none tracking-[-0.02em] ${SHADOW}`}>Aa</span>
      <span className="mt-1 text-[10.5px] text-white/75">Tokens · components · motion</span>
    </motion.button>
  );
}

function FigmaWidget({ onOpen }) {
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.96 }} className="col-span-2 row-span-2 rounded-[24px] overflow-hidden p-3.5 flex flex-col text-left text-white bg-[#1e1e1e] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]" aria-label="Open Figma">
      <span className="flex items-center gap-1.5">
        <img src="/icons/apps/figma.svg" alt="" className="w-5 h-5" />
        <span className="text-[11px] font-semibold text-white/70">Figma</span>
      </span>
      <span className="relative mt-2 flex-1 rounded-lg bg-[#2c2c2c] overflow-hidden">
        <span className="absolute left-2 top-2 text-[8px] text-[#c7a6ff]">❖ Button</span>
        {[16, 34, 52].map((top, k) => (
          <span key={top} className={`absolute left-2 px-1.5 py-0.5 rounded-[5px] text-[8px] leading-[11px] font-semibold ${k ? "ring-1 ring-[#c7a6ff]/60" : ""}`} style={{ top, background: "#9747ff" }}>
            {k ? "◈ " : ""}Invest now
          </span>
        ))}
        <span className="absolute right-2 top-3 w-9 h-12 rounded-md bg-white/90" />
        <motion.span className="absolute" animate={{ left: ["62%", "30%", "70%", "62%"], top: ["60%", "30%", "20%", "60%"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
          <svg viewBox="0 0 16 16" className="w-3 h-3" aria-hidden="true">
            <path d="M2 1.5l11 6.2-4.7 1.2-2 4.6z" fill="#ff375f" stroke="#fff" strokeWidth="1" />
          </svg>
        </motion.span>
      </span>
      <span className="mt-1.5 text-[10px] text-white/60">Live components ❖</span>
    </motion.button>
  );
}

function MusicWidget({ onOpen }) {
  return (
    <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === "Enter" && onOpen()} className={`${WIDGET_SURFACE} col-span-4 row-span-2`} aria-label="Marta's music on Spotify">
      <NowPlayingWidget text={`text-white ${SHADOW}`} sub="text-white/75" />
    </div>
  );
}

// which app each widget opens
const WIDGET_OPENS = { profile: "about", clock: "map", fund: "fundsim", achievements: "achievements", music: "music", memories: "instagram", designsystem: "designsystem", figma: "figma" };

/* ---------- home screen ---------- */
export default function PhoneHome({ apps: appList, launch, openWindow, appOpen, isDark, time, unread, onNotifications, onSearch, loaded, dockStacks = [], iconTheme = "glass", unlocked, accent, badges = {} }) {
  const apps = useMemo(() => Object.fromEntries(appList.map((a) => [a.id, a])), [appList]);
  const [page, setPage] = useState(0);
  const [folder, setFolder] = useState(null);
  const [menu, setMenu] = useState(null);
  const openMenu = (app, rect) => setMenu({ app, rect, actions: actionsFor(app, { launch, openWindow, apps }) });
  const pager = useRef(null);

  // every app gets a home: anything not placed in the config lands on the last page
  const pages = useMemo(() => {
    // an app counts as placed if it has an icon, sits in a folder, or a widget on the home screen opens it
    const placed = new Set(PHONE_PAGES.flat().flatMap((x) => (typeof x === "string" ? [x] : x.items ?? [WIDGET_OPENS[x.widget]])));
    const extra = appList.filter((a) => !placed.has(a.id) && a.kind !== "caseStudy" && a.id !== "portfolioInfo").map((a) => a.id);
    const out = PHONE_PAGES.map((p) => [...p]);
    out[out.length - 1].push(...extra);
    return out;
  }, [appList]);

  useEffect(() => {
    const el = pager.current;
    if (!el) return;
    const on = () => setPage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, [loaded]);

  const goTo = (i) => pager.current?.scrollTo({ left: i * pager.current.clientWidth, behavior: "smooth" });
  const label = (a) => PHONE_LABELS[a.id] ?? a.label;

  if (!loaded) return null;

  return (
    <>
      <StatusBar time={time} appOpen={appOpen} isDark={isDark} unread={unread} onNotifications={onNotifications} />
      <DynamicIsland />

      <motion.div
        className="fixed inset-0 z-[20] flex flex-col"
        style={{ paddingTop: PHONE_STATUS_H + 8 }}
        animate={{ scale: appOpen ? 0.92 : 1, opacity: appOpen ? 0 : 1, filter: appOpen ? "blur(6px)" : "blur(0px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        aria-hidden={appOpen}
      >
        {/* pages */}
        <div ref={pager} className="flex-1 min-h-0 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Home screen">
          {pages.map((items, p) => (
            <div key={p} className="snap-start shrink-0 w-full h-full px-5 overflow-y-auto [scrollbar-width:none]">
              <div className="grid grid-cols-4 grid-flow-row-dense auto-rows-[80px] gap-x-3 gap-y-3 pt-2 pb-4">
                {items.map((it) => {
                  if (typeof it === "string") return apps[it] && <AppIcon key={it} app={apps[it]} label={label(apps[it])} onOpen={() => launch(apps[it])} onLongPress={openMenu} badge={badges[it]} />;
                  if (it.folder) return <FolderIcon key={it.folder} folder={it} apps={apps} onOpen={() => setFolder(it)} />;
                  const W = { profile: ProfileWidget, clock: ClockWidget, fund: FundWidget, achievements: AchievementsWidget, music: MusicWidget, memories: MemoriesWidget, designsystem: DesignSystemWidget, figma: FigmaWidget }[it.widget];
                  const opens = WIDGET_OPENS[it.widget];
                  return W ? <W key={`w-${it.widget}`} onOpen={() => openWindow(opens)} unlocked={unlocked} accent={accent} /> : null;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* search pill doubles as the page dots, like iOS */}
        <div className="flex flex-col items-center gap-2 pb-3">
          <div className="flex gap-2" role="tablist" aria-label="Home screen pages">
            {pages.map((_, i) => (
              <button key={i} type="button" role="tab" aria-selected={page === i} aria-label={`Page ${i + 1}`} onClick={() => goTo(i)} className={`w-[7px] h-[7px] rounded-full transition-colors ${page === i ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
          <button type="button" onClick={onSearch} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/25 backdrop-blur-xl text-white text-[13px] font-medium shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.4)]">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
              <circle cx="6.8" cy="6.8" r="4.6" stroke="currentColor" strokeWidth="1.8" />
              <path d="M10.3 10.3l3.6 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Search
          </button>
        </div>

        {/* dock */}
        {/* dock: the same glass stack icons as the Mac Dock; each opens as a folder */}
        <div className="mx-3 mb-3 rounded-[30px] px-3 py-3 flex justify-between bg-white/25 backdrop-blur-2xl shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.45)]" aria-label="Dock">
          {dockStacks.map((d) => (
            <motion.button
              key={d.id}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => setFolder({ folder: d.label, items: d.stack.items.map((it) => it.key) })}
              aria-label={`${d.label} folder`}
              className="relative"
            >
              <img src={d.icon} alt="" draggable={false} className="w-[54px] h-[54px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" />
              <Badge count={d.stack.items.reduce((n, it) => n + (badges[it.key] || 0), 0)} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {menu && (
          <QuickActions
            menu={menu}
            onClose={() => setMenu(null)}
            renderIcon={(a) => (
              <span className="flex flex-col items-center gap-1.5">
                <IconArt app={a} size={60} />
              </span>
            )}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>{folder && <FolderSheet folder={folder} apps={apps} launch={launch} iconTheme={iconTheme} badges={badges} onClose={() => setFolder(null)} />}</AnimatePresence>
    </>
  );
}
