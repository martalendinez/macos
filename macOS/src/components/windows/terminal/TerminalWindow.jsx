// src/components/windows/terminal/TerminalWindow.jsx
// macOS Terminal.app look-alike: tab bar, profiles, inline prompt with block cursor,
// virtual file system, history, Tab completion, Ctrl shortcuts and full-screen games.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameHost from "./GameHost";
import { HOME, buildFS, prettyPath } from "./fs";
import { complete, runCommand } from "./terminalCommands";
import { consumePendingGame, onTerminalGameRequest } from "./terminalBus";
import { GameActiveContext } from "./games/kit";
import useLocalState from "../../../hooks/useLocalState";

const FONT = '"SF Mono", ui-monospace, Menlo, Monaco, "Cascadia Mono", monospace';

const PALETTE = {
  green: "#32d74b",
  blue: "#64d2ff",
  cyan: "#5ac8fa",
  yellow: "#ffd60a",
  orange: "#ff9f0a",
  red: "#ff6961",
  magenta: "#da8fff",
  white: "#f5f5f7",
};

function profileStyle(profile, appearance) {
  switch (profile) {
    case "homebrew":
      return { bg: "#000", fg: "#28fe14", dim: "rgba(40,254,20,0.55)", cursor: "#28fe14", mono: "#28fe14", tab: "#0d0d0d", tabFg: "#28fe14" };
    case "ocean":
      return { bg: "#224fbc", fg: "#ffffff", dim: "rgba(255,255,255,0.6)", cursor: "#ffffff", tab: "#1b3f96", tabFg: "rgba(255,255,255,0.85)" };
    case "basic":
      return appearance === "dark"
        ? { bg: "#1e1e1e", fg: "#e5e5e5", dim: "rgba(255,255,255,0.45)", cursor: "#e5e5e5", tab: "#2a2a2a", tabFg: "rgba(255,255,255,0.75)" }
        : { bg: "#ffffff", fg: "#1d1d1f", dim: "rgba(0,0,0,0.45)", cursor: "#1d1d1f", tab: "#ececec", tabFg: "rgba(0,0,0,0.7)", light: true };
    case "pro":
    default:
      return { bg: "rgba(18,18,20,0.97)", fg: "#f2f2f2", dim: "rgba(255,255,255,0.45)", cursor: "#c7c7c7", tab: "#262628", tabFg: "rgba(255,255,255,0.7)" };
  }
}

function colorFor(name, style) {
  if (!name) return undefined;
  if (style.mono) return name === "dim" ? style.dim : style.mono; // Homebrew: everything green
  if (name === "dim") return style.dim;
  const c = PALETTE[name];
  if (style.light && (name === "yellow" || name === "white")) return name === "yellow" ? "#b8860b" : "#1d1d1f";
  if (style.light && name === "green") return "#1a8f2e";
  if (style.light && (name === "blue" || name === "cyan")) return "#0a5fd1";
  return c;
}

function Line({ l, style }) {
  if (typeof l === "string") return <div className="whitespace-pre-wrap break-words min-h-[1.4em]">{l}</div>;
  return (
    <div className="whitespace-pre-wrap break-words min-h-[1.4em]">
      {l.segs.map((s, i) => (
        <span key={i} style={{ color: colorFor(s.c, style), fontWeight: s.b ? 700 : undefined }}>
          {s.t}
        </span>
      ))}
    </div>
  );
}

function Prompt({ cwd, style }) {
  return (
    <>
      <span style={{ color: colorFor("green", style), fontWeight: 700 }}>marta@portfolio</span>{" "}
      <span style={{ color: colorFor("blue", style), fontWeight: 700 }}>{prettyPath(cwd)}</span>
      <span> % </span>
    </>
  );
}

function welcome() {
  const d = new Date(Date.now() - 1000 * 60 * 47);
  const stamp = d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).replace(",", "");
  return [
    `Last login: ${stamp} on ttys000`,
    { segs: [{ t: "Welcome to MartaOS 2.0 ✨ ", b: true }, { t: "type ", c: "dim" }, { t: "help", c: "green" }, { t: " for commands, ", c: "dim" }, { t: "neofetch", c: "green" }, { t: " to show off, or ", c: "dim" }, { t: "games", c: "green" }, { t: " to play.", c: "dim" }] },
    "",
  ];
}

/** One shell session (one tab). Stays mounted while hidden so its history, folder and game survive. */
function TerminalSession({ theme = "light", onOpenWindow, trackTerminalCommand, trackGameLaunch, active, takesPending, profile, setProfile, onTitle }) {
  const fs = useMemo(() => buildFS(), []);
  const [lines, setLines] = useState(welcome);
  const [cwd, setCwd] = useState(HOME);
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0);
  const [history, setHistory] = useState([]);
  const [hIndex, setHIndex] = useState(-1);
  const [game, setGame] = useState(null);
  const [ended, setEnded] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const style = profileStyle(profile, theme);

  const print = useCallback((...ls) => setLines((prev) => [...prev, ...ls]), []);

  const startGame = useCallback(
    (name) => {
      if (name !== "matrix") trackGameLaunch?.();
      setGame(name);
    },
    [trackGameLaunch]
  );

  const exitGame = useCallback(() => {
    setGame((g) => {
      if (g) setLines((prev) => [...prev, { segs: [{ t: `[Process completed: ${g}]`, c: "dim" }] }, ""]);
      return null;
    });
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // games requested from other windows (Extras & Fun) go to the active tab
  useEffect(() => {
    if (takesPending) {
      const queued = consumePendingGame();
      if (queued) startGame(queued);
    }
    return onTerminalGameRequest((name) => activeRef.current && startGame(name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGame]);

  // tab title follows the running process, like Terminal.app
  useEffect(() => {
    onTitle?.(game ?? "-zsh");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, input]);

  useEffect(() => {
    if (!game && active) {
      inputRef.current?.focus();
      setFocused(document.activeElement === inputRef.current);
    }
  }, [game, active]);

  function submit() {
    const raw = input;
    print({ segs: [{ t: "marta@portfolio", c: "green", b: true }, { t: " " }, { t: prettyPath(cwd), c: "blue", b: true }, { t: ` % ${raw}` }] });
    setInput("");
    setCaret(0);
    setHIndex(-1);
    if (!raw.trim()) return;
    trackTerminalCommand?.();
    const nextHistory = [...history, raw];
    setHistory(nextHistory);
    runCommand(raw, {
      fs,
      cwd,
      setCwd,
      print,
      history: nextHistory,
      profile,
      setProfile,
      appearance: theme,
      openWindow: (id) => onOpenWindow?.(id),
      startGame,
      clear: () => setLines([]),
      exit: () => {
        print("", { segs: [{ t: "Saving session…", c: "dim" }] }, { segs: [{ t: "…completed.", c: "dim" }] }, "", { segs: [{ t: "[Process completed] — press any key to start a new session", c: "dim" }] });
        setEnded(true);
      },
    });
  }

  function onKeyDown(e) {
    if (ended) {
      e.preventDefault();
      setEnded(false);
      setLines(welcome());
      setCwd(HOME);
      return;
    }
    const k = e.key;
    if (e.ctrlKey && k.toLowerCase() === "l") {
      e.preventDefault();
      return setLines([]);
    }
    if (e.ctrlKey && k.toLowerCase() === "c") {
      e.preventDefault();
      print({ segs: [{ t: "marta@portfolio", c: "green", b: true }, { t: " " }, { t: prettyPath(cwd), c: "blue", b: true }, { t: ` % ${input}` }, { t: "^C", c: "dim" }] });
      setInput("");
      setCaret(0);
      return;
    }
    if (e.ctrlKey && k.toLowerCase() === "u") {
      e.preventDefault();
      setInput("");
      setCaret(0);
      return;
    }
    if (k === "Enter") {
      e.preventDefault();
      return submit();
    }
    if (k === "Tab") {
      e.preventDefault();
      const res = complete(input, { fs, cwd });
      if (res.value != null) {
        setInput(res.value);
        setCaret(res.value.length);
      } else if (res.options?.length) {
        print({ segs: [{ t: "marta@portfolio", c: "green", b: true }, { t: " " }, { t: prettyPath(cwd), c: "blue", b: true }, { t: ` % ${input}` }] }, res.options.join("    "));
      }
      return;
    }
    if (k === "ArrowUp" || k === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      let i = hIndex;
      if (k === "ArrowUp") i = i === -1 ? history.length - 1 : Math.max(0, i - 1);
      else i = i === -1 ? -1 : i + 1 >= history.length ? -1 : i + 1;
      setHIndex(i);
      const v = i === -1 ? "" : history[i];
      setInput(v);
      setCaret(v.length);
    }
  }

  const syncCaret = () => setCaret(inputRef.current?.selectionStart ?? input.length);

  const before = input.slice(0, caret);
  // non-breaking space: a trailing normal space has no width in pre-wrap, which hid the cursor
  const atCursor = (input.slice(caret, caret + 1) || "\u00A0").replace(" ", "\u00A0");
  const after = input.slice(caret + 1);

  return (
      <div className="absolute inset-0" style={{ background: style.bg, color: style.fg, visibility: active ? "visible" : "hidden" }}>
        {game ? (
          <GameActiveContext.Provider value={active}>
            <GameHost game={game} onExit={exitGame} />
          </GameActiveContext.Provider>
        ) : (
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto px-3 py-2 text-[13.5px] leading-[1.45] cursor-text"
            onMouseUp={() => {
              if (!window.getSelection()?.toString()) inputRef.current?.focus();
            }}
          >
            {lines.map((l, i) => (
              <Line key={i} l={l} style={style} />
            ))}

            {!ended && (
              <div className="whitespace-pre-wrap break-all">
                <Prompt cwd={cwd} style={style} />
                <span>{before}</span>
                <span
                  style={
                    focused
                      ? { "--cur": style.cursor, "--curfg": style.bg, animation: "termBlink 1.1s steps(1) infinite" }
                      : { outline: `1px solid ${style.cursor}`, outlineOffset: -1 }
                  }
                >
                  {atCursor}
                </span>
                <span>{after}</span>
              </div>
            )}

            {/* real input, visually hidden: the visible line above mirrors it */}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setCaret(e.target.selectionStart ?? e.target.value.length);
                setHIndex(-1);
              }}
              onKeyDown={onKeyDown}
              onKeyUp={syncCaret}
              onClick={syncCaret}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="absolute left-0 bottom-0 opacity-0 pointer-events-none w-px h-px text-[16px]"
              aria-label="Terminal input"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>
  );
}

let tabSeq = 0;
const newTab = () => ({ id: ++tabSeq });

/** Terminal.app window: tab bar + one session per tab. */
export default function TerminalWindow(props) {
  const { theme = "light" } = props;
  const [tabs, setTabs] = useState(() => [newTab()]);
  const [activeId, setActiveId] = useState(() => tabs[0].id);
  const [titles, setTitles] = useState({});
  const [profile, setProfile] = useLocalState("portfolio.terminal.profile", "pro");
  const [size, setSize] = useState({ cols: 80, rows: 24 });
  const paneRef = useRef(null);
  const firstId = useRef(tabs[0].id);
  const style = profileStyle(profile, theme);

  // window size in character cells, shown in the tab like Terminal.app
  useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ cols: Math.floor((e.contentRect.width - 24) / 8.4), rows: Math.floor((e.contentRect.height - 16) / 19.6) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function addTab() {
    const t = newTab();
    setTabs((ts) => [...ts, t]);
    setActiveId(t.id);
  }

  function closeTab(id) {
    setTabs((ts) => {
      if (ts.length === 1) return ts;
      const i = ts.findIndex((t) => t.id === id);
      const next = ts.filter((t) => t.id !== id);
      if (id === activeId) setActiveId(next[Math.max(0, i - 1)].id);
      return next;
    });
  }

  const single = tabs.length === 1;
  const label = (id) => {
    const title = titles[id] ?? "-zsh";
    return single ? `marta — ${title} — ${size.cols}×${size.rows}` : `${title} — ${size.cols}×${size.rows}`;
  };

  return (
    <div className="no-darkwin h-full flex flex-col" style={{ fontFamily: FONT }}>
      {/* Tab bar, like Terminal.app */}
      <div className="h-[30px] shrink-0 flex items-end px-2 gap-1 border-b border-black/30" style={{ background: style.tab, fontFamily: "-apple-system, Inter, sans-serif" }}>
        <div className="flex-1 min-w-0 flex items-end gap-1">
          {tabs.map((t) => {
            const isActive = t.id === activeId;
            return (
              <div
                key={t.id}
                role="tab"
                aria-selected={isActive}
                onMouseDown={() => setActiveId(t.id)}
                className={`group relative h-[26px] px-7 rounded-t-[6px] flex items-center justify-center text-[11px] font-medium cursor-default transition-colors ${
                  single ? "min-w-[220px]" : "flex-1 min-w-0 max-w-[260px]"
                }`}
                style={{
                  background: isActive ? style.bg : "transparent",
                  color: style.tabFg,
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {!single && (
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => closeTab(t.id)}
                    className="absolute left-2 w-4 h-4 rounded-[4px] flex items-center justify-center text-[11px] opacity-0 group-hover:opacity-100 hover:bg-white/15"
                    aria-label="Close tab"
                    title="Close tab"
                  >
                    ×
                  </button>
                )}
                <span className="truncate">{label(t.id)}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={addTab}
          className="h-[26px] w-7 shrink-0 mb-0 rounded-[5px] flex items-center justify-center text-[15px] opacity-70 hover:opacity-100 hover:bg-white/10 transition"
          style={{ color: style.tabFg }}
          aria-label="New tab"
          title="New tab"
        >
          +
        </button>
      </div>

      <div ref={paneRef} className="relative flex-1 min-h-0" style={{ background: style.bg }}>
        {tabs.map((t) => (
          <TerminalSession
            key={t.id}
            {...props}
            active={t.id === activeId}
            takesPending={t.id === firstId.current}
            profile={profile}
            setProfile={setProfile}
            onTitle={(title) => setTitles((m) => (m[t.id] === title ? m : { ...m, [t.id]: title }))}
          />
        ))}
      </div>

      <style>{`@keyframes termBlink { 0%, 55% { background: var(--cur); color: var(--curfg) } 56%, 100% { background: transparent; color: inherit } }`}</style>
    </div>
  );
}
