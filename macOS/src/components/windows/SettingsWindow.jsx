// src/components/windows/SettingsWindow.jsx

// 👉 Replace these with your real wallpaper imports
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

  const pickWallpaper = (src) => {
    setWallpaperUrl?.(src);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for the uploaded file
    const url = URL.createObjectURL(file);
    setWallpaperUrl?.(url);

    // Allow uploading the same file again later
    e.target.value = "";
  };

  const clearCustom = () => {
    setWallpaperUrl?.(null);
  };

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

        {/* Appearance toggle */}
        <div className="mb-7">
          <div className={`${textSub} text-xs mb-2`}>Appearance</div>
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

        {/* Wallpaper section */}
        <div className="mb-6">
          <div className={`${textSub} text-xs mb-2`}>Wallpaper</div>

          <div className="flex items-center gap-2 mb-4">
            {/* Upload */}
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

            {/* Reset to default */}
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

          {/* macOS wallpapers row */}
          <WallpaperRow
            title="macOS wallpapers"
            textClass={textMain}
            wallpapers={macWallpapers}
            onPick={pickWallpaper}
            isSelected={isSelected}
            uiTheme={uiTheme}
          />

          {/* Glass wallpapers row */}
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

        {/* Your existing grid (optional to keep) */}
        <div className="grid grid-cols-2 gap-4">
          {[
            "About",
            "Software Update",
            "Storage",
            "AirDrop & Handoff",
            "Login Items",
            "Language & Region",
            "Date & Time",
            "Sharing",
          ].map((row) => (
            <div
              key={row}
              className={`rounded-xl ${cardBg} border ${cardBorder} p-4 ${textMain} text-sm transition cursor-pointer ${cardHover}`}
            >
              {row}
            </div>
          ))}
        </div>
      </div>
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

            {/* subtle overlay */}
            <div
              className={`absolute inset-0 ${
                isMac ? "bg-black/0 hover:bg-black/5" : "bg-black/0 hover:bg-black/10"
              } transition`}
            />

            {/* selected check */}
            {isSelected(src) && (
              <div
                className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
                  isMac ? "bg-white/80 text-black/80" : "bg-white/20 text-white"
                }`}
              >
                Selected
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
