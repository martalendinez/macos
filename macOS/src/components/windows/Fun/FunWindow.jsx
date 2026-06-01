// src/components/windows/Fun/FunWindow.jsx
import { useMemo, useRef, useState } from "react";
import { getTokens } from "../../../ui/themeTokens";
import { getFunApps } from "./data/funApps";
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
    >
      <div className="w-[60px] h-[60px]">
        <img src={app.icon} alt="" className="w-full h-full object-contain drop-shadow-sm" />
      </div>

      <div className={`mt-2 text-[13px] font-medium text-center ${label}`}>{app.title}</div>
      {app.subtitle && (
        <div className={`mt-1 text-[11px] text-center ${sub}`}>{app.subtitle}</div>
      )}
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
  iconTheme = "glass",
  onOpenWindow,
}) {
  const t = getTokens(uiTheme, glassContrast);
  const isMac = t.isMac;
  const isDark = theme === "dark";

  const allApps = useMemo(() => getFunApps(onOpenWindow, iconTheme), [onOpenWindow, iconTheme]);

  const topRef = useRef(null);

  const [activeSection, setActiveSection] = useState("home");

  const sections = useMemo(
    () => [
      { id: "home", title: "All", ref: topRef },
      { id: "tools", title: "Mini tools", ref: topRef },
      { id: "games", title: "Games", ref: topRef },
      { id: "fun", title: "Fun stuff", ref: topRef },
    ],
    []
  );

  function handleSelectFromSidebar(item) {
    setActiveSection(item.id);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filteredApps = useMemo(() => {
    if (activeSection === "home") return allApps;
    return allApps.filter((a) => inferGroup(a) === activeSection);
  }, [allApps, activeSection]);

  const titleText = isMac ? (isDark ? "text-white/90" : "text-black/80") : "text-white/90";
  const muted = isMac ? (isDark ? "text-white/55" : "text-black/50") : "text-white/60";

  const rightBg = isMac ? (isDark ? "bg-[#1c1c1e]" : "bg-[#f5f5f7]") : "";

  const toolbar = isMac
    ? isDark
      ? "border-b border-white/10 bg-[#1c1c1e]"
      : "border-b border-black/10 bg-[#f5f5f7]"
    : "border-b border-white/10 bg-white/5 backdrop-blur-xl";

  const sectionTitle =
    activeSection === "home"
      ? "All"
      : activeSection === "tools"
      ? "Mini tools"
      : activeSection === "games"
      ? "Games"
      : "Fun stuff";

  return (
    <div className={`h-full flex ${t.textMain}`}>

      {/* ⭐ SIDEBAR — wider on mobile, normal on desktop */}
      <div
        className="
          shrink-0
          w-[150px]     /* ⭐ mobile width */
          md:w-auto     /* ⭐ desktop width */
          border-r border-white/10
        "
      >
        <SidebarNav
          uiTheme={uiTheme}
          glassContrast={glassContrast}
          theme={theme}
          activeSection={activeSection}
          sections={sections}
          onSelect={handleSelectFromSidebar}
          preferencesItems={[]}
        />
      </div>

      {/* ⭐ RIGHT PANEL */}
      <div className={`flex-1 h-full flex flex-col ${rightBg}`}>

        {/* DESKTOP TOOLBAR */}
        <div className={`h-14 px-4 md:px-6 items-center justify-between gap-4 ${toolbar} flex`}>
          <div className="flex items-center gap-3">
            <div className={`text-[18px] font-semibold ${titleText}`}>Extras</div>
            <div className={`text-[13px] ${muted}`}>{sectionTitle}</div>
          </div>
          <div className={`hidden md:block text-[13px] ${muted}`}>
            Tip: try “play tetris” in Terminal
          </div>
        </div>

        {/* CONTENT */}
        <div ref={topRef} className="flex-1 overflow-auto px-4 md:px-6 py-6">
          <div className={`text-[14px] font-semibold ${titleText}`}>{sectionTitle}</div>

          {/* ⭐ MOBILE = 1 column, DESKTOP = 3 columns */}
          <div className="
            mt-4 
            grid 
            grid-cols-1        /* ⭐ mobile */
            sm:grid-cols-2 
            md:grid-cols-3     /* ⭐ desktop */
            gap-x-4 
            gap-y-6
          ">
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
