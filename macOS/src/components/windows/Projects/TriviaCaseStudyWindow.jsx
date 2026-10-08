// src/components/windows/Projects/TriviaCaseStudyWindow.jsx
// Case study: Trivia Master, a React Native quiz game (KTH group project).
import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import { AtAGlance, BrowserFrame, Caption, Changes, Decision, Figure, H3, Insights, Intro, Lead, PhoneShot, Stage, Stats } from "./caseStudy/Editorial";

import heroImg from "../../../imgs/case-study/trivia/Trivia_Final_web.jpg";
import onboardingImg from "../../../imgs/case-study/trivia/Onboarding_web.jpg";
import categoriesImg from "../../../imgs/case-study/trivia/Categories_web.jpg";
import challengeImg from "../../../imgs/case-study/trivia/TriviaChallenge_web.jpg";
import rankingImg from "../../../imgs/case-study/trivia/TriviaRanking_web.jpg";
import profileImg from "../../../imgs/case-study/trivia/TriviaProfile_web.jpg";
import lofiImg from "../../../imgs/case-study/trivia/Trivia_Lofi.png";
import designImg from "../../../imgs/case-study/trivia/designsystem.png";
import chromeImg from "../../../imgs/case-study/trivia/Chrome.png";
import screensImg from "../../../imgs/case-study/trivia/Trivia_Hero.png";
import mockImg from "../../../imgs/case-study/trivia/Mock.jpg";

const TINT = "#7b6cf6";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "decisions", label: "Key decisions" },
  { id: "design", label: "Design" },
  { id: "build", label: "Build" },
  { id: "testing", label: "Testing & iteration" },
  { id: "outcome", label: "Outcome" },
];

export default function TriviaCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  return (
    <CaseStudyLayout onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Trivia App">
      <Intro
        {...t}
        eyebrow="KTH group project · Mobile · React Native"
        title="Trivia Master: a quiz game that works for a quick round and for serious competition"
        lede="In a four-person team at KTH, I owned the experience from information architecture and the Figma design system to the React Native screens, while two teammates built the Firebase backend."
        ctas={[
          { label: "View on GitHub", href: "https://gits-15.sys.kth.se/iprog-students/arnaupg-ejaco-jintongj-mcli2-vt26-project" },
          { label: "Full case study (PDF)", href: "/pdfs/Trivia_Case_Study.pdf" },
        ]}
        facts={[
          { k: "Role", v: "UI design & frontend" },
          { k: "Team", v: "4 people · 2 UI/frontend, 2 backend" },
          { k: "Platform", v: "Mobile app (React Native)" },
          { k: "Stack", v: "React Native · Redux · Firebase · OpenTDB" },
        ]}
      />

      <Stage {...t} className="mt-10" pad="p-0">
        <button type="button" onClick={() => open(heroImg, "Trivia Master screens")} className="block w-full cursor-zoom-in">
          <img src={heroImg} alt="Trivia Master ranking and challenge screens on phones" className="block w-full h-auto" />
        </button>
      </Stage>

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

      <CaseStudySection id="decisions" title="Key decisions" subtitle="What I chose, and what it cost" theme={theme}>
        <Decision
          {...t}
          n={1}
          title="Play first, sign up later"
          tradeoff="Guests don’t get saved history or a leaderboard spot. That gap is exactly what nudges them to log in once they’re hooked."
          visual={
            <div className="grid grid-cols-2 gap-3">
              <PhoneShot theme={theme} src={onboardingImg} alt="Onboarding with guest option" onOpen={open} />
              <PhoneShot theme={theme} src={categoriesImg} alt="Category selection" onOpen={open} />
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
            <div className="grid grid-cols-2 gap-3">
              <PhoneShot theme={theme} src={challengeImg} alt="Challenge mode question" onOpen={open} />
              <PhoneShot theme={theme} src={rankingImg} alt="Global leaderboard" onOpen={open} />
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

      <CaseStudySection id="design" title="Design" subtitle="From wireframes to a playful system" theme={theme}>
        <p>Lo-fi wireframes validated navigation, game flow and mode selection before any colour went in. The final look is playful but calm: one confident purple, soft geometry and rounded, chunky buttons that feel good to tap.</p>
        <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <Figure theme={theme} src={lofiImg} alt="Lo-fi wireframes" caption="Lo-fi wireframes: navigation and game flow." onOpen={open} />
          <Figure theme={theme} src={designImg} alt="Design system" caption="Design system: colour, type, spacing and components." onOpen={open} />
        </div>
        <div className="mt-6">
          <Stage {...t} pad="p-0">
            <button type="button" onClick={() => open(screensImg, "Trivia Master hi-fi screens")} className="block w-full cursor-zoom-in">
              <img src={screensImg} alt="Hi-fi screens: profile, challenge, login, ranking and history" className="block w-full h-auto" loading="lazy" />
            </button>
          </Stage>
          <Caption theme={theme}>Hi-fi screens: profile, challenge, login, ranking and game history.</Caption>
        </div>
      </CaseStudySection>

      <CaseStudySection id="build" title="Build" subtitle="Bringing the UI to life in React Native" theme={theme}>
        <p>I built the frontend and worked closely with the backend pair on the API, Firestore structure and authentication flows.</p>
        <CaseStudyBulletList
          items={[
            "Stack and tab navigation for the core flows.",
            "Reusable component library mirroring the Figma system.",
            "Dynamic category and difficulty screens driven by the OpenTDB API.",
            "Game screen rendering live questions, plus a results screen with difficulty-based scoring.",
            "Redux for predictable global state across auth, game and settings.",
            "Firebase Auth (Google) and Firestore for profiles, history and the leaderboard.",
          ]}
        />
        <div className="mt-8">
          <BrowserFrame theme={theme} src={chromeImg} alt="App running with Chrome DevTools" url="localhost:8081" onOpen={open} />
          <Caption theme={theme}>Debugging the React Native app in Chrome DevTools.</Caption>
        </div>
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
        <div className="mt-8 grid grid-cols-3 gap-3 @2xl:gap-5">
          <PhoneShot theme={theme} src={profileImg} alt="Profile and history" caption="Profile and game history" onOpen={open} />
          <PhoneShot theme={theme} src={challengeImg} alt="Lives and progress in Challenge" caption="Lives in Challenge mode" onOpen={open} />
          <PhoneShot theme={theme} src={rankingImg} alt="Leaderboard" caption="Global leaderboard" onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Outcome" subtitle="What shipped and what’s next" theme={theme}>
        <Stage {...t} pad="p-0">
          <button type="button" onClick={() => open(mockImg, "Trivia Master final")} className="block w-full cursor-zoom-in">
            <img src={mockImg} alt="Final Trivia Master screens" className="block w-full h-auto" loading="lazy" />
          </button>
        </Stage>
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

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
