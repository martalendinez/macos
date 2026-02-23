// src/components/windows/terminal/TerminalWindow.jsx
import { useMemo, useRef, useState } from "react";
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

  const [lines, setLines] = useState(() => buildWelcomeLines());
  const [input, setInput] = useState("");

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draftInput, setDraftInput] = useState("");

  const [activeGame, setActiveGame] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

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
    window.setTimeout(() => inputRef.current?.focus(), 0);
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

    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    setDraftInput("");

    // echo prompt like a real terminal does
    appendLines([{ type: "prompt", text: promptText(raw) }]);

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

  // Real macOS terminal “paper”
  const chrome = useMemo(() => {
    return {
      bg: "bg-[#fbfbfb]",
      border: "border-black/10",
      text: "text-black",
      // optional subtle inner shadow like terminal window
      inset: "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
    };
  }, []);

  return (
    <div className={`h-full flex flex-col ${chrome.bg} ${chrome.text}`}>
      {/* optional header line (you can remove if you want it even more authentic) */}
      <div className={`px-4 py-2 border-b ${chrome.border}`}>
        <div className="text-[13px] font-semibold">terminal — zsh</div>
      </div>

      {/* terminal canvas */}
      <div
        ref={scrollRef}
        className={[
          "flex-1 overflow-auto",
          "px-4 py-3",
          "font-mono text-[14px] leading-[1.45]",
          chrome.inset,
          activeGame ? "overflow-hidden" : "overflow-auto",
        ].join(" ")}
        tabIndex={0}
        onMouseDown={() => {
          if (!activeGame) inputRef.current?.focus();
        }}
      >
        {lines.map((line, i) => renderTerminalLine({ line, i, styles }))}

        {activeGame ? (
          <div className="mt-3">
            <div className={`text-[12px] ${styles.dim}`}>
              Game controls are active. Press{" "}
              <span className="font-semibold" style={{ color: "hsl(var(--accent))" }}>
                Esc
              </span>{" "}
              to exit.
            </div>
            <div className="mt-2">
              <GameHost game={activeGame} uiTheme={uiTheme} onExit={exitGame} />
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            {/* prompt (accent colored like mac terminal themes) */}
            <span className="select-none whitespace-nowrap" style={{ color: "hsl(var(--accent))" }}>
              marta@portfolio ~ %
            </span>

            <input
              ref={inputRef}
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
                  window.setTimeout(() => {
                    const el = scrollRef.current;
                    if (el) el.scrollTop = el.scrollHeight;
                  }, 0);
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
              className="flex-1 bg-transparent outline-none border-none text-black"
              placeholder="" // real terminal has no placeholder
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />

            {/* caret: thin line (macOS-ish) */}
            <span
              aria-hidden
              className="w-[1px] h-[1.1em]"
              style={{
                background: "rgba(0,0,0,0.7)",
                animation: "termBlink 1s steps(1) infinite",
              }}
            />
          </div>
        )}

        <style>{`
          @keyframes termBlink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}