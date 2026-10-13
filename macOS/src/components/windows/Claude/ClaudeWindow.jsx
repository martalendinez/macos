// src/components/windows/Claude/ClaudeWindow.jsx
// A Claude-style chat that replays example sessions of how Marta works with AI:
// she brings the context and makes the call, Claude drafts, checks and challenges.
// The sessions are written examples of that workflow (no live API).
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CLAUDE_PROJECTS } from "./projects";
import { openWorkspace, useWorkspace } from "../../../config/workspaceBus";
import DemoBanner from "../DemoBanner";

// Marta's real Claude Skills, read straight from the repo's .claude/skills folder
const SKILL_FILES = import.meta.glob("/.claude/skills/**/*", { query: "?raw", import: "default", eager: true });
export const SKILLS = Object.entries(SKILL_FILES)
  .filter(([p]) => p.endsWith("/SKILL.md"))
  .map(([p, raw]) => {
    const dir = p.replace("/SKILL.md", "");
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    const meta = Object.fromEntries((fm ? fm[1] : "").split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]));
    return { name: meta.name || dir.split("/").pop(), description: meta.description || "", body: fm ? raw.slice(fm[0].length) : raw, path: p, files: Object.keys(SKILL_FILES).filter((f) => f.startsWith(dir + "/")).map((f) => f.slice(dir.length + 1)) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
const SKILL_USED_IN = {
  "accessibility-review": ["GitHub PR #43", "Brand blue vs. accessibility"],
  "case-study-writer": ["Trace, Sällskap and Kallos case studies"],
  "design-critique": ["Trace’s stage rules"],
  "pr-description": ["GitHub PR #43"],
  "research-synthesis": ["Trace usability rounds", "Sällskap interview guide"],
};

const CLAY = "#d97757";

export const Spark = ({ className = "w-6 h-6", color = CLAY }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <g fill={color}>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="22" y="3" width="4" height="20" rx="2" transform={`rotate(${i * 30} 24 24) translate(0 ${i % 2 ? 3 : 0})`} />
      ))}
    </g>
  </svg>
);

const SESSIONS = [
  {
    id: "pr",
    title: "PR description for the contrast fix",
    tag: "Writing",
    skill: "pr-description",
    turns: [
      { role: "user", text: "Here’s my diff: the action.primary token goes from #5aa9ff to #0b63ce and Button reads tokens instead of a hex. Draft a PR description with Why, What changed and How I tested. Short, plain words, no buzzwords." },
      { role: "assistant", text: "**Why**\nThe primary button had 2.5:1 contrast with white text, under the 4.5:1 WCAG AA minimum.\n\n**What changed**\n- Darkened `action.primary` so every primary button gets the fix\n- Button reads colours from tokens\n- We leverage a visible focus ring for keyboard users\n\n**How I tested**\n- axe: no contrast violations\n- Keyboard only: focus ring visible" },
      { role: "user", text: "Good. Two edits: drop “leverage”, and mention the hover state now uses a token too. I checked it: 7.0:1." },
      { role: "assistant", text: "Updated:\n- Darkened `action.primary` so every primary button gets the fix\n- Button reads colours from tokens, **including hover (7.0:1)**\n- Added a visible focus ring for keyboard users" },
    ],
    takeaway: "I give it the real diff and the format I want, then edit for voice and add facts I verified myself.",
  },
  {
    id: "a11y",
    title: "Brand blue vs. accessibility",
    tag: "Design review",
    skill: "accessibility-review",
    turns: [
      { role: "user", text: "Check white text on #5aa9ff against WCAG. Brand wants to keep this blue. What are my options without breaking AA?" },
      { role: "assistant", text: "White on #5aa9ff is **2.5:1**, which fails AA for normal text (4.5:1) and large text (3:1).\n\nOptions:\n1. **Darker step for buttons**: #0b63ce with white text is 5.7:1. Keep the light blue for illustrations and backgrounds.\n2. **Dark text on the light blue**: #14141a on #5aa9ff is 7.5:1, so the colour stays but the label changes.\n3. **Outline style**: light blue border, dark text, for secondary actions only." },
      { role: "user", text: "Option 2 feels off-brand for our main CTA. I’ll go with 1 and bring 2 to the brand team for secondary buttons." },
      { role: "assistant", text: "Makes sense. For the brand conversation, a side-by-side of all three on the real Invest screen will land better than ratios. Want a checklist for that review?" },
    ],
    takeaway: "Claude does the maths and widens the options. The decision, and the conversation with brand, stays with me.",
  },
  {
    id: "trace",
    title: "Fix Trace panels overlapping",
    tag: "Code",
    turns: [
      { role: "user", text: "My Trace plugin panels use CSS `zoom` to shrink them in a gallery, and they overlap in some browsers. How do I scale them reliably?" },
      { role: "assistant", text: "`zoom` isn’t consistent across browsers and doesn’t change layout size predictably. Scale with a transform inside a wrapper that has the final size:\n\n```\nconst scale = width / 360;\n<div style={{ width, height: 640 * scale }}>\n  <div style={{ width: 360, transform: `scale(${scale})`,\n                transformOrigin: \"top left\" }}>\n    <Panel />\n  </div>\n</div>\n```" },
      { role: "user", text: "Works, but they still squish in the flex row. I added `shrink-0` to the wrapper and dropped the width to 138, that fixed it." },
      { role: "assistant", text: "Right, flex items shrink by default, so the wrapper needs `flex-shrink: 0` to keep its computed size. Good catch." },
    ],
    takeaway: "I use it as a pair programmer, then test in the browser. When the real fix is mine, I say so.",
  },
  {
    id: "jcurve",
    title: "Explain the J-curve simply",
    tag: "Content",
    turns: [
      { role: "user", text: "For the Fund Simulator’s help text: explain the private-equity J-curve to someone who has never invested. 3 sentences, then one quiz question." },
      { role: "assistant", text: "In the first years of a fund, you pay in money and fees before the investments have had time to grow, so your returns look negative. As the companies mature and get sold, money flows back and returns climb. Plotted over time, that dip and rise looks like the letter J.\n\n**Quiz:** Why do returns look negative early on?\nA) The fund made bad investments\nB) Money goes out before investments can grow\nC) Markets always fall at first" },
      { role: "user", text: "Too long for mobile. Cut to 2 sentences, keep the quiz." },
      { role: "assistant", text: "Early on you pay in money and fees before investments grow, so returns dip below zero. Later, as companies are sold and money comes back, returns rise, tracing a J.\n\n**Quiz:** Why do returns look negative early on? (A / B / C as before)" },
    ],
    takeaway: "Drafts fast, but I judge the result against the real screen and the real learner.",
  },
];

const PRINCIPLES = [
  ["I bring context, I make the call", "Real diffs, real constraints, a clear format. Claude drafts, checks and challenges."],
  ["Everything gets reviewed", "I edit the voice, verify every number and run the code before it ships."],
  ["Some things never go in", "No secrets, keys or private user data in a prompt."],
];

/* tiny markdown: **bold**, `code`, ``` blocks, list lines */
function inline(text, key) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g).map((p, i) => {
    if (p.startsWith("**")) return <b key={`${key}-${i}`}>{p.slice(2, -2)}</b>;
    if (p.length > 2 && p.startsWith("*") && p.endsWith("*")) return <i key={`${key}-${i}`}>{p.slice(1, -1)}</i>;
    if (p.startsWith("`")) return <code key={`${key}-${i}`} className="font-mono text-[0.88em] px-1 py-0.5 rounded-[5px] bg-black/[0.06]">{p.slice(1, -1)}</code>;
    return p;
  });
}
function Rich({ text, dark }) {
  const blocks = text.split(/```\n?/);
  return blocks.map((b, bi) =>
    bi % 2 ? (
      <pre key={bi} className={`my-2 rounded-[10px] p-3 text-[12px] leading-[1.6] font-mono overflow-x-auto ${dark ? "bg-black/40 text-[#e8e6dc]" : "bg-[#f0eee6] text-[#3d3929]"}`}>{b.replace(/\n$/, "")}</pre>
    ) : (
      b.split("\n\n").map((para, pi) => {
        const lines = para.split("\n").filter(Boolean);
        const isList = lines.length && lines.every((l) => /^(- |\d\. |[A-C]\) )/.test(l) || l === lines[0]);
        return (
          <div key={`${bi}-${pi}`} className="mb-2 last:mb-0">
            {lines.map((l, li) =>
              /^(- |\d\. |[A-C]\) )/.test(l) && isList ? (
                <div key={li} className="flex gap-2 pl-1">
                  <span className="shrink-0 opacity-60">{l.startsWith("- ") ? "•" : l.match(/^(\d\.|[A-C]\))/)[0]}</span>
                  <span>{inline(l.replace(/^(- |\d\. |[A-C]\) )/, ""), `${bi}-${pi}-${li}`)}</span>
                </div>
              ) : (
                <p key={li}>{inline(l, `${bi}-${pi}-${li}`)}</p>
              )
            )}
          </div>
        );
      })
    )
  );
}

function useTyped(text, active, speed = 14) {
  const [n, setN] = useState(active ? 0 : text.length);
  useEffect(() => {
    if (!active) return setN(text.length);
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 3)), speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return text.slice(0, n);
}

function AssistantMsg({ text, animate, dark, onDone }) {
  const shown = useTyped(text, animate);
  const done = shown.length >= text.length;
  const fired = useRef(false);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onDone?.();
    }
  }, [done, onDone]);
  // keep code fences balanced while streaming
  const safe = (shown.match(/```/g) || []).length % 2 ? `${shown}\n\`\`\`` : shown;
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0"><Spark className="w-6 h-6" /></span>
      <div className="min-w-0 flex-1 text-[14.5px] leading-[1.65]" style={{ fontFamily: 'ui-serif, Georgia, "Times New Roman", serif' }}>
        <Rich text={safe} dark={dark} />
      </div>
    </div>
  );
}

function Chat({ session, dark, onBack, onOpenWindow, onSkill }) {
  const [count, setCount] = useState(1);
  const [thinking, setThinking] = useState(false);
  const [complete, setComplete] = useState(false);
  const [run, setRun] = useState(0);
  const end = useRef(null);
  const total = session.turns.length;

  const replay = () => {
    setComplete(false);
    setCount(1);
    setRun((r) => r + 1);
  };
  useEffect(replay, [session.id]);

  // after a user turn, "think" briefly and then reveal the assistant reply
  useEffect(() => {
    if (count > total) return undefined;
    const last = session.turns[count - 1];
    if (last.role === "user" && count === total) {
      const t = setTimeout(() => setComplete(true), 900);
      return () => clearTimeout(t);
    }
    if (last.role === "user" && count < total) {
      setThinking(true);
      const t = setTimeout(() => {
        setThinking(false);
        setCount((c) => c + 1);
      }, 900);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [count, total, session]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  const advance = () => {
    if (count >= total) setComplete(true);
    else setTimeout(() => setCount((c) => Math.min(total, c + 1)), 1100);
  };
  const finished = count >= total;

  return (
    <div className="max-w-[720px] mx-auto px-5 py-6 space-y-6">
      {session.skill && (
        <button type="button" onClick={() => onSkill?.(session.skill)} className={`flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1 text-[12px] ${dark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ background: CLAY }}>⚡</span>
          Using skill <code className="font-mono font-semibold">{session.skill}</code>
        </button>
      )}
      {session.turns.slice(0, count).map((t, i) =>
        t.role === "user" ? (
          <motion.div key={`${run}-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
            <div className={`max-w-[85%] rounded-[18px] px-4 py-2.5 text-[14.5px] leading-relaxed ${dark ? "bg-[#393937]" : "bg-[#f0eee6]"}`}>
              <div className={`text-[11px] font-semibold mb-0.5 ${dark ? "text-white/50" : "text-black/45"}`}>Marta</div>
              {inline(t.text, `u${i}`)}
            </div>
          </motion.div>
        ) : (
          <AssistantMsg key={`${run}-${i}`} text={t.text} dark={dark} animate={i === count - 1 && !finished ? true : i === count - 1 && count === total} onDone={i === count - 1 ? advance : undefined} />
        )
      )}
      {thinking && (
        <div className="flex items-center gap-3">
          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}>
            <Spark className="w-6 h-6" />
          </motion.span>
          <span className={`text-[13px] ${dark ? "text-white/45" : "text-black/40"}`}>Thinking…</span>
        </div>
      )}
      <AnimatePresence>
        {complete && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`rounded-[14px] p-4 ${dark ? "bg-[#d97757]/15" : "bg-[#d97757]/10"}`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: CLAY }}>How I work</div>
            <p className="mt-1 text-[14px] leading-relaxed">{session.takeaway}</p>
            <div className="mt-3 flex gap-3 text-[13px] font-semibold">
              <button type="button" onClick={replay} style={{ color: CLAY }}>Replay</button>
              {session.file && session.project && (
                <button
                  type="button"
                  onClick={() => {
                    openWorkspace("vscode", { project: session.project, file: session.file });
                    onOpenWindow?.("vscode");
                  }}
                  style={{ color: CLAY }}
                >
                  See what shipped in VS Code →
                </button>
              )}
              <button type="button" onClick={onBack} className={dark ? "text-white/60" : "text-black/50"}>{session.project ? "Back to project" : "All sessions"}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={end} />
    </div>
  );
}

function Home({ dark, onPick }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="max-w-[720px] mx-auto px-5 py-8 @2xl:py-12">
      <div className="flex items-center justify-center gap-3">
        <Spark className="w-9 h-9" />
        <h1 className="text-[30px] @2xl:text-[36px] tracking-[-0.01em]" style={{ fontFamily: 'ui-serif, Georgia, "Times New Roman", serif' }}>
          {greet}, how do I work with AI?
        </h1>
      </div>
      <p className={`mt-3 text-center text-[14px] ${dark ? "text-white/55" : "text-black/50"}`}>Replay a session to see it, from prompt to final decision.</p>

      <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-3">
        {SESSIONS.map((s) => (
          <button key={s.id} type="button" onClick={() => onPick(s.id)} className={`group text-left rounded-[16px] p-4 transition-colors ${dark ? "bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10" : "bg-white hover:bg-[#fdfcf9] ring-1 ring-black/[0.07] shadow-[0_6px_18px_-14px_rgba(0,0,0,0.3)]"}`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: CLAY }}>{s.tag}</div>
            <div className="mt-1 text-[15px] font-semibold">{s.title}</div>
            <div className={`mt-1 text-[12.5px] line-clamp-2 ${dark ? "text-white/50" : "text-black/50"}`}>{s.turns[0].text.replace(/`/g, "")}</div>
            <div className="mt-3 text-[12.5px] font-semibold opacity-70 group-hover:opacity-100" style={{ color: CLAY }}>Replay session →</div>
          </button>
        ))}
      </div>

      <div className={`mt-8 rounded-[16px] p-5 ${dark ? "bg-white/[0.03] ring-1 ring-white/10" : "bg-[#f5f4ee] ring-1 ring-black/[0.05]"}`}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: CLAY }}>My rules for AI</div>
        <div className="mt-3 grid grid-cols-1 @2xl:grid-cols-3 gap-4">
          {PRINCIPLES.map(([t, d], i) => (
            <div key={t}>
              <div className="flex items-center gap-2 text-[14px] font-semibold">
                <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center text-white" style={{ background: CLAY }}>{i + 1}</span>
                {t}
              </div>
              <p className={`mt-1 text-[13px] leading-snug ${dark ? "text-white/55" : "text-black/55"}`}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- tiny markdown for SKILL.md files ---------- */
function Markdown({ text, dark }) {
  const out = [];
  const lines = text.replace(/\r/g, "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("```")) {
      const code = [];
      while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
      out.push(<pre key={i} className={`my-3 rounded-[10px] p-3 text-[12px] leading-[1.6] font-mono overflow-x-auto ${dark ? "bg-black/40 text-[#e8e6dc]" : "bg-[#f0eee6] text-[#3d3929]"}`}>{code.join("\n")}</pre>);
    } else if (l.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++].split("|").slice(1, -1).map((c) => c.trim()));
      i--;
      const body = rows.filter((r) => !r.every((c) => /^-+$/.test(c)));
      out.push(
        <div key={i} className="my-3 overflow-x-auto">
          <table className="w-full text-[13px]">
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri} className={ri === 0 ? "font-semibold" : ""} style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  {r.map((c, ci) => <td key={ci} className="py-1.5 pr-3 align-top">{inline(c, `${i}-${ri}-${ci}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (/^#{1,3} /.test(l)) {
      const lvl = l.match(/^#+/)[0].length;
      out.push(<div key={i} className={lvl === 1 ? "mt-1 mb-2 text-[24px]" : lvl === 2 ? "mt-6 mb-1.5 text-[17px] font-semibold" : "mt-4 mb-1 text-[15px] font-semibold"} style={lvl === 1 ? { fontFamily: 'ui-serif, Georgia, serif' } : undefined}>{l.replace(/^#+ /, "")}</div>);
    } else if (/^(\s*)(- |\d+\. )/.test(l)) {
      const sub = /^\s{2,}/.test(l);
      const marker = l.trim().match(/^(- \[ \] |- |\d+\. )/)[0];
      out.push(
        <div key={i} className={`flex gap-2 text-[14px] leading-relaxed ${sub ? "pl-6" : "pl-1"}`}>
          <span className="shrink-0 opacity-60">{marker.startsWith("- [") ? "☐" : marker.startsWith("-") ? "•" : marker.trim()}</span>
          <span>{inline(l.trim().slice(marker.length), `li${i}`)}</span>
        </div>
      );
    } else if (l.trim()) out.push(<p key={i} className="my-2 text-[14px] leading-relaxed">{inline(l, `p${i}`)}</p>);
  }
  return out;
}

function SkillsPage({ dark, onOpen }) {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(SKILLS.map((s) => [s.name, true])));
  return (
    <div className="max-w-[760px] mx-auto px-5 py-8">
      <h1 className="text-[28px]" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>Skills</h1>
      <p className={`mt-1 text-[14px] leading-relaxed ${dark ? "text-white/55" : "text-black/55"}`}>
        Reusable instructions Claude loads when a task matches. These are my real skills: the same SKILL.md files live in this portfolio’s repo, under <code className="font-mono text-[12.5px]">.claude/skills</code>.
      </p>
      <div className="mt-6 grid grid-cols-1 @2xl:grid-cols-2 gap-3">
        {SKILLS.map((sk) => (
          <div key={sk.name} className={`rounded-[16px] p-4 ${dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-white ring-1 ring-black/[0.07] shadow-[0_6px_18px_-14px_rgba(0,0,0,0.3)]"}`}>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white text-[13px]" style={{ background: CLAY }}>⚡</span>
              <code className="font-mono text-[13.5px] font-semibold truncate">{sk.name}</code>
              <button
                type="button"
                role="switch"
                aria-checked={enabled[sk.name]}
                aria-label={`Enable ${sk.name}`}
                onClick={() => setEnabled((e) => ({ ...e, [sk.name]: !e[sk.name] }))}
                className="ml-auto relative w-9 h-5 rounded-full transition-colors"
                style={{ background: enabled[sk.name] ? CLAY : dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }}
              >
                <motion.span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow" animate={{ x: enabled[sk.name] ? 16 : 0 }} transition={{ type: "spring", stiffness: 600, damping: 34 }} />
              </button>
            </div>
            <p className={`mt-2 text-[12.5px] leading-snug line-clamp-3 ${dark ? "text-white/60" : "text-black/55"}`}>{sk.description}</p>
            {SKILL_USED_IN[sk.name] && (
              <div className="mt-2 flex flex-wrap gap-1">
                {SKILL_USED_IN[sk.name].map((u) => (
                  <span key={u} className={`rounded-full px-2 py-0.5 text-[11px] ${dark ? "bg-white/[0.06] text-white/60" : "bg-black/[0.04] text-black/55"}`}>{u}</span>
                ))}
              </div>
            )}
            <button type="button" onClick={() => onOpen(sk.name)} className="mt-3 text-[12.5px] font-semibold" style={{ color: CLAY }}>View SKILL.md →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillDetail({ skill, dark, onBack, onOpenWindow }) {
  return (
    <div className="max-w-[760px] mx-auto px-5 py-6">
      <button type="button" onClick={onBack} className={`text-[13px] ${dark ? "text-white/55" : "text-black/50"}`}>← Skills</button>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="w-8 h-8 rounded-[9px] flex items-center justify-center text-white" style={{ background: CLAY }}>⚡</span>
        <code className="font-mono text-[18px] font-semibold">{skill.name}</code>
        <button
          type="button"
          onClick={() => {
            openWorkspace("vscode", { project: "macos", file: skill.path });
            onOpenWindow?.("vscode");
          }}
          className="ml-auto text-[12.5px] font-semibold"
          style={{ color: CLAY }}
        >
          Open in VS Code →
        </button>
      </div>
      <div className={`mt-4 rounded-[14px] p-4 text-[13px] ${dark ? "bg-white/[0.04]" : "bg-[#f5f4ee]"}`}>
        <div className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${dark ? "text-white/45" : "text-black/45"}`}>When Claude uses it</div>
        <p className="mt-1 leading-relaxed">{skill.description}</p>
        <div className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] ${dark ? "text-white/45" : "text-black/45"}`}>Files</div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {skill.files.map((f) => <code key={f} className={`font-mono text-[11.5px] rounded-[6px] px-1.5 py-0.5 ${dark ? "bg-black/30" : "bg-white"}`}>{f}</code>)}
        </div>
      </div>
      <div className="mt-5">
        <Markdown text={skill.body} dark={dark} />
      </div>
    </div>
  );
}

function ProjectPage({ project, dark, onPick, onOpenWindow }) {
  return (
    <div className="max-w-[760px] mx-auto px-5 py-8">
      <div className={`text-[12px] ${dark ? "text-white/45" : "text-black/45"}`}>Projects /</div>
      <h1 className="mt-1 text-[30px]" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>{project.name}</h1>
      <p className={`mt-1 text-[14px] leading-relaxed ${dark ? "text-white/60" : "text-black/55"}`}>{project.blurb}</p>
      <div className="mt-6 grid grid-cols-1 @3xl:grid-cols-[1fr_260px] gap-5">
        <div>
          <div className={`text-[11px] font-semibold uppercase tracking-[0.12em] mb-2 ${dark ? "text-white/45" : "text-black/45"}`}>Chats in this project</div>
          <div className="space-y-2">
            {project.sessions.map((s) => (
              <button key={s.id} type="button" onClick={() => onPick(s.id)} className={`w-full text-left rounded-[14px] p-4 transition-colors ${dark ? "bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10" : "bg-white hover:bg-[#fdfcf9] ring-1 ring-black/[0.07]"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: CLAY }}>{s.tag}</span>
                  {s.skill && <code className={`ml-auto font-mono text-[10.5px] rounded-full px-2 py-0.5 ${dark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`}>⚡ {s.skill}</code>}
                </div>
                <div className="mt-1 text-[15px] font-semibold">{s.title}</div>
                <div className={`mt-0.5 text-[12.5px] line-clamp-2 ${dark ? "text-white/50" : "text-black/50"}`}>{s.turns[0].text.replace(/[`*]/g, "")}</div>
              </button>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className={`rounded-[14px] p-4 ${dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-[#f5f4ee]"}`}>
            <div className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/45" : "text-black/45"}`}>Project instructions</div>
            <p className="mt-2 text-[13px] leading-relaxed">{project.instructions}</p>
          </div>
          <div className={`rounded-[14px] p-4 ${dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-[#f5f4ee]"}`}>
            <div className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/45" : "text-black/45"}`}>Project knowledge</div>
            <div className="mt-2 space-y-1.5">
              {project.knowledge.map(([f, k]) => (
                <div key={f} className="flex items-center gap-2 text-[12.5px]">
                  <span className={`shrink-0 rounded-[5px] px-1.5 py-0.5 text-[10px] font-semibold ${dark ? "bg-black/30" : "bg-white"}`}>{k}</span>
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => onOpenWindow?.(project.caseStudy)} className="text-[13px] font-semibold" style={{ color: CLAY }}>← Back to the case study</button>
        </aside>
      </div>
      <p className={`mt-6 text-[11.5px] ${dark ? "text-white/40" : "text-black/40"}`}>{project.footnote}</p>
    </div>
  );
}

const PROJECT_SESSIONS = Object.entries(CLAUDE_PROJECTS).flatMap(([pid, p]) => p.sessions.map((s) => ({ ...s, project: pid })));
const ALL_SESSIONS = [...SESSIONS, ...PROJECT_SESSIONS];

export default function ClaudeWindow({ theme = "light", onOpenWindow }) {
  const dark = theme === "dark";
  const [active, setActive] = useState(null); // session id
  const [page, setPage] = useState("home"); // home | project | skills | skill
  const [projectId, setProjectId] = useState("trace");
  const [skillName, setSkillName] = useState(null);
  const [nav, setNav] = useState(true);
  const session = ALL_SESSIONS.find((s) => s.id === active);
  const project = CLAUDE_PROJECTS[projectId];
  const skill = SKILLS.find((s) => s.name === skillName);

  useWorkspace("claude", (p) => {
    if (CLAUDE_PROJECTS[p]) {
      setProjectId(p);
      setPage("project");
      setActive(null);
    }
  });

  const goHome = () => {
    setActive(null);
    setPage("home");
  };
  const openProject = (id) => {
    setProjectId(id);
    setPage("project");
    setActive(null);
  };
  const openSkill = (name) => {
    setSkillName(name);
    setPage("skill");
    setActive(null);
  };
  const back = () => (session?.project ? openProject(session.project) : goHome());
  const viewKey = active || `${page}-${projectId}-${skillName}`;
  const navBtn = (on) => `w-full flex items-center gap-2 text-left truncate rounded-[8px] px-2 py-1.5 text-[13px] ${on ? (dark ? "bg-white/10" : "bg-black/[0.06]") : dark ? "hover:bg-white/[0.05] text-white/75" : "hover:bg-black/[0.03] text-black/70"}`;

  return (
    <div className={`@container no-darkwin h-full flex ${dark ? "bg-[#262624] text-[#f5f4ef]" : "bg-[#faf9f5] text-[#1f1e1d]"}`}>
      {/* sidebar */}
      <aside className={`shrink-0 hidden @3xl:flex flex-col transition-[width] ${nav ? "w-[230px]" : "w-[52px]"} ${dark ? "bg-[#1f1e1d] border-r border-white/[0.06]" : "bg-[#f5f4ee] border-r border-black/[0.06]"}`}>
        <div className="flex items-center gap-2 px-3 py-3">
          <button type="button" onClick={() => setNav((v) => !v)} className={`w-7 h-7 rounded-[8px] flex items-center justify-center ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`} aria-label="Toggle sidebar">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="14" height="12" rx="2.5" /><path d="M8 4v12" /></svg>
          </button>
          {nav && <span className="text-[17px] font-semibold tracking-[-0.01em]" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>Claude</span>}
        </div>
        <button type="button" onClick={goHome} className={`mx-2 flex items-center gap-2 rounded-[10px] px-2 py-2 text-[13.5px] font-medium ${dark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.04]"}`}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: CLAY }}>
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
          </span>
          {nav && "New chat"}
        </button>
        {nav && (
          <>
            <div className="mt-2 px-2 space-y-0.5">
              <button type="button" onClick={() => setPage("skills") || setActive(null)} className={navBtn(!active && (page === "skills" || page === "skill"))}>
                <span className="w-4 text-center">⚡</span> Skills
              </button>
            </div>
            <div className={`mt-4 px-4 text-[11.5px] font-semibold ${dark ? "text-white/40" : "text-black/40"}`}>Projects</div>
            <div className="mt-1 px-2 space-y-0.5">
              {Object.entries(CLAUDE_PROJECTS).map(([id, p]) => (
                <button key={id} type="button" onClick={() => openProject(id)} className={navBtn(!active && page === "project" && projectId === id)}>
                  <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H8l1.5 2h6A1.5 1.5 0 0 1 17 8.5v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5z" /></svg>
                  {p.name}
                </button>
              ))}
            </div>
            <div className={`mt-4 px-4 text-[11.5px] font-semibold ${dark ? "text-white/40" : "text-black/40"}`}>Recents</div>
            <div className="mt-1 px-2 space-y-0.5 overflow-y-auto">
              {(session?.project ? CLAUDE_PROJECTS[session.project].sessions : SESSIONS).map((s) => (
                <button key={s.id} type="button" onClick={() => setActive(s.id)} className={navBtn(active === s.id)}>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
            <div className="mt-auto p-3">
              <div className={`flex items-center gap-2 rounded-[10px] p-2 ${dark ? "bg-white/[0.04]" : "bg-black/[0.03]"}`}>
                <span className="w-7 h-7 rounded-full bg-[#3d3929] text-white text-[11px] font-bold flex items-center justify-center">ML</span>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold truncate">Marta Lendínez</div>
                  <div className={`text-[11px] ${dark ? "text-white/45" : "text-black/45"}`}>{SKILLS.length} skills · {Object.keys(CLAUDE_PROJECTS).length} projects</div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {((!session && page === "project") || session?.project) && <DemoBanner project={project.name} dark={dark} onBack={() => onOpenWindow?.(project.caseStudy)} />}
        <div className={`shrink-0 flex items-center gap-2 px-4 h-11 text-[13.5px] ${dark ? "border-b border-white/[0.06]" : "border-b border-black/[0.05]"}`}>
          {session ? (
            <>
              <button type="button" onClick={back} className={dark ? "text-white/60" : "text-black/50"}>←</button>
              {session.project && <span className={dark ? "text-white/45" : "text-black/45"}>{CLAUDE_PROJECTS[session.project].name} /</span>}
              <span className="font-medium truncate">{session.title}</span>
              <span className="ml-auto text-[11.5px] px-2 py-0.5 rounded-full" style={{ background: `${CLAY}22`, color: CLAY }}>{session.tag}</span>
            </>
          ) : (
            <span className={dark ? "text-white/50" : "text-black/45"}>{page === "project" ? `Project · ${project.name}` : page === "skills" || page === "skill" ? "Skills" : "Example sessions, written to show my workflow"}</span>
          )}
          {!session && (
            <div className="ml-auto flex gap-1 @3xl:hidden">
              <button type="button" onClick={() => setPage("skills")} className="text-[12px] px-2 py-1 rounded-full" style={{ background: `${CLAY}22`, color: CLAY }}>Skills</button>
              <button type="button" onClick={() => openProject("trace")} className="text-[12px] px-2 py-1 rounded-full" style={{ background: `${CLAY}22`, color: CLAY }}>Projects</button>
            </div>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={viewKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {session ? (
                <Chat session={session} dark={dark} onBack={back} onOpenWindow={onOpenWindow} onSkill={openSkill} />
              ) : page === "project" ? (
                <ProjectPage project={project} dark={dark} onPick={setActive} onOpenWindow={onOpenWindow} />
              ) : page === "skills" ? (
                <SkillsPage dark={dark} onOpen={openSkill} />
              ) : page === "skill" && skill ? (
                <SkillDetail skill={skill} dark={dark} onBack={() => setPage("skills")} onOpenWindow={onOpenWindow} />
              ) : (
                <Home dark={dark} onPick={setActive} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="shrink-0 px-4 pb-4 pt-2">
          <div className={`max-w-[720px] mx-auto rounded-[20px] px-4 py-3 ${dark ? "bg-[#30302e] ring-1 ring-white/10" : "bg-white ring-1 ring-black/[0.08] shadow-[0_6px_20px_-12px_rgba(0,0,0,0.2)]"}`}>
            <div className={`text-[14px] ${dark ? "text-white/40" : "text-black/35"}`}>{session ? "This is a replay of how I work with Claude" : "Pick a session to replay it"}</div>
            <div className="mt-2 flex items-center gap-2">
              {(page === "project" || session?.project ? project.sessions : SESSIONS).filter((s) => s.id !== active).slice(0, 3).map((s) => (
                <button key={s.id} type="button" onClick={() => setActive(s.id)} className={`truncate rounded-full px-2.5 py-1 text-[11.5px] ${dark ? "bg-white/[0.06] hover:bg-white/10" : "bg-black/[0.04] hover:bg-black/[0.07]"}`}>
                  {s.tag}
                </button>
              ))}
              <span className="ml-auto w-8 h-8 rounded-[10px] flex items-center justify-center text-white" style={{ background: CLAY }} aria-hidden="true">
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15V5M5 10l5-5 5 5" /></svg>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
