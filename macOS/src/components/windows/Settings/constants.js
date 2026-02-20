// src/components/windows/Settings/constants.js

// ---------- MACOS WALLPAPERS ----------
import mac1Light from "../../../imgs/wallpapers/macos/mac1.jpeg";
import mac1Dark from "../../../imgs/wallpapers/macos/mac1dark.jpeg";

import mac2Light from "../../../imgs/wallpapers/macos/mac2.jpg";
import mac2Dark from "../../../imgs/wallpapers/macos/mac2dark.jpg";

import mac3Light from "../../../imgs/wallpapers/macos/mac3.jpg";
import mac3Dark from "../../../imgs/wallpapers/macos/mac3dark.jpg";

// ---------- GLASS WALLPAPERS ----------
import glass1Light from "../../../imgs/wallpapers/glass/glass1.jpg";
import glass1Dark from "../../../imgs/wallpapers/glass/glass1-dark.png";

import glass2Light from "../../../imgs/wallpapers/glass/glass2.jpeg";
import glass2Dark from "../../../imgs/wallpapers/glass/glass2dark.jpeg";

import glass3Light from "../../../imgs/wallpapers/glass/glass3.jpg";
import glass3Dark from "../../../imgs/wallpapers/glass/glass3dark.jpg";


// ------------------- SECTIONS -------------------
export const SECTIONS = [
  { id: "theme", label: "Theme" },
  { id: "accent", label: "Accent color" },
  { id: "wallpapers", label: "Wallpapers" },
  { id: "font", label: "Font size" },
  { id: "quick", label: "Quick actions" },
];


// ------------------- WALLPAPER STRUCTURE -------------------
// Each wallpaper now knows its dark version

export const MAC_WALLPAPERS = [
  { light: mac1Light, dark: mac1Dark },
  { light: mac2Light, dark: mac2Dark },
  { light: mac3Light, dark: mac3Dark },
];

export const GLASS_WALLPAPERS = [
  { light: glass1Light, dark: glass1Dark },
  { light: glass2Light, dark: glass2Dark },
  { light: glass3Light, dark: glass3Dark },
];


// Combined list (used by App auto dark switch)
export const ALL_WALLPAPER_PAIRS = [
  ...MAC_WALLPAPERS,
  ...GLASS_WALLPAPERS,
];


// ------------------- ACCENT -------------------
export const ACCENT_OPTIONS = [
  { key: "emerald", label: "Emerald" },
  { key: "sky", label: "Sky" },
  { key: "violet", label: "Violet" },
  { key: "rose", label: "Rose" },
  { key: "amber", label: "Amber" },
];