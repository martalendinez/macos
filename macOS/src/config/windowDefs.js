// src/config/windowDefs.js
import { lazy } from "react";


const SettingsWindow = lazy(() => import("../components/windows/Settings/SettingsWindow"));
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
const PhotoBoothWindow = lazy(() => import("../components/windows/PhotoBooth/PhotoBoothWindow"));
const NotesWindow = lazy(() => import("../components/windows/Notes/NotesWindow"));
const WeatherWindow = lazy(() => import("../components/windows/Weather/WeatherWindow"));
const StickiesWindow = lazy(() => import("../components/windows/Stickies/StickiesWindow"));
const CalculatorWindow = lazy(() => import("../components/windows/Calculator/CalculatorWindow"));
const PaintWindow = lazy(() => import("../components/windows/Paint/PaintWindow"));

// ⭐ NEW AI ASSISTANT
const AiAssistantWindow = lazy(() =>
  import("../components/windows/AiAssistant/AiAssistantWindow")
);

export const WINDOW_DEFS = {
  settings: {
    title: "Settings",
    Component: SettingsWindow,
    width: 880,
    height: 560,
    initialPos: { x: 220, y: 90 },
  },

  about: {
    title: "About me",
    Component: AboutWindow,
    width: 760,
    height: 520,
    initialPos: { x: 260, y: 120 },
  },

  portfolioInfo: {
    title: "About this portfolio",
    Component: PortfolioInfoWindow,
    width: 760,
    height: 560,
    initialPos: { x: 250, y: 110 },
  },

  recruiter: {
    title: "Recruiter Mode",
    Component: RecruiterModeWindow,
    width: 820,
    height: 560,
    initialPos: { x: 240, y: 120 },
  },

  projects: {
    title: "Projects",
    Component: ProjectsWindow,
    width: 920,
    height: 600,
    initialPos: { x: 200, y: 110 },
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
  title: "Master Thesis — Human–AI Collaboration",
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
    width: 920,
    height: 600,
    initialPos: { x: 240, y: 120 },
  },

  music: {
    title: "Music",
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
    width: 860,
    height: 560,
    initialPos: { x: 240, y: 120 },
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
  photobooth: { title: "Photo Booth", Component: PhotoBoothWindow, width: 840, height: 640, initialPos: { x: 240, y: 60 } },
  notes: { title: "Notes", Component: NotesWindow, width: 880, height: 580, initialPos: { x: 230, y: 90 } },
  weather: { title: "Weather", Component: WeatherWindow, width: 920, height: 660, initialPos: { x: 210, y: 50 } },
  stickies: { title: "Stickies", Component: StickiesWindow, width: 780, height: 560, initialPos: { x: 280, y: 100 } },
  calculator: { title: "Calculator", Component: CalculatorWindow, width: 240, height: 412, initialPos: { x: 620, y: 140 }, resizable: false },
  paint: { title: "Paint", Component: PaintWindow, width: 920, height: 640, initialPos: { x: 200, y: 60 } },
};
