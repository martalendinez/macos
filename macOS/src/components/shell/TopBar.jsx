// src/components/shell/TopBar.jsx
// macOS menu bar:  Apple menu · bold app name · app menus … status items · clock
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MenuPanel from "./menu/MenuPanel";
import AppleLogo from "../../ui/AppleLogo";
import { MENU_BAR_H } from "../../config/shell";

const isMacPlatform =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = isMacPlatform ? "⌘" : "Ctrl+";

function SearchGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="w-[14px] h-[14px]" fill="none" aria-hidden="true">
      <circle cx="6.8" cy="6.8" r="4.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.3 10.3l3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function TopBar({
  loaded,
  theme,
  onToggleTheme,
  onOpenSettings,
  notifOpen,
  setNotifOpen,
  unreadCount,
  currentTime,
  moonIcon,
  gearIcon,
  notificationIcon,
  activeAppName = "Finder",
  windowList = [], // [{ id, title, active, minimized }]
  goItems = [], // [{ label, onSelect }]
  actions = {},
}) {
  const isDark = theme === "dark";
  const [openMenu, setOpenMenu] = useState(null);
  const [anchorX, setAnchorX] = useState(0);
  const barRef = useRef(null);

  // close on outside click / Escape
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e) => {
      if (e.target.closest?.("[role='menu']") || barRef.current?.contains(e.target)) return;
      setOpenMenu(null);
    };
    const onKey = (e) => e.key === "Escape" && setOpenMenu(null);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const hasActive = windowList.some((w) => w.active);
  const active = windowList.find((w) => w.active);

  const menus = [
    {
      key: "apple",
      title: <AppleLogo className="w-[14px] h-[14px] -mt-px" />,
      ariaLabel: "Apple menu",
      items: [
        { label: "About This Portfolio", onSelect: () => actions.openWindow?.("portfolioInfo") },
        { separator: true },
        { label: "System Settings…", onSelect: onOpenSettings },
        { label: "Recruiter Mode", onSelect: () => actions.openWindow?.("recruiter") },
        { separator: true },
        { label: "Force Quit All Windows", onSelect: actions.resetLayout, disabled: !windowList.length },
        { separator: true },
        { label: "Restart…", onSelect: actions.restart },
        { label: "Lock Screen", onSelect: actions.lockScreen },
      ],
    },
    {
      key: "app",
      title: <span className="font-bold">{activeAppName}</span>,
      items: [
        { label: `About Marta`, onSelect: () => actions.openWindow?.("about") },
        { separator: true },
        { label: "Settings…", onSelect: onOpenSettings },
        { separator: true },
        {
          label: hasActive ? `Quit ${activeAppName}` : "Quit",
          disabled: !hasActive,
          onSelect: actions.closeActive,
        },
      ],
    },
    {
      key: "file",
      title: "File",
      items: [
        { label: "New Finder Window", onSelect: () => actions.openWindow?.("projects") },
        { label: "Open resume.pdf", onSelect: actions.openResume },
        { separator: true },
        { label: "Close Window", disabled: !hasActive, onSelect: actions.closeActive },
      ],
    },
    {
      key: "view",
      title: "View",
      items: [
        { label: isDark ? "Use Light Appearance" : "Use Dark Appearance", onSelect: onToggleTheme },
        { label: "Change Wallpaper…", onSelect: onOpenSettings },
        { separator: true },
        {
          label: active?.maximized ? "Exit Zoom" : "Zoom Window",
          disabled: !hasActive,
          onSelect: actions.zoomActive,
        },
        { separator: true },
        { label: "Spotlight Search", shortcut: `${MOD}K`, onSelect: actions.openSpotlight },
      ],
    },
    {
      key: "go",
      title: "Go",
      items: goItems,
    },
    {
      key: "window",
      title: "Window",
      items: [
        { label: "Minimize", disabled: !hasActive, onSelect: actions.minimizeActive },
        { label: "Zoom", disabled: !hasActive, onSelect: actions.zoomActive },
        { separator: true },
        { label: "Close All Windows", disabled: !windowList.length, onSelect: actions.resetLayout },
        ...(windowList.length ? [{ separator: true }] : []),
        ...windowList.map((w) => ({
          label: w.minimized ? `◆ ${w.title}` : w.title,
          checked: w.active,
          onSelect: () => actions.focusOrRestore?.(w.id),
        })),
      ],
    },
    {
      key: "help",
      title: "Help",
      items: [
        { label: "Take the 2-minute tour", onSelect: () => actions.openWindow?.("recruiter") },
        { label: "Contact Marta", onSelect: () => actions.openWindow?.("about") },
        { separator: true },
        { label: "Keyboard Shortcuts", onSelect: actions.showShortcuts },
      ],
    },
  ];

  const current = menus.find((m) => m.key === openMenu);

  function openAt(key, el) {
    const r = el.getBoundingClientRect();
    setAnchorX(r.left);
    setOpenMenu(key);
  }

  const itemBase =
    "h-[22px] px-[9px] rounded-[5px] flex items-center text-[13px] leading-none whitespace-nowrap transition-colors duration-75";
  const itemHover = "hover:bg-white/15";
  const itemOpen = "bg-white/20";

  const statusBtn = `relative h-[22px] min-w-[28px] px-[7px] rounded-[5px] flex items-center justify-center ${itemHover}`;

  return (
    <>
      <div
        ref={barRef}
        className={[
          "fixed top-0 left-0 right-0 z-[10000]",
          "px-2 flex items-center text-white select-none",
          "backdrop-blur-2xl backdrop-saturate-150",
          isDark ? "bg-black/30" : "bg-white/15",
          loaded ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300",
        ].join(" ")}
        style={{
          height: MENU_BAR_H,
          textShadow: "0 0 6px rgba(0,0,0,0.25)",
          boxShadow: isDark ? "inset 0 -0.5px 0 rgba(255,255,255,0.08)" : "inset 0 -0.5px 0 rgba(255,255,255,0.18)",
        }}
      >
        {/* LEFT: menus */}
        <nav className="flex items-center" aria-label="Menu bar">
          {menus.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-label={m.ariaLabel}
              aria-haspopup="menu"
              aria-expanded={openMenu === m.key}
              className={[
                itemBase,
                m.key === "apple" ? "px-[12px]" : "",
                m.key === "app" ? "" : "font-medium",
                openMenu === m.key ? itemOpen : itemHover,
                m.key !== "apple" && m.key !== "app" ? "hidden md:flex" : "",
              ].join(" ")}
              onPointerDown={(e) => {
                e.preventDefault();
                if (openMenu === m.key) setOpenMenu(null);
                else openAt(m.key, e.currentTarget);
              }}
              onMouseEnter={(e) => {
                // like macOS: once a menu is open, hovering switches menus
                if (openMenu && openMenu !== m.key) openAt(m.key, e.currentTarget);
              }}
            >
              {m.key === "app" ? <span className="block max-w-[38vw] md:max-w-none truncate">{m.title}</span> : m.title}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* RIGHT: status items */}
        <div className="flex items-center gap-[2px]">
          <button onClick={actions.openSpotlight} className={statusBtn} aria-label="Spotlight Search" title={`Spotlight (${MOD}K)`}>
            <SearchGlyph />
          </button>

          <button onClick={onToggleTheme} className={`${statusBtn} hidden sm:flex`} aria-label="Toggle dark mode" title="Appearance">
            <img src={moonIcon} alt="" className="h-[14px] w-[14px] opacity-95" />
          </button>

          <button onClick={() => setNotifOpen?.(!notifOpen)} className={statusBtn} aria-label="Notifications" title="Notifications">
            <img src={notificationIcon} alt="" className="h-[14px] w-[14px] opacity-95" />
            {unreadCount > 0 && (
              <span className="absolute top-[1px] right-[3px] min-w-[13px] h-[13px] px-[3px] rounded-full text-[9px] font-semibold leading-none flex items-center justify-center bg-[#ff3b30] text-white [text-shadow:none]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <button onClick={onOpenSettings} className={`${statusBtn} hidden sm:flex`} aria-label="Open settings" title="System Settings">
            <img src={gearIcon} alt="" className="h-[14px] w-[14px] opacity-95" />
          </button>

          {/* Clock — click opens Notification Center, like macOS */}
          <button
            onClick={() => setNotifOpen?.(!notifOpen)}
            className={`${itemBase} ${notifOpen ? itemOpen : itemHover} font-medium tabular-nums ml-1`}
            aria-label="Date and time"
          >
            <span className="hidden sm:inline">{String(currentTime).replace(",", "")}</span>
            <span className="sm:hidden">{String(currentTime).split(", ").pop()}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <MenuPanel
            key={current.key}
            items={current.items}
            isDark={isDark}
            onClose={() => setOpenMenu(null)}
            style={{ top: MENU_BAR_H + 2, left: Math.max(4, anchorX) }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
