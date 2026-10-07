// src/config/apps.js
// Single catalog of "apps" used by the Dock, Spotlight, menu bar and desktop.

// new Extras apps share one icon set (public/icons/apps)
const APP_ICONS = Object.fromEntries(
  ["instagram", "messages", "photobooth", "notes", "weather", "stickies", "calculator", "paint"].map((k) => [k, `/icons/apps/${k}.svg`])
);

const ICONS = {
  macos: {
    about: "/icons/mac/aboutMac.png",
    projects: "/icons/mac/foldersMac.png",
    recruiter: "/icons/mac/timerMac.png",
    fun: "/icons/mac/gamesMac.png",
    terminal: "/icons/mac/terminalMac.webp",
    map: "/icons/mac/mapsMac.png",
    music: "/icons/mac/musicMap.svg",
    doc: "/icons/mac/docMac.png",
    ...APP_ICONS,
  },
  glass: {
    about: "/icons/glass/me-512.png",
    projects: "/icons/glass/FolderGlass.png",
    recruiter: "/icons/glass/ProfileGlass.png",
    fun: "/icons/glass/games-512.png",
    terminal: "/icons/glass/terminalGlass.png",
    map: "/icons/glass/mapsGlass.png",
    music: "/icons/glass/MediaGlass.png",
    doc: "/icons/glass/MailGlass.png",
    ...APP_ICONS,
  },
};

export const RESUME_URL = "/resume.pdf";

export function getIcons(iconTheme = "glass") {
  return iconTheme === "macos" ? ICONS.macos : ICONS.glass;
}

/**
 * kind: "app" | "caseStudy" | "document" | "system"
 * inDock: shown in the Dock (left section)
 */
export function getApps(iconTheme = "glass") {
  const i = getIcons(iconTheme);

  return [
    { id: "about", label: "About me", windowId: "about", icon: i.about, kind: "app", inDock: true, keywords: "marta bio contact experience skills royc design engineer job" },
    { id: "projects", label: "Projects", windowId: "projects", icon: i.projects, kind: "app", inDock: false, keywords: "work portfolio case studies ux" },
    { id: "recruiter", label: "Recruiter Mode", windowId: "recruiter", icon: i.recruiter, kind: "app", inDock: false, keywords: "quick summary hire tour" },
    { id: "fun", label: "Extras & Fun", windowId: "fun", icon: i.fun, kind: "app", inDock: true, keywords: "games extras" },
    { id: "terminal", label: "Terminal", windowId: "terminal", icon: i.terminal, kind: "app", inDock: false, keywords: "shell snake pong tetris commands" },
    { id: "map", label: "Maps", windowId: "map", icon: i.map, kind: "app", inDock: false, keywords: "places travel home world" },
    { id: "music", label: "Music", windowId: "music", icon: i.music, kind: "app", inDock: false, keywords: "songs playlist spotify" },
    { id: "instagram", label: "Instagram", windowId: "instagram", icon: i.instagram, kind: "app", extra: true, keywords: "photos pictures stories travel" },
    { id: "messages", label: "Messages", windowId: "messages", icon: i.messages, kind: "app", extra: true, keywords: "chat imessage talk ask contact" },
    { id: "photobooth", label: "Photo Booth", windowId: "photobooth", icon: i.photobooth, kind: "app", extra: true, keywords: "camera selfie webcam filters" },
    { id: "notes", label: "Notes", windowId: "notes", icon: i.notes, kind: "app", extra: true, keywords: "philosophy toolbox timeline write" },
    { id: "weather", label: "Weather", windowId: "weather", icon: i.weather, kind: "app", extra: true, keywords: "forecast temperature stockholm" },
    { id: "stickies", label: "Stickies", windowId: "stickies", icon: i.stickies, kind: "app", extra: true, keywords: "sticky notes post-it" },
    { id: "calculator", label: "Calculator", windowId: "calculator", icon: i.calculator, kind: "app", extra: true, keywords: "math numbers" },
    { id: "paint", label: "Paint", windowId: "paint", icon: i.paint, kind: "app", extra: true, keywords: "draw drawing sketch canvas" },

    { id: "employerBrandingCaseStudy", label: "Employer Branding — Case Study", windowId: "employerBrandingCaseStudy", icon: i.projects, kind: "caseStudy", keywords: "bachelor thesis pridecom ai" },
    { id: "triviaCaseStudy", label: "Trivia App — Case Study", windowId: "triviaCaseStudy", icon: i.projects, kind: "caseStudy", keywords: "react native kth quiz" },
    { id: "groupDiningCaseStudy", label: "Sällskap — Group Dining Case Study", windowId: "groupDiningCaseStudy", icon: i.projects, kind: "caseStudy", keywords: "restaurant booking sallskap" },

    { id: "resume", label: "resume.pdf", href: RESUME_URL, icon: i.doc, kind: "document", keywords: "cv resume pdf" },

    { id: "settings", label: "System Settings", windowId: "settings", icon: null, kind: "system", keywords: "preferences wallpaper theme accent dark" },
    { id: "portfolioInfo", label: "About This Portfolio", windowId: "portfolioInfo", icon: null, kind: "system", keywords: "info credits built" },
  ];
}

/** Best icon to represent a window (used for minimized windows in the Dock). */
export function iconForWindow(windowId, iconTheme = "glass") {
  const apps = getApps(iconTheme);
  const hit = apps.find((a) => a.windowId === windowId && a.icon);
  return hit?.icon ?? getIcons(iconTheme).projects;
}
