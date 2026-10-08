// src/components/windows/Fun/data/funApps.js
// Catalog for the Extras & Fun "App Store". ✏️ Edit titles, taglines and categories here.
import { getIcons } from "../../../../config/apps";

// category: "me" (get to know Marta) | "play" (just for fun) | "tools" (handy tools)
const APPS = [
  { key: "instagram", title: "Instagram", subtitle: "My life in photos & stories", category: "me", tint: "#e1306c", blurb: "Swipe through the places I've lived, one story at a time." },
  { key: "messages", title: "Messages", subtitle: "Ask me anything", category: "me", tint: "#34c759", blurb: "Chat with a pre-recorded me: projects, skills, fun facts." },
  { key: "map", title: "Maps", subtitle: "The places I've called home", category: "me", tint: "#0a84ff", iconKey: "map" },
  { key: "music", title: "Music", subtitle: "My favorite tunes", category: "me", tint: "#fa2d48", iconKey: "music" },
  { key: "notes", title: "Notes", subtitle: "My philosophy & toolbox", category: "me", tint: "#ffcc00" },
  { key: "photobooth", title: "Photo Booth", subtitle: "Take a selfie with filters", category: "play", tint: "#ff3b30", blurb: "Strike a pose: 9 filters, a countdown and a Polaroid frame." },
  { key: "paint", title: "Paint", subtitle: "Draw me something!", category: "play", tint: "#af52de" },
  { key: "terminal", title: "Terminal", subtitle: "Play games & commands", category: "play", tint: "#1c1c1e", iconKey: "terminal" },
  { key: "weather", title: "Weather", subtitle: "Every city I've lived in", category: "tools", tint: "#32ade6" },
  { key: "calculator", title: "Calculator", subtitle: "Yes, it really works", category: "tools", tint: "#ff9f0a" },
  { key: "stickies", title: "Stickies", subtitle: "Leave yourself a note", category: "tools", tint: "#ffd60a" },
];

// Mini games that live inside Terminal
export const GAMES = [
  { key: "snake", title: "Snake", subtitle: "Grow fast, chase golden apples", emoji: "🐍", gradient: ["#34c759", "#0f8f3a"] },
  { key: "pong", title: "Pong", subtitle: "Beat the CPU, first to 7", emoji: "🏓", gradient: ["#64d2ff", "#0a5fd1"] },
  { key: "tetris", title: "Tetris", subtitle: "Ghost piece, hold & levels", emoji: "🧱", gradient: ["#af52de", "#5e2ca5"] },
  { key: "2048", title: "2048", subtitle: "Slide, merge, reach 2048", emoji: "🔢", gradient: ["#ff9f0a", "#c93400"] },
  { key: "breakout", title: "Breakout", subtitle: "Smash the rainbow bricks", emoji: "🧨", gradient: ["#ff375f", "#a0003a"] },
  { key: "flappy", title: "Flappy", subtitle: "One button. Endless pipes.", emoji: "🐤", gradient: ["#0a84ff", "#003a8c"] },
];

export const FEATURED = ["instagram", "messages", "photobooth"];

/**
 * @param {(key: string) => void} onOpenWindow
 * @param {"glass"|"macos"} iconTheme
 */
export function getFunApps(onOpenWindow, iconTheme = "glass") {
  const icons = getIcons(iconTheme);
  return APPS.map((a) => ({
    ...a,
    icon: icons[a.iconKey ?? a.key],
    onClick: () => onOpenWindow?.(a.key),
  }));
}
