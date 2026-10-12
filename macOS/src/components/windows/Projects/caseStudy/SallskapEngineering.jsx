// src/components/windows/Projects/caseStudy/SallskapEngineering.jsx
// "Design → code" for Sällskap. Every snippet, token and table below is taken from the real repo
// (github.com/martalendinez/Sallskap): src/index.css, tailwind.config.ts, src/components/DietaryBadge.tsx,
// src/utils/filtering.ts and the Supabase calls in src/screens.
import { useState } from "react";
import { motion } from "framer-motion";

const SANS = '"Public Sans", Inter, -apple-system, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

/* ---------- tiny syntax colouring ---------- */
const C = {
  key: "#c792ea",
  str: "#c3e88d",
  attr: "#82aaff",
  num: "#f78c6c",
  cm: "rgba(255,255,255,0.38)",
  tag: "#f07178",
  base: "#d8d8e4",
};
const k = (s) => <span style={{ color: C.key }}>{s}</span>;
const st = (s) => <span style={{ color: C.str }}>{s}</span>;
const at = (s) => <span style={{ color: C.attr }}>{s}</span>;
const nu = (s) => <span style={{ color: C.num }}>{s}</span>;
const cm = (s) => <span style={{ color: C.cm }}>{s}</span>;
const tg = (s) => <span style={{ color: C.tag }}>{s}</span>;

function Editor({ file, children, className = "" }) {
  return (
    <figure className={`min-w-0 rounded-[14px] overflow-hidden ${className}`} style={{ background: "#15151b", boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -26px rgba(0,0,0,0.6)" }}>
      <div className="h-8 px-3 flex items-center gap-1.5 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-white/45 truncate" style={{ fontFamily: MONO }}>
          {file}
        </span>
      </div>
      <pre className="p-4 overflow-x-auto text-[11.5px] @2xl:text-[12px] leading-[1.75]" style={{ fontFamily: MONO, color: C.base }}>
        {children}
      </pre>
    </figure>
  );
}

function Step({ n, title, children, theme, tint }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: tint }}>
        {n}
      </span>
      <span className={`text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>{title}</span>
      {children}
    </div>
  );
}

/* ---------- 1. tokens ---------- */
const TOKENS = [
  { name: "--primary", light: "158 19% 29%", dark: "0 0% 100%", use: "Buttons, selected states" },
  { name: "--accent", light: "32 80% 50%", dark: "0 0% 18%", use: "Ratings, highlights" },
  { name: "--background", light: "40 12% 97%", dark: "0 0% 7%", use: "Page" },
  { name: "--card", light: "0 0% 100%", dark: "0 0% 12%", use: "Surfaces" },
  { name: "--muted-foreground", light: "0 0% 45%", dark: "0 0% 70%", use: "Secondary text" },
];
const hsl = (v) => `hsl(${v.split(" ").join(", ")})`;

function Tokens({ theme, tint }) {
  const [mode, setMode] = useState("light");
  return (
    <div>
      <Step n={1} title="Tokens: one source of truth, two themes" theme={theme} tint={tint}>
        <div className={`ml-auto flex rounded-full p-0.5 text-[12px] font-medium ${theme.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
          {["light", "dark"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full capitalize transition ${mode === m ? (theme.isDark ? "bg-white/20 text-white" : "bg-white text-black shadow-sm") : theme.textSub}`}
            >
              {m}
            </button>
          ))}
        </div>
      </Step>
      <div className="grid grid-cols-1 @3xl:grid-cols-[1fr_1.15fr] gap-5 items-start">
        <div className="rounded-[14px] overflow-hidden" style={{ boxShadow: theme.isDark ? "0 0 0 1px rgba(255,255,255,0.08)" : "0 0 0 1px rgba(0,0,0,0.07)" }}>
          {TOKENS.map((t) => (
            <motion.div key={t.name} layout className={`flex items-center gap-3 px-4 py-3 border-b last:border-b-0 ${theme.divider}`}>
              <motion.span
                className="w-9 h-9 shrink-0"
                animate={{ background: hsl(mode === "light" ? t.light : t.dark) }}
                transition={{ duration: 0.35 }}
                style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
              />
              <span className="min-w-0">
                <span className={`block text-[12.5px] font-medium ${theme.textMain}`} style={{ fontFamily: MONO }}>
                  {t.name}
                </span>
                <span className={`block text-[12px] ${theme.textSub}`}>{t.use}</span>
              </span>
              <span className={`ml-auto text-[11px] tabular-nums ${theme.textSub}`} style={{ fontFamily: MONO }}>
                {mode === "light" ? t.light : t.dark}
              </span>
            </motion.div>
          ))}
        </div>
        <Editor file="src/index.css">
          {cm("/* LIGHT + DARK MODE TOKENS */")}
          {"\n"}
          {at(":root")} {"{"}
          {"\n  "}
          {at("--primary")}: {nu("158 19% 29%")}; {cm("/* forest */")}
          {"\n  "}
          {at("--accent")}: {nu("32 80% 50%")}; {cm("/* amber */")}
          {"\n  "}
          {at("--background")}: {nu("40 12% 97%")};{"\n  "}
          {at("--radius")}: {nu("12px")};{"\n"}
          {"}"}
          {"\n"}
          {at(".dark")} {"{"}
          {"\n  "}
          {at("--primary")}: {nu("0 0% 100%")};{"\n  "}
          {at("--background")}: {nu("0 0% 7%")};{"\n"}
          {"}"}
          {"\n\n"}
          {cm("// tailwind.config.ts")}
          {"\n"}
          {at("primary")}: {st('"hsl(var(--primary))"')},{"\n"}
          {cm("// ⭐ Scandinavian square radius system")}
          {"\n"}
          {at("borderRadius")}: {"{ "}
          {at("sm")}: {st('"0px"')}, {at("md")}: {st('"0px"')}, {at("lg")}: {st('"0px"')} {"}"}
        </Editor>
      </div>
      <p className={`mt-4 text-[14px] leading-relaxed ${theme.textSub}`}>
        Colours live as HSL variables, so dark mode is a single class swap instead of a second stylesheet. Even the square corners are a token decision: every radius is set to zero for that
        calm, Scandinavian geometry.
      </p>
    </div>
  );
}

/* ---------- 2. component ---------- */
function Badge({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all duration-200"
      style={{
        fontFamily: SANS,
        background: selected ? "hsl(158,19%,29%)" : "#fff",
        color: selected ? "#fafafa" : "hsl(0,0%,45%)",
        boxShadow: selected ? "none" : "inset 0 0 0 1px rgba(0,0,0,0.08)",
      }}
    >
      {selected && (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      )}
      {label}
    </button>
  );
}

function Component({ theme, tint }) {
  const [sel, setSel] = useState(["Vegetarian", "Dairy-free"]);
  const opts = ["Vegan", "Vegetarian", "Gluten-free", "Dairy-free", "Nut-free", "Halal"];
  return (
    <div>
      <Step n={2} title="Components: built once, used everywhere" theme={theme} tint={tint} />
      <div className="grid grid-cols-1 @3xl:grid-cols-[1fr_1.15fr] gap-5 items-stretch">
        <div className="rounded-[14px] p-5 flex flex-col" style={{ background: "hsl(40,12%,97%)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45" style={{ fontFamily: SANS }}>
            Live component · try it
          </div>
          <div className="mt-1 text-[18px] font-bold text-[#1a1a1a]" style={{ fontFamily: SANS }}>
            Dietary restrictions
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {opts.map((o) => (
              <Badge key={o} label={o} selected={sel.includes(o)} onClick={() => setSel((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]))} />
            ))}
          </div>
          <div className="mt-auto pt-5 grid grid-cols-2 gap-3 text-[11px] text-black/55" style={{ fontFamily: SANS }}>
            <div>
              <div className="font-semibold text-black/75">Selected</div>
              bg-primary · check icon
            </div>
            <div>
              <div className="font-semibold text-black/75">Default</div>
              bg-card · 1px outline, darkens on hover
            </div>
          </div>
        </div>
        <Editor file="src/components/DietaryBadge.tsx">
          {k("const")} {at("DietaryBadge")} = ({"{ "}label, selected, onClick{" }"}) {"=>"} ({"\n"}
          {"  "}&lt;{tg("button")}{"\n"}
          {"    "}
          {at("onClick")}={"{"}onClick{"}"}
          {"\n"}
          {"    "}
          {at("className")}={"{`"}
          {"\n"}
          {"      "}
          {st("inline-flex items-center gap-2 px-6 py-3")}
          {"\n"}
          {"      "}
          {st("rounded-sm text-sm font-medium transition-all")}
          {"\n"}
          {"      "}${"{"}selected{"\n"}
          {"        "}? {st("'bg-primary text-primary-foreground'")}
          {"\n"}
          {"        "}: {st("'bg-card text-muted-foreground outline")}
          {"\n"}
          {"           "}
          {st("outline-1 outline-black/5 hover:outline-black/20'")}
          {"}"}
          {"\n"}
          {"    "}
          {"`}"}&gt;{"\n"}
          {"    "}
          {"{"}selected && &lt;{tg("Check")} {at("className")}={st('"w-3.5 h-3.5"')} /&gt;{"}"}
          {"\n"}
          {"    "}
          {"{"}label{"}"}
          {"\n"}
          {"  "}&lt;/{tg("button")}&gt;{"\n"});
        </Editor>
      </div>
      <p className={`mt-4 text-[14px] leading-relaxed ${theme.textSub}`}>
        Components only reference tokens (<code style={{ fontFamily: MONO }}>bg-primary</code>, <code style={{ fontFamily: MONO }}>bg-card</code>), never raw colours, so the same badge works in light and dark
        mode for free. 14 custom components, each with a single job: MemberCard, RestaurantCard, StepIndicator, StickyBottomButton…
      </p>
    </div>
  );
}

/* ---------- 3. data + matching ---------- */
function Table({ name, cols, x, y, theme }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="170" height={34 + cols.length * 22} rx="10" fill={theme.isDark ? "#1f1f24" : "#fff"} stroke={theme.isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)"} />
      <rect width="170" height="30" rx="10" fill="hsl(158,19%,29%)" />
      <rect y="20" width="170" height="10" fill="hsl(158,19%,29%)" />
      <text x="14" y="20" fontFamily={MONO} fontSize="12" fontWeight="600" fill="#fff">
        {name}
      </text>
      {cols.map((c, i) => (
        <text key={c} x="14" y={52 + i * 22} fontFamily={MONO} fontSize="11.5" fill={theme.isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)"}>
          {c}
        </text>
      ))}
    </g>
  );
}

function Data({ theme, tint }) {
  const stroke = theme.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  return (
    <div>
      <Step n={3} title="Data & logic: the matching in one line" theme={theme} tint={tint} />
      <div className="grid grid-cols-1 @3xl:grid-cols-[1fr_1.15fr] gap-5 items-start">
        <div className="rounded-[14px] p-3" style={{ boxShadow: theme.isDark ? "0 0 0 1px rgba(255,255,255,0.08)" : "0 0 0 1px rgba(0,0,0,0.07)" }}>
          <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="Supabase tables: groups, members, availability, restrictions">
            <g fill="none" stroke={stroke} strokeWidth="1.5">
              <path d="M180 47 H215" />
              <path d="M300 112 V150 H105 V180" />
              <path d="M300 150 V180" />
            </g>
            <Table theme={theme} name="groups" cols={["id", "name"]} x={10} y={20} />
            <Table theme={theme} name="members" cols={["id", "group_id →", "name"]} x={215} y={20} />
            <Table theme={theme} name="availability" cols={["member_id →", "date", "time_slot"]} x={20} y={180} />
            <Table theme={theme} name="restrictions" cols={["member_id →", "restriction"]} x={215} y={180} />
          </svg>
        </div>
        <Editor file="src/utils/filtering.ts">
          {k("export function")} {at("getGroupRestrictions")}(members) {"{"}
          {"\n  "}
          {k("return")} [...{k("new")} Set(members.{at("flatMap")}((m) {"=>"} m.restrictions))];{"\n"}
          {"}"}
          {"\n\n"}
          {k("export function")} {at("filterRestaurants")}(restaurants, members) {"{"}
          {"\n  "}
          {k("const")} needed = getGroupRestrictions(members);{"\n  "}
          {k("if")} (needed.length === {nu("0")}) {k("return")} restaurants;{"\n\n  "}
          {cm("// a restaurant qualifies only if it works for EVERYONE")}
          {"\n  "}
          {k("return")} restaurants.{at("filter")}((r) {"=>"}{"\n    "}
          needed.{at("every")}((n) {"=>"} r.restrictionsAccommodated.{at("includes")}(n)){"\n  "});{"\n"}
          {"}"}
        </Editor>
      </div>
      <p className={`mt-4 text-[14px] leading-relaxed ${theme.textSub}`}>
        Four Supabase tables keep each person’s answers separate: availability and restrictions belong to a member, not to the group chat. The UX promise “only restaurants that fit everyone”
        is literally an <code style={{ fontFamily: MONO }}>every()</code>: the union of the group’s needs, and no restaurant that misses one of them.
      </p>
    </div>
  );
}

export default function SallskapEngineering({ theme, tint }) {
  return (
    <div className="space-y-14">
      <Tokens theme={theme} tint={tint} />
      <Component theme={theme} tint={tint} />
      <Data theme={theme} tint={tint} />
    </div>
  );
}
