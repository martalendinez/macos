import { useMemo, useState } from "react";

export default function TerminalWindow({ uiTheme = "glass" }) {
  const isMac = uiTheme === "macos";
  const [lines, setLines] = useState([
    "Last login: Thu Jan 22 19:30:45",
    "marta@portfolio ~ % help",
    "",
    "Available commands:",
    "  ls                 List projects and sections",
    "  whoami             About Marta",
    "  skills             Show skill bars",
    "  projects           List projects",
    "  map                Open map window (later)",
    "  music              Open music window (later)",
    "  snake / tetris / pong   Launch game (later)",
    "  resume             Download resume",
    "",
  ]);

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

  const runCommand = (cmdRaw) => {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    const next = [...lines, `marta@portfolio ~ % ${cmdRaw}`];

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "resume") {
      // same download trick you used
      const a = document.createElement("a");
      a.href = "/resume.pdf";
      a.download = "Marta_Lendinez_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      next.push("(downloading resume...)");
    } else {
      next.push(`command not implemented yet: ${cmd}`);
      next.push(`(try: help, clear, resume)`);
    }

    next.push("");
    setLines(next);
  };

  return (
    <div className={`h-full flex flex-col ${styles.text}`}>
      <div className={`px-4 py-3 border-b ${styles.border}`}>
        <div className="text-sm font-semibold">terminal — zsh</div>
      </div>

      <div className={`flex-1 overflow-auto p-4 font-mono text-[13px] ${styles.bg}`}>
        <div className={`rounded-xl border ${styles.border} ${styles.chip} p-4`}>
          {lines.map((l, i) => (
            <div key={i} className={l.startsWith("Available") ? "font-semibold" : ""}>
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
              }}
              className={`flex-1 bg-transparent outline-none ${styles.text}`}
              placeholder="type a command… (help)"
            />
          </div>
        </div>

        <div className={`${styles.textDim} text-xs mt-3`}>
          Placeholder: games will render ASCII later (snake/tetris/pong).
        </div>
      </div>
    </div>
  );
}
