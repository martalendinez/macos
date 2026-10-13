// src/components/windows/VSCode/VSCodeWindow.jsx
// A VS Code-style editor that opens the real source of this portfolio (bundled with Vite's ?raw imports,
// each file loaded on demand). Explorer, tabs, syntax highlighting, quick open, search and git history.
import { useEffect, useMemo, useRef, useState } from "react";
import { RECENT_COMMITS, TOTAL_COMMITS } from "../GitHub/repoActivity";
import { useWorkspace } from "../../../config/workspaceBus";
import DemoBanner from "../DemoBanner";

const FILES = import.meta.glob(["/src/**/*.{js,jsx,css}", "/index.html", "/package.json", "/vite.config.js", "/.claude/skills/**/*"], { query: "?raw", import: "default" });
const PATHS = Object.keys(FILES).sort();
const REPO_URL = "https://github.com/martalendinez/macos";

// Trace_Plugin: a copy of real files from github.com/martalendinez/Trace_Plugin (stored as .txt so this app doesn't compile them)
const WS_RAW = import.meta.glob("./workspaces/*/**/*.txt", { query: "?raw", import: "default" });
const wsFiles = (id) => Object.fromEntries(Object.entries(WS_RAW).filter(([k]) => k.startsWith(`./workspaces/${id}/`)).map(([k, v]) => [k.replace(`./workspaces/${id}`, "").replace(/\.txt$/, ""), v]));
const TRACE_FILES = wsFiles("trace");
const SAL_FILES = wsFiles("sallskap");
const KAL_FILES = wsFiles("kallos");

// short notes shown above key files, and the "start here" tour on the welcome tab
const TOUR = [
  ["/src/App.jsx", "The OS itself: window manager, Dock, menu bar, widgets and the shared app API every window receives."],
  ["/src/config/windowDefs.js", "Every app is a lazy-loaded window registered here, with its default size and position."],
  ["/src/config/dockStacks.js", "The Dock stacks: Design, Code, Finance and Play & Me."],
  ["/src/components/windows/MacWindow.jsx", "The window chrome: dragging, resizing, traffic lights and the container that makes apps responsive."],
  ["/src/components/windows/GitHub/GitHubWindow.jsx", "The pull request you can review and merge, with checks that run one by one."],
  ["/src/components/windows/Excel/ExcelWindow.jsx", "A fund model spreadsheet with live IRR, and the same numbers redesigned as a product."],
  ["/.claude/skills/design-critique/SKILL.md", "My Claude Skills: reusable instructions Claude loads for critique, PRs, accessibility and research."],
  ["/src/components/windows/VSCode/VSCodeWindow.jsx", "This editor. Yes, you can read its own source."],
];
const TRACE_TOUR = [
  ["/server/reflect.ts", "The prompt layer. Stage rules decide what the AI may talk about, and what it must avoid. Every request returns strict JSON."],
  ["/src/features/reflection/data/critiqueRules.ts", "The critique library: each card has a concern, a suggestion and an uncertainty note."],
  ["/src/features/reflection/types.ts", "The data model: eight design stages, options with assumptions and trade-offs."],
  ["/src/features/reflection/state/reflectionReducer.ts", "All plugin state in one reducer: steps, options, critiques and the trace log."],
  ["/src/components/steps/CritiqueStep.tsx", "The critique stage UI: lenses, cards, apply or reject."],
  ["/src/components/steps/OptionsStep.tsx", "Options with visible reasoning, and mix & match across them."],
  ["/README.md", "How the six-stage flow works and how to run it."],
];
const SAL_TOUR = [
  ["/src/utils/filtering.ts", "The matching rule: a restaurant only makes the shortlist if it covers every need in the group."],
  ["/src/context/GroupContext.tsx", "Group state shared across the flow: members, availability and dietary needs."],
  ["/src/screens/DietaryRestrictions.tsx", "Each member shares their needs privately, in a structured form."],
  ["/src/screens/Availability.tsx", "A time picker instead of a poll, so the app can compute the overlap."],
  ["/src/screens/BrowseRestaurants.tsx", "The shortlist: restaurants that already fit everyone."],
  ["/src/index.css", "Design tokens as CSS variables, which made dark mode a class swap."],
  ["/README.md", "What Sällskap does, the features and how to run it."],
];
const KAL_TOUR = [
  ["/website/auth.py", "Sign-up and login: validation rules, then encryption before anything is stored."],
  ["/website/encryption.py", "PyNaCl SecretBox helpers: encrypt, decrypt, generate a key."],
  ["/website/models.py", "The SQLAlchemy data model."],
  ["/website/init.py", "Flask app factory: config, database, migrations and login manager."],
  ["/website/template/sign_up.html", "The sign-up form, rendered with Jinja2."],
  ["/README.md", "The platform, the stack and how to run it."],
];
const WORKSPACES = {
  macos: { id: "macos", name: "macos", label: "macOS · portfolio", files: FILES, paths: PATHS, tour: TOUR, repo: REPO_URL, rootOpen: ["/src", "/src/components", "/src/config"] },
  sallskap: { id: "sallskap", name: "Sallskap", label: "Sallskap · group dining app", files: SAL_FILES, paths: Object.keys(SAL_FILES).sort(), tour: SAL_TOUR, repo: "https://github.com/martalendinez/Sallskap", caseStudy: "groupDiningCaseStudy", project: "Sällskap", intro: "The real code of Sällskap: React, TypeScript, Tailwind and Supabase, scaffolded with Lovable and shaped by hand.", how: ["Research first: private dietary needs came from interviews", "A strict matching rule people can predict", "Design tokens before screens", "Built screen by screen, reviewed at every step"], rootOpen: ["/src", "/src/screens", "/src/utils"] },
  kallos: { id: "kallos", name: "Kallos", label: "Kallos · employer branding", files: KAL_FILES, paths: Object.keys(KAL_FILES).sort(), tour: KAL_TOUR, repo: "https://github.com/martalendinez/Kallos", caseStudy: "employerBrandingCaseStudy", project: "Kallos", intro: "The public Kallos repo: the Flask foundation with secure sign-up, validation and PyNaCl encryption.", how: ["Privacy by design: encryption before storage", "Server-side validation with clear messages", "A small, modular Flask app ready to grow", "Local LLM, so HR data never leaves our environment"], rootOpen: ["/website"] },
  trace: { id: "trace", name: "Trace_Plugin", project: "Trace", intro: "The real code of my master thesis prototype: React + TypeScript, an Express API, and Llama 3.3 on Groq.", how: ["Research first: every prompt rule traces back to an interview insight", "Strict JSON from the model, normalised on the server", "One reducer for all plugin state", "Prompts reviewed like UI: red-teamed before testing"], label: "Trace_Plugin · thesis prototype", files: TRACE_FILES, paths: Object.keys(TRACE_FILES).sort(), tour: TRACE_TOUR, repo: "https://github.com/martalendinez/Trace_Plugin", caseStudy: "thesisCaseStudy", rootOpen: ["/server", "/src", "/src/features", "/src/features/reflection"] },
};
const NOTES = Object.fromEntries([...TOUR, ...TRACE_TOUR, ...SAL_TOUR, ...KAL_TOUR, ["/.claude/skills/design-critique/SKILL.md", "One of my Claude Skills: reusable instructions Claude loads when a task matches."]]);

/* ---------- themes ---------- */
const THEMES = {
  dark: { bg: "#1f1f1f", side: "#181818", bar: "#181818", tabOn: "#1f1f1f", tabOff: "#181818", line: "#2b2b2b", text: "#cccccc", muted: "#9d9d9d", dim: "#6e7681", hover: "#2a2d2e", sel: "#37373d", accent: "#0078d4", status: "#0078d4", lineHl: "#2a2a2a", gutter: "#6e7681",
    tk: { com: "#6a9955", str: "#ce9178", kw: "#569cd6", ctl: "#c586c0", num: "#b5cea8", fn: "#dcdcaa", type: "#4ec9b0", tag: "#569cd6", attr: "#9cdcfe", punct: "#d4d4d4", prop: "#9cdcfe", css: "#d7ba7d" } },
  light: { bg: "#ffffff", side: "#f8f8f8", bar: "#f8f8f8", tabOn: "#ffffff", tabOff: "#f8f8f8", line: "#e5e5e5", text: "#3b3b3b", muted: "#616161", dim: "#8b8b8b", hover: "#f0f0f0", sel: "#e4e6f1", accent: "#005fb8", status: "#005fb8", lineHl: "#f5f5f5", gutter: "#a0a0a0",
    tk: { com: "#008000", str: "#a31515", kw: "#0000ff", ctl: "#af00db", num: "#098658", fn: "#795e26", type: "#267f99", tag: "#800000", attr: "#e50000", punct: "#3b3b3b", prop: "#001080", css: "#800000" } },
};

/* ---------- syntax highlighting (line by line, tracking block comments and template strings) ---------- */
const KW = new Set(["const", "let", "var", "function", "class", "new", "typeof", "instanceof", "in", "of", "true", "false", "null", "undefined", "this", "void", "async", "await", "extends", "static", "get", "set", "interface", "type", "enum", "implements", "readonly", "keyof", "any", "string", "number", "boolean"]);
const PY = new Set(["def", "elif", "except", "with", "pass", "None", "True", "False", "not", "and", "or", "lambda", "self", "raise", "is"]);
const CTL = new Set(["import", "export", "from", "default", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "as"]);
const TOKEN = /(\/\/.*$)|(\/\*.*?(?:\*\/|$))|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(`(?:[^`\\]|\\.)*(?:`|$))|(<\/?[A-Za-z][\w.]*)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)|(\s*\/?>)/g;

function highlightLine(line, state, tk, lang) {
  const out = [];
  let i = 0;
  // continuing a block comment or template literal from previous lines
  if (state.mode) {
    const endTok = state.mode === "com" ? "*/" : "`";
    const end = line.indexOf(endTok);
    if (end === -1) return [<span key="c" style={{ color: state.mode === "com" ? tk.com : tk.str }}>{line}</span>];
    out.push(<span key="c" style={{ color: state.mode === "com" ? tk.com : tk.str }}>{line.slice(0, end + endTok.length)}</span>);
    i = end + endTok.length;
    state.mode = null;
  }
  if (lang === "py") {
    const rest = line.slice(i);
    const hash = rest.search(/#(?=(?:[^"']|"[^"]*"|'[^']*')*$)/);
    const code = hash >= 0 ? rest.slice(0, hash) : rest;
    const out2 = highlightLine(code, { mode: null }, tk, "js").map((el, k2) =>
      typeof el === "string" ? el.split(/\b/).map((w, k3) => (PY.has(w) ? <span key={`${k2}-${k3}`} style={{ color: tk.ctl }}>{w}</span> : w)) : el
    );
    if (hash >= 0) out2.push(<span key="pyc" style={{ color: tk.com }}>{rest.slice(hash)}</span>);
    return out2;
  }
  if (lang === "md") {
    const rest = line.slice(i);
    if (rest.startsWith("```")) {
      state.fence = !state.fence;
      return [<span key="f" style={{ color: tk.com }}>{rest}</span>];
    }
    if (state.fence) return [<span key="c" style={{ color: tk.str }}>{rest}</span>];
    if (/^#{1,6} /.test(rest)) return [<span key="h" style={{ color: tk.kw, fontWeight: 700 }}>{rest}</span>];
    if (/^---$/.test(rest) || /^[a-z-]+: /.test(rest)) return [<span key="m" style={{ color: tk.prop }}>{rest}</span>];
    return rest.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, k2) =>
      part.startsWith("`") ? <span key={k2} style={{ color: tk.str }}>{part}</span> : part.startsWith("**") ? <span key={k2} style={{ fontWeight: 700 }}>{part}</span> : part
    );
  }
  if (lang === "css") {
    const rest = line.slice(i);
    const parts = rest.split(/(\/\*.*?\*\/|"[^"]*"|'[^']*'|#[0-9a-fA-F]{3,8}\b|-?\d+\.?\d*(?:px|rem|em|%|ms|s|deg|vh|vw)?|[a-z-]+(?=\s*:)|@[\w-]+)/g);
    parts.forEach((p, k) => {
      if (!p) return;
      let c;
      if (p.startsWith("/*")) c = tk.com;
      else if (/^["']/.test(p)) c = tk.str;
      else if (p.startsWith("#") || /^-?\d/.test(p)) c = tk.num;
      else if (p.startsWith("@")) c = tk.ctl;
      else if (/^[a-z-]+$/.test(p) && rest.slice(rest.indexOf(p) + p.length).trimStart().startsWith(":")) c = tk.prop;
      out.push(c ? <span key={k} style={{ color: c }}>{p}</span> : <span key={k} style={{ color: tk.css }}>{p}</span>);
    });
    if (rest.includes("/*") && !rest.includes("*/")) state.mode = "com";
    return out;
  }
  const rest = line.slice(i);
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  let k = 0;
  while ((m = TOKEN.exec(rest))) {
    if (m.index > last) out.push(rest.slice(last, m.index));
    const [s, lc, bc, str, tpl, tag, num, fn, word, close] = m;
    let c;
    if (lc) c = tk.com;
    else if (bc) {
      c = tk.com;
      if (!bc.endsWith("*/")) state.mode = "com";
    } else if (str) c = tk.str;
    else if (tpl) {
      c = tk.str;
      if (tpl.length === 1 || !tpl.endsWith("`")) state.mode = "tpl";
    } else if (tag) c = /^<\/?[A-Z]/.test(tag) ? tk.type : tk.tag;
    else if (num) c = tk.num;
    else if (fn) c = CTL.has(fn) ? tk.ctl : KW.has(fn) ? tk.kw : tk.fn;
    else if (word) {
      const after = rest.slice(m.index + word.length);
      c = CTL.has(word) ? tk.ctl : KW.has(word) ? tk.kw : /^[A-Z]/.test(word) ? tk.type : /^=(?!=)/.test(after) && /<[A-Za-z]/.test(rest) ? tk.attr : /^\s*:/.test(after) ? tk.prop : null;
    } else if (close) c = tk.tag;
    out.push(c ? <span key={k++} style={{ color: c }}>{s}</span> : s);
    last = m.index + s.length;
  }
  if (last < rest.length) out.push(rest.slice(last));
  return out;
}

const langOf = (p) => {
  const ext = p.split(".").pop();
  return { css: "css", json: "json", html: "html", jsx: "jsx", tsx: "tsx", ts: "ts", md: "md", mjs: "js", py: "py" }[ext] || "js";
};
const LANG_NAME = { py: "Python", css: "CSS", json: "JSON", html: "HTML", jsx: "JavaScript JSX", js: "JavaScript", ts: "TypeScript", tsx: "TypeScript JSX", md: "Markdown" };
const base = (p) => p.split("/").pop();

/* ---------- icons ---------- */
function FileIcon({ path }) {
  const l = langOf(path);
  if (l === "jsx")
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="#61dafb" strokeWidth="1.4" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.6" fill="#61dafb" />
      </svg>
    );
  if (l === "tsx")
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="#3178c6" strokeWidth="1.4" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.6" fill="#3178c6" />
      </svg>
    );
  const map = { py: ["PY", "#3572A5"], js: ["JS", "#e8d44d"], ts: ["TS", "#3178c6"], css: ["#", "#42a5f5"], json: ["{}", "#cbcb41"], html: ["<>", "#e44d26"], md: ["M↓", "#519aba"] };
  const [t, col] = map[l];
  return <span className="w-4 shrink-0 text-center text-[10px] font-bold leading-none" style={{ color: col }}>{t}</span>;
}
const ACT = {
  files: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  git: "M6 3v12M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9c0 6-12 3-12 8",
};
const Act = ({ n }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={ACT[n]} />
  </svg>
);

/* ---------- tree ---------- */
function buildTree(paths) {
  const root = { name: "root", children: {}, path: "" };
  paths.forEach((p) => {
    const parts = p.slice(1).split("/");
    let node = root;
    parts.forEach((part, i) => {
      const leaf = i === parts.length - 1;
      node.children[part] = node.children[part] || { name: part, children: leaf ? null : {}, path: `${node.path}/${part}` };
      node = node.children[part];
    });
  });
  return root;
}
function TreeNode({ node, depth, open, toggle, active, openFile, c }) {
  const entries = Object.values(node.children).sort((a, b) => (!!b.children - !!a.children) || a.name.localeCompare(b.name));
  return entries.map((n) => {
    const isDir = !!n.children;
    const isOpen = open.has(n.path);
    return (
      <div key={n.path}>
        <button
          type="button"
          onClick={() => (isDir ? toggle(n.path) : openFile(n.path))}
          className="w-full flex items-center gap-1 h-[22px] pr-2 text-left text-[13px] truncate"
          style={{ paddingLeft: 8 + depth * 12, background: active === n.path ? c.sel : undefined, color: c.text }}
          onMouseEnter={(e) => active !== n.path && (e.currentTarget.style.background = c.hover)}
          onMouseLeave={(e) => active !== n.path && (e.currentTarget.style.background = "")}
        >
          {isDir ? (
            <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 transition-transform" style={{ color: c.muted, transform: isOpen ? "rotate(90deg)" : "none" }} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 4l4 4-4 4" />
            </svg>
          ) : (
            <FileIcon path={n.path} />
          )}
          <span className="truncate">{n.name}</span>
        </button>
        {isDir && isOpen && <TreeNode node={n} depth={depth + 1} open={open} toggle={toggle} active={active} openFile={openFile} c={c} />}
      </div>
    );
  });
}

/* ---------- editor ---------- */
function Editor({ path, src, c, onCursor, cursor }) {
  const lang = langOf(path);
  const lines = useMemo(() => {
    const state = { mode: null };
    return src.replace(/\n$/, "").split("\n").map((l) => highlightLine(l, state, c.tk, lang));
  }, [src, c, lang]);
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [path]);
  const gutterW = String(lines.length).length * 8 + 28;
  return (
    <div ref={ref} className="flex-1 min-h-0 overflow-auto font-mono text-[12.5px] leading-[19px]" style={{ background: c.bg, fontFamily: 'Menlo, "SF Mono", Consolas, monospace' }}>
      {NOTES[path] && (
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-1.5 text-[11.5px]" style={{ background: c.bg, borderBottom: `1px solid ${c.line}`, color: c.muted, fontFamily: "-apple-system, sans-serif" }}>
          <span style={{ color: c.accent }}>ⓘ</span> {NOTES[path]}
        </div>
      )}
      <div className="py-1 min-w-max">
        {lines.map((l, i) => (
          <div key={i} onClick={() => onCursor(i + 1)} className="flex whitespace-pre" style={{ background: cursor === i + 1 ? c.lineHl : undefined }}>
            <span className="select-none text-right pr-5 shrink-0 sticky left-0" style={{ width: gutterW, color: cursor === i + 1 ? c.text : c.gutter, background: cursor === i + 1 ? c.lineHl : c.bg }}>{i + 1}</span>
            <span style={{ color: c.tk.punct }}>{l.length ? l : " "}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Welcome({ c, openFile, ws, onOpenWindow }) {
  if (ws.id !== "macos") return <TraceWelcome c={c} openFile={openFile} ws={ws} onOpenWindow={onOpenWindow} />;
  return (
    <div className="flex-1 overflow-auto px-8 py-10" style={{ background: c.bg, color: c.text }}>
      <div className="max-w-[640px]">
        <div className="text-[28px] font-light">Welcome</div>
        <div className="text-[15px] mt-1" style={{ color: c.muted }}>This is the real source code of the portfolio you’re using right now.</div>
        <div className="mt-6 grid grid-cols-1 @2xl:grid-cols-2 gap-6 text-[13px]">
          <div>
            <div className="text-[15px] mb-2">Start here</div>
            {TOUR.map(([p, note]) => (
              <button key={p} type="button" onClick={() => openFile(p)} className="block w-full text-left py-1.5 group">
                <span className="flex items-center gap-1.5 group-hover:underline" style={{ color: c.accent }}>
                  <FileIcon path={p} />
                  {base(p)}
                </span>
                <span className="block pl-[22px] text-[12px] leading-snug" style={{ color: c.muted }}>{note}</span>
              </button>
            ))}
          </div>
          <div>
            <div className="text-[15px] mb-2">Built with</div>
            <ul className="space-y-1" style={{ color: c.muted }}>
              {["React 18 + Vite", "Tailwind CSS v4 with container queries", "Framer Motion for every animation", "No UI kit: every app is hand-built", "Canvas 2D for the games"].map((t) => <li key={t}>· {t}</li>)}
            </ul>
            <div className="text-[15px] mt-6 mb-2">Numbers</div>
            <ul className="space-y-1" style={{ color: c.muted }}>
              <li>· {PATHS.length} source files</li>
              <li>· {TOTAL_COMMITS} commits in 2026</li>
            </ul>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-block mt-6 hover:underline" style={{ color: c.accent }}>Open the repo on GitHub →</a>
            <div className="mt-6 text-[12px]" style={{ color: c.dim }}>Tip: press ⌘P / Ctrl+P to open any file.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TraceWelcome({ c, openFile, ws, onOpenWindow }) {
  return (
    <div className="flex-1 overflow-auto px-8 py-10" style={{ background: c.bg, color: c.text }}>
      <div className="max-w-[640px]">
        <div className="text-[28px] font-light">{ws.name}</div>
        <div className="text-[15px] mt-1" style={{ color: c.muted }}>{ws.intro}</div>
        <div className="mt-6 grid grid-cols-1 @2xl:grid-cols-2 gap-6 text-[13px]">
          <div>
            <div className="text-[15px] mb-2">Start here</div>
            {ws.tour.map(([p, note]) => (
              <button key={p} type="button" onClick={() => openFile(p)} className="block w-full text-left py-1.5 group">
                <span className="flex items-center gap-1.5 group-hover:underline" style={{ color: c.accent }}>
                  <FileIcon path={p} />
                  {base(p)}
                </span>
                <span className="block pl-[22px] text-[12px] leading-snug" style={{ color: c.muted }}>{note}</span>
              </button>
            ))}
          </div>
          <div>
            <div className="text-[15px] mb-2">How I built it</div>
            <ul className="space-y-1" style={{ color: c.muted }}>
              {ws.how.map((t) => <li key={t}>· {t}</li>)}
            </ul>
            <div className="text-[15px] mt-6 mb-2">Related</div>
            <div className="space-y-1.5">
              <button type="button" onClick={() => onOpenWindow?.(ws.caseStudy)} className="block hover:underline" style={{ color: c.accent }}>← Back to the {ws.project} case study</button>
              <a href={ws.repo} target="_blank" rel="noreferrer" className="block hover:underline" style={{ color: c.accent }}>Open {ws.name} on GitHub →</a>
            </div>
            <div className="mt-6 text-[12px]" style={{ color: c.dim }}>A selection of {ws.paths.length} files from the repo.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VSCodeWindow({ onOpenWindow }) {
  const c = THEMES.dark; // always dark, like most people run it
  const [wsId, setWsId] = useState("macos");
  const ws = WORKSPACES[wsId];
  const tree = useMemo(() => buildTree(ws.paths), [ws]);
  const [panel, setPanel] = useState("files");
  const [open, setOpen] = useState(() => new Set(WORKSPACES.macos.rootOpen));
  const [wsMenu, setWsMenu] = useState(false);
  const [tabs, setTabs] = useState(["welcome"]);
  const [active, setActive] = useState("welcome");
  const [cache, setCache] = useState({});
  const [cursor, setCursor] = useState(1);
  const [quick, setQuick] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const rootRef = useRef(null);

  const key = (p, id = wsId) => `${id}:${p}`;
  const openFile = async (p, id = wsId) => {
    const W = WORKSPACES[id];
    setTabs((t) => (t.includes(p) ? t : [...t, p]));
    setActive(p);
    setCursor(1);
    setQuick(null);
    // reveal in the explorer
    setOpen((o) => {
      const n = new Set(o);
      p.split("/").slice(1, -1).reduce((acc, part) => {
        const next = `${acc}/${part}`;
        n.add(next);
        return next;
      }, "");
      return n;
    });
    if (cache[key(p, id)] == null && W.files[p]) {
      const src = await W.files[p]();
      setCache((cc) => ({ ...cc, [key(p, id)]: src }));
    }
  };
  const switchWs = (id, file) => {
    setWsMenu(false);
    setQuick(null);
    setResults(null);
    setQuery("");
    if (id !== wsId) {
      setWsId(id);
      setOpen(new Set(WORKSPACES[id].rootOpen));
      setTabs(["welcome"]);
      setActive("welcome");
    }
    if (file) {
      const p = file.startsWith("/") ? file : `/${file}`;
      if (WORKSPACES[id].files[p]) openFile(p, id);
    }
  };
  // deep links from the case studies, Claude and Figma: { project, file }
  useWorkspace("vscode", (req) => {
    const r = typeof req === "string" ? { project: req } : req;
    switchWs(WORKSPACES[r.project] ? r.project : "macos", r.file);
  });
  const closeTab = (p, e) => {
    e?.stopPropagation();
    setTabs((t) => {
      const n = t.filter((x) => x !== p);
      if (active === p) setActive(n[n.length - 1] || null);
      return n;
    });
  };
  const toggle = (p) => setOpen((o) => {
    const n = new Set(o);
    n.has(p) ? n.delete(p) : n.add(p);
    return n;
  });

  // full-text search: loads files on demand
  const runSearch = async (q) => {
    if (q.trim().length < 2) return setResults(null);
    setResults("loading");
    const all = await Promise.all(ws.paths.map(async (p) => [p, cache[key(p)] ?? (await ws.files[p]())]));
    setCache((cc) => ({ ...cc, ...Object.fromEntries(all.map(([p, v]) => [key(p), v])) }));
    const ql = q.toLowerCase();
    const found = [];
    all.forEach(([p, src]) => {
      const hits = [];
      src.split("\n").forEach((l, i) => l.toLowerCase().includes(ql) && hits.length < 5 && hits.push([i + 1, l.trim().slice(0, 90)]));
      if (hits.length) found.push([p, hits]);
    });
    setResults(found.slice(0, 40));
  };

  useEffect(() => {
    const t = setTimeout(() => panel === "search" && runSearch(query), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, panel, wsId]);

  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
      e.preventDefault();
      e.stopPropagation();
      setQuick("");
    }
    if (e.key === "Escape") setQuick(null);
  };

  const quickList = quick === null ? [] : ws.paths.filter((p) => p.toLowerCase().includes(quick.toLowerCase())).slice(0, 12);
  const src = active && active !== "welcome" ? cache[key(active)] : null;
  const lang = active && active !== "welcome" ? langOf(active) : null;

  return (
    <div ref={rootRef} tabIndex={-1} onKeyDown={onKey} className="@container no-darkwin relative h-full flex flex-col outline-none" style={{ background: c.bg, color: c.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* title / command center */}
      <div className="relative shrink-0 h-[35px] flex items-center justify-center gap-2 px-3" style={{ background: c.bar, borderBottom: `1px solid ${c.line}` }}>
        <button type="button" onClick={() => setWsMenu((v) => !v)} className="absolute left-3 h-[22px] px-2 rounded-[6px] text-[12px] flex items-center gap-1.5 hover:bg-white/10" style={{ color: c.text }} aria-haspopup="menu" aria-expanded={wsMenu}>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" /></svg>
          <span className="hidden @xl:inline">{ws.name}</span>
          <span style={{ color: c.dim }}>▾</span>
        </button>
        {wsMenu && (
          <div className="absolute left-3 top-[32px] z-30 w-[260px] rounded-[6px] py-1 shadow-2xl" style={{ background: c.side, border: `1px solid ${c.line}` }} role="menu">
            <div className="px-3 py-1 text-[11px] uppercase tracking-[0.04em]" style={{ color: c.dim }}>Open recent</div>
            {Object.values(WORKSPACES).map((w) => (
              <button key={w.id} type="button" role="menuitem" onClick={() => switchWs(w.id)} className="w-full text-left px-3 py-1.5 text-[13px] flex items-center gap-2 hover:bg-white/5" style={{ color: c.text, background: w.id === wsId ? c.sel : undefined }}>
                <span className="font-medium">{w.name}</span>
                <span className="text-[11.5px] truncate" style={{ color: c.dim }}>{w.label.split("·")[1]}</span>
              </button>
            ))}
          </div>
        )}
        <button type="button" onClick={() => setQuick("")} className="w-full max-w-[420px] h-[22px] rounded-[6px] text-[12px] flex items-center justify-center gap-2" style={{ background: c.bg, border: `1px solid ${c.line}`, color: c.muted }}>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d={ACT.search} /></svg>
          {ws.label}
        </button>
      </div>

      {ws.caseStudy && <DemoBanner project={ws.project} dark onBack={() => onOpenWindow?.(ws.caseStudy)} />}
      <div className="flex-1 min-h-0 flex">
        {/* activity bar */}
        <div className="shrink-0 w-12 flex flex-col items-center py-1" style={{ background: c.bar, borderRight: `1px solid ${c.line}` }}>
          {[
            ["files", "Explorer"],
            ["search", "Search"],
            ["git", "Source Control"],
          ].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setPanel((p) => (p === k ? null : k))} title={l} aria-label={l} className="relative w-12 h-12 flex items-center justify-center" style={{ color: panel === k ? c.text : c.dim }}>
              {panel === k && <span className="absolute left-0 top-2 bottom-2 w-[2px]" style={{ background: c.accent }} />}
              <Act n={k} />
            </button>
          ))}
        </div>

        {/* side panel */}
        {panel && (
          <div className="shrink-0 w-[230px] hidden @2xl:flex flex-col min-h-0" style={{ background: c.side, borderRight: `1px solid ${c.line}` }}>
            <div className="shrink-0 h-[35px] flex items-center px-4 text-[11px] uppercase tracking-[0.04em]" style={{ color: c.muted }}>
              {panel === "files" ? "Explorer" : panel === "search" ? "Search" : "Source Control"}
            </div>
            {panel === "files" && (
              <div className="flex-1 min-h-0 overflow-y-auto pb-4">
                <div className="px-2 h-[22px] flex items-center text-[11px] font-bold uppercase">{ws.name}</div>
                <TreeNode node={tree} depth={0} open={open} toggle={toggle} active={active} openFile={openFile} c={c} />
              </div>
            )}
            {panel === "search" && (
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="px-3 pb-2">
                  <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full h-[26px] px-2 text-[13px] rounded-[2px] outline-none" style={{ background: c.bg, border: `1px solid ${c.accent}`, color: c.text }} />
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto text-[12.5px] pb-4">
                  {results === "loading" && <div className="px-4" style={{ color: c.muted }}>Searching {ws.paths.length} files…</div>}
                  {Array.isArray(results) && !results.length && <div className="px-4" style={{ color: c.muted }}>No results.</div>}
                  {Array.isArray(results) &&
                    results.map(([p, hits]) => (
                      <div key={p} className="mb-1">
                        <button type="button" onClick={() => openFile(p)} className="w-full flex items-center gap-1 px-3 h-[22px] truncate" style={{ color: c.text }}>
                          <FileIcon path={p} /> <span className="truncate">{base(p)}</span>
                          <span className="ml-auto text-[10.5px] rounded-full px-1.5" style={{ background: c.sel }}>{hits.length}</span>
                        </button>
                        {hits.map(([ln, t]) => (
                          <button key={ln} type="button" onClick={async () => { await openFile(p); setCursor(ln); }} className="w-full text-left pl-8 pr-2 h-[20px] truncate text-[12px]" style={{ color: c.muted }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {panel === "git" && (
              <div className="flex-1 min-h-0 overflow-y-auto px-3 text-[12.5px]">
                <div className="rounded-[2px] px-2 py-1.5 text-[12px]" style={{ background: c.bg, border: `1px solid ${c.line}`, color: c.dim }}>Message (⌘Enter to commit on “main”)</div>
                <div className="mt-2 text-center rounded-[2px] py-1 text-white text-[12.5px]" style={{ background: c.accent }}>✓ Commit</div>
                <div className="mt-4 mb-1 text-[11px] uppercase tracking-[0.04em]" style={{ color: c.muted }}>Graph</div>
                {wsId !== "macos" && (
                  <div className="py-2 text-[12px] leading-snug" style={{ color: c.muted }}>
                    History lives on GitHub.{" "}
                    <a href={ws.repo} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: c.accent }}>Open {ws.name} →</a>
                  </div>
                )}
                {wsId === "macos" && RECENT_COMMITS.map((cm, i) => (
                  <div key={cm.sha} className="flex gap-2 py-1">
                    <span className="flex flex-col items-center pt-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: i ? c.dim : c.accent }} />
                      {i < RECENT_COMMITS.length - 1 && <span className="w-px flex-1 mt-0.5" style={{ background: c.line }} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block leading-snug">{cm.msg}</span>
                      <span className="block text-[11px]" style={{ color: c.dim }}>{cm.sha} · {cm.date}</span>
                    </span>
                  </div>
                ))}
                {wsId === "macos" && <button type="button" onClick={() => onOpenWindow?.("github")} className="mt-3 mb-4 text-[12px] hover:underline" style={{ color: c.accent }}>View all {TOTAL_COMMITS} commits in GitHub →</button>}
              </div>
            )}
          </div>
        )}

        {/* editor group */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="shrink-0 h-[35px] flex overflow-x-auto" style={{ background: c.tabOff, borderBottom: `1px solid ${c.line}` }}>
            {tabs.map((t) => (
              <div
                key={t}
                onClick={() => setActive(t)}
                className="group shrink-0 flex items-center gap-1.5 pl-3 pr-1.5 h-full text-[13px] cursor-pointer"
                style={{ background: active === t ? c.tabOn : c.tabOff, color: active === t ? c.text : c.muted, borderRight: `1px solid ${c.line}`, borderTop: `1px solid ${active === t ? c.accent : "transparent"}` }}
              >
                {t === "welcome" ? <span className="w-4 text-center text-[11px]" style={{ color: c.accent }}>◆</span> : <FileIcon path={t} />}
                {t === "welcome" ? "Welcome" : base(t)}
                <button type="button" onClick={(e) => closeTab(t, e)} className={`w-5 h-5 rounded-[4px] flex items-center justify-center text-[14px] leading-none ${active === t ? "" : "opacity-0 group-hover:opacity-100"}`} style={{ color: c.muted }} aria-label={`Close ${t}`}>
                  ×
                </button>
              </div>
            ))}
          </div>
          {active && active !== "welcome" && (
            <div className="shrink-0 h-[22px] flex items-center gap-1 px-4 text-[12px] truncate" style={{ color: c.muted, background: c.bg }}>
              {active.slice(1).split("/").map((s, i, arr) => (
                <span key={i} className="flex items-center gap-1">
                  {i === arr.length - 1 && <FileIcon path={active} />}
                  <span style={i === arr.length - 1 ? { color: c.text } : undefined}>{s}</span>
                  {i < arr.length - 1 && <span>›</span>}
                </span>
              ))}
            </div>
          )}
          {active === "welcome" ? (
            <Welcome c={c} openFile={openFile} ws={ws} onOpenWindow={onOpenWindow} />
          ) : src != null ? (
            <Editor path={active} src={src} c={c} cursor={cursor} onCursor={setCursor} />
          ) : active ? (
            <div className="flex-1 flex items-center justify-center text-[13px]" style={{ color: c.muted }}>Loading…</div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[13px]" style={{ color: c.dim }}>
              <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-20"><path d="M72 8 38 40 18 24 8 29v42l10 5 20-16 34 32 20-9V17z" fill="currentColor" /></svg>
              <span>Show All Commands ⇧⌘P · Go to File ⌘P</span>
            </div>
          )}
        </div>
      </div>

      {/* status bar */}
      <div className="shrink-0 h-[22px] flex items-center gap-4 px-2 text-[12px] text-white" style={{ background: c.status }}>
        <span>⑂ main</span>
        <span>⊗ 0  ⚠ 0</span>
        <span className="ml-auto hidden @xl:inline">{src != null ? `Ln ${cursor}, Col 1` : ""}</span>
        <span className="hidden @xl:inline">Spaces: 2</span>
        <span className="hidden @2xl:inline">UTF-8</span>
        <span>{lang ? LANG_NAME[lang] : "Welcome"}</span>
        <span className="hidden @2xl:inline">Prettier ✓</span>
      </div>

      {/* quick open */}
      {quick !== null && (
        <div className="absolute inset-0 z-20" onClick={() => setQuick(null)}>
          <div onClick={(e) => e.stopPropagation()} className="absolute left-1/2 -translate-x-1/2 top-2 w-[min(560px,92%)] rounded-[6px] shadow-2xl overflow-hidden" style={{ background: c.side, border: `1px solid ${c.line}` }}>
            <input
              autoFocus
              value={quick}
              onChange={(e) => setQuick(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && quickList[0]) openFile(quickList[0]);
                if (e.key === "Escape") setQuick(null);
              }}
              placeholder="Search files by name"
              className="w-full h-[30px] px-2 m-1.5 text-[13px] outline-none rounded-[2px]"
              style={{ width: "calc(100% - 12px)", background: c.bg, border: `1px solid ${c.accent}`, color: c.text }}
            />
            <div className="max-h-[300px] overflow-y-auto pb-1">
              {quickList.map((p, i) => (
                <button key={p} type="button" onClick={() => openFile(p)} className="w-full flex items-center gap-2 px-3 h-[24px] text-[13px] text-left" style={{ background: i === 0 ? c.sel : undefined, color: c.text }}>
                  <FileIcon path={p} />
                  {base(p)}
                  <span className="truncate text-[12px]" style={{ color: c.dim }}>{p.slice(1, -base(p).length - 1)}</span>
                </button>
              ))}
              {!quickList.length && <div className="px-3 py-1 text-[13px]" style={{ color: c.muted }}>No matching files</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
