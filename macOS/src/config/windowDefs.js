// src/config/windowDefs.js
import { lazy } from "react";


const SettingsWindow = lazy(() => import("../components/windows/Settings/SettingsWindow"));
const AccessibilityWindow = lazy(() => import("../components/windows/Settings/AccessibilityWindow"));
const AboutWindow = lazy(() => import("../components/windows/About/AboutWindow"));
const ProjectsWindow = lazy(() => import("../components/windows/Projects/ProjectsWindow"));
const VideosWindow = lazy(() => import("../components/windows/VideosWindow"));

const FunWindow = lazy(() => import("../components/windows/Fun/FunWindow"));
const MusicWindow = lazy(() => import("../components/windows/Music/MusicWindow"));
const MapWindow = lazy(() => import("../components/windows/Map/MapWindow"));
const TerminalWindow = lazy(() => import("../components/windows/terminal/TerminalWindow"));

const EmployerBrandingCaseStudyWindow = lazy(() =>
  import("../components/windows/Projects/EmployerBrandingCaseStudyWIndow")
);
const StardewNotionCaseStudyWindow = lazy(() =>
  import("../components/windows/Projects/StardewNotionCaseStudyWindow")
);

const GroupDiningCaseStudyWindow = lazy(() =>
  import("../components/windows/Projects/GroupDiningCaseStudyWindow")
);

const ThesisCaseStudyWindow = lazy(() =>
  import("../components/windows/Projects/ThesisCaseStudyWindow")
);

const TriviaCaseStudyWindow = lazy(() =>
  import("../components/windows/Projects/TriviaCaseStudyWindow")
);

const SecretProjectsWindow = lazy(() => import("../components/windows/Projects/SecretProjectsWindow"));
const BehindTheButtonWindow = lazy(() => import("../components/windows/Projects/BehindTheButtonWindow"));

const PortfolioInfoWindow = lazy(() =>
  import("../components/windows/Settings/components/PortfolioInfoWindow")
);

const RecruiterModeWindow = lazy(() =>
  import("../components/windows/RecruiterMode/RecruiterModeWindow")
);

// Extras & Fun apps
const InstagramWindow = lazy(() => import("../components/windows/Instagram/InstagramWindow"));
const MessagesWindow = lazy(() => import("../components/windows/Messages/MessagesWindow"));
const FundSimWindow = lazy(() => import("../components/windows/FundSim/FundSimWindow"));
const FigmaWindow = lazy(() => import("../components/windows/Figma/FigmaWindow"));
const DesignSystemWindow = lazy(() => import("../components/windows/DesignSystem/DesignSystemWindow"));
const GitHubWindow = lazy(() => import("../components/windows/GitHub/GitHubWindow"));
const ClaudeWindow = lazy(() => import("../components/windows/Claude/ClaudeWindow"));
const NotionWindow = lazy(() => import("../components/windows/Notion/NotionWindow"));
const ExcelWindow = lazy(() => import("../components/windows/Excel/ExcelWindow"));
const JourneyWindow = lazy(() => import("../components/windows/Journey/JourneyWindow"));
const VSCodeWindow = lazy(() => import("../components/windows/VSCode/VSCodeWindow"));
const TrashWindow = lazy(() => import("../components/windows/Trash/TrashWindow"));
const AchievementsWindow = lazy(() => import("../components/windows/Achievements/AchievementsWindow"));

// ⭐ NEW AI ASSISTANT
const AiAssistantWindow = lazy(() =>
  import("../components/windows/AiAssistant/AiAssistantWindow")
);

export const WINDOW_DEFS = {
  settings: {
    title: "System Settings",
    Component: SettingsWindow,
    width: 900,
    height: 660,
    initialPos: { x: 240, y: 60 },
  },

  accessibility: { title: "Accessibility", Component: AccessibilityWindow, width: 900, height: 660, initialPos: { x: 260, y: 70 } },

  about: {
    title: "About me",
    Component: AboutWindow,
    width: 1080,
    height: 720,
    initialPos: { x: 190, y: 50 },
  },

  portfolioInfo: {
    title: "About This Portfolio",
    Component: PortfolioInfoWindow,
    width: 700,
    height: 720,
    initialPos: { x: 370, y: 40 },
  },

  recruiter: {
    title: "Recruiter Mode",
    Component: RecruiterModeWindow,
    width: 1120,
    height: 740,
    initialPos: { x: 170, y: 42 },
  },

  projects: {
    title: "Projects",
    Component: ProjectsWindow,
    width: 1120,
    height: 720,
    initialPos: { x: 170, y: 50 },
  },

  secretProjects: {
    title: "Secret Projects",
    Component: SecretProjectsWindow,
    width: 920,
    height: 600,
    initialPos: { x: 210, y: 120 },
  },

  behindTheButton: {
    title: "Behind the Button — WIP",
    Component: BehindTheButtonWindow,
    width: 1180,
    height: 760,
    initialPos: { x: 140, y: 80 },
  },

  thesisCaseStudy: {
  title: "Trace — Master Thesis",
  Component: ThesisCaseStudyWindow,
  width: 1180,
  height: 760,
  initialPos: { x: 140, y: 80 },
},

  videos: {
    title: "Videos",
    Component: VideosWindow,
    width: 860,
    height: 520,
    initialPos: { x: 240, y: 130 },
  },

  fun: {
    title: "Extras & Fun",
    Component: FunWindow,
    width: 1060,
    height: 720,
    initialPos: { x: 190, y: 44 },
  },

  music: {
    title: "Spotify",
    Component: MusicWindow,
    width: 1040,
    height: 700,
    initialPos: { x: 160, y: 50 },
  },

  map: {
    title: "Maps",
    Component: MapWindow,
    width: 1120,
    height: 720,
    initialPos: { x: 160, y: 44 },
  },

  terminal: {
    title: "Terminal",
    Component: TerminalWindow,
    width: 920,
    height: 640,
    initialPos: { x: 230, y: 50 },
  },

  employerBrandingCaseStudy: {
    title: "Employer Branding — Case Study",
    Component: EmployerBrandingCaseStudyWindow,
    width: 1180,
    height: 760,
    initialPos: { x: 140, y: 80 },
  },
   triviaCaseStudy: {
    title: "Trivia — Case Study",
    Component: TriviaCaseStudyWindow,
    width: 1180,
    height: 760,
    initialPos: { x: 140, y: 80 },
  },

  stardewNotionCaseStudy: {
    title: "Gamified Notion Template — Case Study",
    Component: StardewNotionCaseStudyWindow,
    width: 1180,
    height: 760,
    initialPos: { x: 140, y: 80 },
  },

  groupDiningCaseStudy: {
    title: "Sällskap — Group Dining Coordination",
    Component: GroupDiningCaseStudyWindow,
    width: 1180,
    height: 760,
    initialPos: { x: 140, y: 80 },
  },

  // ⭐ NEW AI ASSISTANT WINDOW
  aiAssistant: {
    title: "AI Assistant",
    Component: AiAssistantWindow,
    width: 820,
    height: 560,
    initialPos: { x: 260, y: 120 },
  },

  instagram: { title: "Instagram", Component: InstagramWindow, width: 980, height: 720, initialPos: { x: 200, y: 40 } },
  messages: { title: "Messages", Component: MessagesWindow, width: 820, height: 600, initialPos: { x: 260, y: 90 } },
  figma: { title: "Figma", Component: FigmaWindow, width: 1180, height: 740, initialPos: { x: 140, y: 40 } },
  designsystem: { title: "Design System", Component: DesignSystemWindow, width: 1040, height: 720, initialPos: { x: 200, y: 44 } },
  trash: { title: "Trash", Component: TrashWindow, width: 720, height: 480, initialPos: { x: 360, y: 120 } },
  achievements: { title: "Achievements", Component: AchievementsWindow, width: 900, height: 700, initialPos: { x: 240, y: 50 } },
  fundsim: { title: "Fund Simulator", Component: FundSimWindow, width: 1060, height: 760, initialPos: { x: 190, y: 36 } },
  github: { title: "GitHub", Component: GitHubWindow, width: 1080, height: 760, initialPos: { x: 170, y: 36 } },
  claude: { title: "Claude", Component: ClaudeWindow, width: 1000, height: 720, initialPos: { x: 200, y: 44 } },
  notion: { title: "Notion", Component: NotionWindow, width: 1080, height: 740, initialPos: { x: 170, y: 40 } },
  excel: { title: "Excel", Component: ExcelWindow, width: 860, height: 700, initialPos: { x: 240, y: 50 } },
  journey: { title: "Marta’s Journey", Component: JourneyWindow, width: 980, height: 600, initialPos: { x: 200, y: 60 } },
  vscode: { title: "Visual Studio Code", Component: VSCodeWindow, width: 1120, height: 720, initialPos: { x: 150, y: 40 } },
};
