// src/components/windows/Settings/components/WallpaperSection.jsx
import React from "react";

function isPairSelected(pair, isSelected) {
  return Boolean(isSelected?.(pair.light) || isSelected?.(pair.dark));
}

function pickForTheme(pair, theme) {
  return theme === "dark" ? pair.dark : pair.light;
}

function WallpaperGrid({ title, wallpapers, theme, isSelected, onPick }) {
  return (
    <div className="space-y-3">
      <div className="font-semibold text-sm">{title}</div>

      <div className="grid grid-cols-3 gap-4">
        {wallpapers.map((pair, idx) => {
          const selected = isPairSelected(pair, isSelected);
          const previewSrc = pair.light;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onPick?.(pickForTheme(pair, theme))}
              className={[
                "rounded-2xl overflow-hidden border transition",
                selected
                  ? "ring-2 ring-emerald-400/70 border-emerald-400/40"
                  : "border-black/10",
                "bg-white",
              ].join(" ")}
              title="Set wallpaper"
            >
              <img
                src={previewSrc}
                alt=""
                className="w-full h-[92px] object-cover"
                draggable={false}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WallpaperSection({
  styles,
  theme = "light",
  onUpload,
  onReset,
  macWallpapers = [],
  glassWallpapers = [],
  isSelected,
  onPick,
}) {
  const btnBase =
    styles?.btnBase ??
    "px-3 py-2 rounded-xl border border-black/10 bg-white/70 hover:bg-white transition text-sm";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button className={btnBase} onClick={onUpload} type="button">
          Upload image
        </button>
        <button className={btnBase} onClick={onReset} type="button">
          Reset
        </button>
      </div>

      <WallpaperGrid
        title="macOS wallpapers"
        wallpapers={macWallpapers}
        theme={theme}
        isSelected={isSelected}
        onPick={onPick}
      />

      <WallpaperGrid
        title="Glass wallpapers"
        wallpapers={glassWallpapers}
        theme={theme}
        isSelected={isSelected}
        onPick={onPick}
      />
    </div>
  );
}