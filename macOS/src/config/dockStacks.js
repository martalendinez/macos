// src/config/dockStacks.js
// Dock "Stacks": each opens a macOS-style grid of apps above the Dock.
// ✏️ Reorder or move apps between stacks here. `app` = an id from config/apps.js,
// `category` = the Extras & Fun section the "Open in Extras" link jumps to.
// The three work stacks tell one story: Design decides, Code builds, Finance ships to users.
// "This Mac" holds the apps that are about this OS itself.
// ✏️ `tagline` is the one-liner under the stack name in its popover.

export const DOCK_STACKS = [
  {
    id: "design",
    tagline: "Where the decisions get made",
    label: "Design",
    iconKey: "stackDesign",
    category: "design",
    items: [{ app: "figma" }, { app: "notion" }],
  },
  {
    id: "code",
    tagline: "Where it gets built",
    label: "Code",
    iconKey: "stackCode",
    category: "code",
    items: [{ app: "vscode" }, { app: "claude" }, { app: "github" }],
  },
  {
    id: "finance",
    tagline: "Where it meets real money",
    label: "Finance",
    iconKey: "stackFinance",
    category: "fintech",
    items: [{ app: "excel" }, { app: "fundsim" }],
  },
  {
    id: "mac",
    tagline: "All about this OS",
    label: "This Mac",
    iconKey: "stackMac",
    category: "mac",
    items: [{ app: "designsystem" }, { app: "accessibility" }, { app: "terminal" }, { app: "achievements" }],
  },
  {
    id: "play",
    tagline: "The non-work me",
    label: "Play & Me",
    iconKey: "stackPlay",
    category: "me",
    items: [
      { app: "instagram" },
      { app: "messages" },
      { app: "music" },
      { app: "map" },
    ],
  },
];
