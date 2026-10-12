// src/components/windows/Projects/TriviaCaseStudyWindow.jsx
// Case study: Trivia Master, a React Native quiz game (KTH group project).
import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import { AtAGlance, Caption, Changes, Decision, Figure, H3, Insights, Intro, Lead, Learnings, MetricsPlan, Stats } from "./caseStudy/Editorial";

import heroImg from "../../../imgs/case-study/trivia/Trivia_Final_web.jpg";
import onboardingImg from "../../../imgs/case-study/trivia/screens/Onboarding.jpg";
import categoriesImg from "../../../imgs/case-study/trivia/screens/Categories.jpg";
import challengeImg from "../../../imgs/case-study/trivia/screens/TriviaChallenge.jpg";
import rankingImg from "../../../imgs/case-study/trivia/screens/TriviaRanking.jpg";
import profileImg from "../../../imgs/case-study/trivia/screens/TriviaProfile.jpg";
import { ComponentToCode, FetchQuestions, HifiWall, Iphone, LofiToHifi, OutcomeStage, TriviaArchitecture, TriviaBlueprint, TriviaSystem } from "./caseStudy/TriviaVisuals";

const TINT = "#7b6cf6";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "lofi", label: "Sketches & lo-fi" },
  { id: "decisions", label: "Key decisions" },
  { id: "system", label: "Design system" },
  { id: "design", label: "Hi-fi design" },
  { id: "build", label: "Build" },
  { id: "team", label: "Team & collaboration" },
  { id: "testing", label: "Testing & iteration" },
  { id: "metrics", label: "Measuring success" },
  { id: "outcome", label: "Outcome" },
  { id: "learnings", label: "What I learned" },
];

export default function TriviaCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  return (
    <CaseStudyLayout tint={TINT} canvas={false} onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Trivia App">
      <Intro
        {...t}
        eyebrow="KTH group project · Mobile · React Native"
        title="Trivia Master: a quiz game that works for a quick round and for serious competition"
        lede="In a four-person team at KTH, I owned the experience from information architecture and the Figma design system to the React Native screens, while two teammates built the Firebase backend."
        ctas={[
          { label: "View on GitHub", href: "https://gits-15.sys.kth.se/iprog-students/arnaupg-ejaco-jintongj-mcli2-vt26-project" },
        ]}
        facts={[
          { k: "Role", v: "UI design & frontend" },
          { k: "Team", v: "4 people · 2 UI/frontend, 2 backend" },
          { k: "Platform", v: "Mobile app (React Native)" },
          { k: "Stack", v: "React Native · Redux · Firebase · OpenTDB" },
        ]}
      />

      <button type="button" onClick={() => open(heroImg, "Trivia Master screens")} className="mt-10 block w-full cursor-zoom-in">
          <img src={heroImg} alt="Trivia Master ranking and challenge screens on phones" className="block w-full h-auto rounded-[20px]" />
        </button>

      <CaseStudySection id="glance" title="At a glance" subtitle="The 30-second version" theme={theme}>
        <AtAGlance
          {...t}
          items={[
            { label: "Problem", text: "Trivia apps tend to feel cluttered and generic: it’s hard to pick the right difficulty, scoring is unclear, and there’s little reason to come back." },
            { label: "What I did", text: "Designed the IA, flows, design system and hi-fi screens, then built them as reusable React Native components connected to Redux and Firebase." },
            { label: "Outcome", text: "A working app with live questions, saved game history and a global leaderboard. Every tester completed every core task and understood the scoring right away." },
          ]}
        />
        <div className="mt-10">
          <Stats
            {...t}
            items={[
              { value: "2", label: "game modes: Leisure and Challenge" },
              { value: "5", label: "core flows designed and built" },
              { value: "100%", label: "of core tasks completed in testing" },
              { value: "5", label: "improvements shipped after testing" },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The problem" subtitle="Why most trivia apps lose players" theme={theme}>
        <Lead theme={theme}>
          Casual players want to open the app and play. Competitive players want stakes, scores and a ranking. Most trivia apps serve neither well and end up cluttered for both.
        </Lead>
        <p className={`mt-6 pl-4 border-l-2 text-[18px] font-semibold tracking-[-0.01em] ${theme.textMain}`} style={{ borderColor: TINT }}>
          How might we get someone into a game in seconds, and still give competitive players a reason to come back?
        </p>
      </CaseStudySection>

      <CaseStudySection id="research" title="Research" subtitle="Competitors and quick interviews" theme={theme}>
        <p>I scanned existing trivia apps (onboarding, game flow, scoring, visual style) and ran quick interviews with students about what makes trivia fun and what makes it frustrating. The same three problems kept coming up.</p>
        <div className="mt-8">
          <Insights
            {...t}
            items={[
              { title: "Getting started takes too long.", text: "Players struggled to find the right difficulty before they could even start playing.", so: "guest play, and category plus difficulty chosen in one step." },
              { title: "Scoring is a mystery.", text: "It was often unclear how points were earned or why one answer was worth more.", so: "simple difficulty-based points, visible during every round." },
              { title: "Nothing to come back for.", text: "Without saved progress, there was little motivation to return.", so: "saved history and a global leaderboard for logged-in players." },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="lofi" title="Sketches & lo-fi" subtitle="Testing the game before the graphics" theme={theme}>
        <p>
          I started on paper, sketching the four moments of a game: getting in, picking what to play, answering and seeing where you rank. The margin notes became the rules for everything
          that followed: no sign-up wall, lives only in Challenge mode, and always showing progress.
        </p>
        <div className="mt-8">
          <TriviaBlueprint theme={theme} />
        </div>
        <p className="mt-12 mb-8">
          Then I moved to greyscale wireframes in Figma to test navigation, mode selection and the game flow with the team before any colour went in. The structure held all the way to the
          final app. Drag across each phone to see how:
        </p>
        <LofiToHifi theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="decisions" title="Key decisions" subtitle="What I chose, and what it cost" theme={theme}>
        <Decision
          {...t}
          n={1}
          title="Play first, sign up later"
          tradeoff="Guests don’t get saved history or a leaderboard spot. That gap is exactly what nudges them to log in once they’re hooked."
          visual={
            <div className="grid grid-cols-2 gap-4 items-end">
              <Iphone src={onboardingImg} alt="Onboarding with guest option" onOpen={open} width={200} />
              <Iphone src={categoriesImg} alt="Category selection" onOpen={open} width={200} />
            </div>
          }
        >
          Onboarding offers <b className={theme.textMain}>Continue as Guest</b> right next to Google login. Category and difficulty are picked on one screen, so a new player is answering questions
          within a couple of taps.
        </Decision>
        <Decision
          {...t}
          n={2}
          title="Two modes, two moods"
          tradeoff="Two modes means two sets of rules to explain. Clear labels and a separate visual treatment for Challenge kept them from blurring."
          visual={
            <div className="grid grid-cols-2 gap-4 items-end">
              <Iphone src={challengeImg} alt="Challenge mode question" onOpen={open} width={200} />
              <Iphone src={rankingImg} alt="Global leaderboard" onOpen={open} width={200} />
            </div>
          }
        >
          <b className={theme.textMain}>Leisure</b> is relaxed practice. <b className={theme.textMain}>Challenge</b> adds difficulty-based points, lives and a place on the global leaderboard. Separating them
          meant neither audience had to wade through the other’s features.
        </Decision>
        <Decision {...t} n={3} title="Design system first, components second" tradeoff="Setting up tokens and components up front slowed the first screens down, then made every screen after that much faster.">
          I defined colours, type, spacing and components in Figma before building, and mirrored them as reusable React Native components (buttons, cards, headers, list items). Design and code
          stayed in sync because they were literally the same parts.
        </Decision>
      </CaseStudySection>

      <CaseStudySection id="system" title="Design system" subtitle="Playful, but built like a system" theme={theme}>
        <p>
          Before going hi-fi, we built reusable tokens (colour, type, components and patterns) so every screen stayed on brand from onboarding to the leaderboard. The personality comes from a
          few deliberate choices: one confident purple, a sunny yellow for “selected”, soft geometric shapes, and chunky buttons with a 4px press shadow that feel good to tap.
        </p>
        <div className="mt-8">
          <TriviaSystem />
        </div>
        <p className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
          <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TINT }} />
          The Trivia Master design system, rebuilt live: copy a token, pick categories, or play a round.
        </p>
      </CaseStudySection>

      <CaseStudySection id="design" title="Hi-fi design" subtitle="Every screen, on brand" theme={theme}>
        <p>With the structure validated and the system in place, every core screen came together quickly and consistently.</p>
        <div className="mt-10">
          <HifiWall theme={theme} onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="build" title="Build" subtitle="From Figma components to React Native" theme={theme}>
        <p>
          I built the frontend and worked closely with the backend pair on the API, Firestore structure and authentication. The goal was simple: every component in Figma should have exactly
          one twin in code.
        </p>

        <H3 theme={theme} className="mt-10">
          Architecture
        </H3>
        <p className="mt-2 mb-5">Five screens share one Redux store; questions come live from OpenTDB, while accounts, history and the leaderboard live in Firebase.</p>
        <TriviaArchitecture theme={theme} />

        <H3 theme={theme} className="mt-12">
          One component, design to code
        </H3>
        <p className="mt-2 mb-5">The answer button is the heart of the game. Its two states map directly to design-system tokens, so the code reads like the Figma file.</p>
        <ComponentToCode theme={theme} />

        <H3 theme={theme} className="mt-12">
          Live questions
        </H3>
        <p className="mt-2 mb-5">Categories and difficulty on the Home screen become a single API call, so no two games are the same.</p>
        <FetchQuestions />
        <p className={`mt-3 text-[12px] ${theme.textSub}`}>Code samples are simplified for reading; the full project lives in the KTH GitHub repo.</p>

      </CaseStudySection>

      <CaseStudySection id="team" title="Team & collaboration" subtitle="Four people, one shared language" theme={theme}>
        <p>
          Trivia Master was a four-person project: two of us on UI and frontend, two on the backend. As the UX engineer in the middle, my job was making sure design decisions survived the
          trip into code, and that backend constraints shaped the design early, not late.
        </p>
        <div className="mt-8 grid grid-cols-1 @3xl:grid-cols-3 gap-4">
          {[
            { who: "Design & frontend", me: true, items: ["Information architecture & flows", "Figma design system", "Lo-fi → hi-fi screens", "React Native components & navigation"] },
            { who: "Shared", items: ["API contract with OpenTDB", "Firestore data structure", "Authentication flows", "Usability testing"] },
            { who: "Backend", items: ["Firebase Auth (Google)", "Firestore: profiles & history", "Global leaderboard", "Scoring persistence"] },
          ].map((c) => (
            <div key={c.who} className={`rounded-[18px] p-5 ${c.me ? "text-white" : theme.isDark ? "bg-white/[0.04]" : "bg-black/[0.025]"}`} style={c.me ? { background: TINT } : { boxShadow: theme.isDark ? "inset 0 0 0 1px rgba(255,255,255,0.07)" : "inset 0 0 0 1px rgba(0,0,0,0.05)" }}>
              <div className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${c.me ? "text-white/80" : theme.textSub}`}>{c.me ? "Me + 1 teammate" : c.who === "Shared" ? "Whole team" : "2 teammates"}</div>
              <div className={`mt-1 text-[18px] font-bold tracking-[-0.01em] ${c.me ? "" : theme.textMain}`}>{c.who}</div>
              <ul className="mt-3 space-y-1.5 text-[14px]">
                {c.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className={c.me ? "text-white/70" : ""} style={c.me ? undefined : { color: TINT }}>
                      •
                    </span>
                    <span className={c.me ? "text-white/95" : theme.textBody}>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <H3 theme={theme} className="mt-10">
          How design and code stayed in sync
        </H3>
        <ol className="mt-4 space-y-4">
          {[
            ["Tokens before screens.", "Colours, type and spacing were agreed in Figma first, so both frontend developers built from the same names."],
            ["One component, one twin.", "Every reusable piece in Figma (buttons, cards, chips, list rows) had exactly one matching React Native component."],
            ["Data shapes decided together.", "Designing the history and leaderboard screens meant agreeing with the backend pair on what Firestore stores, before either side built it."],
          ].map(([h, d], i) => (
            <li key={h} className="grid grid-cols-[36px_1fr] gap-x-3">
              <span className="text-[13px] font-semibold tabular-nums pt-[3px]" style={{ color: TINT }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className={`font-semibold ${theme.textMain}`}>{h}</span> {d}
              </div>
            </li>
          ))}
        </ol>
      </CaseStudySection>

      <CaseStudySection id="testing" title="Testing & iteration" subtitle="Think-aloud with the working app" theme={theme}>
        <p>
          3–4 participants ran task-based, think-aloud sessions on the functional app: onboarding, playing both modes, editing their account, and checking history and the leaderboard. Everyone
          completed the core tasks. Scoring was understood immediately, and Question of the Day was easy to find and a hit.
        </p>
        <H3 theme={theme} className="mt-8">
          What changed after testing
        </H3>
        <div className="mt-4">
          <Changes
            {...t}
            labels={["Goal", "What I shipped"]}
            items={[
              { found: "Make waiting feel responsive.", changed: "Loading states on sign-up and login." },
              { found: "Faster access to your own profile.", changed: "Tapping the avatar on Home opens the profile." },
              { found: "Raise the stakes in Challenge mode.", changed: "A lives system: 5 lives on easy, 3 on hard." },
              { found: "Show progress through a round.", changed: "A progress indicator: “1 out of X questions”." },
              { found: "Let players personalise the app.", changed: "A basic theme switcher." },
            ]}
          />
        </div>
        <div className="mt-10 grid grid-cols-3 gap-4 @2xl:gap-8 items-start">
          <figure><Iphone src={profileImg} alt="Profile and history" onOpen={open} width={210} /><figcaption className={`mt-4 text-center text-[13px] ${theme.textSub}`}>Profile and game history</figcaption></figure>
          <figure><Iphone src={challengeImg} alt="Lives and progress in Challenge" onOpen={open} width={210} /><figcaption className={`mt-4 text-center text-[13px] ${theme.textSub}`}>Lives in Challenge mode</figcaption></figure>
          <figure><Iphone src={rankingImg} alt="Leaderboard" onOpen={open} width={210} /><figcaption className={`mt-4 text-center text-[13px] ${theme.textSub}`}>Global leaderboard</figcaption></figure>
        </div>
      </CaseStudySection>

      <CaseStudySection id="metrics" title="Measuring success" subtitle="What I’d track after launch" theme={theme}>
        <p className="mb-8">Testing proved the flows work. In a real launch, these are the numbers that would tell us whether players actually come back, and where to improve next.</p>
        <MetricsPlan
          {...t}
          items={[
            { metric: "Time to first question", why: "The whole onboarding promise: play within seconds, no sign-up wall.", how: "Time from app open to the first answered question, guests vs. logged-in.", target: "North star" },
            { metric: "Guest → account conversion", why: "Guest play lowers friction; history and the leaderboard should make signing up worth it.", how: "Share of guests who create an account within their first 3 games.", target: "Growth" },
            { metric: "Day-7 return rate", why: "Progress and rankings exist to bring players back. If they don’t, the loop isn’t working.", how: "Players who play again within 7 days of their first game.", target: "Retention" },
            { metric: "Challenge completion", why: "Lives add tension; too many early losses would make Challenge feel punishing.", how: "Share of Challenge rounds finished vs. ended by running out of lives, per difficulty.", target: "Balance" },
          ]}
          note="Planned metrics, not results: this was a university MVP without production analytics."
        />
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Outcome" subtitle="What shipped and what’s next" theme={theme}>
        <OutcomeStage onOpen={open} />
        <p className="mt-8">
          A working mobile game with live questions, two modes, persistent history and a global leaderboard, designed and built by the same hands so nothing was lost between Figma and code.
        </p>
        <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-8">
          <div>
            <H3 theme={theme}>What I’d build next</H3>
            <CaseStudyBulletList
              items={[
                "Timers, streaks and dynamic difficulty in Challenge mode.",
                "Leaderboard filters: daily, weekly, friends, difficulty.",
                "Aggregated stats for Question of the Day.",
                "Hints, background music and full theming.",
              ]}
            />
          </div>
          <div>
            <H3 theme={theme}>Honest constraints</H3>
            <CaseStudyBulletList
              items={[
                "A small test group limited the range of player profiles.",
                "Time limits meant advanced features went untested.",
                "No real-time statistics or dynamic filtering yet.",
              ]}
            />
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection id="learnings" title="What I learned" subtitle="Reflection" theme={theme}>
        <Learnings
          {...t}
          items={[
            { title: "A design system is a team tool, not a style guide.", text: "With two people building the frontend, shared tokens and components were what kept the app consistent. It saved more time in code than it cost in Figma." },
            { title: "Test the working app, not just the prototype.", text: "Loading states, the lives system and the progress indicator only showed up as needs once people played the real thing with live questions." },
            { title: "Friction is a design decision.", text: "Removing the sign-up wall and putting lives only in Challenge mode came from deciding where friction helps (stakes) and where it hurts (getting started)." },
            { title: "Being in the middle is the job.", text: "Sitting between design and backend meant translating in both directions: what the UI needs from the data, and what the data makes possible in the UI." },
          ]}
        />
      </CaseStudySection>

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
