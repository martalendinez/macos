// src/config/apps.js
// Single catalog of "apps" used by the Dock, Spotlight, menu bar and desktop.

// new Extras apps share one icon set (public/icons/apps)
const APP_ICONS = Object.fromEntries(
  ["instagram", "messages", "photobooth", "notes", "weather", "stickies", "calculator", "paint", "fundsim", "fundquest", "figma", "facetime", "activitymonitor", "designsystem", "achievements", "spotify"].map((k) => [k, `/icons/apps/${k}.svg`])
);

const ICONS = {
  macos: {
    about: "/icons/mac/aboutMac.png",
    projects: "/icons/mac/foldersMac.png",
    recruiter: "/icons/mac/timerMac.png",
    fun: "/icons/mac/gamesMac.png",
    terminal: "/icons/mac/terminalMac.webp",
    map: "/icons/mac/mapsMac.png",
    music: "/icons/apps/spotify.svg",
    doc: "/icons/mac/docMac.png",
    extras: "/icons/mac/extrasMac.svg",
    stackFinance: "/icons/mac/financeMac.svg",
    stackDesign: "/icons/mac/designMac.svg",
    stackWorld: "/icons/mac/worldMac.svg",
    stackPlay: "/icons/mac/playMac.svg",
    ...APP_ICONS,
  },
  glass: {
    about: "/icons/glass/me-512.png",
    projects: "/icons/glass/FolderGlass.png",
    recruiter: "/icons/glass/ProfileGlass.png",
    fun: "/icons/glass/games-512.png",
    terminal: "/icons/glass/terminalGlass.png",
    map: "/icons/glass/mapsGlass.png",
    music: "/icons/apps/spotify.svg",
    doc: "/icons/glass/MailGlass.png",
    extras: "/icons/glass/extras-512.png",
    stackFinance: "/icons/glass/finance-512.png",
    stackDesign: "/icons/glass/design-512.png",
    stackWorld: "/icons/glass/world-512.png",
    stackPlay: "/icons/glass/games-512.png",
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
    { id: "about", label: "About me", windowId: "about", icon: i.about, kind: "app", inDock: true, keywords: "marta bio contact experience skills royc design engineer job fintech b2b saas private markets" },
    { id: "projects", label: "Projects", windowId: "projects", icon: i.projects, kind: "app", inDock: false, keywords: "work portfolio case studies ux" },
    { id: "recruiter", label: "Recruiter Mode", windowId: "recruiter", icon: i.recruiter, kind: "app", inDock: false, keywords: "quick summary hire tour" },
    { id: "fun", label: "Extras & Fun", windowId: "fun", icon: i.extras, kind: "app", inDock: true, keywords: "games extras all apps launchpad" },
    { id: "terminal", label: "Terminal", windowId: "terminal", icon: i.terminal, kind: "app", inDock: false, keywords: "shell snake pong tetris commands" },
    { id: "map", label: "Maps", windowId: "map", icon: i.map, kind: "app", inDock: false, keywords: "places travel home world" },
    { id: "music", label: "Spotify", windowId: "music", icon: i.music, kind: "app", inDock: false, keywords: "music songs playlist spotify wrapped" },
    { id: "fundquest", label: "Fund Quest", windowId: "fundquest", icon: i.fundquest, kind: "app", extra: true, keywords: "learn private markets course quiz game fintech kyc j-curve tvpi lesson" },
    { id: "figma", label: "Figma", windowId: "figma", icon: i.figma, kind: "app", extra: true, keywords: "design canvas auto layout components prototype ui ux tool" },
    { id: "facetime", label: "FaceTime", windowId: "facetime", icon: i.facetime, kind: "app", extra: true, keywords: "call book meeting contact video talk hire" },
    { id: "designsystem", label: "Design System", windowId: "designsystem", icon: i.designsystem, kind: "app", extra: true, keywords: "tokens colors typography components motion ui" },
    { id: "activitymonitor", label: "Activity Monitor", windowId: "activitymonitor", icon: i.activitymonitor, kind: "app", extra: true, keywords: "processes cpu skills windows task manager" },
    { id: "achievements", label: "Achievements", windowId: "achievements", icon: i.achievements, kind: "app", extra: true, keywords: "trophies badges unlock game center progress" },
    { id: "fundsim", label: "Fund Simulator", windowId: "fundsim", icon: i.fundsim, kind: "app", extra: true, keywords: "fintech private markets fund j-curve irr tvpi investing royc finance" },
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
