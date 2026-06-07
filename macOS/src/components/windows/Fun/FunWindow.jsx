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

// Mobile card — bigger tap target, horizontal layout
function AppCardMobile({ app, t, theme = "light" }) {
  const isMac = t.isMac;
  const isDark = theme === "dark";

  const label = isMac ? (isDark ? "text-white/90" : "text-black/80") : "text-white";
  const sub   = isMac ? (isDark ? "text-white/55" : "text-black/50") : "text-white/55";
  const cardBg = isMac
    ? isDark ? "bg-white/8 border-white/10" : "bg-black/5 border-black/8"
    : "bg-white/8 border-white/10";

  return (
    <button
      type="button"
      onClick={app.onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border ${cardBg} active:scale-[0.97] transition-transform`}
    >
      <div className="w-12 h-12 shrink-0">
        <img src={app.icon} alt="" className="w-full h-full object-contain drop-shadow-sm" />
      </div>
      <div className="min-w-0 text-left">
        <div className={`text-[15px] font-semibold truncate ${label}`}>{app.title}</div>
        {app.subtitle && (
          <div className={`text-[12px] truncate mt-0.5 ${sub}`}>{app.subtitle}</div>
        )}
      </div>
      <span className="ml-auto text-white/30 text-lg shrink-0">›</span>
    </button>
  );
}

function inferGroup(app) {
  if (app.group) return app.group;
  const key   = `${app.key   ?? ""}`.toLowerCase();
  const title = `${app.title ?? ""}`.toLowerCase();
  const isGame =
    key.includes("snake")   || key.includes("pong")   || key.includes("tetris") ||
    title.includes("snake") || title.includes("pong") || title.includes("tetris");
  return isGame ? "games" : "tools";
}

const SECTIONS = [
  { id: "home",   title: "All"        },
  { id: "tools",  title: "Mini tools" },
  { id: "games",  title: "Games"      },
  { id: "fun",    title: "Fun stuff"  },
];

export default function FunWindow({
  uiTheme = "glass",
  glassContrast = "light",
  theme = "light",
  iconTheme = "glass",
  onOpenWindow,
}) {
  const t      = getTokens(uiTheme, glassContrast);
  const isMac  = t.isMac;
  const isDark = theme === "dark";

  const allApps = useMemo(() => getFunApps(onOpenWindow, iconTheme), [onOpenWindow, iconTheme]);
  const topRef  = useRef(null);

  const [activeSection, setActiveSection] = useState("home");

  const sections = useMemo(
    () => SECTIONS.map((s) => ({ ...s, ref: topRef })),
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

  const sectionTitle = SECTIONS.find((s) => s.id === activeSection)?.title ?? "All";

  // ── theme tokens ──────────────────────────────────────────
  const titleText = isMac ? (isDark ? "text-white/90"  : "text-black/80") : "text-white/90";
  const muted     = isMac ? (isDark ? "text-white/55"  : "text-black/50") : "text-white/60";
  const rightBg   = isMac ? (isDark ? "bg-[#1c1c1e]"   : "bg-[#f5f5f7]") : "";
  const toolbar   = isMac
    ? isDark ? "border-b border-white/10 bg-[#1c1c1e]"  : "border-b border-black/10 bg-[#f5f5f7]"
    : "border-b border-white/10 bg-white/5 backdrop-blur-xl";

  const pillActive = isMac
    ? isDark ? "bg-white/15 text-white"      : "bg-black/10 text-black/80"
    : "bg-white/20 text-white";
  const pillInactive = isMac
    ? isDark ? "text-white/55 hover:bg-white/8" : "text-black/50 hover:bg-black/5"
    : "text-white/55 hover:bg-white/10";

  return (
    <div className={`h-full flex flex-col ${t.textMain}`}>

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on md+)
      ══════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col h-full overflow-hidden">

        {/* Mobile top bar */}
        <div className={`shrink-0 px-4 pt-4 pb-3 ${toolbar}`}>
          <div className={`text-[20px] font-bold ${titleText}`}>Extras</div>
          <div className={`text-[13px] mt-0.5 ${muted}`}>
            Tip: try "play tetris" in Terminal
          </div>
        </div>

        {/* Mobile filter pills */}
        <div className={`shrink-0 flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none ${toolbar}`}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setActiveSection(s.id); topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              className={[
                "shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition",
                activeSection === s.id ? pillActive : pillInactive,
              ].join(" ")}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Mobile app list */}
        <div ref={topRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {filteredApps.map((a) => (
            <AppCardMobile key={a.key} app={a} t={t} theme={theme} />
          ))}
          <div className="h-6 pb-safe" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden below md)
      ══════════════════════════════════════════════ */}
      <div className="hidden md:flex h-full">

        {/* Sidebar */}
        <div className="shrink-0 border-r border-white/10">
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

        {/* Right panel */}
        <div className={`flex-1 h-full flex flex-col ${rightBg}`}>

          {/* Toolbar */}
          <div className={`h-14 px-6 flex items-center justify-between gap-4 ${toolbar}`}>
            <div className="flex items-center gap-3">
              <div className={`text-[18px] font-semibold ${titleText}`}>Extras</div>
              <div className={`text-[13px] ${muted}`}>{sectionTitle}</div>
            </div>
            <div className={`text-[13px] ${muted}`}>
              Tip: try "play tetris" in Terminal
            </div>
          </div>

          {/* Content grid */}
          <div ref={topRef} className="flex-1 overflow-auto px-6 py-6">
            <div className={`text-[14px] font-semibold ${titleText}`}>{sectionTitle}</div>
            <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-8">
              {filteredApps.map((a) => (
                <AppIconTile key={a.key} app={a} t={t} theme={theme} />
              ))}
            </div>
            <div className="h-6" />
          </div>
        </div>
      </div>

    </div>
  );
}