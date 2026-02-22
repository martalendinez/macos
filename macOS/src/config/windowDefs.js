// src/config/windowDefs.js
import SettingsWindow from "../components/windows/Settings/SettingsWindow";
import AboutWindow from "../components/windows/About/AboutWindow";
import ProjectsWindow from "../components/windows/Projects/ProjectsWindow";
import VideosWindow from "../components/windows/VideosWindow";

import FunWindow from "../components/windows/Fun/FunWindow";
import MusicWindow from "../components/windows/Music/MusicWindow";
import MapWindow from "../components/windows/Map/MapWindow";
import TerminalWindow from "../components/windows/terminal/TerminalWindow";

import EmployerBrandingCaseStudyWindow from "../components/windows/Projects/EmployerBrandingCaseStudyWIndow";
import StardewNotionCaseStudyWindow from "../components/windows/Projects/StardewNotionCaseStudyWindow";

// ✅ Secret Projects overview vault
import SecretProjectsWindow from "../components/windows/Projects/SecretProjectsWindow";

// ✅ individual secret project window(s)
import BehindTheButtonWindow from "../components/windows/Projects/BehindTheButtonWindow";

// ✅ NEW: About this portfolio window (lives inside Settings/components, as requested)
import PortfolioInfoWindow from "../components/windows/Settings/components/PortfolioInfoWindow";

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

  // ✅ NEW WINDOW DEF
  portfolioInfo: {
    title: "About this portfolio",
    Component: PortfolioInfoWindow,
    width: 760,
    height: 560,
    initialPos: { x: 250, y: 110 },
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
    width: 760,
    height: 520,
    initialPos: { x: 260, y: 130 },
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