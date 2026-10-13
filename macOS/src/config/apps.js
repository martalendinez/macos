// src/config/apps.js
// Single catalog of "apps" used by the Dock, Spotlight, menu bar and desktop.

// new Extras apps share one icon set (public/icons/apps)
const APP_ICONS = Object.fromEntries(
  ["instagram", "messages", "fundsim", "figma", "designsystem", "achievements", "spotify", "github", "claude", "notion", "excel", "journey", "vscode", "accessibility", "trash"].map((k) => [k, `/icons/apps/${k}.svg`])
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
    stackCode: "/icons/mac/codeMac.svg",
    stackMac: "/icons/mac/thisMac.svg",
    stackWorld: "/icons/mac/worldMac.svg",
    stackPlay: "/icons/mac/playMac.svg",
    ...APP_ICONS,
  },
  glass: {
    about: "/icons/glass/me-512.png",
    projects: "/icons/glass/FolderGlass.png",
    recruiter: "/icons/glass/ProfileGlass.png",
    fun: "/icons/glass/games-512.png",
    terminal: "/icons/apps/terminal.svg",
    map: "/icons/glass/mapsGlass.png",
    music: "/icons/apps/spotify.svg",
    doc: "/icons/glass/MailGlass.png",
    extras: "/icons/glass/extras-512.png",
    stackFinance: "/icons/glass/finance-512.png",
    stackDesign: "/icons/glass/design-512.png",
    stackCode: "/icons/glass/code-512.png",
    stackMac: "/icons/glass/mac-512.png",
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
    { id: "notion", label: "Notion", windowId: "notion", icon: i.notion, kind: "app", extra: true, keywords: "docs design notes brief decision log research insights process critique checklist" },
    { id: "journey", label: "Marta’s Journey", windowId: "journey", icon: i.journey, kind: "app", extra: true, keywords: "game platformer pixel art arcade play madrid groningen stuttgart canada stockholm journey career" },
    { id: "vscode", label: "VS Code", windowId: "vscode", icon: i.vscode, kind: "app", extra: true, keywords: "visual studio code editor source code react jsx files developer ide" },
    { id: "trash", label: "Trash", windowId: "trash", icon: i.trash, kind: "system", keywords: "bin deleted files garbage" },
    { id: "accessibility", label: "Accessibility", windowId: "accessibility", icon: i.accessibility, kind: "app", extra: true, keywords: "a11y contrast text size reduce motion color blind filters focus keyboard vision" },
    { id: "claude", label: "Claude", windowId: "claude", icon: i.claude, kind: "app", extra: true, keywords: "ai llm assistant prompt workflow chat claude anthropic pair programming" },
    { id: "github", label: "GitHub", windowId: "github", icon: i.github, kind: "app", extra: true, keywords: "code repos pull request pr merge review ci developer engineering git" },
    { id: "excel", label: "Excel", windowId: "excel", icon: i.excel, kind: "app", extra: true, keywords: "spreadsheet fund model irr dpi j-curve cash flows excel to product fintech b2b" },
    { id: "figma", label: "Figma", windowId: "figma", icon: i.figma, kind: "app", extra: true, keywords: "design canvas auto layout components prototype ui ux tool" },
    { id: "designsystem", label: "Design System", windowId: "designsystem", icon: i.designsystem, kind: "app", extra: true, keywords: "tokens colors typography components motion ui" },
    { id: "achievements", label: "Achievements", windowId: "achievements", icon: i.achievements, kind: "app", extra: true, keywords: "trophies badges unlock game center progress" },
    { id: "fundsim", label: "Fund Simulator", windowId: "fundsim", icon: i.fundsim, kind: "app", extra: true, keywords: "fintech private markets fund j-curve irr tvpi investing royc finance" },
    { id: "instagram", label: "Instagram", windowId: "instagram", icon: i.instagram, kind: "app", extra: true, keywords: "photos pictures stories travel" },
    { id: "messages", label: "Messages", windowId: "messages", icon: i.messages, kind: "app", extra: true, keywords: "chat imessage talk ask contact" },

    { id: "employerBrandingCaseStudy", label: "Employer Branding — Case Study", windowId: "employerBrandingCaseStudy", icon: i.projects, kind: "caseStudy", keywords: "bachelor thesis pridecom ai" },
    { id: "thesisCaseStudy", label: "Trace — Master Thesis Case Study", windowId: "thesisCaseStudy", icon: i.projects, kind: "caseStudy", keywords: "master thesis kth ai co-pilot human ai collaboration llm plugin trace research" },
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
