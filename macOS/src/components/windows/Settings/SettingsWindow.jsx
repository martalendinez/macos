// src/components/windows/Settings/SettingsWindow.jsx
import { useMemo, useRef, useState } from "react";
import { getTokens } from "../../../ui/themeTokens";
import { ACCENT_OPTIONS, GLASS_WALLPAPERS, MAC_WALLPAPERS, SECTIONS } from "./constants";
import { downloadResume } from "./utils";

import SidebarNav from "./components/SidebarNav";
import AccentPicker from "./components/AccentPicker";
import WallpaperSection from "./components/WallpaperSection";
import QuickActionsSection from "./components/QuickActionsSection";

function GroupCard({ children, className = "" }) {
  return <div className={`rounded-3xl border p-5 ${className}`}>{children}</div>;
}

function Row({ left, right, divider = true, dividerClass = "" }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="text-[14px]">{left}</div>
        <div className="shrink-0">{right}</div>
      </div>
      {divider ? <div className={`h-px ${dividerClass}`} /> : null}
    </>
  );
}

function PreviewPill({ active, label, onClick, children, activeRingClass, idleRingClass }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-[110px] text-center",
        "rounded-2xl p-2 transition active:scale-95",
        active ? activeRingClass : idleRingClass,
      ].join(" ")}
    >
      <div className="rounded-xl overflow-hidden border border-black/10 bg-white/80 h-[52px] grid place-items-center">
        {children}
      </div>
      <div className={`mt-2 text-[13px] ${active ? "font-semibold" : "opacity-70"}`}>{label}</div>
    </button>
  );
}

const NAV_SECTIONS = [
  { id: "theme",      emoji: "🎨", label: "Appearance"    },
  { id: "accent",     emoji: "🖌️",  label: "Theme"         },
  { id: "wallpapers", emoji: "🖼️",  label: "Wallpapers"    },
  { id: "quick",      emoji: "⚡",  label: "Quick actions" },
];

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
  notify,
  resetLayout,
  glassContrast = "light",
}) {
  const t      = getTokens(uiTheme, glassContrast);
  const isMac  = t.isMac;
  const isDark = theme === "dark";

  const themeRef      = useRef(null);
  const accentRef     = useRef(null);
  const wallpapersRef = useRef(null);
  const quickRef      = useRef(null);

  const [activeSection, setActiveSection] = useState("theme");

  const sectionRefs = useMemo(
    () => ({ theme: themeRef, accent: accentRef, wallpapers: wallpapersRef, quick: quickRef }),
    []
  );

  const sections = useMemo(() => {
    const allowed = new Set(["theme", "accent", "wallpapers", "quick"]);
    return SECTIONS.filter((s) => allowed.has(s.id)).map((s) => ({ ...s, ref: sectionRefs[s.id] }));
  }, [sectionRefs]);

  function scrollToSection(section) {
    setActiveSection(section.id);
    section.ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function mobileScrollTo(id) {
    setActiveSection(id);
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── theme tokens ──────────────────────────────────────────
  const rightBg   = isMac ? (isDark ? "bg-[#1c1c1e]"  : "bg-[#f5f5f7]") : "";
  const card      = isMac
    ? isDark ? "bg-white/5 border-white/10"   : "bg-white/80 border-black/10"
    : isDark ? "bg-white/6 border-white/10"   : "bg-white/8 border-white/12";
  const divider   = isMac ? (isDark ? "bg-white/10" : "bg-black/10") : "bg-white/10";
  const titleText = isMac ? (isDark ? "text-white/90" : "text-black/80") : "text-white/90";
  const muted     = isMac ? (isDark ? "text-white/55" : "text-black/50") : "text-white/60";

  const pillActive = isMac
    ? isDark ? "bg-white/15 text-white"        : "bg-black/10 text-black/80"
    : "bg-white/20 text-white";
  const pillInactive = isMac
    ? isDark ? "text-white/55 hover:bg-white/8" : "text-black/50 hover:bg-black/5"
    : "text-white/55 hover:bg-white/10";

  const isSelected  = (src) => wallpaperUrl === src;
  const pickWallpaper = (src) => setWallpaperUrl?.(src);
  const clearCustom   = ()    => setWallpaperUrl?.(null);

  // ── shared content sections ───────────────────────────────
  const content = (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-5 space-y-6">

      {/* APPEARANCE */}
      <div ref={themeRef}>
        <GroupCard className={card}>
          <div className={`text-[16px] font-semibold ${titleText}`}>Appearance</div>
          <div className={`text-sm mt-1 ${muted}`}>Choose your preferred look.</div>

          <div className="mt-5 flex flex-wrap gap-3">
            <PreviewPill
              label="Light" active={theme === "light"}
              onClick={() => setTheme?.("light")}
              activeRingClass="ring-2 ring-[hsl(var(--accent))]"
              idleRingClass="hover:ring-2 hover:ring-black/10"
            >
              <div className="w-full h-full bg-white" />
            </PreviewPill>

            <PreviewPill
              label="Dark" active={theme === "dark"}
              onClick={() => setTheme?.("dark")}
              activeRingClass="ring-2 ring-[hsl(var(--accent))]"
              idleRingClass="hover:ring-2 hover:ring-black/10"
            >
              <div className="w-full h-full bg-[#1c1c1e]" />
            </PreviewPill>
          </div>

          <div className={`mt-5 h-px ${divider}`} />

          <div className="mt-4">
            <div className={`text-[15px] font-semibold ${titleText}`}>Theme</div>
            <div className={`text-sm mt-1 ${muted}`}>Choose the window style for your portfolio.</div>

            <div className="mt-4 flex flex-wrap gap-3">
              <PreviewPill
                label="Glass" active={uiTheme === "glass"}
                onClick={() => setUiTheme?.("glass")}
                activeRingClass="ring-2 ring-[hsl(var(--accent))]"
                idleRingClass="hover:ring-2 hover:ring-black/10"
              >
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/20" />
                  <div className="absolute inset-0 backdrop-blur-xl" />
                  <div className="absolute inset-[10px] rounded-lg border border-white/40 bg-white/15" />
                </div>
              </PreviewPill>

              <PreviewPill
                label="macOS" active={uiTheme === "macos"}
                onClick={() => setUiTheme?.("macos")}
                activeRingClass="ring-2 ring-[hsl(var(--accent))]"
                idleRingClass="hover:ring-2 hover:ring-black/10"
              >
                <div className="w-full h-full relative bg-[#f6f6f6]">
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="absolute inset-[10px] rounded-lg border border-black/10 bg-white" />
                </div>
              </PreviewPill>
            </div>
          </div>
        </GroupCard>
      </div>

      {/* THEME / ACCENT */}
      <div ref={accentRef}>
        <GroupCard className={card}>
          <div className={`text-[16px] font-semibold ${titleText}`}>Theme</div>
          <div className={`text-sm mt-1 ${muted}`}>Color and highlight settings.</div>
          <div className={`mt-5 h-px ${divider}`} />

          <div className="mt-2">
            <Row
              left={<span className={titleText}>Color</span>}
              right={
                <AccentPicker
                  isMac={isMac} styles={{ ...t }}
                  accent={accent ?? "sky"} setAccent={setAccent}
                  options={ACCENT_OPTIONS}
                />
              }
              dividerClass={divider}
            />

            <Row
              left={<span className={titleText}>Text highlight color</span>}
              right={
                <div className={`text-[14px] ${muted} flex items-center gap-2`}>
                  <span className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--accent))" }} />
                  Automatic
                </div>
              }
              dividerClass={divider}
            />

            <Row
              left={<span className={titleText}>Icon & widget style</span>}
              right={
                <div className="flex gap-2">
                  {["macos", "glass"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setIconTheme?.(val)}
                      className={[
                        "px-3 py-2 rounded-xl border text-[13px] transition active:scale-95",
                        iconTheme === val
                          ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.12)]"
                          : isMac
                          ? isDark ? "border-white/10 bg-white/5 hover:bg-white/8"
                                   : "border-black/10 bg-white hover:bg-black/5"
                          : "border-white/12 bg-white/10 hover:bg-white/12",
                      ].join(" ")}
                    >
                      {val === "macos" ? "Default" : "Glass"}
                    </button>
                  ))}
                </div>
              }
              divider={false}
            />
          </div>
        </GroupCard>
      </div>

      {/* WALLPAPERS */}
      <div ref={wallpapersRef}>
        <GroupCard className={card}>
          <div className={`text-[16px] font-semibold ${titleText}`}>Wallpapers</div>
          <div className={`text-sm mt-1 ${muted}`}>Switch your desktop background.</div>
          <div className={`mt-5 h-px ${divider}`} />
          <div className="mt-5">
            <WallpaperSection
              styles={{}} theme={theme}
              onReset={clearCustom}
              macWallpapers={MAC_WALLPAPERS}
              glassWallpapers={GLASS_WALLPAPERS}
              isSelected={isSelected}
              onPick={pickWallpaper}
            />
          </div>
        </GroupCard>
      </div>

      {/* QUICK ACTIONS */}
      <div ref={quickRef}>
        <GroupCard className={card}>
          <div className={`text-[16px] font-semibold ${titleText}`}>Quick actions</div>
          <div className={`text-sm mt-1 ${muted}`}>Shortcuts & tools.</div>
          <div className={`mt-5 h-px ${divider}`} />
          <div className="mt-5">
            <QuickActionsSection
              uiTheme={uiTheme} theme={theme}
              onDownloadResume={downloadResume}
              onOpenWindow={onOpenWindow}
              onToggleTheme={() => setTheme?.(theme === "dark" ? "light" : "dark")}
              notify={notify}
              onResetLayout={resetLayout}
            />
          </div>
        </GroupCard>
      </div>

      <div className="h-4 pb-safe" />
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${t.textMain}`}>

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on md+)
      ══════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col h-full overflow-hidden">

        {/* Mobile header */}
        <div className={[
          "shrink-0 px-4 pt-4 pb-3",
          isMac
            ? isDark ? "border-b border-white/10 bg-[#1c1c1e]" : "border-b border-black/10 bg-[#f5f5f7]"
            : "border-b border-white/10 bg-white/5 backdrop-blur-xl",
        ].join(" ")}>
          <div className={`text-[20px] font-bold ${titleText}`}>Appearance</div>
        </div>

        {/* Mobile filter pills */}
        <div className={[
          "shrink-0 flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none",
          isMac
            ? isDark ? "bg-[#1c1c1e] border-b border-white/10" : "bg-[#f5f5f7] border-b border-black/10"
            : "border-b border-white/10 bg-white/5",
        ].join(" ")}>
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => mobileScrollTo(s.id)}
              className={[
                "shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition active:scale-95",
                activeSection === s.id ? pillActive : pillInactive,
              ].join(" ")}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile scrollable content */}
        {content}
      </div>

      {/* ══════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden below md)
      ══════════════════════════════════════════════ */}
      <div className="hidden md:flex h-full">

        {/* Sidebar */}
        <SidebarNav
          uiTheme={uiTheme}
          glassContrast={glassContrast}
          theme={theme}
          activeSection={activeSection}
          sections={sections}
          onSelect={scrollToSection}
          onOpenWindow={onOpenWindow}
        />

        {/* Right panel */}
        <div className={`flex-1 h-full flex flex-col ${rightBg}`}>
          <div className={[
            "h-14 px-6 flex items-center",
            isMac
              ? isDark ? "border-b border-white/10" : "border-b border-black/10"
              : "border-b border-white/10",
          ].join(" ")}>
            <div className={`text-[20px] font-semibold ${titleText}`}>Appearance</div>
          </div>
          {content}
        </div>
      </div>

    </div>
  );
}