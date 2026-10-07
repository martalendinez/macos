// src/components/windows/Fun/data/funApps.js

// -----------------------------
// GLASS icons
// -----------------------------
import glassTerminal from "/icons/glass/terminalGlass.png";
import glassMaps from "/icons/glass/mapsGlass.png";
import glassMusic from "/icons/glass/MediaGlass.png";

// -----------------------------
// MAC icons
// -----------------------------
import macTerminal from "/icons/mac/terminalMac.webp";
import macMaps from "/icons/mac/mapsMac.png";
import macMusic from "/icons/mac/musicMap.svg";

const ICONS = {
  glass: {
    terminal: glassTerminal,
    map: glassMaps,
    music: glassMusic,
  },
  macos: {
    terminal: macTerminal,
    map: macMaps,
    music: macMusic,
  },
};

function pickIcon(iconTheme, iconKey) {
  const normalized = String(iconTheme || "").toLowerCase();
  const themeKey = normalized === "macos" ? "macos" : "glass";
  return ICONS[themeKey]?.[iconKey] ?? ICONS.glass?.[iconKey] ?? null;
}

// Apps with their own icon in public/icons/apps (same for both icon themes)
const EXTRA_APPS = [
  { key: "instagram", title: "Instagram", subtitle: "My life in photos & stories", group: "fun" },
  { key: "messages", title: "Messages", subtitle: "Ask me anything", group: "fun" },
  { key: "photobooth", title: "Photo Booth", subtitle: "Take a selfie with filters", group: "fun" },
  { key: "paint", title: "Paint", subtitle: "Draw me something!", group: "fun" },
  { key: "notes", title: "Notes", subtitle: "My philosophy & toolbox", group: "tools" },
  { key: "weather", title: "Weather", subtitle: "Every city I've lived in", group: "tools" },
  { key: "stickies", title: "Stickies", subtitle: "Leave yourself a note", group: "tools" },
  { key: "calculator", title: "Calculator", subtitle: "Yes, it really works", group: "tools" },
];

/**
 * @param {(key: string) => void} onOpenWindow
 * @param {"glass"|"macos"} iconTheme
 */
export function getFunApps(onOpenWindow, iconTheme = "glass") {
  return [
    {
      key: "terminal",
      title: "Terminal",
      subtitle: "Play games & commands",
      group: "tools",
      icon: pickIcon(iconTheme, "terminal"),
      onClick: () => onOpenWindow?.("terminal"),
    },
    {
      key: "map",
      title: "Maps",
      subtitle: "The places I've called home",
      group: "tools",
      icon: pickIcon(iconTheme, "map"),
      onClick: () => onOpenWindow?.("map"),
    },
    {
      key: "music",
      title: "Music",
      subtitle: "My favorite tunes",
      group: "tools",
      icon: pickIcon(iconTheme, "music"),
      onClick: () => onOpenWindow?.("music"),
    },
    ...EXTRA_APPS.map((a) => ({
      ...a,
      icon: `/icons/apps/${a.key}.svg`,
      onClick: () => onOpenWindow?.(a.key),
    })),
  ];
}