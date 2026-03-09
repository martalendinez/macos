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

const SecretProjectsWindow = lazy(() => import("../components/windows/Projects/SecretProjectsWindow"));
const BehindTheButtonWindow = lazy(() => import("../components/windows/Projects/BehindTheButtonWindow"));

const PortfolioInfoWindow = lazy(() =>
  import("../components/windows/Settings/components/PortfolioInfoWindow")
);

const RecruiterModeWindow = lazy(() =>
  import("../components/windows/RecruiterMode/RecruiterModeWindow")
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
    width: 900,
    height: 580,
    initialPos: { x: 180, y: 110 },
  },

  map: {
    title: "Interactive Map",
    Component: MapWindow,
    width: 920,
    height: 600,
    initialPos: { x: 220, y: 110 },
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

  stardewNotionCaseStudy: {
    title: "Gamified Notion Template — Case Study",
    Component: StardewNotionCaseStudyWindow,
    width: 1180,
    height: 760,
    initialPos: { x: 140, y: 80 },
  },
};