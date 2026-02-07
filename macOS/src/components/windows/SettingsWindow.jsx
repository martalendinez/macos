// src/components/windows/SettingsWindow.jsx

import mac1 from "../../imgs/wallpapers/macos/mac1.jpg";
import mac2 from "../../imgs/wallpapers/macos/mac2.jpg";
import mac3 from "../../imgs/wallpapers/macos/mac3.jpg";

import glass1 from "../../imgs/wallpapers/glass/glass1.jpg";
import glass2 from "../../imgs/wallpapers/glass/glass2.jpeg";
import glass3 from "../../imgs/wallpapers/glass/glass3.jpg";

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

  const sidebarItem = isMac
    ? "hover:bg-[#d9e8ff] text-black/80"
    : "bg-white/5 hover:bg-white/10 text-white/90";

  const btnBase = "px-3 py-2 rounded-xl text-sm transition";
  const btnSelected = isMac ? "bg-black/10 text-black/90" : "bg-white/20 text-white";
  const btnUnselected = isMac
    ? "bg-white text-black/80 border border-black/10 hover:bg-black/5"
    : "bg-white/10 text-white/85 hover:bg-white/15";

  // Wallpaper groups
  const macWallpapers = [mac1, mac2, mac3];
  const glassWallpapers = [glass1, glass2, glass3];

  const isSelected = (src) => wallpaperUrl === src;

  const pickWallpaper = (src) => setWallpaperUrl?.(src);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setWallpaperUrl?.(url);
    e.target.value = "";
  };

  const clearCustom = () => setWallpaperUrl?.(null);

  return (
    <div className={`h-full flex ${isMac ? "text-black" : "text-white"}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r ${sidebarBorder} ${sidebarBg} p-4`}>
        <div className={`${textSub} text-xs mb-3`}>Settings</div>

        <div className="space-y-2">
          {["General", "Appearance", "Desktop & Dock", "Wallpaper"].map((item) => (
            <div
              key={item}
              className={`px-3 py-2 rounded-lg cursor-pointer transition ${sidebarItem}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className={`flex-1 p-6 ${mainBg} overflow-auto`}>
        <div className={`${textMain} text-xl font-semibold mb-4`}>General</div>

        {/* 1) THEME */}
        <div className="mb-7">
          <div className={`${textSub} text-xs mb-2`}>Theme</div>
          <div className="flex gap-2">
            <button
              className={`${btnBase} ${uiTheme === "glass" ? btnSelected : btnUnselected}`}
              onClick={() => setUiTheme?.("glass")}
              type="button"
            >
              Glass
            </button>
            <button
              className={`${btnBase} ${uiTheme === "macos" ? btnSelected : btnUnselected}`}
              onClick={() => setUiTheme?.("macos")}
              type="button"
            >
              macOS
            </button>
          </div>
        </div>

        {/* 2) WALLPAPERS */}
        <div className="mb-7">
          <div className={`${textSub} text-xs mb-2`}>Wallpapers</div>

          <div className="flex items-center gap-2 mb-4">
            <label
              className={`${btnBase} ${
                isMac
                  ? "bg-white text-black/80 border border-black/10 hover:bg-black/5"
                  : "bg-white/10 text-white/85 hover:bg-white/15"
              } cursor-pointer`}
            >
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
              className={`${btnBase} ${
                isMac
                  ? "bg-black/5 text-black/70 hover:bg-black/10"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
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

        {/* 3) FONT SIZE (pretty slider) */}
        <div className="mb-7">
          <div className={`${textSub} text-xs mb-2`}>Font size</div>

          <div className={`rounded-xl ${cardBg} border ${cardBorder} p-4`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className={`${textMain} text-sm font-medium`}>Font scale</div>
                <div className={`${textSub} text-xs mt-1`}>Adjust the UI text size</div>
              </div>

              <div className={`${textSub} text-xs text-right`}>
                <div>
                  {fontScale <= 0.95 ? "Small" : fontScale >= 1.1 ? "Large" : "Default"}
                </div>
                <div className="tabular-nums">{Math.round((fontScale ?? 1) * 100)}%</div>
              </div>
            </div>

            {/* Preview */}
            <div className={`rounded-lg ${isMac ? "bg-black/5" : "bg-white/5"} p-3 mb-4`}>
              <div className={`${textSub} text-[11px] mb-1`}>Preview</div>
              <div className={`${textMain}`} style={{ fontSize: `${(fontScale ?? 1) * 14}px` }}>
                The quick brown fox jumps over the lazy dog.
              </div>
            </div>

            {/* Slider row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFontScale?.(Math.max(0.85, Number(((fontScale ?? 1) - 0.05).toFixed(2))))
                }
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
                  isMac ? "bg-black/5 border border-black/10" : "bg-white/5 border border-white/10"
                }`}
              >
                <input
                  type="range"
                  min="0.85"
                  max="1.25"
                  step="0.05"
                  value={fontScale ?? 1}
                  onChange={(e) => setFontScale?.(Number(e.target.value))}
                  className={`w-full h-2 appearance-none bg-transparent cursor-pointer slider ${
                    isMac ? "slider-mac" : "slider-glass"
                  }`}
                  aria-label="Font scale"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setFontScale?.(Math.min(1.25, Number(((fontScale ?? 1) + 0.05).toFixed(2))))
                }
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
                onClick={() => setFontScale?.(1)}
                className={`${btnBase} ${
                  isMac ? "bg-black/5 text-black/70 hover:bg-black/10" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* 4) QUICK ACTIONS (2 columns + icons) */}
        <div>
          <div className={`${textSub} text-xs mb-2`}>Quick actions</div>

          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              label="Share portfolio"
              icon="↗"
              onClick={() => {
                // fallback: copy link if share not supported
                const url = window.location.href;
                if (navigator.share) navigator.share({ url });
                else navigator.clipboard?.writeText(url);
              }}
              cardBg={cardBg}
              cardBorder={cardBorder}
              cardHover={cardHover}
              textMain={textMain}
              textSub={textSub}
              isMac={isMac}
            />

            <QuickAction
              label="Download résumé"
              icon="⬇"
              onClick={() => window.open("/resume.pdf", "_blank")}
              cardBg={cardBg}
              cardBorder={cardBorder}
              cardHover={cardHover}
              textMain={textMain}
              textSub={textSub}
              isMac={isMac}
            />

            <QuickAction
              label="Keyboard shortcuts"
              icon="⌘"
              onClick={() => alert("⌘,  Open Settings\n⌘K  Command menu\nEsc  Close window")}
              cardBg={cardBg}
              cardBorder={cardBorder}
              cardHover={cardHover}
              textMain={textMain}
              textSub={textSub}
              isMac={isMac}
            />

            <QuickAction
              label="About this portfolio"
              icon="ℹ"
              onClick={() => alert("Built with React, Framer Motion & a lot of care ✨")}
              cardBg={cardBg}
              cardBorder={cardBorder}
              cardHover={cardHover}
              textMain={textMain}
              textSub={textSub}
              isMac={isMac}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  label,
  icon,
  onClick,
  cardBg,
  cardBorder,
  cardHover,
  textMain,
  textSub,
  isMac,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-xl ${cardBg} border ${cardBorder} px-4 py-3 transition ${cardHover}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
            isMac ? "bg-black/5 text-black/70" : "bg-white/10 text-white/80"
          }`}
        >
          {icon}
        </div>

        <div className={`${textMain} text-sm font-medium truncate`}>{label}</div>
      </div>

      <div className={`${textSub} text-sm flex-shrink-0`}>›</div>
    </button>
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
            type="button"
            onClick={() => onPick(src)}
            className={`relative flex-shrink-0 rounded-2xl overflow-hidden border transition ${
              isSelected(src)
                ? isMac
                  ? "border-black/30 ring-2 ring-black/20"
                  : "border-white/40 ring-2 ring-white/30"
                : isMac
                ? "border-black/10 hover:border-black/20"
                : "border-white/15 hover:border-white/25"
            }`}
            style={{ width: 150, height: 96 }}
          >
            <img src={src} alt={title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
