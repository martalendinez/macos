// src/components/windows/TerminalWindow.jsx
import { useMemo, useState } from "react";

export default function TerminalWindow({ uiTheme = "glass", onOpenWindow }) {
  const isMac = uiTheme === "macos";

  // Single source of truth for commands (so help + autocomplete stay in sync)
  const COMMANDS = useMemo(
    () => ({
      help: "Show available commands",
      ls: "List sections",
      whoami: "About Marta",
      skills: "Show skill summary",
      projects: "List projects",
      map: "Open map window",
      music: "Open music window",
      resume: "Download resume",
      clear: "Clear terminal",
      cowsay: "Output wisdom via code"
    }),
    []
  );

function levelToBar(level) {
  const map = {
    Basic: 2,
    Intermediate: 3,
    Proficient: 4,
    Advanced: 5,
    Expert: 6,
  };

  const filled = map[level] ?? 3;
  const total = 6;

  return "●".repeat(filled) + "○".repeat(total - filled);
}




  function buildWelcomeLines() {
    const lines = [
      "Last login: Thu Jan 22 19:30:45",
      "",
      "Available commands:",
    ];

    Object.entries(COMMANDS).forEach(([cmd, desc]) => {
      lines.push(`  ${cmd.padEnd(10)} ${desc}`);
    });

    lines.push("");
    lines.push("Tip: press Tab to autocomplete • Enter to run • Esc to clear input");
    lines.push("");
    return lines;
  }

  const [lines, setLines] = useState(buildWelcomeLines);
  const [input, setInput] = useState("");

  const styles = useMemo(() => {
    return {
      text: isMac ? "text-black/80" : "text-white/90",
      textDim: isMac ? "text-black/50" : "text-white/60",
      bg: isMac ? "bg-white" : "bg-black/30",
      border: isMac ? "border-black/10" : "border-white/10",
      chip: isMac ? "bg-black/5" : "bg-white/5",
    };
  }, [isMac]);

  function appendLines(newLines) {
    setLines((prev) => [...prev, ...newLines]);
  }

  function printHelp() {
    const out = ["Available commands:"];
    Object.entries(COMMANDS).forEach(([cmd, desc]) => {
      out.push(`  ${cmd.padEnd(10)} ${desc}`);
    });
    out.push("");
    appendLines(out);
  }

  function downloadResume() {
    const a = document.createElement("a");
    a.href = "/resume.pdf";
    a.download = "Marta_Lendinez_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function runCommand(cmdRaw) {
    const raw = cmdRaw ?? "";
    const cmd = raw.trim();
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    const promptLine = `marta@portfolio ~ % ${raw}`;

    // echo prompt line first
    appendLines([promptLine]);

    if (lower === "clear") {
      setLines([]);
      return;
    }
    if (lower === "ls") {
  appendLines([
    "Desktop:",
    "  30-seconds-mode/        (for recruiters)",
    "  projects/",
    "  videos/",
    "  ai-assistant/",
    "  extras-and-fun/",
    "",
    "System:",
    "  notification-centre/",
    "  settings/",
    "  dark-mode/",
    "",
    "Files:",
    "  resume.pdf",
    "",
  ]);
  return;
}

if (lower === "skills") {
  appendLines([
    "DESIGN TOOLS 🎨",
    `Figma            ${levelToBar("Advanced")}  Advanced`,
    `Adobe XD         ${levelToBar("Advanced")}  Advanced`,
    `Photoshop        ${levelToBar("Proficient")}  Proficient`,
    `Illustrator      ${levelToBar("Intermediate")}  Intermediate`,
    `Framer           ${levelToBar("Basic")}  Basic`,
    "",
    "DEVELOPMENT 💻",
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
    "UX RESEARCH & METHODS 🔬",
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


    if (lower === "help") {
      printHelp();
      return;
    }

    if (lower === "resume") {
      downloadResume();
      appendLines(["(downloading resume...)", ""]);
      return;
    }

    // (Optional) open windows if you want later
    if (lower === "music") {
      onOpenWindow?.("music");
      appendLines(["(opening music...)", ""]);
      return;
    }
    if (lower === "map") {
      onOpenWindow?.("map");
      appendLines(["(opening map...)", ""]);
      return;
    }
    if (lower === "projects") {
      onOpenWindow?.("projects");
      appendLines(["(opening projects...)", ""]);
      return;
    }

    // not implemented yet
    const all = Object.keys(COMMANDS);
    const suggestions = all
      .filter((c) => c.startsWith(lower) || c.includes(lower) || lower.includes(c))
      .slice(0, 5);

    appendLines([
      `command not implemented yet: ${lower}`,
      suggestions.length ? `did you mean: ${suggestions.join(", ")} ?` : `try: ${all.join(", ")}`,
      "",
    ]);
  }

  function handleTabAutocomplete() {
    const raw = input;
    const v = raw.trim().toLowerCase();
    if (!v) return;

    const all = Object.keys(COMMANDS);
    const matches = all.filter((c) => c.startsWith(v));

    if (matches.length === 1) {
      setInput(matches[0] + " "); // nice terminal feel
      return;
    }

    if (matches.length > 1) {
      // Print options like a shell would
      appendLines([`marta@portfolio ~ % ${raw}`, matches.join("   "), ""]);
      return;
    }

    // no matches
    appendLines([`(no matches for "${v}")`, ""]);
  }

  return (
    <div className={`h-full flex flex-col ${styles.text}`}>
      <div className={`px-4 py-3 border-b ${styles.border}`}>
        <div className="text-sm font-semibold">terminal — zsh</div>
      </div>

      <div className={`flex-1 overflow-auto p-4 font-mono text-[13px] ${styles.bg}`}>
        <div className={`rounded-xl border ${styles.border} ${styles.chip} p-4`}>
          {lines.map((l, i) => (
            <div key={i} className={l.startsWith("Available commands:") ? "font-semibold" : ""}>
              {l === "" ? "\u00A0" : l}
            </div>
          ))}

          <div className="flex items-center gap-2 mt-2">
            <span className={styles.textDim}>marta@portfolio ~ %</span>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  runCommand(input);
                  setInput("");
                }

                if (e.key === "Tab") {
                  e.preventDefault();
                  handleTabAutocomplete();
                }

                if (e.key === "Escape") {
                  e.preventDefault();
                  setInput("");
                }
              }}
              className={`flex-1 bg-transparent outline-none ${styles.text}`}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </div>

        
      </div>
    </div>
  );
}
