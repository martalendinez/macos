// src/components/windows/Settings/constants.js
import mac1 from "../../../imgs/wallpapers/macos/mac1.jpeg";
import mac2 from "../../../imgs/wallpapers/macos/mac2.jpg";
import mac3 from "../../../imgs/wallpapers/macos/mac3.jpg";

import glass1 from "../../../imgs/wallpapers/glass/glass1.jpg";
import glass2 from "../../../imgs/wallpapers/glass/glass2.jpeg";
import glass3 from "../../../imgs/wallpapers/glass/glass3.jpg";

export const SECTIONS = [
  { id: "theme", label: "Theme" },
  { id: "accent", label: "Accent color" },
  { id: "wallpapers", label: "Wallpapers" },
  { id: "font", label: "Font size" },
  { id: "quick", label: "Quick actions" },
];

export const MAC_WALLPAPERS = [mac1, mac2, mac3];
export const GLASS_WALLPAPERS = [glass1, glass2, glass3];

export const ACCENT_OPTIONS = [
  { key: "emerald", label: "Emerald" },
  { key: "sky", label: "Sky" },
  { key: "violet", label: "Violet" },
  { key: "rose", label: "Rose" },
  { key: "amber", label: "Amber" },
];