import { useEffect, useMemo, useRef, useState } from "react";
import GameHost from "./GameHost";

import { COMMANDS, buildWelcomeLines, runTerminalCommand } from "./terminalCommands";
import useTerminalStyles from "./useTerminalStyles";
import renderTerminalLine from "./renderTerminalLine";
import useBlockGameScroll from "./useBlockGameScroll";
import { promptText } from "./utils";

export default function TerminalWindow({
  uiTheme = "glass",
  onOpenWindow,
  trackTerminalCommand,
  trackGameLaunch,
}) {
  const isMac = uiTheme === "macos";
  const styles = useTerminalStyles(isMac);

  // terminal state
  const [lines, setLines] = useState(() => buildWelcomeLines());
  const [input, setInput] = useState("");

  // history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draftInput, setDraftInput] = useState("");

  // games
  const [activeGame, setActiveGame] = useState(null); // "snake" | "pong" | "tetris" | null

  const scrollRef = useRef(null);

  // prevents arrow keys + space from scrolling when game is active
  useBlockGameScroll({ activeGame, scrollRef });

  function appendLines(newLines) {
    const normalized = (newLines ?? []).map((x) => x);
    setLines((prev) => [...prev, ...normalized]);
  }

  function startGame(name) {
    setActiveGame(name);
    trackGameLaunch?.();
    appendLines([{ type: "accent", text: `(launching ${name}... Esc to exit)` }, ""]);
  }

  function exitGame() {
    setActiveGame(null);
    appendLines([{ type: "accent", text: "(exited game)" }, ""]);
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

  function runCommand(cmdRaw) {
    const raw = cmdRaw ?? "";
    const cmd = raw.trim();
    if (!cmd) return;

    trackTerminalCommand?.();

    // save to history
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    setDraftInput("");

    // echo prompt
    appendLines([{ type: "prompt", text: promptText(raw) }]);

    // delegate to command engine
    runTerminalCommand({
      raw,
      cmd,
      activeGame,
      setLines,
      appendLines,
      onOpenWindow,
      startGame,
      exitGame,
    });
  }

  return (
    <div className={`h-full flex flex-col ${styles.text}`}>
      <div className={`px-4 py-3 border-b ${styles.border}`}>
        <div className="text-sm font-semibold">terminal — zsh</div>
      </div>

      <div
        ref={scrollRef}
        className={`flex-1 p-4 font-mono text-[13px] ${styles.bg} ${activeGame ? "overflow-hidden" : "overflow-auto"}`}
        tabIndex={0}
      >
        <div className={`rounded-xl border ${styles.border} ${styles.chip} p-4`}>
          {lines.map((line, i) => renderTerminalLine({ line, i, styles }))}

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
                      historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);

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