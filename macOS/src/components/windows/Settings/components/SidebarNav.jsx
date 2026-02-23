// src/components/windows/Settings/components/SidebarNav.jsx
import { useMemo, useState } from "react";
import { getTokens } from "../../../../ui/themeTokens";

/** Finder-style glyph icons */
function FinderIcon({ name }) {
  const cls = "w-[18px] h-[18px]";
  const stroke = "currentColor";
  const sw = 2;

  switch (name) {
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );

    case "music":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path
            d="M14 4v12.2a3.2 3.2 0 1 1-1.8-2.9V7l8-2v9.2a3.2 3.2 0 1 1-1.8-2.9V4"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );

    case "terminal":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16v12H4V6Z" stroke={stroke} strokeWidth={sw} />
          <path d="M7 9l3 3-3 3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 15h5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );

    case "map":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18 3 20V6l6-2 6 2 6-2v14l-6 2-6-2Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path d="M9 4v14M15 6v14" stroke={stroke} strokeWidth={sw} />
        </svg>
      );

    case "projects":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h6l2 2h8v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );

    case "videos":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path d="M4 7h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4V7Z" stroke={stroke} strokeWidth={sw} />
          <path d="M18 10l3-2v8l-3-2v-4Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );

    case "about":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path d="M20 21H4v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke={stroke} strokeWidth={sw} />
        </svg>
      );

    case "sparkles":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path d="M12 2l1.2 4.3L18 8l-4.8 1.7L12 14l-1.2-4.3L6 8l4.8-1.7L12 2Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M19 13l.7 2.4L22 16l-2.3.6L19 19l-.7-2.4L16 16l2.3-.6L19 13Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );

    case "settings":
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke={stroke} strokeWidth={sw} />
          <path
            d="M19.4 15a8.2 8.2 0 0 0 .1-1 8.2 8.2 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7.8 7.8 0 0 0-1.7-1L15 4h-6l-.3 2.5a7.8 7.8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8.2 8.2 0 0 0-.1 1c0 .3 0 .7.1 1l-2 1.5 2 3.5 2.4-1a7.8 7.8 0 0 0 1.7 1L9 20h6l.3-2.5a7.8 7.8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function resolveSectionLabel(s) {
  return s?.title ?? s?.label ?? s?.name ?? s?.id ?? "Section";
}

export default function SidebarNav({
  uiTheme = "macos",
  glassContrast = "light",
  theme = "light",
  activeSection,
  sections = [],
  onSelect,
  onOpenWindow,

  // ✅ NEW: custom preferences list (window shortcuts, etc)
  preferencesItems = null, // [{id,label,icon,onClick}]
}) {
  const t = getTokens(uiTheme, glassContrast);
  const isMac = t.isMac;
  const isDark = theme === "dark";

  const [query, setQuery] = useState("");

  const bg = isMac
    ? isDark
      ? "bg-[#141416] border-r border-white/10"
      : "bg-[#f6f6f6] border-r border-black/10"
    : isDark
    ? "bg-black/15 border-r border-white/10 backdrop-blur-xl"
    : "bg-white/8 border-r border-white/12 backdrop-blur-xl";

  const headerText = isMac ? (isDark ? "text-white/55" : "text-black/55") : "text-white/70";
  const rowText = isMac ? (isDark ? "text-white/90" : "text-black/80") : "text-white/90";
  const iconBlue = isMac ? (isDark ? "text-[#4ea1ff]" : "text-[#0a84ff]") : "text-[#7dd3fc]";

  const pillActive = isMac ? (isDark ? "bg-white/10" : "bg-black/10") : "bg-white/12";
  const pillHover = isMac ? (isDark ? "hover:bg-white/8" : "hover:bg-black/5") : "hover:bg-white/10";
  const divider = isMac ? (isDark ? "bg-white/10" : "bg-black/10") : "bg-white/10";

  const apps = useMemo(
    () => [
      { id: "music", label: "Music", icon: "music", open: () => onOpenWindow?.("music") },
      { id: "map", label: "Maps", icon: "map", open: () => onOpenWindow?.("map") },
      { id: "terminal", label: "Terminal", icon: "terminal", open: () => onOpenWindow?.("terminal") },
      { id: "projects", label: "Projects", icon: "projects", open: () => onOpenWindow?.("projects") },
      { id: "videos", label: "Videos", icon: "videos", open: () => onOpenWindow?.("videos") },
    ],
    [onOpenWindow]
  );

  const q = query.trim().toLowerCase();
  const filteredApps = !q ? apps : apps.filter((a) => a.label.toLowerCase().includes(q));

  const baseSections =
    !q ? sections : sections.filter((s) => resolveSectionLabel(s).toLowerCase().includes(q));

  const prefs =
    preferencesItems && Array.isArray(preferencesItems)
      ? !q
        ? preferencesItems
        : preferencesItems.filter((p) => `${p.label ?? ""}`.toLowerCase().includes(q))
      : null;

  return (
    <div className={`w-[280px] shrink-0 h-full flex flex-col ${bg}`}>
      {/* Search */}
      <div className="p-3">
        <div
          className={[
            "rounded-xl px-3 py-2 border flex items-center gap-2",
            isMac
              ? isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-black/10"
              : isDark
              ? "bg-white/5 border-white/10"
              : "bg-white/10 border-white/12",
          ].join(" ")}
        >
          <span className={isMac ? (isDark ? "text-white/60" : "text-black/50") : "text-white/60"}>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className={[
              "w-full bg-transparent outline-none text-[15px]",
              isMac
                ? isDark
                  ? "text-white placeholder:text-white/35"
                  : "text-black placeholder:text-black/35"
                : "text-white placeholder:text-white/40",
            ].join(" ")}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-2 pb-3">
        {/* FAVORITES */}
        <div className={`px-2 pt-1 pb-2 text-[11px] font-semibold tracking-wide ${headerText}`}>
          FAVORITES
        </div>

        <button
          type="button"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition ${pillActive} ${rowText}`}
          onClick={() => {
            const first = sections?.[0];
            if (first) onSelect?.(first);
          }}
        >
          <span className={iconBlue}>
            <FinderIcon name="home" />
          </span>
          <span className="text-[15px] font-medium">Home</span>
        </button>

        <div className={`my-3 h-px ${divider}`} />

        {/* LOCATIONS (portfolio apps) */}
        <div className={`px-2 pt-1 pb-2 text-[11px] font-semibold tracking-wide ${headerText}`}>
          LOCATIONS
        </div>

        <div className="space-y-1">
          {filteredApps.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={a.open}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition ${pillHover} ${rowText}`}
            >
              <span className={iconBlue}>
                <FinderIcon name={a.icon} />
              </span>
              <span className="text-[15px] font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        <div className={`my-3 h-px ${divider}`} />

        {/* PREFERENCES */}
        <div className={`px-2 pt-1 pb-2 text-[11px] font-semibold tracking-wide ${headerText}`}>
          PREFERENCES
        </div>

        <div className="space-y-1">
          {(prefs ?? baseSections).map((item) => {
            const id = prefs ? item.id : item.id;
            const label = prefs ? item.label : resolveSectionLabel(item);
            const icon = prefs ? (item.icon ?? "settings") : "settings";
            const active = activeSection === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  if (prefs) item.onClick?.();
                  else onSelect?.(item);
                }}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition",
                  active ? pillActive : pillHover,
                  rowText,
                ].join(" ")}
              >
                <span className={iconBlue}>
                  <FinderIcon name={icon} />
                </span>
                <span className="text-[15px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}