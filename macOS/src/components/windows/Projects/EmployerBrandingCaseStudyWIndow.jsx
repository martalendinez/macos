// src/components/windows/Projects/EmployerBrandingCaseStudyWIndow.jsx
// Case study: Kallos, an AI-assisted employer branding platform (bachelor thesis with PrideCom).
import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import { AtAGlance, BrowserFrame, Caption, Changes, Decision, Figure, H3, Insights, Intro, Lead, PullQuote, Stage, Stats } from "./caseStudy/Editorial";

import interviewImg from "../../../imgs/case-study/kallos/Interview.png";
import competitorImg from "../../../imgs/case-study/kallos/competitor_analysis.png";
import architectureImg from "../../../imgs/case-study/kallos/Architecture.png";
import securityImg from "../../../imgs/case-study/kallos/Security_Model.png";
import iaImg from "../../../imgs/case-study/kallos/IA.png";
import personaImg from "../../../imgs/case-study/kallos/Persona_web.jpg";
import empathyMapImg from "../../../imgs/case-study/kallos/Empathy_Map1.jpg";
import designSystem1Img from "../../../imgs/case-study/kallos/DesignSystem1.png";
import designSystem2Img from "../../../imgs/case-study/kallos/DesignSystem2.png";
import lofiImg from "../../../imgs/case-study/kallos/Lofi.png";
import testingImg from "../../../imgs/case-study/kallos/Testing.png";
import iterationsImg from "../../../imgs/case-study/kallos/Survey_Iterations.png";
import recommendationsImg from "../../../imgs/case-study/kallos/recommendations.png";
import dashboardImg from "../../../imgs/case-study/kallos/Dashboard.png";
import mockupImg from "../../../imgs/case-study/kallos/Kallos_Mockup_web.jpg";
import laptopImg from "../../../imgs/case-study/kallos/Laptop_Kallos.png";

const TINT = "#f28b4b";
const URL = "localhost:5000";

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

export default function EmployerBrandingCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  return (
    <CaseStudyLayout onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Employer Branding">
      <Intro
        {...t}
        eyebrow="Bachelor thesis · PrideCom · 2024"
        title="Kallos: turning scattered employer-brand signals into one score HR can act on"
        lede="Small companies know employer branding matters, but can’t afford a consultant to tell them where they stand. I designed and built Kallos, a secure, AI-assisted platform that brings surveys, web data and benchmarks into one dashboard, a transparent score, and concrete next steps."
        ctas={[
          { label: "View on GitHub", href: "https://github.com/martalendinez/Kallos" },
          { label: "Full case study (PDF)", href: "/pdfs/Case-Study-Kallos.pdf" },
        ]}
        facts={[
          { k: "Role", v: "UX designer & developer" },
          { k: "Timeline", v: "Feb–Jun 2024 · 4 months" },
          { k: "Team", v: "3 designers, client PrideCom" },
          { k: "Stack", v: "Flask · PostgreSQL · LLaMA 3 · Docker" },
        ]}
      />

      <Stage {...t} className="mt-10" pad="p-0">
        <button type="button" onClick={() => open(mockupImg, "Kallos screens")} className="block w-full cursor-zoom-in">
          <img src={mockupImg} alt="Kallos platform screens: landing page, dashboard and recommendations" className={`block w-full h-auto ${theme.isDark ? "" : "mix-blend-multiply"}`} />
        </button>
      </Stage>

      <CaseStudySection id="glance" title="At a glance" subtitle="The 30-second version" theme={theme}>
        <AtAGlance
          {...t}
          items={[
            { label: "Problem", text: "HR teams at SMEs have the raw material (surveys, reviews, KPIs) but no affordable way to see the whole picture or know what to fix first." },
            { label: "What I did", text: "Led research, IA, UI and the design system, then built the product end to end: Flask backend, encrypted PostgreSQL, a LLaMA 3 analysis pipeline and a Docker deployment." },
            { label: "Outcome", text: "All seven HR professionals finished the core flow without help and read the dashboard straight away. They called the recommendations “very in line with HR vocabulary”." },
          ]}
        />
        <div className="mt-10">
          <Stats
            {...t}
            items={[
              { value: "7", label: "HR professionals tested the prototype" },
              { value: "7/7", label: "completed the full flow unassisted" },
              { value: "4", label: "expert interviews: HR, marketing, security, AI" },
              { value: "3", label: "competing platforms analysed" },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The problem" subtitle="Why HR teams were stuck" theme={theme}>
        <Lead theme={theme}>
          Existing tools like CultureAmp, Eletive and Populum each measure one slice of the picture, mostly through surveys. Nobody was helping a two-person HR team connect those slices into a
          story they could act on.
        </Lead>
        <p className="mt-5">
          The options were expensive consultancy or tools that only show part of the picture. Together with PrideCom, we explored whether AI could close that gap without turning employee data
          into a black box.
        </p>
        <p className={`mt-6 pl-4 border-l-2 text-[18px] font-semibold tracking-[-0.01em] ${theme.textMain}`} style={{ borderColor: TINT }}>
          How might we help a small HR team understand its employer brand in one sitting, and trust what the AI tells them?
        </p>
      </CaseStudySection>

      <CaseStudySection id="research" title="Research" subtitle="Competitors, experts, literature" theme={theme}>
        <p>
          I mapped the competitive landscape and interviewed four experts who would each break the product in a different way: an HR Director at Toyota, a Marketing Lead at Accenture, a
          cybersecurity expert and an AI engineer. Three insights shaped everything that followed.
        </p>
        <div className="mt-8">
          <Insights
            {...t}
            items={[
              { title: "HR wants answers, not more data.", text: "Teams wanted automated processing and dashboards they could scan before a meeting, not another survey tool.", so: "a dashboard-first IA, with analysis running in the background." },
              { title: "Trust is the product.", text: "Strong encryption and GDPR compliance were non-negotiable. Without them, nobody would upload employee data.", so: "security went into the requirements on day one, not the polish phase." },
              { title: "AI should advise, not decide.", text: "Experts were clear that HR judgment stays in charge; the AI’s job is to surface patterns and suggest.", so: "recommendations are framed as levelled suggestions, never verdicts." },
            ]}
          />
        </div>
        <div className="mt-10 grid grid-cols-1 @3xl:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <Figure theme={theme} src={competitorImg} alt="Competitor analysis" caption="Feature comparison: every competitor leaned on surveys, none offered a holistic view." onOpen={open} />
          <Figure theme={theme} src={interviewImg} alt="Expert interview synthesis" caption="Expert interview synthesis." onOpen={open} />
        </div>
        <div className="mt-6 grid grid-cols-1 @2xl:grid-cols-2 gap-6">
          <Figure theme={theme} src={personaImg} alt="Persona: Elena, HR coordinator" caption="Elena, our primary persona: an HR coordinator with no budget and no employer-branding playbook." onOpen={open} framed={false} />
          <Figure theme={theme} src={empathyMapImg} alt="Empathy map" caption="Empathy map: time pressure and uncertainty were the recurring feelings." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="decisions" title="Key decisions" subtitle="What I chose, and what it cost" theme={theme}>
        <Decision
          {...t}
          n={1}
          title="One score, never a black box"
          tradeoff="A single number can oversimplify. It is always shown next to the category breakdown and the recommendations that explain it."
          visual={<BrowserFrame theme={theme} src={dashboardImg} alt="Kallos dashboard" url={`${URL}/dashboard`} onOpen={open} />}
        >
          We chose a <b className={theme.textMain}>holistic</b> concept over single-metric tools: survey data, web insights, sentiment and benchmarks roll up into one employer-brand score. The dashboard
          then shows the breakdown by category (work culture, salary, work-life balance…) so HR can see <i>why</i> the score is what it is.
        </Decision>
        <Decision
          {...t}
          n={2}
          title="Recommendations matched to maturity"
          tradeoff="Levels add a concept users must learn. Testing showed some friction there, so I added short explanations of each level."
          visual={<BrowserFrame theme={theme} src={recommendationsImg} alt="Kallos recommendations" url={`${URL}/recommendations`} onOpen={open} />}
        >
          A company starting from zero needs different advice than one with an established brand. Recommendations are tailored to each company’s maturity level and written as concrete steps HR can
          take this quarter, in the language HR teams already use.
        </Decision>
        <Decision {...t} n={3} title="Privacy by design" tradeoff="Encryption and GDPR flows took real time out of a 4-month build. The experts made it clear the product was worthless without them.">
          Sensitive fields are encrypted with PyNaCl before they reach PostgreSQL, data handling follows GDPR, and LLaMA 3 runs locally through LM Studio, so survey answers never have to leave our own
          environment.
        </Decision>
      </CaseStudySection>

      <CaseStudySection id="design" title="Design" subtitle="Structure first, then a system" theme={theme}>
        <p>
          The design flowchart mapped every route through the product and exposed dead ends before any UI existed. From there I built a design system aligned with PrideCom’s brand: a warm orange
          accent on calm neutrals, so dense data still feels approachable.
        </p>
        <div className="mt-8">
          <Figure theme={theme} src={iaImg} alt="Information architecture and flow" caption="Information architecture and user flow." onOpen={open} />
        </div>
        <div className="mt-6 grid grid-cols-1 @2xl:grid-cols-3 gap-6 items-start">
          <Figure theme={theme} src={designSystem1Img} alt="Colour system" caption="Colour system." onOpen={open} />
          <Figure theme={theme} src={designSystem2Img} alt="Type and buttons" caption="Typography and buttons." onOpen={open} />
          <Figure theme={theme} src={lofiImg} alt="Low-fi screens" caption="Low-fi key screens." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="build" title="Build" subtitle="Designing it and shipping it" theme={theme}>
        <p>Being the designer <i>and</i> the developer meant the UI never promised something the backend couldn’t deliver. Each technical choice served a UX goal:</p>
        <CaseStudyBulletList
          items={[
            "Python + Flask: a lightweight backend with modular routes, easy to plug the AI pipeline into.",
            "PostgreSQL: a reliable relational schema for surveys, KPIs and encrypted user data.",
            "LLaMA 3 via LM Studio: NLP and sentiment analysis across survey answers and web data.",
            "PyNaCl: field-level encryption before anything is stored.",
            "Docker: one container setup for consistent environments and smooth deployment.",
            "SOLID principles throughout, so the codebase stays easy to extend.",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <Figure theme={theme} src={architectureImg} alt="System architecture" caption="System architecture." onOpen={open} />
          <Figure theme={theme} src={securityImg} alt="Security model" caption="Security model and GDPR data flow." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="testing" title="Testing & iteration" subtitle="7 HR professionals, one core flow" theme={theme}>
        <p>
          Seven HR professionals tested the prototype, focusing on the HR metrics flow and the interface as a whole. Clarity and navigation came out strong, and the friction we did find was specific
          enough to fix.
        </p>
        <PullQuote {...t} quotes={["“Everything is very clear.”", "“Very good, very in line with HR vocabulary.”", "“Very modern and professional.”"]} who="HR professionals during usability testing" />
        <H3 theme={theme}>What changed after testing</H3>
        <div className="mt-4">
          <Changes
            {...t}
            items={[
              { found: "Recommendation levels weren’t immediately understood.", changed: "Short explanations for each level and the purpose of every survey." },
              { found: "Some companies don’t run every survey.", changed: "Manual KPI input as a fallback, so nobody gets stuck." },
              { found: "Open-ended competitor lists made benchmarks less precise.", changed: "Competitor input limited to 3–5 for more accurate comparisons." },
              { found: "Key topics were missing and one question felt off.", changed: "New questions on budget, growth and recruitment channels; diversity question rephrased for clarity and inclusivity." },
              { found: "Editing surveys and question banks was hard to discover.", changed: "Renamed the section and added guidance on how to edit them." },
            ]}
          />
        </div>
        <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <BrowserFrame theme={theme} src={testingImg} alt="HR metrics flow tested" url={`${URL}/metrics`} onOpen={open} />
          <BrowserFrame theme={theme} src={iterationsImg} alt="Iterated question banks" url={`${URL}/questions`} onOpen={open} />
        </div>
        <Caption theme={theme}>Left: the HR metrics flow we tested. Right: question banks after iteration.</Caption>
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Outcome" subtitle="What shipped and what I learned" theme={theme}>
        <Stage {...t} pad="px-4 pt-6 pb-2 @2xl:px-16 @2xl:pt-10">
          <button type="button" onClick={() => open(laptopImg, "Kallos final")} className="block w-full cursor-zoom-in">
            <img src={laptopImg} alt="Kallos dashboard on a laptop" className={`block w-full max-w-[640px] mx-auto h-auto ${theme.isDark ? "rounded-xl" : "mix-blend-multiply"}`} />
          </button>
        </Stage>
        <p className="mt-8">
          A working, containerised platform that helps SMEs understand and improve their employer brand, validated by the people it’s for. Even without production metrics, testing showed it
          delivered on its core UX goals: less cognitive load, trust built through familiar HR language, and complex insights that feel actionable.
        </p>
        <H3 theme={theme} className="mt-8">
          What I’d do differently
        </H3>
        <CaseStudyBulletList
          items={[
            "Test earlier with a wider range of HR roles and company sizes to catch edge cases sooner.",
            "Bring in real-world datasets earlier to stress-test the analysis and sharpen the recommendations.",
            "Prototype the AI explanation layer from the start: transparency is what makes people trust the score.",
          ]}
        />
      </CaseStudySection>

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
