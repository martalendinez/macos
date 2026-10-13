// src/components/windows/Fun/data/funApps.js
// Catalog for the Extras & Fun "App Store". ✏️ Edit titles, taglines and categories here.
import { getIcons } from "../../../../config/apps";

// category: "fintech" | "design" | "code" | "mac" (This Mac: apps about the OS itself) | "me" (get to know Marta) | "play" (just for fun) | "tools" (utilities)
const APPS = [
  { key: "accessibility", title: "Accessibility", subtitle: "Make the whole OS yours", category: "mac", tint: "#0a84ff", blurb: "Text size, contrast, reduced motion and transparency, colour-blindness filters and focus outlines, applied to every window." },
  { key: "vscode", title: "VS Code", subtitle: "Read this portfolio’s source", category: "code", tint: "#0a6fd0", blurb: "The real source code of this OS, in an editor: explorer, tabs, search across every file and the git history." },
  { key: "excel", title: "Excel", subtitle: "From spreadsheet to product", category: "fintech", tint: "#107c41", blurb: "Edit a real-style fund model, then flip it into a product screen. Private markets still run on spreadsheets; this is how I design what replaces them." },
  { key: "notion", title: "Notion", subtitle: "My design docs & decision log", category: "design", tint: "#37352f", blurb: "My process, project briefs, every big decision with its trade-off, and the checklist I run before a review." },
  { key: "claude", title: "Claude", subtitle: "How I work with AI", category: "code", tint: "#d97757", blurb: "Replay real-style sessions: I bring the context and make the call, Claude drafts, checks and challenges." },
  { key: "github", title: "GitHub", subtitle: "Review and merge my pull request", category: "code", tint: "#1f2328", blurb: "See how I ship: a real-style PR with checks, a review and a Merge button you get to press." },
  { key: "figma", title: "Figma", subtitle: "Auto layout & components, for real", category: "design", tint: "#a259ff", blurb: "A working mini Figma: draw, use auto layout, and edit a component to update every instance." },
  { key: "designsystem", title: "Design System", subtitle: "Tokens, components & motion", category: "mac", tint: "#ff9f0a", blurb: "The design system behind this portfolio: live tokens, components and springs." },
  { key: "achievements", title: "Achievements", subtitle: "Your trophy room", category: "mac", tint: "#ffd60a" },
  { key: "fundsim", title: "Fund Simulator", subtitle: "Private markets, explained", category: "fintech", tint: "#5e5ce6", blurb: "Play with a private markets fund: watch the J-curve, capital calls and returns unfold." },
  { key: "instagram", title: "Instagram", subtitle: "My life in photos & stories", category: "me", tint: "#e1306c", blurb: "Swipe through the places I've lived, one story at a time." },
  { key: "messages", title: "Messages", subtitle: "Ask me anything", category: "me", tint: "#34c759", blurb: "Chat with a pre-recorded me: projects, skills, fun facts." },
  { key: "map", title: "Maps", subtitle: "The places I've called home", category: "me", tint: "#0a84ff", iconKey: "map" },
  { key: "music", title: "Spotify", subtitle: "My playlists, queue & Wrapped", category: "me", tint: "#1ed760", iconKey: "music" },
  { key: "terminal", title: "Terminal", subtitle: "Play games & commands", category: "mac", tint: "#1c1c1e", iconKey: "terminal" },
];


export const FEATURED = ["excel", "claude", "notion", "github", "figma", "fundsim", "designsystem"];

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
