// src/config/phoneHome.js
// ✏️ The phone home screen (screens under 768px wide look like an iPhone instead of a Mac).
// Each page is a list of app ids from config/apps.js, a folder: { folder: "Name", items: [ids] },
// or a widget: { widget: "profile" | "clock" | "fund" | "achievements" | "music" | "memories" | "figma" | "designsystem" }.
// Any app you forget to place is added to the last page automatically, so nothing goes missing.
// The Dock uses the same glass stack icons as the Mac Dock (config/dockStacks.js); tapping one opens it as a folder.

// Each page fits 5 rows: a big widget is 2 rows, a small widget is 2×2 icons, an app row is 4 icons.
// Apps that already have a widget (Fund Sim, Design System, Trophies) don't need a separate icon.
export const PHONE_PAGES = [
  // page 1: who I am, my trophies, and the most important apps
  [
    { widget: "profile" },
    { widget: "achievements" },
    "projects",
    "recruiter",
    "about",
    "resume",
    "messages",
    "fun",
    "music",
    "map",
  ],
  // page 2: music, Stockholm, the case studies and the work tools
  [
    { widget: "music" },
    { widget: "clock" },
    { folder: "Case Studies", items: ["thesisCaseStudy", "employerBrandingCaseStudy", "triviaCaseStudy", "groupDiningCaseStudy"] },
    "figma",
    "notion",
    "vscode",
    "claude",
    "github",
    "excel",
    "instagram",
  ],
  // page 3: memories, the fund, Figma and the design system, plus the rest of the OS
  [{ widget: "memories" }, { widget: "fund" }, { widget: "figma" }, { widget: "designsystem" }, "terminal", "accessibility", "settings"],
];

// short names under the icons (the full names are too long for a phone grid)
export const PHONE_LABELS = {
  recruiter: "Recruiter",
  fun: "Extras",
  designsystem: "Design Sys.",
  accessibility: "Access.",
  achievements: "Trophies",
  fundsim: "Fund Sim",
  settings: "Settings",
  resume: "Résumé",
  thesisCaseStudy: "Trace",
  employerBrandingCaseStudy: "Employer Br.",
  triviaCaseStudy: "Trivia",
  groupDiningCaseStudy: "Sällskap",
};
