// src/components/windows/Projects/PortfolioCaseStudyWindow.jsx
// Case study: this portfolio itself, a macOS-style OS built to show how I design and build.
// ⏸️ Draft, not linked anywhere yet: needs better pictures and will change. To bring it back, register it in
// config/windowDefs.js, config/apps.js, ProjectsWindow ACTION_TO_WINDOW and data/projectData.js.
// ✏️ Copy is a first draft in my voice: numbers come from the repo (git history, windowDefs, a11yStore).
import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import { AtAGlance, Changes, Decision, Figure, H3, Insights, Intro, Lead, Learnings, MetricsPlan, PhoneShot, Stats } from "./caseStudy/Editorial";

import desktopImg from "../../../imgs/case-study/portfolio/desktop.jpg";
import projectsImg from "../../../imgs/case-study/portfolio/projects.jpg";
import recruiterImg from "../../../imgs/case-study/portfolio/recruiter.jpg";
import a11yImg from "../../../imgs/case-study/portfolio/accessibility.jpg";
import phoneHomeImg from "../../../imgs/case-study/portfolio/phone-home.jpg";
import phoneAboutImg from "../../../imgs/case-study/portfolio/phone-about.jpg";

const TINT = "#0a84ff";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "audience", label: "Who it’s for" },
  { id: "decisions", label: "Key decisions" },
  { id: "build", label: "Design → code" },
  { id: "a11y", label: "Accessibility" },
  { id: "testing", label: "Testing & iteration" },
  { id: "metrics", label: "Measuring success" },
  { id: "learnings", label: "What I learned" },
];

/* a small code card, same look as the other case studies */
const kw = (s) => <span style={{ color: "#c792ea" }}>{s}</span>;
const st = (s) => <span style={{ color: "#c3e88d" }}>{s}</span>;
const fn = (s) => <span style={{ color: "#82aaff" }}>{s}</span>;
const cmt = (s) => <span style={{ color: "rgba(255,255,255,0.38)" }}>{s}</span>;
function CodeCard({ file, children }) {
  return (
    <figure className="min-w-0 rounded-[16px] overflow-hidden" style={{ background: "#16182a", boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -26px rgba(10,60,140,0.55)" }}>
      <div className="h-9 px-3 flex items-center gap-1.5 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-white/50 font-mono">{file}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[11.5px] leading-[1.75] font-mono text-[#dcdcf0]">{children}</pre>
    </figure>
  );
}

export default function PortfolioCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  const tryIt = [
    ["Recruiter Mode", "recruiter"],
    ["Source in VS Code", "vscode"],
    ["Design System", "designsystem"],
    ["Accessibility settings", "accessibility"],
  ];

  return (
    <CaseStudyLayout tint={TINT} canvas={false} onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="This portfolio">
      <Intro
        {...t}
        eyebrow="Personal project · 2026 · Design + Build"
        title="This portfolio: an operating system that shows how I work, not just what I made"
        lede="I designed and built a macOS-style portfolio where every app is a way into my work: case studies, the real source code, my design system and how I use AI. You’re using it right now."
        facts={[
          { k: "Role", v: "Design, content & frontend (solo)" },
          { k: "Timeline", v: "Jan 2026 → today · 187 commits" },
          { k: "Platform", v: "Web · desktop, tablet & phone" },
          { k: "Stack", v: "React 18 · Vite · Tailwind v4 · Framer Motion" },
        ]}
      />

      <button type="button" onClick={() => open(desktopImg, "The portfolio desktop")} className="mt-10 block w-full cursor-zoom-in">
        <img src={desktopImg} alt="The portfolio desktop with widgets, desktop icons and the Dock" className="block w-full h-auto rounded-[20px]" />
      </button>

      {/* this case study can link straight into the thing it describes */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className={`mr-1 text-[13px] ${theme.textSub}`}>Try it while you read:</span>
        {tryIt.map(([label, id]) => (
          <button key={id} type="button" onClick={() => onOpenWindow?.(id)} className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all ${theme.buttonClass}`}>
            {label} ↗
          </button>
        ))}
      </div>

      <CaseStudySection id="glance" title="At a glance" subtitle="The 30-second version" theme={theme}>
        <AtAGlance
          {...t}
          items={[
            { label: "Problem", text: "A design engineer’s portfolio has two jobs: give a recruiter the facts in seconds, and give a hiring manager enough depth to trust both the design and the code. Most portfolios do one or the other." },
            { label: "What I did", text: "Designed and built a small operating system: a desktop, a Dock, a menu bar and about 30 apps. The playful layer pulls people in, and a Recruiter Mode and a plain HTML version get them out fast." },
            { label: "Outcome", text: "A live portfolio that works on desktop and phone, follows its own accessibility settings and doubles as a code sample. I don’t have visitor data yet; measuring it is the next step." },
          ]}
        />
        <div className="mt-10">
          <Stats
            {...t}
            items={[
              { value: "~30", label: "apps, each loaded only when it opens" },
              { value: "6", label: "OS-wide accessibility settings" },
              { value: "3", label: "ways in: the OS, Recruiter Mode, a plain page" },
              { value: "187", label: "commits since January 2026" },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The problem" subtitle="Two readers, very different amounts of time" theme={theme}>
        <Lead theme={theme}>
          A recruiter decides in under a minute whether to keep reading. A hiring manager for a design engineer role wants to see research, trade-offs and real code. A static grid of case studies
          serves the first reader and tells the second very little about how I build.
        </Lead>
        <p className={`mt-6 pl-4 border-l-2 text-[18px] font-semibold tracking-[-0.01em] ${theme.textMain}`} style={{ borderColor: TINT }}>
          How might I make a portfolio that is the work sample itself, without making the people who are short on time pay for it?
        </p>
      </CaseStudySection>

      <CaseStudySection id="audience" title="Who it’s for" subtitle="Three visitors I designed around" theme={theme}>
        <p>
          I didn’t run a formal study for this project. These are working assumptions from my own job search and from how hiring usually works, and they shaped every decision below.
        </p>
        <div className="mt-8">
          <Insights
            {...t}
            items={[
              { title: "The recruiter has 30 seconds.", text: "They need role, location, availability and a résumé, ideally without learning a new interface.", so: "Recruiter Mode on the desktop, a résumé one click away, and “Copy summary” for their ATS." },
              { title: "The hiring manager wants depth.", text: "They want to see how I think and whether the code holds up.", so: "full case studies, plus the real source in VS Code and the live design system." },
              { title: "Some visitors just want a normal website.", text: "On a slow phone, with a screen reader, or simply not in the mood for a desktop metaphor.", so: "a plain HTML version, full-screen apps on phones and OS-wide accessibility settings." },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="decisions" title="Key decisions" subtitle="What I chose, and what it cost" theme={theme}>
        <Decision
          {...t}
          n={1}
          title="An OS, with escape hatches"
          tradeoff="A desktop metaphor is slower than a homepage for someone who just wants facts. Recruiter Mode, Copy summary and the plain page exist to pay that cost back."
          visual={<Figure theme={theme} tint={TINT} src={recruiterImg} alt="Recruiter Mode window" onOpen={open} caption="Recruiter Mode: the 30-second overview, one click from the desktop." />}
        >
          The OS is the memorable part, but nobody should be forced through it. Recruiter Mode sits on the desktop and puts role, education, location, tools and languages on one screen, with
          the résumé, email and LinkedIn in a single action bar.
        </Decision>
        <Decision
          {...t}
          n={2}
          title="Every app has to point at the work"
          tradeoff="Cutting apps meant cutting jokes I liked. The OS feels a little less like a toy and a lot more like a portfolio."
          visual={<Figure theme={theme} tint={TINT} src={projectsImg} alt="Projects window" onOpen={open} caption="Projects stays one click away, from the desktop and the Dock." />}
        >
          The first versions had a calculator, stickies, paint, a weather app, arcade games and a desktop pet. They were fun to build and said nothing about my work. I removed them and kept apps
          that each show a skill: Figma for components, Excel for turning spreadsheets into product, GitHub for how I ship, Claude for how I work with AI.
        </Decision>
        <Decision
          {...t}
          n={3}
          title="Humour around the work, never inside it"
          tradeoff="Some of my favourite jokes live in the Terminal and menus where fewer people find them. That’s on purpose."
        >
          The personality lives in the system layer: boot lines, a fika reminder at 15:00 Stockholm time, Wi-Fi networks like “Abuela’s WiFi”, Terminal commands. Case studies stay serious and
          emoji-free, so the work is never undercut by a gag.
        </Decision>
        <Decision
          {...t}
          n={4}
          title="Phones get apps, not tiny windows"
          tradeoff="You lose the multi-window feel on a phone. You gain an interface that actually works with a thumb."
          visual={
            <div className="grid grid-cols-2 gap-4 items-start">
              <PhoneShot theme={theme} tint={TINT} src={phoneHomeImg} alt="Portfolio home screen on a phone" onOpen={open} caption="Home" />
              <PhoneShot theme={theme} tint={TINT} src={phoneAboutImg} alt="About me open full screen on a phone" onOpen={open} caption="Apps open full screen" />
            </div>
          }
        >
          Draggable windows don’t make sense on a 390px screen. On phones every app opens full screen like an iOS app, with a Done button, and the Dock hides while an app is open.
        </Decision>
      </CaseStudySection>

      <CaseStudySection id="build" title="Design → code" subtitle="A small OS, built like a product" theme={theme}>
        <p>
          The shell (desktop, Dock, menu bar, Spotlight, notifications) is shared. Each app is its own component, registered in one place with its default size and position, and loaded only when
          someone opens it. That keeps the first load small even though there are around 30 apps.
        </p>

        <H3 theme={theme} className="mt-10">
          Apps respond to their window, not the screen
        </H3>
        <p className="mt-2">
          A window can be 400px wide on a 27″ monitor. So every window is a CSS container, and apps use container queries instead of viewport breakpoints. The same Recruiter Mode layout works in a
          small window on desktop and full screen on a phone.
        </p>

        <H3 theme={theme} className="mt-10">
          One setting, every window
        </H3>
        <p className="mt-2 mb-5">Accessibility settings are stored once and written to the root element, so each window follows them through CSS without knowing they exist.</p>
        <CodeCard file="config/a11yStore.js · simplified">
          {cmt("// Accessibility settings live on <html>, so every window follows them")}
          {"\n"}
          {kw("function")} {fn("apply")}(s) {"{"}
          {"\n  "}
          {kw("const")} d = document.documentElement.dataset;
          {"\n  "}d.a11yMotion = s.motion ? {st('"reduce"')} : {st('""')};
          {"\n  "}d.a11yContrast = s.contrast ? {st('"more"')} : {st('""')};
          {"\n  "}d.a11yTransparency = s.transparency ? {st('"reduce"')} : {st('""')};
          {"\n  "}d.a11yText = s.text; {cmt("// default · large · larger")}
          {"\n  "}d.a11yFilter = s.filter; {cmt("// colour-vision previews")}
          {"\n"}
          {"}"}
        </CodeCard>
        <p className={`mt-3 text-[12px] ${theme.textSub}`}>Simplified for reading. The full file is in VS Code, inside this portfolio.</p>

        <H3 theme={theme} className="mt-10">
          How I worked
        </H3>
        <p className="mt-2">
          I designed the system, wrote the content and made the calls. I used Claude Code as a pair programmer for drafting components, refactors and automated screenshot checks, the same way I
          describe in the Claude app on this desktop.
        </p>
      </CaseStudySection>

      <CaseStudySection id="a11y" title="Accessibility" subtitle="The portfolio follows its own rules" theme={theme}>
        <p>
          A playful interface is easy to make inaccessible. System Settings has an Accessibility pane that changes the whole OS: text size, increased contrast, reduced transparency, reduced motion
          (which also follows the device setting), always-visible focus outlines and colour-vision filters. The plain HTML version is linked from the Help menu.
        </p>
        <div className="mt-8">
          <Figure theme={theme} tint={TINT} src={a11yImg} alt="The Accessibility settings pane" onOpen={open} caption="System Settings → Accessibility: six settings that apply to every window." />
        </div>
      </CaseStudySection>

      <CaseStudySection id="testing" title="Testing & iteration" subtitle="Review passes at three screen sizes" theme={theme}>
        <p>
          I review the portfolio the way I’d review a product: open every app at phone, tablet and desktop size, check for overflow and broken layouts, and compare each screen against the rest of
          the OS. These are some of the things those passes caught.
        </p>
        <div className="mt-6">
          <Changes
            {...t}
            labels={["What I found", "What I changed"]}
            items={[
              { found: "On phones the Dock was wider than the screen and its ends were cut off.", changed: "Dock icons shrink just enough to fit the screen width." },
              { found: "Notifications stacked on top of the open app on phones.", changed: "Phones show one notification at a time." },
              { found: "Recruiter Mode’s action bar wrapped onto three rows on a phone.", changed: "One swipeable row, with Download résumé first." },
              { found: "Tooltips near the menu bar were clipped by it.", changed: "Tooltips render above everything and flip to stay on screen." },
              { found: "Gradient cards felt off next to the flat, native-looking apps.", changed: "Flat cards that match the case studies and System Settings." },
            ]}
          />
        </div>
        <p className={`mt-4 text-[13px] ${theme.textSub}`}>
          These checks ran in a browser at device sizes. Testing with real visitors, and on real devices, is still to do.
        </p>
      </CaseStudySection>

      <CaseStudySection id="metrics" title="Measuring success" subtitle="What I’d track next" theme={theme}>
        <p className="mb-8">A portfolio works if the right people find the right thing quickly. These are the numbers I’d look at.</p>
        <MetricsPlan
          {...t}
          items={[
            { metric: "Time to first case study", why: "The OS should lead people to the work, not distract from it.", how: "Time from page load to the first case study opened.", target: "North star" },
            { metric: "Recruiter Mode usage", why: "Tests whether the fast path is visible enough for people short on time.", how: "Share of visits that open Recruiter Mode, and how long they stay.", target: "Fast path" },
            { metric: "Résumé and contact actions", why: "The real goal of a portfolio is a conversation.", how: "Résumé downloads, copied emails and booked calls per visit.", target: "Outcome" },
            { metric: "Phone drop-off", why: "A desktop metaphor is the riskiest on small screens.", how: "Share of phone visits that leave before opening any app.", target: "Risk" },
          ]}
          note="Planned metrics, not results: the portfolio doesn’t have analytics yet."
        />
      </CaseStudySection>

      <CaseStudySection id="learnings" title="What I learned" subtitle="Reflection" theme={theme}>
        <Learnings
          {...t}
          items={[
            { title: "A concept needs an exit.", text: "The OS is what people remember, but Recruiter Mode and the plain page are what make it safe to be playful." },
            { title: "Cutting is a design skill.", text: "Removing apps I enjoyed building made the portfolio clearer. Each app that stayed had to point at real work." },
            { title: "Constraints travel.", text: "Building for windows of any width pushed me to container queries, which also made the phone version almost free." },
            { title: "Practise what you preach.", text: "If accessibility is part of how I design, the portfolio has to pass its own checklist, not just talk about it." },
          ]}
        />
        <div className="mt-10">
          <H3 theme={theme}>What’s next</H3>
          <CaseStudyBulletList
            items={[
              "A case study from my work at ROYC.",
              "Analytics, to replace assumptions with real visitor data.",
              "Testing with real recruiters and on real phones.",
              "Short quotes from people I’ve worked with.",
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
