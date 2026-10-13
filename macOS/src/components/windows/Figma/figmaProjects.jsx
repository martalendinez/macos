// src/components/windows/Figma/figmaProjects.jsx
// Pages, frames and comments for each project's demo design file. Images are the ones used in the
// case studies; comments are Marta's real findings and changes; `code` links a frame to its source file.
import { OldLog, OldOptions, TracePanel } from "../Projects/caseStudy/TracePanels";
import traceCover from "../../../imgs/case-study/trace/Trace_Cover.png";
import figmaTrace from "../../../imgs/case-study/trace/figma_trace.png";
import salCover from "../../../imgs/case-study/sallskap/Sallskap_Shot_web.jpg";
import salPersona from "../../../imgs/case-study/sallskap/Elina_Persona.png";
import salEmpathy from "../../../imgs/case-study/sallskap/Elina_Empathy_Map.png";
import salFlow from "../../../imgs/case-study/sallskap/Dining_Flowchart.png";
import salData from "../../../imgs/case-study/sallskap/Flowchart_Sakura_Data.png";
import salRestrictions from "../../../imgs/case-study/sallskap/Dining_Restrictions.png";
import salGroup from "../../../imgs/case-study/sallskap/Dining_Group.png";
import salRestaurant from "../../../imgs/case-study/sallskap/Dining_Restaurant.png";
import salReviews from "../../../imgs/case-study/sallskap/Dining_Reviews.png";
import salDark from "../../../imgs/case-study/sallskap/Dining_Dark.png";
import salArch from "../../../imgs/case-study/sallskap/Sakura_Architecture.png";
import kalCover from "../../../imgs/case-study/kallos/Kallos_Mockup_web.jpg";
import kalPersona from "../../../imgs/case-study/kallos/Persona_web.jpg";
import kalEmpathy from "../../../imgs/case-study/kallos/Empathy_Map1.jpg";
import kalIA from "../../../imgs/case-study/kallos/IA.png";
import kalSurvey from "../../../imgs/case-study/kallos/Survey_Iterations_clean.png";
import kalDashboard from "../../../imgs/case-study/kallos/Dashboard.png";
import kalRecs from "../../../imgs/case-study/kallos/recommendations.png";
import triCover from "../../../imgs/case-study/trivia/Trivia_Final_web.jpg";
import triLoHome from "../../../imgs/case-study/trivia/lofi/home.png";
import triLoChallenge from "../../../imgs/case-study/trivia/lofi/challenge.png";
import triLoRanking from "../../../imgs/case-study/trivia/lofi/ranking.png";
import triOnboarding from "../../../imgs/case-study/trivia/screens/Onboarding.jpg";
import triCategories from "../../../imgs/case-study/trivia/screens/Categories.jpg";
import triChallenge from "../../../imgs/case-study/trivia/screens/TriviaChallenge.jpg";
import triRanking from "../../../imgs/case-study/trivia/screens/TriviaRanking.jpg";
import triProfile from "../../../imgs/case-study/trivia/screens/TriviaProfile.jpg";

/** An image frame sized from the source's aspect ratio. */
const img = (id, name, src, x, y, w, [iw, ih], extra = {}) => ({
  id,
  name,
  x,
  y,
  w,
  h: Math.round((w * ih) / iw),
  bg: "#fff",
  render: () => <img src={src} alt={name} className="w-full h-full object-contain" draggable={false} />,
  ...extra,
});
const phone = (id, name, src, x, w = 240, ratio = [1520, 3290], extra = {}) => ({
  ...img(id, name, src, x, 0, w, ratio, extra),
  render: () => <img src={src} alt={name} className="w-full h-full object-cover rounded-[22px]" draggable={false} />,
  bg: "transparent",
});

const INSIGHTS = [
  ["AI shines early, then fades.", "Focus on early- and mid-stage exploration."],
  ["Over-automation kills engagement.", "Options and critiques, never finished answers."],
  ["Confident tone, miscalibrated trust.", "Visible reasoning and honest uncertainty."],
  ["Nobody knows where AI belongs.", "The designer states task type and stage up front."],
  ["Failures break the flow.", "Steerable outputs and recovery paths at every step."],
];
const STAGES = ["Intent", "Context", "Options", "Critique", "Improve", "Trace"];
const CODE = { Intent: "src/components/steps/IntentStep.tsx", Context: "src/components/steps/ContextStep.tsx", Options: "src/components/steps/OptionsStep.tsx", "Mix & match": "src/components/steps/OptionsStep.tsx", Critique: "src/components/steps/CritiqueStep.tsx", Trace: "src/components/steps/TraceStep.tsx" };

function Sticky({ color, children, w = 200 }) {
  return (
    <div className="p-4 text-[14px] leading-snug text-[#1e1e1e] shadow-[0_2px_6px_rgba(0,0,0,0.12)]" style={{ width: w, minHeight: 120, background: color, fontFamily: "Inter, sans-serif" }}>
      {children}
    </div>
  );
}

const TRACE_PAGES = [
  {
    id: "cover",
    name: "Cover",
    frames: [
      { id: "cover", name: "Cover", x: 0, y: 0, w: 960, h: 536, render: () => <img src={traceCover} alt="Trace cover" className="w-full h-full object-cover" draggable={false} /> },
    ],
    comments: [],
  },
  {
    id: "research",
    name: "01 · Research",
    frames: [
      {
        id: "insights",
        name: "Expert interviews → so what",
        x: 0,
        y: 0,
        w: 1180,
        h: 360,
        bg: "#fff",
        render: () => (
          <div className="p-8" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="text-[22px] font-bold text-[#1e1e1e]">5 expert interviews → design principles</div>
            <div className="mt-6 flex gap-4">
              {INSIGHTS.map(([a, b]) => (
                <div key={a} className="flex flex-col gap-3">
                  <Sticky color="#fff3a8">{a}</Sticky>
                  <Sticky color="#c8f2d0" w={200}>
                    <span className="font-semibold">So → </span>
                    {b}
                  </Sticky>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "framework",
        name: "Framework · six stages",
        x: 0,
        y: 420,
        w: 1180,
        h: 200,
        bg: "#fff",
        render: () => (
          <div className="p-8" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="text-[22px] font-bold text-[#1e1e1e]">The framework</div>
            <div className="mt-6 flex items-center gap-3">
              {STAGES.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-[150px] h-[64px] rounded-[14px] flex items-center justify-center text-[16px] font-semibold text-white" style={{ background: i === 3 ? "#5b5bd6" : "#7c7ce8" }}>
                    0{i + 1} · {s}
                  </div>
                  {i < STAGES.length - 1 && <span className="text-[22px] text-[#9b9bd6]">→</span>}
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
    comments: [{ x: 1150, y: 30, text: "Every principle here had to survive real code, a real model and real participants. If it didn’t, it went.", resolved: false }],
  },
  {
    id: "round1",
    name: "02 · Round 1 (lo-fi)",
    frames: [
      { id: "r1-options", name: "Options · as tested", x: 0, y: 0, w: 300, h: 560, render: () => <OldOptions /> },
      { id: "r1-log", name: "Trace log · as tested", x: 360, y: 0, w: 300, h: 560, render: () => <OldLog /> },
    ],
    comments: [
      { x: 280, y: 60, text: "“I’m not always sure what the system expects me to write here.” → Rewrote labels, added one-line descriptions, examples and tooltips.", resolved: true },
      { x: 640, y: 120, text: "The trace felt fixed and not theirs → made the trace log editable and structured.", resolved: true },
      { x: 280, y: 420, text: "“I want to ask the AI to elaborate, not just read static cards.” → added a refinement chat.", resolved: true },
    ],
  },
  {
    id: "round2",
    name: "03 · Round 2 (hi-fi)",
    frames: ["Intent", "Context", "Options", "Mix & match", "Critique", "Trace"].map((s, i) => ({
      id: `r2-${s}`,
      name: `${String(i + 1).padStart(2, "0")} · ${s}`,
      x: i * 360,
      y: 0,
      w: 320,
      h: 560,
      screen: s,
      code: CODE[s],
      render: () => <TracePanel screen={s} width={320} />,
    })),
    comments: [
      { x: 1740, y: 90, text: "“If I say no, I want the system to drop it.” → memory of rejected ideas, plus Apply / Suggest / Reject on every critique.", resolved: true },
      { x: 1000, y: 140, text: "Options lacked variety and couldn’t be combined → mix & match across options.", resolved: true },
      { x: 700, y: 60, text: "“I want to see how the AI thinks.” → visible reasoning above the options.", resolved: true },
      { x: 2100, y: 500, text: "Navigation felt stuck after the trace → a global “Go back”.", resolved: true },
    ],
  },
  {
    id: "context",
    name: "04 · In Figma",
    frames: [{ id: "in-figma", name: "Trace running as a plugin", x: 0, y: 0, w: 1030, h: 494, render: () => <img src={figmaTrace} alt="Trace inside Figma" className="w-full h-full object-cover" draggable={false} /> }],
    comments: [{ x: 1000, y: 40, text: "Next step from the thesis: connect to real design files, so suggestions can be applied on the canvas.", resolved: false }],
  },
];


/* ---------- Sällskap ---------- */
const SAL = [1820, 850];
const SALLSKAP_PAGES = [
  { id: "cover", name: "Cover", frames: [img("cover", "Cover", salCover, 0, 0, 960, [2600, 1950])], comments: [] },
  {
    id: "research",
    name: "01 · Research",
    frames: [img("persona", "Persona · Elina", salPersona, 0, 0, 700, [2000, 1414]), img("empathy", "Empathy map", salEmpathy, 760, 0, 440, [1440, 1630])],
    comments: [
      { x: 640, y: 40, text: "Dietary needs are personal: people don’t want to explain them in the group chat → private, structured input.", resolved: true },
      { x: 1160, y: 60, text: "The organizer carries the mental load → the system does the matching, the organizer just confirms.", resolved: true },
    ],
  },
  {
    id: "flows",
    name: "02 · Flows",
    frames: [img("flow", "User flow", salFlow, 0, 0, 900, [2415, 1549]), img("data", "Data flow", salData, 960, 0, 746, [2489, 1925])],
    comments: [{ x: 860, y: 30, text: "The pivot: both research streams said groups were the real problem. Solo diners are out of scope.", resolved: true }],
  },
  {
    id: "screens",
    name: "03 · Screens",
    frames: [
      img("restrictions", "Dietary needs", salRestrictions, 0, 0, 640, SAL, { code: "src/screens/DietaryRestrictions.tsx" }),
      img("group", "Group overview", salGroup, 680, 0, 640, SAL, { code: "src/screens/Overview.tsx" }),
      img("restaurant", "Shortlist", salRestaurant, 1360, 0, 640, SAL, { code: "src/screens/BrowseRestaurants.tsx" }),
      img("reviews", "Restaurant details", salReviews, 0, 360, 640, SAL, { code: "src/components/RestaurantCard.tsx" }),
      img("dark", "Dark mode", salDark, 680, 360, 640, SAL, { code: "src/index.css" }),
    ],
    comments: [
      { x: 600, y: 20, text: "Never leave people stuck mid-flow → a Back button across the entire flow.", resolved: true },
      { x: 1960, y: 30, text: "Give enough information to decide → full details: reviews, address, phone and dietary tags.", resolved: true },
      { x: 1280, y: 380, text: "Comfort and accessibility → dark mode everywhere. Tokens first made it a class swap.", resolved: true },
      { x: 1280, y: 30, text: "Close the loop for organizers → clear confirmation messaging after booking.", resolved: true },
    ],
  },
  {
    id: "architecture",
    name: "04 · Architecture",
    frames: [img("arch", "System architecture", salArch, 0, 0, 640, [1395, 1270], { code: "src/context/GroupContext.tsx" })],
    comments: [{ x: 600, y: 30, text: "Matching runs on structured data (availability + needs), never on free-text notes.", resolved: false }],
  },
];

/* ---------- Kallos ---------- */
const KALLOS_PAGES = [
  { id: "cover", name: "Cover", frames: [img("cover", "Cover", kalCover, 0, 0, 960, [2400, 1428])], comments: [] },
  {
    id: "research",
    name: "01 · Research",
    frames: [img("persona", "Persona", kalPersona, 0, 0, 720, [1800, 1044]), img("empathy", "Empathy map", kalEmpathy, 780, 0, 720, [1728, 903])],
    comments: [
      { x: 680, y: 30, text: "People need guidance, not raw metrics → a recommendation-first dashboard.", resolved: true },
      { x: 1460, y: 40, text: "Trust and scale from the start → encryption, local AI and a modular backend.", resolved: true },
    ],
  },
  {
    id: "structure",
    name: "02 · IA & iterations",
    frames: [img("ia", "Information architecture", kalIA, 0, 0, 800, [2380, 1718]), img("survey", "Survey iterations", kalSurvey, 860, 0, 800, [1806, 857])],
    comments: [{ x: 1620, y: 30, text: "Key topics were missing and the diversity question felt off → new questions, diversity rephrased to be clearer and more inclusive.", resolved: true }],
  },
  {
    id: "hifi",
    name: "03 · Hi-fi",
    frames: [img("dashboard", "Dashboard", kalDashboard, 0, 0, 800, [1812, 852]), img("recs", "Recommendations", kalRecs, 860, 0, 800, [1816, 855])],
    comments: [
      { x: 1620, y: 40, text: "Testers weren’t sure what separated Level 1, 2 and 3 → each level now says what it’s for.", resolved: true },
      { x: 760, y: 40, text: "Some companies don’t run every survey → manual KPI input as well as upload.", resolved: true },
      { x: 760, y: 300, text: "Open-ended competitor lists made benchmarks vague → 3–5 competitors.", resolved: true },
    ],
  },
];

/* ---------- Trivia ---------- */
const TRIVIA_PAGES = [
  { id: "cover", name: "Cover", frames: [img("cover", "Cover", triCover, 0, 0, 900, [2400, 1600])], comments: [] },
  {
    id: "lofi",
    name: "01 · Lo-fi",
    frames: [phone("lo-home", "Home", triLoHome, 0, 240, [384, 804]), phone("lo-challenge", "Challenge", triLoChallenge, 300, 240, [384, 804]), phone("lo-ranking", "Ranking", triLoRanking, 600, 240, [384, 804])],
    comments: [{ x: 210, y: 30, text: "Margin note that became a rule: no sign-up wall. Guests can play straight away.", resolved: true }],
  },
  {
    id: "hifi",
    name: "02 · Hi-fi",
    frames: [
      phone("onboarding", "Onboarding", triOnboarding, 0),
      phone("categories", "Categories", triCategories, 300),
      phone("challenge", "Challenge", triChallenge, 600),
      phone("ranking", "Ranking", triRanking, 900),
      phone("profile", "Profile", triProfile, 1200),
    ],
    comments: [
      { x: 820, y: 40, text: "Raise the stakes in Challenge mode → lives: 5 on easy, 3 on hard.", resolved: true },
      { x: 820, y: 300, text: "Show progress through a round → “1 out of X questions”.", resolved: true },
      { x: 1420, y: 40, text: "Faster access to your own profile → tapping the avatar on Home opens it.", resolved: true },
      { x: 220, y: 60, text: "Make waiting feel responsive → loading states on sign-up and login.", resolved: true },
    ],
  },
];

export const FIGMA_FILES = {
  trace: {
    name: "Trace · Design",
    sub: "Master thesis",
    pages: TRACE_PAGES,
    startPage: "round2",
    devIntro: "Each coded screen links to the component that implements it in the real Trace_Plugin repo.",
    devFiles: [["Prompt layer", "server/reflect.ts"]],
    devHint: "Open “03 · Round 2 (hi-fi)” to inspect the coded screens.",
  },
  sallskap: {
    name: "Sällskap · Design",
    sub: "Personal project",
    pages: SALLSKAP_PAGES,
    startPage: "screens",
    devIntro: "Screens link to the React components that implement them in the real Sällskap repo.",
    devFiles: [["Matching logic", "src/utils/filtering.ts"], ["Group state", "src/context/GroupContext.tsx"]],
    devHint: "Open “03 · Screens” to inspect the coded screens.",
  },
  kallos: {
    name: "Kallos · Design",
    sub: "Bachelor thesis",
    pages: KALLOS_PAGES,
    startPage: "hifi",
    devIntro: "The public Kallos repo holds the secure foundation: sign-up, validation and encryption.",
    devFiles: [["Sign-up & validation", "website/auth.py"], ["Encryption (PyNaCl)", "website/encryption.py"], ["Data model", "website/models.py"]],
  },
  trivia: {
    name: "Trivia · Design",
    sub: "KTH group project",
    pages: TRIVIA_PAGES,
    startPage: "hifi",
    devIntro: "The React Native code isn’t part of this demo, so screens don’t link to source here.",
  },
};
