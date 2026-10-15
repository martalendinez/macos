// src/components/phone/PhoneHome.jsx
// On phones the Mac becomes an iPhone: status bar, swipeable home screen pages, a folder, a Dock and a search pill.
// The layout lives in config/phoneHome.js. Apps still open in the shared windows (full screen, see MacWindow).
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PHONE_DOCK, PHONE_LABELS, PHONE_PAGES } from "../../config/phoneHome";
import { PROFILE } from "../windows/About/aboutData";
import avatar from "../../imgs/avatar/profile-photo.jpg";
import { PROJECTS } from "../windows/Projects/data/projectData";

// case studies get their project's cover as an icon, not a generic folder
const CASE_PROJECT = { thesisCaseStudy: "thesis", employerBrandingCaseStudy: "employerBranding", triviaCaseStudy: "kthTriviaApp", groupDiningCaseStudy: "restaurantCoordination" };
const coverOf = (id) => PROJECTS.find((p) => p.id === CASE_PROJECT[id]);
import { PHONE_STATUS_H } from "../../config/shell";
const FALLBACK_ICON = "/icons/glass/mac-512.png";

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
function AppIcon({ app, label, onOpen, size = 60, showLabel = true }) {
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.88 }} className="flex flex-col items-center gap-1.5 min-w-0" aria-label={app.label}>
      {coverOf(app.id) ? (
        <span className="rounded-[15px] overflow-hidden ring-2 ring-white/70 shadow-[0_4px_10px_rgba(0,0,0,0.25)]" style={{ width: size, height: size, background: coverOf(app.id).tint }}>
          <img src={coverOf(app.id).thumbnail} alt="" draggable={false} className="w-full h-full object-cover" />
        </span>
      ) : (
        <img src={app.icon || FALLBACK_ICON} alt="" draggable={false} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" style={{ width: size, height: size }} />
      )}
      {showLabel && <span className="max-w-full truncate text-[11.5px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">{label}</span>}
    </motion.button>
  );
}

/* ---------- folder ---------- */
function FolderIcon({ folder, apps, onOpen }) {
  const shown = folder.items.map((id) => apps[id]).filter(Boolean).slice(0, 9);
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.88 }} className="flex flex-col items-center gap-1.5 min-w-0" aria-label={`${folder.folder} folder`}>
      <span className="w-[60px] h-[60px] rounded-[15px] p-[7px] grid grid-cols-3 gap-[3px] bg-white/30 backdrop-blur-xl shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        {shown.map((a) => (
          <img key={a.id} src={coverOf(a.id)?.thumbnail || a.icon || FALLBACK_ICON} alt="" className={`w-full h-full ${coverOf(a.id) ? "object-cover rounded-[4px]" : "object-contain"}`} />
        ))}
      </span>
      <span className="max-w-full truncate text-[11.5px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">{folder.folder}</span>
    </motion.button>
  );
}

function FolderSheet({ folder, apps, onClose, launch }) {
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

/* ---------- the profile widget on page 1 ---------- */
function ProfileWidget({ onOpen }) {
  return (
    <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.97 }} className="col-span-4 h-[150px] rounded-[24px] p-4 text-left text-white bg-white/20 backdrop-blur-2xl shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.5),0_10px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col" aria-label="About Marta">
      <div className="flex items-center gap-3">
        <img src={avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-white/60" />
        <div className="min-w-0">
          <div className="text-[16px] font-bold leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">{PROFILE.name}</div>
          <div className="text-[12.5px] text-white/85 leading-tight">
            {PROFILE.role} @ {PROFILE.company.name}
          </div>
        </div>
      </div>
      <div className="mt-3 text-[13.5px] leading-snug [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
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

/* ---------- home screen ---------- */
export default function PhoneHome({ apps: appList, launch, openWindow, appOpen, isDark, time, unread, onNotifications, onSearch, loaded }) {
  const apps = useMemo(() => Object.fromEntries(appList.map((a) => [a.id, a])), [appList]);
  const [page, setPage] = useState(0);
  const [folder, setFolder] = useState(null);
  const pager = useRef(null);

  // every app gets a home: anything not placed in the config lands on the last page
  const pages = useMemo(() => {
    const placed = new Set([...PHONE_DOCK, ...PHONE_PAGES.flat().flatMap((x) => (typeof x === "string" ? [x] : x.items))]);
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
              <div className="grid grid-cols-4 gap-x-3 gap-y-5 pt-2 pb-4">
                {p === 0 && <ProfileWidget onOpen={() => openWindow("about")} />}
                {items.map((it) =>
                  typeof it === "string" ? (
                    apps[it] && <AppIcon key={it} app={apps[it]} label={label(apps[it])} onOpen={() => launch(apps[it])} />
                  ) : (
                    <FolderIcon key={it.folder} folder={it} apps={apps} onOpen={() => setFolder(it)} />
                  )
                )}
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
        <div className="mx-3 mb-3 rounded-[30px] px-4 py-3 grid grid-cols-4 gap-3 bg-white/25 backdrop-blur-2xl shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.45)]" aria-label="Dock">
          {PHONE_DOCK.map((id) => apps[id] && <AppIcon key={id} app={apps[id]} label={label(apps[id])} onOpen={() => launch(apps[id])} showLabel={false} />)}
        </div>
      </motion.div>

      <AnimatePresence>{folder && <FolderSheet folder={folder} apps={apps} launch={launch} onClose={() => setFolder(null)} />}</AnimatePresence>
    </>
  );
}
