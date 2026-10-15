// src/config/phoneHome.js
// ✏️ The phone home screen (screens under 768px wide look like an iPhone instead of a Mac).
// Each page is a list of app ids from config/apps.js, a folder: { folder: "Name", items: [ids] },
// or a widget: { widget: "profile" | "clock" | "fund" | "achievements" | "music" | "memories" | "figma" | "designsystem" }.
// Any app you forget to place is added to the last page automatically, so nothing goes missing.
// The Dock uses the same glass stack icons as the Mac Dock (config/dockStacks.js); tapping one opens it as a folder.

// Each page fits 5 rows: a big widget is 2 rows, a small widget takes a 2×2 block of icons, an app row is 4 icons.
export const PHONE_PAGES = [
  // page 1: who I am, then the most important apps
  ["profile", "projects", "recruiter", "about", "resume", "messages", "fun", "music", "map"].map((x) => (x === "profile" ? { widget: x } : x)),
  // page 2: music, Stockholm and the design tools
  [
    { widget: "music" },
    { widget: "clock" },
    { folder: "Case Studies", items: ["thesisCaseStudy", "employerBrandingCaseStudy", "triviaCaseStudy", "groupDiningCaseStudy"] },
    "figma",
    "notion",
    "vscode",
  ],
  // page 3: memories next to the fun apps, the fund next to the work apps
  [{ widget: "memories" }, "instagram", "terminal", "accessibility", "settings", { widget: "fund" }, "excel", "fundsim", "claude", "github"],
  // page 4: Figma, the design system and trophies
  [{ widget: "figma" }, { widget: "designsystem" }, { widget: "achievements" }, "designsystem", "achievements"],
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
