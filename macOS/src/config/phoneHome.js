// src/config/phoneHome.js
// ✏️ The phone home screen (screens under 768px wide look like an iPhone instead of a Mac).
// Each page is a list of app ids from config/apps.js, or a folder: { folder: "Name", items: [ids] }.
// Any app you forget to place is added to the last page automatically, so nothing goes missing.
// The Dock uses the same glass stack icons as the Mac Dock (config/dockStacks.js); tapping one opens it as a folder.

export const PHONE_PAGES = [
  // page 1: the profile widget sits on top, then the most important apps first
  ["projects", "recruiter", "about", "resume", "messages", "fun", "music", "map"],
  // page 2: everything else, plus the case studies in a folder
  [
    { folder: "Case Studies", items: ["thesisCaseStudy", "employerBrandingCaseStudy", "triviaCaseStudy", "groupDiningCaseStudy"] },
    "instagram",
    "terminal",
    "figma",
    "notion",
    "vscode",
    "claude",
    "github",
    "excel",
    "fundsim",
    "designsystem",
    "accessibility",
    "achievements",
    "settings",
  ],
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
