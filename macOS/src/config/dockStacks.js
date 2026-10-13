// src/config/dockStacks.js
// Dock "Stacks": each opens a macOS-style grid of apps above the Dock.
// ✏️ Reorder or move apps between stacks here. `app` = an id from config/apps.js,
// `game` = a Terminal arcade game key (see Fun/data/funApps.js GAMES).
// `category` = the Extras & Fun section the "Open in Extras" link jumps to.
// The three work stacks tell one story: Design decides, Code builds, Finance ships to users.
// "This Mac" holds the apps that are about this OS itself.

export const DOCK_STACKS = [
  {
    id: "design",
    label: "Design",
    iconKey: "stackDesign",
    category: "design",
    items: [{ app: "figma" }, { app: "notion" }],
  },
  {
    id: "code",
    label: "Code",
    iconKey: "stackCode",
    category: "code",
    items: [{ app: "vscode" }, { app: "claude" }, { app: "github" }],
  },
  {
    id: "finance",
    label: "Finance",
    iconKey: "stackFinance",
    category: "fintech",
    items: [{ app: "excel" }, { app: "fundsim" }],
  },
  {
    id: "mac",
    label: "This Mac",
    iconKey: "stackMac",
    category: "mac",
    items: [{ app: "designsystem" }, { app: "accessibility" }, { app: "terminal" }, { app: "achievements" }],
  },
  {
    id: "play",
    label: "Play & Me",
    iconKey: "stackPlay",
    category: "me",
    items: [
      { app: "journey" },
      { app: "instagram" },
      { app: "messages" },
      { app: "music" },
      { app: "map" },
      { game: "snake" },
      { game: "tetris" },
    ],
  },
];
