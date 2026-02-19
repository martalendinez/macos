// src/components/windows/TerminalWindow.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import GameHost from "./terminal/GameHost";

export default function TerminalWindow({ uiTheme = "glass", onOpenWindow }) {
  const isMac = uiTheme === "macos";

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draftInput, setDraftInput] = useState("");

  const [activeGame, setActiveGame] = useState(null); // "snake" | "pong" | "tetris" | null

  const COMMANDS = useMemo(
    () => ({
      help: "Show available commands",
      ls: "List sections",
      whoami: "About Marta",
      skills: "Show skill summary",
      projects: "List projects",
      hacker: "Enter hacker mode (opens secret projects)", // ✅ NEW
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

  const [lines, setLines] = useState(buildWelcomeLines);
  const [input, setInput] = useState("");

  const styles = useMemo(() => {
    return {
      text: isMac ? "text-black/80" : "text-white/90",
      textDim: isMac ? "text-black/50" : "text-white/60",
      bg: isMac ? "bg-white" : "bg-black/30",
      border: isMac ? "border-black/10" : "border-white/10",
      chip: isMac ? "bg-black/5" : "bg-white/5",
      panel: isMac ? "bg-black/5" : "bg-white/5",
    };
  }, [isMac]);

  const scrollRef = useRef(null);

  // Prevent arrow keys (and space) from scrolling the terminal/page while a game is active
  useEffect(() => {
    const el = scrollRef.current;
    const blockKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];

    function onKeyDownCapture(e) {
      if (!activeGame) return;
      if (blockKeys.includes(e.key)) e.preventDefault();
    }

    if (el) el.addEventListener("keydown", onKeyDownCapture, { capture: true });
    window.addEventListener("keydown", onKeyDownCapture, { capture: true });

    return () => {
      if (el) el.removeEventListener("keydown", onKeyDownCapture, { capture: true });
      window.removeEventListener("keydown", onKeyDownCapture, { capture: true });
    };
  }, [activeGame]);

  function appendLines(newLines) {
    const normalized = (newLines ?? []).map((x) => x);
    setLines((prev) => [...prev, ...normalized]);
  }

  function promptText(raw) {
    return `marta@portfolio ~ % ${raw}`;
  }

  function printHelp() {
    const out = [{ type: "title", text: "Available commands:" }];
    Object.entries(COMMANDS).forEach(([cmd, desc]) => out.push({ type: "cmd", cmd, desc }));
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

  function handleTabAutocomplete() {
    const raw = input;
    const v = raw.trim().toLowerCase();
    if (!v) return;

    const all = Object.keys(COMMANDS);
    const matches = all.filter((c) => c.startsWith(v));

    if (matches.length === 1) {
      setInput(matches[0] + " ");
      return;
    }

    if (matches.length > 1) {
      appendLines([{ type: "prompt", text: promptText(raw) }, { type: "dim", text: matches.join("   ") }, ""]);
      return;
    }

    appendLines([{ type: "warn", text: `(no matches for "${v}")` }, ""]);
  }

  function startGame(name) {
    setActiveGame(name);
    appendLines([{ type: "accent", text: `(launching ${name}... Esc to exit)` }, ""]);
  }

  function exitGame() {
    setActiveGame(null);
    appendLines([{ type: "accent", text: "(exited game)" }, ""]);
  }

  function runCommand(cmdRaw) {
    const raw = cmdRaw ?? "";
    const cmd = raw.trim();
    if (!cmd) return;

    // save to history
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    setDraftInput("");

    const lower = cmd.toLowerCase();

    appendLines([{ type: "prompt", text: promptText(raw) }]);

    if (lower === "clear") {
      setLines([]);
      return;
    }

    if (lower === "help") {
      printHelp();
      return;
    }

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

    if (lower === "ls") {
      appendLines([
        { type: "title", text: "Desktop:" },
        "  30-seconds-mode/        (for recruiters)",
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

    // ✅ NEW: hacker mode → open secret projects window
    if (lower === "hacker") {
      // a little “vibe” before opening
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

  function renderLine(line, i) {
    if (typeof line === "string") {
      return (
        <div key={i} className={line === "" ? "select-none" : ""}>
          {line === "" ? "\u00A0" : line}
        </div>
      );
    }

    const t = line?.type;

    if (t === "prompt") {
      return (
        <div key={i} className="break-words">
          <span className="select-none" style={{ color: "hsl(var(--accent))" }}>
            marta@portfolio ~ %
          </span>
          <span className="select-none"> </span>
          <span>{line.text.replace("marta@portfolio ~ % ", "")}</span>
        </div>
      );
    }

    if (t === "cmd") {
      return (
        <div key={i} className="flex gap-3">
          <span className="w-[92px]" style={{ color: "hsl(var(--accent))" }}>
            {line.cmd}
          </span>
          <span className={styles.textDim}>{line.desc}</span>
        </div>
      );
    }

    if (t === "title") return <div key={i} className="font-semibold">{line.text}</div>;

    if (t === "accent") {
      return (
        <div key={i} style={{ color: "hsl(var(--accent))" }}>
          {line.text}
        </div>
      );
    }

    if (t === "dim") return <div key={i} className={styles.textDim}>{line.text}</div>;

    if (t === "warn") {
      return (
        <div key={i} className={styles.textDim}>
          <span style={{ color: "hsl(var(--accent))" }}>⚠ </span>
          {line.text}
        </div>
      );
    }

    if (t === "error") {
      return (
        <div key={i} className={styles.textDim}>
          <span style={{ color: "hsl(var(--accent))" }}>✕ </span>
          {line.text}
        </div>
      );
    }

    return (
      <div key={i} className={styles.textDim}>
        {String(line?.text ?? "")}
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${styles.text}`}>
      <div className={`px-4 py-3 border-b ${styles.border}`}>
        <div className="text-sm font-semibold">terminal — zsh</div>
      </div>

      <div
        ref={scrollRef}
        className={`flex-1 p-4 font-mono text-[13px] ${styles.bg} ${
          activeGame ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        <div className={`rounded-xl border ${styles.border} ${styles.chip} p-4`}>
          {lines.map(renderLine)}

          {activeGame ? (
            <>
              <div className={`mt-2 text-xs ${styles.textDim}`}>
                Game controls are active. Press{" "}
                <span className="font-semibold" style={{ color: "hsl(var(--accent))" }}>
                  Esc
                </span>{" "}
                to exit.
              </div>

              <GameHost game={activeGame} uiTheme={uiTheme} onExit={exitGame} />
            </>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <span className="select-none" style={{ color: "hsl(var(--accent))" }}>
                marta@portfolio ~ %
              </span>

              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setHistoryIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (history.length === 0) return;

                    if (historyIndex === -1) setDraftInput(input);

                    const nextIndex =
                      historyIndex === -1
                        ? history.length - 1
                        : Math.max(0, historyIndex - 1);

                    setHistoryIndex(nextIndex);
                    setInput(history[nextIndex]);
                    return;
                  }

                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (history.length === 0) return;
                    if (historyIndex === -1) return;

                    const nextIndex = historyIndex + 1;

                    if (nextIndex >= history.length) {
                      setHistoryIndex(-1);
                      setInput(draftInput);
                    } else {
                      setHistoryIndex(nextIndex);
                      setInput(history[nextIndex]);
                    }
                    return;
                  }

                  if (e.key === "Enter") {
                    runCommand(input);
                    setInput("");
                    return;
                  }

                  if (e.key === "Tab") {
                    e.preventDefault();
                    handleTabAutocomplete();
                    return;
                  }

                  if (e.key === "Escape") {
                    e.preventDefault();
                    setInput("");
                    return;
                  }
                }}
                className={`flex-1 bg-transparent outline-none ${styles.text}`}
                placeholder="type a command… (Tab for autocomplete)"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
