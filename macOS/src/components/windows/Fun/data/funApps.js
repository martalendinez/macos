// src/components/windows/Fun/data/funApps.js
// Catalog for the Extras & Fun "App Store". ✏️ Edit titles, taglines and categories here.
import { getIcons } from "../../../../config/apps";

// category: "fintech" | "design" (design & build) | "me" (get to know Marta) | "play" (just for fun) | "tools" (utilities)
const APPS = [
  { key: "fundquest", title: "Fund Quest", subtitle: "Learn private markets in 10 min", category: "fintech", tint: "#5e5ce6", blurb: "The crash course I wish I'd had: 7 bite-sized lessons with quizzes, XP and a certificate." },
  { key: "figma", title: "Figma", subtitle: "Auto layout & components, for real", category: "design", tint: "#a259ff", blurb: "A working mini Figma: draw, use auto layout, and edit a component to update every instance." },
  { key: "facetime", title: "FaceTime", subtitle: "Book a call with me", category: "me", tint: "#30d158", blurb: "Give me a ring, then pick a time to chat. I'd love to meet you!" },
  { key: "designsystem", title: "Design System", subtitle: "Tokens, components & motion", category: "design", tint: "#ff9f0a", blurb: "The design system behind this portfolio: live tokens, components and springs." },
  { key: "achievements", title: "Achievements", subtitle: "Your trophy room", category: "play", tint: "#ffd60a" },
  { key: "activitymonitor", title: "Activity Monitor", subtitle: "My skills, as processes", category: "design", tint: "#30d158" },
  { key: "fundsim", title: "Fund Simulator", subtitle: "Private markets, explained", category: "fintech", tint: "#5e5ce6", blurb: "Play with a private markets fund: watch the J-curve, capital calls and returns unfold." },
  { key: "instagram", title: "Instagram", subtitle: "My life in photos & stories", category: "me", tint: "#e1306c", blurb: "Swipe through the places I've lived, one story at a time." },
  { key: "messages", title: "Messages", subtitle: "Ask me anything", category: "me", tint: "#34c759", blurb: "Chat with a pre-recorded me: projects, skills, fun facts." },
  { key: "map", title: "Maps", subtitle: "The places I've called home", category: "me", tint: "#0a84ff", iconKey: "map" },
  { key: "music", title: "Spotify", subtitle: "My playlists, queue & Wrapped", category: "me", tint: "#1ed760", iconKey: "music" },
  { key: "notes", title: "Notes", subtitle: "My philosophy & toolbox", category: "me", tint: "#ffcc00" },
  { key: "photobooth", title: "Photo Booth", subtitle: "Take a selfie with filters", category: "play", tint: "#ff3b30", blurb: "Strike a pose: 9 filters, a countdown and a Polaroid frame." },
  { key: "paint", title: "Paint", subtitle: "Draw me something!", category: "play", tint: "#af52de" },
  { key: "terminal", title: "Terminal", subtitle: "Play games & commands", category: "design", tint: "#1c1c1e", iconKey: "terminal" },
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

export const FEATURED = ["fundquest", "figma", "fundsim", "designsystem"];

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
