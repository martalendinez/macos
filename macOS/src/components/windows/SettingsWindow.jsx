import { useMemo, useRef, useState } from "react";

import mac1 from "../../imgs/wallpapers/macos/mac1.jpg";
import mac2 from "../../imgs/wallpapers/macos/mac2.jpg";
import mac3 from "../../imgs/wallpapers/macos/mac3.jpg";

import glass1 from "../../imgs/wallpapers/glass/glass1.jpg";
import glass2 from "../../imgs/wallpapers/glass/glass2.jpeg";
import glass3 from "../../imgs/wallpapers/glass/glass3.jpg";

const downloadResume = () => {
  const a = document.createElement("a");
  a.href = "/resume.pdf"; // must be in public/
  a.download = "Marta_Lendinez_Resume.pdf"; // filename the user gets
  document.body.appendChild(a);
  a.click();
  a.remove();
};


export default function SettingsWindow({
  uiTheme,
  setUiTheme,
  wallpaperUrl,
  setWallpaperUrl,
  fontScale,
  setFontScale,
}) {
  const isMac = uiTheme === "macos";

  const textMain = isMac ? "text-black/80" : "text-white/90";
  const textSub = isMac ? "text-black/60" : "text-white/70";

  const sidebarBg = isMac ? "bg-[#efefec]" : "bg-white/5";
  const sidebarBorder = isMac ? "border-black/10" : "border-white/10";

  const mainBg = isMac ? "bg-[#f7f7f4]" : "";
  const cardBg = isMac ? "bg-white" : "bg-white/6";
  const cardBorder = isMac ? "border-black/10" : "border-white/10";
  const cardHover = isMac ? "hover:bg-black/5" : "hover:bg-white/10";

  const btnBase = "px-3 py-2 rounded-xl text-sm transition";
  const btnSelected = isMac
    ? "bg-black/10 text-black/90"
    : "bg-white/20 text-white";
  const btnUnselected = isMac
    ? "bg-white text-black/80 border border-black/10 hover:bg-black/5"
    : "bg-white/10 text-white/85 hover:bg-white/15";

  /* ---------------- Sidebar logic ---------------- */

  const [activeSection, setActiveSection] = useState("theme");

  const themeRef = useRef(null);
  const wallpapersRef = useRef(null);
  const fontRef = useRef(null);
  const quickRef = useRef(null);

  const sections = useMemo(
    () => [
      { id: "theme", label: "Theme", ref: themeRef },
      { id: "wallpapers", label: "Wallpapers", ref: wallpapersRef },
      { id: "font", label: "Font size", ref: fontRef },
      { id: "quick", label: "Quick actions", ref: quickRef },
    ],
    []
  );

  const scrollToSection = (section) => {
    setActiveSection(section.id);
    section.ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ---------------- Wallpaper logic ---------------- */

  const macWallpapers = [mac1, mac2, mac3];
  const glassWallpapers = [glass1, glass2, glass3];

  const isSelected = (src) => wallpaperUrl === src;
  const pickWallpaper = (src) => setWallpaperUrl?.(src);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWallpaperUrl?.(URL.createObjectURL(file));
    e.target.value = "";
  };

  const clearCustom = () => setWallpaperUrl?.(null);

  // ---- font helpers (same slider behavior as before)
  const safeFontScale = fontScale ?? 1;
  const decFont = () =>
    setFontScale?.(Math.max(0.85, Number((safeFontScale - 0.05).toFixed(2))));
  const incFont = () =>
    setFontScale?.(Math.min(1.25, Number((safeFontScale + 0.05).toFixed(2))));
  const resetFont = () => setFontScale?.(1);

  return (
    <div className={`h-full flex ${isMac ? "text-black" : "text-white"}`}>
      {/* ---------------- Sidebar ---------------- */}
      <div className={`w-64 border-r ${sidebarBorder} ${sidebarBg} p-4`}>
        <div className={`${textSub} text-xs mb-3`}>Settings</div>

        <div className="space-y-1">
          {sections.map((s) => (
            <div
              key={s.id}
              onClick={() => scrollToSection(s)}
              className={`px-3 py-2 rounded-lg cursor-pointer transition ${
                activeSection === s.id
                  ? isMac
                    ? "bg-[#d9e8ff] text-black/80"
                    : "bg-white/15 text-white/95"
                  : isMac
                  ? "hover:bg-black/5 text-black/70"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Main ---------------- */}
      <div className={`flex-1 p-6 ${mainBg} overflow-auto space-y-10`}>
        {/* THEME */}
        <div ref={themeRef}>
          <div className={`${textSub} text-xs mb-2`}>Theme</div>
          <div className="flex gap-2">
            <button
              className={`${btnBase} ${
                uiTheme === "glass" ? btnSelected : btnUnselected
              }`}
              onClick={() => setUiTheme?.("glass")}
            >
              Glass
            </button>
            <button
              className={`${btnBase} ${
                uiTheme === "macos" ? btnSelected : btnUnselected
              }`}
              onClick={() => setUiTheme?.("macos")}
            >
              macOS
            </button>
          </div>
        </div>

        {/* WALLPAPERS */}
        <div ref={wallpapersRef}>
          <div className={`${textSub} text-xs mb-2`}>Wallpapers</div>

          <div className="flex items-center gap-2 mb-4">
            <label className={`${btnBase} ${btnUnselected} cursor-pointer`}>
              Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </label>

            <button
              type="button"
              onClick={clearCustom}
              className={`${btnBase} ${btnUnselected}`}
            >
              Reset
            </button>
          </div>

          <WallpaperRow
            title="macOS wallpapers"
            textClass={textMain}
            wallpapers={macWallpapers}
            onPick={pickWallpaper}
            isSelected={isSelected}
            uiTheme={uiTheme}
          />

          <div className="mt-6" />

          <WallpaperRow
            title="Glass wallpapers"
            textClass={textMain}
            wallpapers={glassWallpapers}
            onPick={pickWallpaper}
            isSelected={isSelected}
            uiTheme={uiTheme}
          />
        </div>

        {/* FONT SIZE — NICE SLIDER */}
        <div ref={fontRef}>
          <div className={`${textSub} text-xs mb-2`}>Font size</div>

          <div className={`rounded-xl ${cardBg} border ${cardBorder} p-4`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className={`${textMain} text-sm font-medium`}>Font scale</div>
                <div className={`${textSub} text-xs mt-1`}>Adjust the UI text size</div>
              </div>

              <div className={`${textSub} text-xs text-right`}>
                <div>
                  {safeFontScale <= 0.95
                    ? "Small"
                    : safeFontScale >= 1.1
                    ? "Large"
                    : "Default"}
                </div>
                <div className="tabular-nums">{Math.round(safeFontScale * 100)}%</div>
              </div>
            </div>

            {/* Preview */}
            <div
              className={`rounded-lg ${
                isMac ? "bg-black/5" : "bg-white/5"
              } p-3 mb-4`}
            >
              <div className={`${textSub} text-[11px] mb-1`}>Preview</div>
              <div
                className={`${textMain}`}
                style={{ fontSize: `${safeFontScale * 14}px` }}
              >
                The quick brown fox jumps over the lazy dog.
              </div>
            </div>

            {/* Slider row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decFont}
                className={`h-9 w-9 rounded-xl flex items-center justify-center transition ${
                  isMac
                    ? "bg-white border border-black/10 text-black/70 hover:bg-black/5"
                    : "bg-white/10 border border-white/10 text-white/80 hover:bg-white/15"
                }`}
                aria-label="Decrease font size"
              >
                A
              </button>

              <div
                className={`flex-1 rounded-full px-3 py-2 ${
                  isMac
                    ? "bg-black/5 border border-black/10"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <input
                  type="range"
                  min="0.85"
                  max="1.25"
                  step="0.05"
                  value={safeFontScale}
                  onChange={(e) => setFontScale?.(Number(e.target.value))}
                  className={`w-full h-2 appearance-none bg-transparent cursor-pointer slider ${
                    isMac ? "slider-mac" : "slider-glass"
                  }`}
                  aria-label="Font scale"
                />
              </div>

              <button
                type="button"
                onClick={incFont}
                className={`h-9 w-9 rounded-xl flex items-center justify-center transition ${
                  isMac
                    ? "bg-white border border-black/10 text-black/80 hover:bg-black/5"
                    : "bg-white/10 border border-white/10 text-white hover:bg-white/15"
                }`}
                aria-label="Increase font size"
              >
                <span className="text-base">A</span>
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={resetFont}
                className={`${btnBase} ${
                  isMac
                    ? "bg-black/5 text-black/70 hover:bg-black/10"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div ref={quickRef}>
          <div className={`${textSub} text-xs mb-2`}>Quick actions</div>

          <div className="grid grid-cols-2 gap-3">
            <QuickAction label="Share portfolio" icon="↗" />
            <QuickAction
  label="Download Resume"
  icon="⬇"
  onClick={downloadResume}
/>

            <QuickAction label="Keyboard shortcuts" icon="⌘" />
            <QuickAction label="About this portfolio" icon="ℹ" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

function QuickAction({ label, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between rounded-xl bg-white/6 border border-white/10 px-4 py-3 hover:bg-white/10 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="opacity-50">›</span>
    </div>
  );
}


function WallpaperRow({ title, textClass, wallpapers, onPick, isSelected, uiTheme }) {
  const isMac = uiTheme === "macos";

  return (
    <div>
      <div className={`${textClass} text-sm font-medium mb-3`}>{title}</div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {wallpapers.map((src) => (
          <button
            key={src}
            onClick={() => onPick(src)}
            className={`rounded-2xl overflow-hidden border transition ${
              isSelected(src)
                ? isMac
                  ? "border-black/30 ring-2 ring-black/20"
                  : "border-white/40 ring-2 ring-white/30"
                : "border-white/10 hover:border-white/20"
            }`}
            style={{ width: 150, height: 96 }}
          >
            <img src={src} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
