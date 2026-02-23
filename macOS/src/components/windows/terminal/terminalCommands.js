// src/components/windows/terminal/terminalCommands.js
import { levelToBar, promptText, downloadResume } from "./utils";

export const COMMANDS = {
  help: "Show available commands",
  ls: "List sections",
  whoami: "About Marta",
  skills: "Show skill summary",
  projects: "List projects",
  hacker: "Enter hacker mode (opens secret projects)",
  map: "Open map window",
  music: "Open music window",
  resume: "Download resume",
  clear: "Clear terminal",
  cowsay: "ASCII cow says your message",
  snake: "Play Snake (Esc to exit)",
  pong: "Play Pong (Esc to exit)",
  tetris: "Play Tetris (Esc to exit)",
  play: "Alias: play snake | play pong | play tetris",
  exit: "Exit the running game",
};

export function buildWelcomeLines() {
  const out = [
    { type: "dim", text: "Last login: Thu Jan 22 19:30:45" },
    "",
    { type: "title", text: "Available commands:" },
  ];

  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    out.push({ type: "cmd", cmd, desc });
  });

  out.push("");
  out.push({
    type: "dim",
    text: "Tip: press Tab to autocomplete • ↑/↓ for history • Enter to run • Esc to clear input",
  });
  out.push("");
  return out;
}

function printHelp(appendLines) {
  const out = [{ type: "title", text: "Available commands:" }];
  Object.entries(COMMANDS).forEach(([cmd, desc]) => out.push({ type: "cmd", cmd, desc }));
  out.push("");
  appendLines(out);
}

export function runTerminalCommand({
  raw,
  cmd,
  activeGame,
  setLines,
  appendLines,
  onOpenWindow,
  startGame,
  exitGame,
}) {
  const lower = cmd.toLowerCase();

  // clear
  if (lower === "clear") {
    setLines([]);
    return;
  }

  // help
  if (lower === "help") {
    printHelp(appendLines);
    return;
  }

  // resume
  if (lower === "resume") {
    downloadResume();
    appendLines([{ type: "dim", text: "(downloading resume...)" }, ""]);
    return;
  }

  // game control
  if (activeGame && lower === "exit") {
    exitGame();
    return;
  }

  if (lower === "snake" || lower === "pong" || lower === "tetris") {
    startGame(lower);
    return;
  }

  if (lower.startsWith("play")) {
    const target = lower.replace("play", "").trim();
    if (target === "snake" || target === "pong" || target === "tetris") {
      startGame(target);
    } else {
      appendLines([{ type: "warn", text: "usage: play snake | play pong | play tetris" }, ""]);
    }
    return;
  }

  // ls
  if (lower === "ls") {
    appendLines([
      { type: "title", text: "Desktop:" },
      "  Recruiter mode/        (for recruiters)",
      "  projects/",
      "  videos/",
      "  ai-assistant/",
      "  extras-and-fun/",
      "  ",
      { type: "title", text: "System:" },
      "  notification-centre/",
      "  settings/",
      "  dark-mode/",
      "  ",
      { type: "title", text: "Files:" },
      "  resume.pdf",
      "  ",
    ]);
    return;
  }

  // whoami
  if (lower === "whoami") {
    appendLines([
      "Hi, I’m Marta — a UX Engineer in my second year of the Interactive Media Technology master’s at KTH.",
      "",
      "I love traveling and have lived in Spain, Germany, the Netherlands, Canada, and Sweden.",
      "",
      "I’ve always been a creative kid at heart — design, art, writing, anything that let me make things.",
      "",
      "Today that curiosity shows up in how I build interfaces, explore new tools,",
      "and blend engineering with design to create experiences that feel thoughtful and alive.",
      "",
    ]);
    return;
  }

  // skills
  if (lower === "skills") {
    appendLines([
      { type: "title", text: "DESIGN TOOLS 🎨" },
      `Figma            ${levelToBar("Advanced")}  Advanced`,
      `Adobe XD         ${levelToBar("Advanced")}  Advanced`,
      `Photoshop        ${levelToBar("Proficient")}  Proficient`,
      `Illustrator      ${levelToBar("Intermediate")}  Intermediate`,
      `Framer           ${levelToBar("Basic")}  Basic`,
      "",
      { type: "title", text: "DEVELOPMENT 💻" },
      `React            ${levelToBar("Advanced")}  Advanced`,
      `TypeScript       ${levelToBar("Advanced")}  Advanced`,
      `HTML/CSS         ${levelToBar("Expert")}  Expert`,
      `JavaScript       ${levelToBar("Advanced")}  Advanced`,
      `Tailwind CSS     ${levelToBar("Proficient")}  Proficient`,
      `Python           ${levelToBar("Advanced")}  Advanced`,
      `SQL              ${levelToBar("Proficient")}  Proficient`,
      `Docker           ${levelToBar("Basic")}  Basic`,
      `Git              ${levelToBar("Advanced")}  Advanced`,
      "",
      { type: "title", text: "UX RESEARCH & METHODS 🔬" },
      `User Interviews  ${levelToBar("Expert")}  Expert`,
      `Usability Testing${levelToBar("Expert")}  Expert`,
      `Survey Design    ${levelToBar("Advanced")}  Advanced`,
      `Persona Creation ${levelToBar("Advanced")}  Advanced`,
      `Journey Mapping  ${levelToBar("Advanced")}  Advanced`,
      `A/B Testing      ${levelToBar("Advanced")}  Advanced`,
      "",
    ]);
    return;
  }

  // cowsay
  if (lower.startsWith("cowsay")) {
    const message = cmd.slice(6).trim() || "moo";

    const top = " " + "-".repeat(message.length + 2);
    const middle = `< ${message} >`;
    const bottom = " " + "-".repeat(message.length + 2);

    appendLines([
      top,
      middle,
      bottom,
      "        \\   ^__^",
      "         \\  (oo)\\_______",
      "            (__)\\       )\\/\\",
      "                ||----w |",
      "                ||     ||",
      "",
    ]);
    return;
  }

  // open windows
  if (lower === "music") {
    onOpenWindow?.("music");
    appendLines([{ type: "dim", text: "(opening music...)" }, ""]);
    return;
  }

  if (lower === "map") {
    onOpenWindow?.("map");
    appendLines([{ type: "dim", text: "(opening map...)" }, ""]);
    return;
  }

  if (lower === "projects") {
    onOpenWindow?.("projects");
    appendLines([{ type: "dim", text: "(opening projects...)" }, ""]);
    return;
  }

  // hacker mode
  if (lower === "hacker") {
    appendLines([
      { type: "accent", text: ">>> initiating hacker mode…" },
      { type: "dim", text: "decrypting portfolio vault · · ·" },
      { type: "dim", text: "auth ok ✓  channels secure ✓  access granted ✓" },
      "",
      { type: "dim", text: "(opening secret projects...)" },
      "",
    ]);
    onOpenWindow?.("secretProjects");
    return;
  }

  // fallback: suggestions
  const all = Object.keys(COMMANDS);
  const suggestions = all
    .filter((c) => c.startsWith(lower) || c.includes(lower) || lower.includes(c))
    .slice(0, 5);

  appendLines([
    { type: "error", text: `command not implemented yet: ${lower}` },
    suggestions.length
      ? { type: "dim", text: `did you mean: ${suggestions.join(", ")} ?` }
      : { type: "dim", text: `try: ${all.join(", ")}` },
    "",
  ]);
}