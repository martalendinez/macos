// src/config/phoneHome.js
// ✏️ The phone home screen (screens under 768px wide look like an iPhone instead of a Mac).
// Each page is a list of app ids from config/apps.js, or a folder: { folder: "Name", items: [ids] }.
// Any app you forget to place is added to the last page automatically, so nothing goes missing.

export const PHONE_DOCK = ["projects", "about", "recruiter", "messages"];

export const PHONE_PAGES = [
  // page 1: the profile widget sits on top, then these
  ["resume", "fun", "music", "map", "instagram", "terminal", "figma", "notion"],
  // page 2: the work apps, plus the case studies in a folder
  [
    "vscode",
    "claude",
    "github",
    "excel",
    "fundsim",
    "designsystem",
    "accessibility",
    "achievements",
    "settings",
    { folder: "Case Studies", items: ["thesisCaseStudy", "employerBrandingCaseStudy", "triviaCaseStudy", "groupDiningCaseStudy"] },
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
