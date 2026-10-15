// src/config/phoneHome.js
// ✏️ The phone home screen (screens under 768px wide look like an iPhone instead of a Mac).
// Each page is a list of app ids from config/apps.js, a folder: { folder: "Name", items: [ids] },
// or a widget: { widget: "profile" | "clock" | "fund" | "achievements" | "music" | "memories" | "figma" | "designsystem" }.
// Any app you forget to place is added to the last page automatically, so nothing goes missing.
// The Dock uses the same glass stack icons as the Mac Dock (config/dockStacks.js); tapping one opens it as a folder.

export const PHONE_PAGES = [
  // page 1: who I am, then the most important apps
  [
    { widget: "profile" },
    "projects",
    "recruiter",
    "about",
    "resume",
    "messages",
    "fun",
    "music",
    "map",
  ],
  // page 2: music, the case studies and the work tools
  [
    { widget: "music" },
    { folder: "Case Studies", items: ["thesisCaseStudy", "employerBrandingCaseStudy", "triviaCaseStudy", "groupDiningCaseStudy"] },
    "figma",
    "notion",
    "vscode",
    "claude",
    "github",
    "excel",
    "fundsim",
  ],
  // page 3: the rest of the OS, plus Stockholm time and the fund snapshot
  [{ widget: "achievements" }, "designsystem", "accessibility", "instagram", "terminal", { widget: "clock" }, { widget: "fund" }, "achievements", "settings"],
  // page 4: the rest of the desktop widgets
  [{ widget: "memories" }, { widget: "figma" }, { widget: "designsystem" }],
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
