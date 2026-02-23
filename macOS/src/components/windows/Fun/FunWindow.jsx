// src/components/windows/Fun/FunWindow.jsx
import { useMemo, useRef, useState } from "react";
import { getTokens } from "../../../ui/themeTokens";
import { getFunApps } from "./data/funApps";

// ✅ reuse the exact Settings sidebar
import SidebarNav from "../Settings/components/SidebarNav";

function AppIconTile({ app, t, theme = "light" }) {
  const isMac = t.isMac;
  const isDark = theme === "dark";

  const label = isMac ? (isDark ? "text-white/85" : "text-black/80") : "text-white/90";
  const sub = isMac ? (isDark ? "text-white/55" : "text-black/55") : "text-white/60";

  return (
    <button
      type="button"
      onClick={app.onClick}
      className="flex flex-col items-center transition hover:scale-105 active:scale-95"
      title={app.title}
    >
      {/* ICON */}
      <div className="w-[60px] h-[60px]">
        <img
          src={app.icon}
          alt=""
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {/* LABEL */}
      <div className={`mt-2 text-[13px] font-medium text-center ${label}`}>
        {app.title}
      </div>

      {/* SUBTITLE */}
      {app.subtitle ? (
        <div className={`mt-1 text-[11px] text-center ${sub}`}>
          {app.subtitle}
        </div>
      ) : null}
    </button>
  );
}

function inferGroup(app) {
  if (app.group) return app.group;

  const key = `${app.key ?? ""}`.toLowerCase();
  const title = `${app.title ?? ""}`.toLowerCase();

  const isGame =
    key.includes("snake") ||
    key.includes("pong") ||
    key.includes("tetris") ||
    title.includes("snake") ||
    title.includes("pong") ||
    title.includes("tetris");

  return isGame ? "games" : "tools";
}

export default function FunWindow({
  uiTheme = "glass",
  glassContrast = "light",
  theme = "light",
  iconTheme = "glass", // ✅ icons follow this (NOT uiTheme)
  onOpenWindow,
}) {
  const t = getTokens(uiTheme, glassContrast);
  const isMac = t.isMac;
  const isDark = theme === "dark";

  // ✅ IMPORTANT: use iconTheme for icons
  const allApps = useMemo(() => getFunApps(onOpenWindow, iconTheme), [onOpenWindow, iconTheme]);

  // single scroll container anchor
  const topRef = useRef(null);

  // ✅ Sidebar "filters"
  // NOTE: use ids that DO NOT clash with your preferences ids
  const [activeSection, setActiveSection] = useState("pref_fun"); // highlight “Fun” by default

  const sections = useMemo(
    () => [
      { id: "home", title: "All", ref: topRef },
      { id: "tools", title: "Mini tools", ref: topRef },
      { id: "games", title: "Games", ref: topRef },
      { id: "fun", title: "Fun stuff", ref: topRef },
    ],
    []
  );

  // ✅ PREFERENCES shortcuts (sidebar)
  const preferencesItems = useMemo(
    () => [
      { id: "pref_about", label: "About me", icon: "about", onClick: () => onOpenWindow?.("about") },
      { id: "pref_map", label: "Map", icon: "map", onClick: () => onOpenWindow?.("map") },
      { id: "pref_fun", label: "Fun", icon: "sparkles", onClick: () => onOpenWindow?.("fun") },
      { id: "pref_terminal", label: "Terminal", icon: "terminal", onClick: () => onOpenWindow?.("terminal") },
      { id: "pref_music", label: "Music", icon: "music", onClick: () => onOpenWindow?.("music") },
    ],
    [onOpenWindow]
  );

  // Clicking a FILTER section should show the grid, not open a window
  function handleSelectFromSidebar(item) {
    setActiveSection(item.id);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // derive which filter is active (if a preference is active, default grid to "home")
  const activeFilter =
    activeSection === "tools" || activeSection === "games" || activeSection === "fun" || activeSection === "home"
      ? activeSection
      : "home";

  const filteredApps = useMemo(() => {
    if (activeFilter === "home") return allApps;
    return allApps.filter((a) => inferGroup(a) === activeFilter);
  }, [allApps, activeFilter]);

  const titleText = isMac ? (isDark ? "text-white/90" : "text-black/80") : "text-white/90";
  const muted = isMac ? (isDark ? "text-white/55" : "text-black/50") : "text-white/60";

  const rightBg = isMac ? (isDark ? "bg-[#1c1c1e]" : "bg-[#f5f5f7]") : "";

  const toolbar = isMac
    ? isDark
      ? "border-b border-white/10 bg-[#1c1c1e]"
      : "border-b border-black/10 bg-[#f5f5f7]"
    : "border-b border-white/10 bg-white/5 backdrop-blur-xl";

  const sectionTitle =
    activeFilter === "home"
      ? "All"
      : activeFilter === "tools"
      ? "Mini tools"
      : activeFilter === "games"
      ? "Games"
      : "Fun stuff";

  return (
    <div className={`h-full flex ${t.textMain}`}>
      <SidebarNav
        uiTheme={uiTheme}
        glassContrast={glassContrast}
        theme={theme}
        activeSection={activeSection}
        sections={sections}
        onSelect={handleSelectFromSidebar}
        onOpenWindow={onOpenWindow}
        preferencesItems={preferencesItems}
      />

      <div className={`flex-1 h-full flex flex-col ${rightBg}`}>
        <div className={`h-14 px-6 flex items-center justify-between gap-4 ${toolbar}`}>
          <div className="flex items-center gap-3">
            <div className={`text-[18px] font-semibold ${titleText}`}>Extras</div>
            <div className={`text-[13px] ${muted}`}>{sectionTitle}</div>
          </div>
          <div className={`text-[13px] ${muted}`}>Tip: try “play tetris” in Terminal</div>
        </div>

        <div ref={topRef} className="flex-1 overflow-auto px-6 py-6">
          <div className={`text-[14px] font-semibold ${titleText}`}>{sectionTitle}</div>

          {/* ✅ if you only have 3 apps, this looks better than lg:grid-cols-5 */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-5">
            {filteredApps.map((a) => (
              <AppIconTile key={a.key} app={a} t={t} theme={theme} />
            ))}
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}