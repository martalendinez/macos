// src/components/windows/Notion/NotionWindow.jsx
// A Notion-style workspace with Marta's design docs: her process, project briefs, a decision log,
// research insights, learnings and a critique template. Content comes from the case studies.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { openWorkspace, useWorkspace } from "../../../config/workspaceBus";
import DemoBanner from "../DemoBanner";
import { PROJECT_DOCS } from "./projectDocs";
import { APP_STEPS, PROJECT_ORDER, WORKSPACE_PROJECTS } from "../../../config/projectWorkspaces";

/* ---------- content ---------- */
const PROJECTS = {
  trace: { name: "Trace", color: "purple", win: "thesisCaseStudy" },
  sallskap: { name: "Sällskap", color: "green", win: "groupDiningCaseStudy" },
  kallos: { name: "Kallos", color: "orange", win: "employerBrandingCaseStudy" },
  trivia: { name: "Trivia", color: "blue", win: "triviaCaseStudy" },
};

const BRIEFS = [
  {
    id: "trace",
    status: ["Done", "green"],
    type: "Master thesis · KTH",
    year: "2026",
    problem: "AI design tools prioritise automation over collaboration. Designers get output faster, but lose control, transparency and ownership.",
    hmw: "What design principles enable task-aware AI assistance to support UX designers’ exploration and decision-making while preserving transparency and human agency?",
    did: ["Literature review", "Interviews with 5 experts", "Design experiment: the same feature with and without AI", "Built Trace and tested two versions with 12 participants"],
    outcome: "Designers described Trace as a thinking partner, not a decision-maker.",
  },
  {
    id: "sallskap",
    status: ["Done", "green"],
    type: "Personal project",
    year: "2026",
    problem: "Group dinners fall apart in chat threads: who’s free, who’s vegan, who’s actually booking?",
    hmw: "How might we help a group agree on when and where to eat, without anyone having to explain their dietary needs in the group chat?",
    did: ["Analysed 5 booking platforms", "Interviewed 5 people who organise group dinners", "Pivoted from solo + groups to groups only", "Designed and built the web app"],
    outcome: "A web app that collects availability and dietary needs privately, then recommends restaurants that fit the whole group.",
  },
  {
    id: "kallos",
    status: ["Done", "green"],
    type: "Bachelor thesis · PrideCom",
    year: "2024",
    problem: "PrideCom’s employer-branding audits were manual and expensive, so they didn’t scale to SMEs.",
    hmw: "How might we turn a consultancy methodology into a self-serve product, without losing analytical depth or compromising data security?",
    did: ["Competitor, expert and literature research", "Double Diamond with three stakeholder groups", "2 rounds of testing with 11 participants"],
    outcome: "A working, user-validated prototype that turns scattered employer-brand signals into one score HR can act on.",
  },
  {
    id: "trivia",
    status: ["Done", "green"],
    type: "KTH group project",
    year: "2026",
    problem: "Trivia apps either take too long to start or give competitive players no reason to return.",
    hmw: "How might we get someone into a game in seconds, and still give competitive players a reason to come back?",
    did: ["Led the UI design", "Built the React Native front end", "Integrated a public trivia API"],
    outcome: "A mobile MVP with quick-start games and a consistent design system.",
  },
];

const DECISIONS = [
  { id: "d1", p: "sallskap", title: "Dietary needs are private by default", why: "Each member submits needs privately in a structured form, which removes social pressure and gives the matching accurate data.", cost: "The group doesn’t discuss needs openly, but every need is still respected in the recommendations." },
  { id: "d2", p: "sallskap", title: "Availability as a picker, not a poll", why: "A visual time selector replaces the “does Thursday work?” thread, and the app computes the overlap.", cost: "Less flexible than a chat message, which is exactly why the system can compute it." },
  { id: "d3", p: "sallskap", title: "A shortlist, not a search page", why: "The organizer chooses between a few good options instead of searching from scratch.", cost: "Fewer options means trusting the matching, so compatibility tags make that trust earned." },
  { id: "d4", p: "trace", title: "No generated UI. Ever.", why: "Trace outputs 3–5 options with assumptions and trade-offs: things to reason about, not artefacts to paste in.", cost: "Less flashy than a tool that spits out screens. That’s the point." },
  { id: "d5", p: "trace", title: "Feedback that knows where you are", why: "What the AI focuses on adapts across eight design stages, so pixel feedback doesn’t derail problem definition.", cost: "The designer has to state their stage: one extra input." },
  { id: "d6", p: "trace", title: "Critiques that admit uncertainty", why: "Each critique has a concern, a suggestion and a note on what the AI can’t know.", cost: "Hedged feedback feels less authoritative. Deliberately: the designer makes the call." },
  { id: "d7", p: "trace", title: "A trace you can edit and keep", why: "The session becomes an editable log of intent, critiques and improvements, so AI-assisted decisions are auditable.", cost: "Documenting takes a moment at the end." },
  { id: "d8", p: "kallos", title: "Privacy by design", why: "Encryption, local AI and GDPR flows from day one: experts were clear the product was worthless without them.", cost: "Real time out of a 4-month build." },
  { id: "d10", p: "trivia", title: "Play first, sign up later", why: "Guest play gets people into a game within a couple of taps; logging in unlocks history and the leaderboard.", cost: "Guests don’t get saved history or a leaderboard spot. That gap is exactly what nudges them to log in once they’re hooked." },
  { id: "d11", p: "trivia", title: "Two modes, two moods", why: "Leisure for a quick round, Challenge for competition, so neither audience wades through the other’s features.", cost: "Two sets of rules to explain. Clear labels and a separate visual treatment kept them from blurring." },
  { id: "d12", p: "trivia", title: "Design system first, components second", why: "Tokens and components defined in Figma and mirrored as reusable React Native components.", cost: "It slowed the first screens down, then made every screen after that much faster." },
  { id: "d9", p: "kallos", title: "Recommendations first, metrics second", why: "HR teams wanted to know what to do next, not stare at more charts, so the dashboard leads with three priority levels.", cost: "The detailed KPIs move one level down, grouped into themes, so the first screen stays simple." },
];

const INSIGHTS = {
  trace: [
    ["AI shines early, then fades.", "Focus Trace on early- and mid-stage exploration."],
    ["Over-automation kills engagement.", "Give options and critiques, never finished answers."],
    ["Confident tone, miscalibrated trust.", "Show the reasoning and admit uncertainty."],
    ["Nobody knows where AI belongs.", "Let the designer state the task type and stage up front."],
  ],
  sallskap: [
    ["Nobody supports the group decision.", "Start the product before the booking: at “who’s in, and when?”"],
    ["Dietary needs are an afterthought, and personal.", "Private, structured dietary input."],
    ["The organizer carries the mental load.", "The system does the matching; the organizer just confirms."],
  ],
  trivia: [
    ["Getting started takes too long.", "Guest play, and category plus difficulty chosen in one step."],
    ["Scoring is a mystery.", "Simple difficulty-based points, visible during every round."],
    ["Nothing to come back for.", "Saved history and a global leaderboard for logged-in players."],
  ],
  kallos: [
    ["Employer-branding data is fragmented.", "One data-input module feeding one holistic score."],
    ["People need guidance, not raw metrics.", "A recommendation-first dashboard."],
    ["Hierarchy is everything.", "KPIs grouped into themes, the most important insights first."],
  ],
};

const LEARNINGS = [
  ["sallskap", "Let research kill your favourite idea.", "Both research streams said groups were the real problem. Narrowing the scope made every later decision easier."],
  ["sallskap", "Privacy is a UX feature, not a setting.", "Nobody wants to explain dietary needs in a group chat. Private by default removes that social cost."],
  ["sallskap", "Tokens first saves time later.", "Dark mode was a class swap, not a redesign, when testing asked for it."],
  ["trace", "Structure beats prompting.", "Guiding the AI through stages lifted the burden of writing the perfect prompt."],
  ["trace", "Agency is fragile.", "One rejected idea coming back was enough to make people feel unheard. Respecting a “no” became a core feature."],
  ["kallos", "Trust is designed, not added.", "Encryption, local AI and GDPR shaped the product from day one."],
  ["kallos", "Speak the user’s language.", "Testers valued recommendations written in HR vocabulary more than any visual."],
];

const CRITIQUE = [
  ["Goal", ["What is this screen for, in one sentence?", "Who is the user and what were they doing before this?"]],
  ["Usability", ["Is the primary action obvious within 3 seconds?", "Can every task be done with a keyboard?", "Are errors prevented, and recoverable when they happen?"]],
  ["Accessibility", ["Text contrast at least 4.5:1 (3:1 for large text)", "Meaning never carried by colour alone", "Touch targets at least 44 × 44 px"]],
  ["Content", ["Labels use the user’s words, not ours", "Empty, loading and error states are designed"]],
  ["System", ["Built from existing components and tokens", "Anything new is documented for the design system"]],
];

/* ---------- theme ---------- */
const TAGS = {
  light: { gray: ["#e3e2e0", "#32302c"], green: ["#dbeddb", "#1c3829"], purple: ["#e8deee", "#412454"], orange: ["#fadec9", "#49290e"], blue: ["#d3e5ef", "#183347"], yellow: ["#fdecc8", "#402c1b"] },
  dark: { gray: ["#373737", "#e2e2e2"], green: ["#2b593f", "#d9f0e1"], purple: ["#492f64", "#ebdff5"], orange: ["#854c1d", "#fde8d6"], blue: ["#28456c", "#dcebf9"], yellow: ["#89632a", "#fdf0d3"] },
};
const Tag = ({ c, color, children }) => {
  const [bg, fg] = c.tags[color] || c.tags.gray;
  return <span className="inline-flex items-center rounded-[3px] px-1.5 text-[12.5px] leading-[20px] whitespace-nowrap" style={{ background: bg, color: fg }}>{children}</span>;
};

/* ---------- icons ---------- */
const ICONS = {
  home: "M3 9.5L10 4l7 5.5V16a1 1 0 0 1-1 1h-4v-4H8v4H4a1 1 0 0 1-1-1z",
  brief: "M5 3h7l3 3v11H5zM12 3v3h3M7.5 10h5M7.5 13h5",
  db: "M3.5 4.5h13v11h-13zM3.5 8h13M3.5 11.5h13M8 4.5v11",
  bulb: "M10 3a5 5 0 0 1 3 9v2H7v-2a5 5 0 0 1 3-9zM8 16.5h4",
  book: "M4 4.5A1.5 1.5 0 0 1 5.5 3H16v12H5.5A1.5 1.5 0 0 0 4 16.5zM4 16.5A1.5 1.5 0 0 0 5.5 18H16v-3",
  check: "M4 4h12v12H4zM7 10l2 2 4-4",
  chevron: "M7 5l5 5-5 5",
  search: "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM17 17l-3.5-3.5",
  table: "M3 4h14v12H3zM3 8h14M8 8v8",
  board: "M3 4h4v12H3zM8 4h4v8H8zM13 4h4v10h-4z",
  open: "M11 3h6v6M17 3l-8 8M14 11v5H4V6h5",
  close: "M5 5l10 10M15 5L5 15",
  trace: "M10 2.5v15M2.5 10h15M4.7 4.7l10.6 10.6M15.3 4.7 4.7 15.3",
  link: "M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.8.8M11.5 8.5a3 3 0 0 0-4.2 0L4.7 11.1a3 3 0 0 0 4.2 4.2l.8-.8",
};
const Ic = ({ n, className = "w-[18px] h-[18px]", style }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={ICONS[n]} />
  </svg>
);

const PROJECT_PAGES = PROJECT_ORDER.map((id) => ({ id, title: WORKSPACE_PROJECTS[id].name, icon: PROJECT_DOCS[id].icon, project: true }));
const PAGES = [
  { id: "home", title: "How I design", icon: "home" },
  { id: "briefs", title: "Project briefs", icon: "db" },
  { id: "decisions", title: "Decision log", icon: "db" },
  { id: "research", title: "Research insights", icon: "bulb" },
  { id: "learnings", title: "Learnings", icon: "book" },
  { id: "critique", title: "Design critique checklist", icon: "check" },
];

/* ---------- blocks ---------- */
function Toggle({ c, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="my-0.5">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex items-start gap-1 w-full text-left rounded-[4px] py-0.5 hover:bg-black/[0.03]" aria-expanded={open}>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="mt-[3px]" style={{ color: c.muted }}>
          <Ic n="chevron" className="w-4 h-4" />
        </motion.span>
        <span className="font-medium">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-[22px]">
            <div className="pb-2 pt-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
const Callout = ({ c, icon = "bulb", children }) => (
  <div className="my-2 flex gap-2.5 rounded-[4px] p-4" style={{ background: c.callout }}>
    <Ic n={icon} className="w-5 h-5 mt-px" style={{ color: c.muted }} />
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
const H2 = ({ children }) => <h2 className="mt-8 mb-1 text-[24px] font-semibold tracking-[-0.01em]">{children}</h2>;
const H3 = ({ children }) => <h3 className="mt-5 mb-1 text-[19px] font-semibold">{children}</h3>;

function PageLink({ c, page, go }) {
  const p = PAGES.find((x) => x.id === page);
  return (
    <button type="button" onClick={() => go(page)} className="flex items-center gap-1.5 rounded-[4px] px-0.5 py-0.5 hover:bg-black/[0.04] underline decoration-1 underline-offset-[3px]" style={{ textDecorationColor: c.border }}>
      <Ic n={p.icon} className="w-4 h-4" style={{ color: c.muted }} />
      <span className="font-medium">{p.title}</span>
    </button>
  );
}

/* ---------- pages ---------- */
const STEPS = [
  ["Research", "Interviews, competitor analysis and literature before any pixels.", "research"],
  ["Define", "One problem statement and a “How might we” the whole team can repeat.", "briefs"],
  ["Explore", "Sketch wide and cheap: pencil, then lo-fi, then hi-fi only for what survives.", null],
  ["Decide", "Write down every big decision and what it costs. Future me will ask why.", "decisions"],
  ["Test", "Real people, real tasks, at least two rounds. Then change things.", "learnings"],
  ["Systemise", "Tokens and components, so what we learned scales.", "critique"],
];

function HomePage({ c, go, onOpenWindow }) {
  return (
    <>
      <p className="text-[16px]" style={{ color: c.muted }}>My working notes. Every project starts from this page.</p>
      <Callout c={c}>
        I design and build, so my docs are short and practical: a brief anyone can read in two minutes, a log of decisions with their trade-offs, and a checklist before anything ships.
      </Callout>
      <H2>My process</H2>
      <div className="mt-2 grid grid-cols-1 @2xl:grid-cols-2 gap-2">
        {STEPS.map(([t, d, link], i) => (
          <div key={t} className="rounded-[6px] p-3" style={{ border: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: c.muted }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold">{t}</span>
            </div>
            <p className="mt-1 text-[14px]" style={{ color: c.muted }}>{d}</p>
            {link && <div className="mt-1 text-[14px]"><PageLink c={c} page={link} go={go} /></div>}
          </div>
        ))}
      </div>
      <H2>Tools I pair this with</H2>
      <div className="mt-2 flex flex-wrap gap-2 text-[14px]">
        {[
          ["Figma", "figma"],
          ["Design System", "designsystem"],
          ["Claude", "claude"],
          ["GitHub", "github"],
        ].map(([l, w]) => (
          <button key={l} type="button" onClick={() => onOpenWindow?.(w)} className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 hover:bg-black/[0.04]" style={{ border: `1px solid ${c.border}` }}>
            <img src={`/icons/apps/${w}.svg`} alt="" className="w-4 h-4" />
            {l}
          </button>
        ))}
      </div>
    </>
  );
}

// apps that hold each project's working files (from the shared registry)
const WORKSPACE_LINKS = Object.fromEntries(
  Object.values(WORKSPACE_PROJECTS).map((w) => [w.id, Object.entries(w.apps).filter(([app]) => app !== "notion").map(([app, label]) => [app, label, APP_STEPS[app][1]])])
);

function BriefsPage({ c, onOpenWindow, initial = null }) {
  const [open, setOpen] = useState(initial);
  const b = BRIEFS.find((x) => x.id === open);
  return (
    <>
      <p className="text-[16px]" style={{ color: c.muted }}>One page per project. Problem, question, what I did, what came out.</p>
      <DbTable c={c} cols={["Name", "Status", "Type", "Year"]} rows={BRIEFS.map((x) => [
        <span key="n" className="flex items-center gap-1.5 font-medium"><Ic n="brief" className="w-4 h-4" style={{ color: c.muted }} />{PROJECTS[x.id].name}</span>,
        <Tag key="s" c={c} color={x.status[1]}>{x.status[0]}</Tag>,
        <span key="t" style={{ color: c.muted }}>{x.type}</span>,
        <span key="y" className="tabular-nums">{x.year}</span>,
      ])} onRow={(i) => setOpen(BRIEFS[i].id)} />
      <Peek c={c} open={!!b} onClose={() => setOpen(null)} title={b && `${PROJECTS[b.id].name} brief`}>
        {b && (
          <>
            <Props c={c} items={[["Status", <Tag key="s" c={c} color={b.status[1]}>{b.status[0]}</Tag>], ["Type", b.type], ["Year", b.year]]} />
            <H3>Problem</H3>
            <p>{b.problem}</p>
            <Callout c={c} icon="bulb">
              <div className="text-[12px] font-semibold uppercase tracking-wide mb-1" style={{ color: c.muted }}>{b.id === "trace" ? "Research question" : "How might we"}</div>
              {b.hmw}
            </Callout>
            <H3>What I did</H3>
            <ul className="list-disc pl-6 space-y-0.5">{b.did.map((d) => <li key={d}>{d}</li>)}</ul>
            <H3>Outcome</H3>
            <p>{b.outcome}</p>
            {WORKSPACE_LINKS[b.id] && (
              <>
                <H3>Working files</H3>
                <div className="grid grid-cols-2 gap-2">
                  {WORKSPACE_LINKS[b.id].map(([app, label, name]) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => {
                        openWorkspace(app, b.id);
                        onOpenWindow?.(app);
                      }}
                      className="flex items-center gap-2 rounded-[6px] p-2.5 text-left text-[13.5px] hover:bg-black/[0.03]"
                      style={{ border: `1px solid ${c.border}` }}
                    >
                      <img src={`/icons/apps/${app}.svg`} alt="" className="w-6 h-6" />
                      <span>
                        <span className="block font-medium">{label}</span>
                        <span className="block text-[12px]" style={{ color: c.muted }}>{name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <button type="button" onClick={() => onOpenWindow?.(PROJECTS[b.id].win)} className="mt-4 flex items-center gap-1.5 text-[14px] font-medium hover:underline" style={{ color: c.link }}>
              <Ic n="open" className="w-4 h-4" /> Open the full case study
            </button>
          </>
        )}
      </Peek>
    </>
  );
}

function DecisionsPage({ c }) {
  const [view, setView] = useState("table");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const rows = DECISIONS.filter((d) => filter === "all" || d.p === filter);
  const d = DECISIONS.find((x) => x.id === open);
  return (
    <>
      <p className="text-[16px]" style={{ color: c.muted }}>Every big call, why I made it, and what it cost. Trade-offs written down are trade-offs I can defend.</p>
      <div className="mt-4 flex flex-wrap items-center gap-1 text-[14px]" style={{ borderBottom: `1px solid ${c.border}` }}>
        {[["table", "Table", "table"], ["board", "By project", "board"]].map(([k, l, ic]) => (
          <button key={k} type="button" onClick={() => setView(k)} className="flex items-center gap-1.5 px-2 py-1.5 -mb-px" style={view === k ? { borderBottom: `2px solid ${c.text}`, fontWeight: 500 } : { color: c.muted }}>
            <Ic n={ic} className="w-4 h-4" /> {l}
          </button>
        ))}
        <div className="ml-auto flex gap-1 pb-1">
          {["all", "trace", "sallskap", "kallos"].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className="rounded-[4px] px-2 py-0.5 text-[13px]" style={filter === f ? { background: c.hover, fontWeight: 500 } : { color: c.muted }}>
              {f === "all" ? "All" : PROJECTS[f].name}
            </button>
          ))}
        </div>
      </div>
      {view === "table" ? (
        <DbTable c={c} cols={["Decision", "Project", "Trade-off"]} rows={rows.map((x) => [
          <span key="n" className="font-medium">{x.title}</span>,
          <Tag key="p" c={c} color={PROJECTS[x.p].color}>{PROJECTS[x.p].name}</Tag>,
          <span key="t" className="line-clamp-1" style={{ color: c.muted }}>{x.cost}</span>,
        ])} onRow={(i) => setOpen(rows[i].id)} />
      ) : (
        <div className="mt-3 grid grid-cols-1 @2xl:grid-cols-3 gap-3">
          {["trace", "sallskap", "kallos"].filter((p) => filter === "all" || p === filter).map((p) => (
            <div key={p} className="rounded-[6px] p-2" style={{ background: c.callout }}>
              <div className="px-1 pb-2 flex items-center gap-2 text-[13px]">
                <Tag c={c} color={PROJECTS[p].color}>{PROJECTS[p].name}</Tag>
                <span style={{ color: c.muted }}>{DECISIONS.filter((x) => x.p === p).length}</span>
              </div>
              <div className="space-y-1.5">
                {DECISIONS.filter((x) => x.p === p).map((x) => (
                  <button key={x.id} type="button" onClick={() => setOpen(x.id)} className="w-full text-left rounded-[4px] p-2.5 text-[14px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:opacity-90" style={{ background: c.bg, boxShadow: `0 0 0 1px ${c.border}` }}>
                    {x.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Peek c={c} open={!!d} onClose={() => setOpen(null)} title={d?.title}>
        {d && (
          <>
            <Props c={c} items={[["Project", <Tag key="p" c={c} color={PROJECTS[d.p].color}>{PROJECTS[d.p].name}</Tag>]]} />
            <H3>Why</H3>
            <p>{d.why}</p>
            <H3>What it cost</H3>
            <Callout c={c} icon="bulb">{d.cost}</Callout>
          </>
        )}
      </Peek>
    </>
  );
}

function ResearchPage({ c }) {
  return (
    <>
      <p className="text-[16px]" style={{ color: c.muted }}>What research said, and what I did about it. Open a project.</p>
      {Object.entries(INSIGHTS).map(([p, list], i) => (
        <div key={p} className="mt-5">
          <div className="flex items-center gap-2"><Tag c={c} color={PROJECTS[p].color}>{PROJECTS[p].name}</Tag><span className="text-[13px]" style={{ color: c.muted }}>{list.length} insights</span></div>
          <div className="mt-1">
            {list.map(([t, so]) => (
              <Toggle key={t} c={c} title={t} defaultOpen={i === 0}>
                <div className="flex gap-2 text-[15px]">
                  <span className="font-semibold shrink-0" style={{ color: c.link }}>So →</span>
                  <span>{so}</span>
                </div>
              </Toggle>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function LearningsPage({ c }) {
  return (
    <>
      <p className="text-[16px]" style={{ color: c.muted }}>What each project taught me, so the next one starts smarter.</p>
      <div className="mt-4 space-y-2">
        {LEARNINGS.map(([p, t, d]) => (
          <div key={t} className="rounded-[6px] p-3.5" style={{ border: `1px solid ${c.border}` }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{t}</span>
              <Tag c={c} color={PROJECTS[p].color}>{PROJECTS[p].name}</Tag>
            </div>
            <p className="mt-1 text-[14.5px]" style={{ color: c.muted }}>{d}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function CritiquePage({ c }) {
  const all = CRITIQUE.flatMap(([, items]) => items);
  const [done, setDone] = useState({});
  const n = all.filter((x) => done[x]).length;
  return (
    <>
      <p className="text-[16px]" style={{ color: c.muted }}>The template I run before a design review or a hand-off. Try it on any screen.</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: c.hover }}>
          <motion.div className="h-full rounded-full" style={{ background: n === all.length ? "#2f9e44" : c.link }} animate={{ width: `${(n / all.length) * 100}%` }} />
        </div>
        <span className="text-[13px] tabular-nums" style={{ color: c.muted }}>{n}/{all.length}</span>
        {n > 0 && <button type="button" onClick={() => setDone({})} className="text-[13px]" style={{ color: c.muted }}>Reset</button>}
      </div>
      {CRITIQUE.map(([h, items]) => (
        <div key={h}>
          <H3>{h}</H3>
          {items.map((it) => (
            <label key={it} className="flex items-start gap-2 py-1 cursor-pointer select-none">
              <input type="checkbox" checked={!!done[it]} onChange={(e) => setDone((d) => ({ ...d, [it]: e.target.checked }))} className="mt-[5px] w-4 h-4 accent-[#2383e2]" />
              <span style={done[it] ? { textDecoration: "line-through", color: c.muted } : undefined}>{it}</span>
            </label>
          ))}
        </div>
      ))}
      <AnimatePresence>
        {n === all.length && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Callout c={c} icon="check">Ready for review. Ship it to the team.</Callout>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- project pages: one per case study, organised the way I keep project docs ---------- */
const TOC = [
  ["brief", "Brief"],
  ["plan", "Research plan"],
  ["insights", "Insights"],
  ["flow", "Flow"],
  ["decisions", "Decisions"],
  ["testing", "Testing"],
  ["learnings", "Learnings"],
  ["files", "Working files"],
];

function ProjectDocPage({ id, c, onOpenWindow }) {
  const doc = PROJECT_DOCS[id];
  const ws = WORKSPACE_PROJECTS[id];
  const [openDecision, setOpenDecision] = useState(null);
  const [next, setNext] = useState({});
  const decisions = DECISIONS.filter((d) => d.p === id);
  const d = DECISIONS.find((x) => x.id === openDecision);
  const jump = (k) => document.getElementById(`doc-${id}-${k}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const Anchor = ({ k, children }) => <div id={`doc-${id}-${k}`} className="scroll-mt-4"><H2>{children}</H2></div>;
  return (
    <>
      <div className="mt-1 mb-4">
        {doc.props.map(([k, v]) => (
          <div key={k} className="flex items-baseline py-1 text-[14px]">
            <span className="w-28 shrink-0" style={{ color: c.muted }}>{k}</span>
            <span>{v}</span>
          </div>
        ))}
        <div className="flex items-baseline py-1 text-[14px]">
          <span className="w-28 shrink-0" style={{ color: c.muted }}>Status</span>
          <Tag c={c} color={doc.status[1]}>{doc.status[0]}</Tag>
        </div>
      </div>
      <Callout c={c} icon="trace">
        <b>This page is a demo.</b> It recreates how I document a project, using the real content of the {ws.name} case study.
      </Callout>

      <div className="my-4 rounded-[6px] p-3 text-[14px]" style={{ border: `1px solid ${c.border}` }}>
        <div className="text-[12px] font-medium mb-1" style={{ color: c.muted }}>On this page</div>
        <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-x-4">
          {TOC.map(([k, l]) => (
            <button key={k} type="button" onClick={() => jump(k)} className="text-left py-0.5 underline decoration-1 underline-offset-[3px] hover:opacity-70" style={{ textDecorationColor: c.border }}>
              {k === "flow" ? doc.flowTitle : l}
            </button>
          ))}
        </div>
      </div>

      <Anchor k="brief">Brief</Anchor>
      <p>{doc.problem}</p>
      <Callout c={c} icon="bulb">
        <div className="text-[12px] font-semibold uppercase tracking-wide mb-1" style={{ color: c.muted }}>{doc.question[0]}</div>
        {doc.question[1]}
      </Callout>
      <H3>Goals</H3>
      <ol className="list-decimal pl-6 space-y-0.5">{doc.goals.map((g) => <li key={g}>{g}</li>)}</ol>

      <Anchor k="plan">Research plan</Anchor>
      <DbTable c={c} cols={["Method", "Scope", "Why"]} rows={doc.methods.map(([m, sc, why]) => [<span key="m" className="font-medium">{m}</span>, <span key="s" style={{ color: c.muted }}>{sc}</span>, <span key="w">{why}</span>])} />
      {doc.pivot && (
        <Callout c={c} icon="trace">
          <div className="text-[12px] font-semibold uppercase tracking-wide mb-1" style={{ color: c.muted }}>The pivot</div>
          {doc.pivot}
        </Callout>
      )}

      <Anchor k="insights">Insights</Anchor>
      <p className="text-[14.5px]" style={{ color: c.muted }}>{doc.insightsNote}</p>
      <div className="mt-1">
        {(INSIGHTS[id] || []).map(([t, so], i) => (
          <Toggle key={t} c={c} title={t} defaultOpen={i === 0}>
            <div className="flex gap-2 text-[15px]">
              <span className="font-semibold shrink-0" style={{ color: c.link }}>So →</span>
              <span>{so}</span>
            </div>
          </Toggle>
        ))}
      </div>

      <Anchor k="flow">{doc.flowTitle}</Anchor>
      <div className="mt-2 space-y-1.5">
        {doc.flow.map(([st, desc], i) => (
          <div key={st} className="flex gap-3 rounded-[6px] p-2.5" style={{ background: i % 2 ? undefined : c.callout }}>
            <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: ws.tint }}>{i + 1}</span>
            <span className="text-[14.5px]"><b>{st}.</b> <span style={{ color: c.muted }}>{desc}</span></span>
          </div>
        ))}
      </div>

      <Anchor k="decisions">Decisions</Anchor>
      <p className="text-[14.5px]" style={{ color: c.muted }}>Every big call and what it cost. Click a row.</p>
      <DbTable c={c} cols={["Decision", "Trade-off"]} rows={decisions.map((x) => [<span key="n" className="font-medium">{x.title}</span>, <span key="t" className="line-clamp-2" style={{ color: c.muted }}>{x.cost}</span>])} onRow={(i) => setOpenDecision(decisions[i].id)} />

      <Anchor k="testing">Testing</Anchor>
      {doc.rounds.map((r) => (
        <div key={r.name} className="mt-3">
          <H3>{r.name}</H3>
          {r.quote && <blockquote className="my-2 pl-3 text-[15px] italic" style={{ borderLeft: `3px solid ${c.text}` }}>{r.quote}</blockquote>}
          <div className="mt-2">
            {r.items.map(([found, changed]) => (
              <div key={found} className="flex gap-2 py-1.5 text-[14.5px]" style={{ borderBottom: `1px solid ${c.border}` }}>
                <input type="checkbox" checked readOnly className="mt-[5px] w-4 h-4 accent-[#2383e2]" aria-label="Shipped" />
                <span className="min-w-0">
                  <span style={{ color: c.muted }}>{found}</span>
                  <span className="block"><b>→</b> {changed} <Tag c={c} color="green">Shipped</Tag></span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Anchor k="learnings">Learnings</Anchor>
      <div className="space-y-2">
        {doc.learnings.map(([t, x]) => (
          <div key={t} className="rounded-[6px] p-3" style={{ border: `1px solid ${c.border}` }}>
            <div className="font-semibold">{t}</div>
            <p className="mt-0.5 text-[14.5px]" style={{ color: c.muted }}>{x}</p>
          </div>
        ))}
      </div>
      {doc.next?.length > 0 && (
        <>
          <H3>Next steps</H3>
          {doc.next.map((n) => (
            <label key={n} className="flex items-start gap-2 py-1 cursor-pointer select-none">
              <input type="checkbox" checked={!!next[n]} onChange={(e) => setNext((x) => ({ ...x, [n]: e.target.checked }))} className="mt-[5px] w-4 h-4 accent-[#2383e2]" />
              <span style={next[n] ? { textDecoration: "line-through", color: c.muted } : undefined}>{n}</span>
            </label>
          ))}
        </>
      )}

      <Anchor k="files">Working files</Anchor>
      <p className="text-[14.5px]" style={{ color: c.muted }}>The same project, in the other tools of this demo.</p>
      <div className="mt-2 grid grid-cols-1 @2xl:grid-cols-2 gap-2">
        {WORKSPACE_LINKS[id].map(([app, label, name]) => (
          <button
            key={app}
            type="button"
            onClick={() => {
              openWorkspace(app, id);
              onOpenWindow?.(app);
            }}
            className="flex items-center gap-3 rounded-[6px] p-3 text-left hover:bg-black/[0.03]"
            style={{ border: `1px solid ${c.border}` }}
          >
            <img src={`/icons/apps/${app}.svg`} alt="" className="w-7 h-7" />
            <span>
              <span className="block font-medium text-[14.5px]">{label}</span>
              <span className="block text-[12.5px]" style={{ color: c.muted }}>{name}</span>
            </span>
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onOpenWindow?.(ws.caseStudy)} className="mt-5 flex items-center gap-1.5 text-[14px] font-medium hover:underline" style={{ color: c.link }}>
        <Ic n="open" className="w-4 h-4" /> Open the full case study
      </button>

      <Peek c={c} open={!!d} onClose={() => setOpenDecision(null)} title={d?.title}>
        {d && (
          <>
            <H3>Why</H3>
            <p>{d.why}</p>
            <H3>What it cost</H3>
            <Callout c={c} icon="bulb">{d.cost}</Callout>
          </>
        )}
      </Peek>
    </>
  );
}

/* ---------- database pieces ---------- */
function DbTable({ c, cols, rows, onRow }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-[14px] border-collapse min-w-[520px]">
        <thead>
          <tr style={{ color: c.muted }}>
            {cols.map((h, i) => (
              <th key={h} className="text-left font-normal px-2 py-1.5" style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`, borderLeft: i ? `1px solid ${c.border}` : "none" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} onClick={() => onRow?.(ri)} className="cursor-pointer group" style={{ borderBottom: `1px solid ${c.border}` }}>
              {r.map((cell, ci) => (
                <td key={ci} className="px-2 py-2 align-top group-hover:bg-black/[0.025]" style={{ borderLeft: ci ? `1px solid ${c.border}` : "none" }}>
                  {cell}
                  {ci === 0 && <span className="ml-2 opacity-0 group-hover:opacity-100 text-[11px] font-medium rounded-[3px] px-1 align-middle" style={{ background: c.hover, color: c.muted }}>OPEN</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const Props = ({ c, items }) => (
  <div className="mb-4 space-y-1 text-[14px]">
    {items.map(([k, v]) => (
      <div key={k} className="flex items-center">
        <span className="w-28 shrink-0" style={{ color: c.muted }}>{k}</span>
        <span>{v}</span>
      </div>
    ))}
  </div>
);
function Peek({ c, open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="absolute inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: "rgba(0,0,0,0.12)" }} onClick={onClose} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 380, damping: 40 }} className="absolute top-0 right-0 bottom-0 z-30 w-full max-w-[560px] overflow-y-auto shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.3)]" style={{ background: c.bg, borderLeft: `1px solid ${c.border}` }}>
            <div className="sticky top-0 flex items-center gap-2 px-4 py-2" style={{ background: c.bg }}>
              <button type="button" onClick={onClose} className="w-7 h-7 rounded-[4px] flex items-center justify-center hover:bg-black/[0.05]" style={{ color: c.muted }} aria-label="Close">
                <Ic n="close" className="w-4 h-4" />
              </button>
            </div>
            <div className="px-8 @2xl:px-12 pb-10 text-[15.5px] leading-[1.6]">
              <h1 className="text-[30px] font-bold leading-tight tracking-[-0.01em] mb-4">{title}</h1>
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const COVERS = {
  home: "linear-gradient(120deg,#f9d8c4 0%,#f3c6d8 45%,#c9d7f5 100%)",
  briefs: "linear-gradient(120deg,#d6e6f5,#e9def3)",
  decisions: "linear-gradient(120deg,#fbe6c8,#f6d4cf)",
  research: "linear-gradient(120deg,#d9efe1,#d4e7f3)",
  learnings: "linear-gradient(120deg,#ece2f6,#f8e1ea)",
  critique: "linear-gradient(120deg,#e2ecd5,#d8ebe8)",
  trace: "linear-gradient(120deg,#e9e8ff 0%,#d9d8ff 50%,#c7d5ff 100%)",
};

export default function NotionWindow({ theme = "light", onOpenWindow }) {
  const dark = theme === "dark";
  const c = dark
    ? { bg: "#191919", side: "#202020", text: "rgba(255,255,255,0.86)", muted: "rgba(255,255,255,0.46)", border: "rgba(255,255,255,0.094)", hover: "rgba(255,255,255,0.055)", callout: "rgba(255,255,255,0.05)", link: "#529cca", tags: TAGS.dark }
    : { bg: "#ffffff", side: "#f7f7f5", text: "#37352f", muted: "#787774", border: "#e9e9e7", hover: "rgba(55,53,47,0.08)", callout: "#f1f1ef", link: "#2383e2", tags: TAGS.light };
  const [page, setPage] = useState("home");
  const [focus, setFocus] = useState(null);
  useWorkspace("notion", (p) => {
    if (PROJECT_PAGES.some((x) => x.id === p)) setPage(p);
    else if (PROJECTS[p]) {
      setFocus(p);
      setPage("briefs");
    }
  });
  const ALL = [...PAGES, ...PROJECT_PAGES];
  const p = ALL.find((x) => x.id === page);
  const go = (id) => {
    setFocus(null);
    setPage(id);
  };

  return (
    <div className="@container no-darkwin h-full flex" style={{ background: c.bg, color: c.text, fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif' }}>
      <aside className="hidden @3xl:flex w-[230px] shrink-0 flex-col text-[14px]" style={{ background: c.side, borderRight: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="w-6 h-6 rounded-[5px] flex items-center justify-center text-[12px] font-bold text-white bg-[#37352f]">M</span>
          <span className="font-semibold truncate">Marta’s Design Notes</span>
        </div>
        <div className="px-2 flex items-center gap-2 py-1 rounded-[4px] mx-1" style={{ color: c.muted }}>
          <Ic n="search" className="w-4 h-4" /> Search
        </div>
        <div className="mt-4 px-3 text-[12px] font-medium" style={{ color: c.muted }}>Design</div>
        <nav className="mt-1 px-1 space-y-px">
          {PAGES.map((x) => (
            <button key={x.id} type="button" onClick={() => go(x.id)} className="w-full flex items-center gap-2 rounded-[4px] px-2 py-1 text-left" style={page === x.id ? { background: c.hover, fontWeight: 500 } : { color: c.muted }}>
              <Ic n={x.icon} className="w-[17px] h-[17px]" />
              <span className="truncate" style={{ color: page === x.id ? c.text : undefined }}>{x.title}</span>
            </button>
          ))}
        </nav>
        <div className="mt-4 px-3 text-[12px] font-medium" style={{ color: c.muted }}>Projects</div>
        <nav className="mt-1 px-1 space-y-px">
          {PROJECT_PAGES.map((x) => (
            <button key={x.id} type="button" onClick={() => go(x.id)} className="w-full flex items-center gap-2 rounded-[4px] px-2 py-1 text-left" style={page === x.id ? { background: c.hover, fontWeight: 500 } : { color: c.muted }}>
              <Ic n={x.icon} className="w-[17px] h-[17px]" />
              <span className="truncate" style={{ color: page === x.id ? c.text : undefined }}>{x.title}</span>
              <span className="ml-auto text-[10px] rounded-[3px] px-1" style={{ background: c.hover }}>DEMO</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-3 text-[12px]" style={{ color: c.muted }}>Content from my case studies</div>
      </aside>

      <main className="relative flex-1 min-w-0 flex flex-col">
        {p.project && <DemoBanner project={p.title} dark={dark} onBack={() => onOpenWindow?.(WORKSPACE_PROJECTS[page].caseStudy)} />}
        <div className="shrink-0 flex items-center gap-1 px-3 h-11 text-[14px]">
          <button type="button" onClick={() => go("home")} className="rounded-[4px] px-1.5 py-0.5 hover:bg-black/[0.04]">{p.project ? "Projects" : "Design"}</button>
          <span style={{ color: c.muted }}>/</span>
          <span className="flex items-center gap-1.5 px-1.5"><Ic n={p.icon} className="w-4 h-4" />{p.title}</span>
          <select value={page} onChange={(e) => go(e.target.value)} className="@3xl:hidden ml-auto bg-transparent text-[13px] rounded-[4px] px-1 py-0.5" style={{ border: `1px solid ${c.border}` }} aria-label="Page">
            {ALL.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
          </select>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
              <div className="h-[120px] @2xl:h-[150px]" style={{ background: COVERS[page] || PROJECT_DOCS[page]?.cover, filter: dark ? "brightness(0.55) saturate(1.3)" : undefined }} />
              <div className="max-w-[760px] mx-auto px-6 @2xl:px-14 pb-20 text-[16px] leading-[1.6]">
                <div className="-mt-9 w-[72px] h-[72px] rounded-[10px] flex items-center justify-center shadow-sm" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                  <Ic n={p.icon} className="w-10 h-10" />
                </div>
                <h1 className="mt-4 mb-2 text-[34px] @2xl:text-[40px] font-bold leading-tight tracking-[-0.02em]">{p.title}</h1>
                {page === "home" && <HomePage c={c} go={go} onOpenWindow={onOpenWindow} />}
                {page === "briefs" && <BriefsPage key={focus || "briefs"} initial={focus} c={c} onOpenWindow={onOpenWindow} />}
                {page === "decisions" && <DecisionsPage c={c} />}
                {page === "research" && <ResearchPage c={c} />}
                {page === "learnings" && <LearningsPage c={c} />}
                {page === "critique" && <CritiquePage c={c} />}
                {p.project && <ProjectDocPage key={page} id={page} c={c} onOpenWindow={onOpenWindow} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
