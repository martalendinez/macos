// src/config/projectWorkspaces.js
// The demo workspaces: which apps each case study opens, in process order.
// Trivia has no public repo, so it only opens the apps with real material behind them.

export const APP_STEPS = {
  notion: ["Research", "Notion"],
  figma: ["Design", "Figma"],
  claude: ["AI", "Claude"],
  vscode: ["Build", "VS Code"],
  github: ["Ship", "GitHub"],
};

export const WORKSPACE_PROJECTS = {
  trace: {
    id: "trace",
    name: "Trace",
    caseStudy: "thesisCaseStudy",
    tint: "#5b5bd6",
    apps: {
      notion: "Brief & decisions",
      figma: "Design file",
      claude: "Prompt sessions",
      vscode: "Source code",
      github: "Repository",
    },
  },
  sallskap: {
    id: "sallskap",
    name: "Sällskap",
    caseStudy: "groupDiningCaseStudy",
    tint: "#34b27b",
    apps: {
      notion: "Brief & research",
      figma: "Design file",
      claude: "Build sessions",
      vscode: "Source code",
      github: "Repository",
    },
  },
  kallos: {
    id: "kallos",
    name: "Kallos",
    caseStudy: "employerBrandingCaseStudy",
    tint: "#f28b4b",
    apps: {
      notion: "Brief & research",
      figma: "Design file",
      claude: "AI sessions",
      vscode: "Source code",
      github: "Repository",
    },
  },
  trivia: {
    id: "trivia",
    name: "Trivia",
    caseStudy: "triviaCaseStudy",
    tint: "#7b6cf6",
    note: "Team project: the code was built together and isn’t public, so this demo shows research, design and collaboration.",
    apps: {
      notion: "Brief & testing",
      figma: "Design file",
      claude: "Team sessions",
    },
  },
};

export const PROJECT_ORDER = ["trace", "sallskap", "kallos", "trivia"];
