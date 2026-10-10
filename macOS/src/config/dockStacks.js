// src/config/dockStacks.js
// Dock "Stacks": each opens a macOS-style grid of apps above the Dock.
// ✏️ Reorder or move apps between stacks here. `app` = an id from config/apps.js,
// `game` = a Terminal arcade game key (see Fun/data/funApps.js GAMES).
// `category` = the Extras & Fun section the "Open in Extras" link jumps to.

export const DOCK_STACKS = [
  {
    id: "finance",
    label: "Finance",
    iconKey: "stackFinance",
    category: "fintech",
    items: [{ app: "fundquest" }, { app: "fundsim" }],
  },
  {
    id: "design",
    label: "Design & Build",
    iconKey: "stackDesign",
    category: "design",
    items: [{ app: "figma" }, { app: "designsystem" }, { app: "activitymonitor" }, { app: "terminal" }],
  },
  {
    id: "world",
    label: "My World",
    iconKey: "stackWorld",
    category: "me",
    items: [{ app: "instagram" }, { app: "messages" }, { app: "music" }, { app: "map" }, { app: "notes" }, { app: "facetime" }],
  },
  {
    id: "play",
    label: "Games & Play",
    iconKey: "stackPlay",
    category: "games",
    items: [
      { game: "snake" },
      { game: "tetris" },
      { game: "2048" },
      { game: "pong" },
      { game: "breakout" },
      { game: "flappy" },
      { app: "photobooth" },
      { app: "paint" },
      { app: "achievements" },
    ],
  },
];
