// src/components/windows/Projects/EmployerBrandingCaseStudyWIndow.jsx
// Case study: Kallos, an AI-assisted employer branding platform (bachelor thesis with PrideCom).
import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import { EncryptionCode, KallosSystem, PasswordRules, UploadCard } from "./caseStudy/KallosVisuals";
import { AIPipeline, AppFactoryCode, ArchitectureDiagram, BeforeAfter, CompetitorTable, DataModel, DoubleDiamondPro, ExpertPanel, KPIFramework, ProblemCards, SecurityFlow, TechStack, UXSketchSheet, LofiWireframes, CodeToggle } from "./caseStudy/KallosDeep";
import { AtAGlance, BrowserFrame, Caption, Changes, Decision, Figure, H3, Insights, Intro, Lead, Learnings, MetricsPlan, PullQuote, Stats } from "./caseStudy/Editorial";

import iaImg from "../../../imgs/case-study/kallos/IA.png";
import personaImg from "../../../imgs/case-study/kallos/Persona_web.jpg";
import empathyMapImg from "../../../imgs/case-study/kallos/Empathy_Map1.jpg";
import iterationsImg from "../../../imgs/case-study/kallos/Survey_Iterations_clean.png";
import recommendationsImg from "../../../imgs/case-study/kallos/recommendations.png";
import dashboardImg from "../../../imgs/case-study/kallos/Dashboard.png";
import mockupImg from "../../../imgs/case-study/kallos/Kallos_Mockup_web.jpg";
import BehindTheScenes from "./caseStudy/BehindTheScenes";

const TINT = "#f28b4b";
const URL = "localhost:5000";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "process", label: "Process & goals" },
  { id: "research", label: "Research" },
  { id: "lofi", label: "Sketches & lo-fi" },
  { id: "system", label: "Design system" },
  { id: "hifi", label: "Product & decisions" },
  { id: "build", label: "Design → code" },
  { id: "testing", label: "Testing & iteration" },
  { id: "outcome", label: "Impact & metrics" },
  { id: "learnings", label: "What I learned" },
];

export default function EmployerBrandingCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  return (
    <CaseStudyLayout tint={TINT} canvas={false} device="laptop" onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Employer Branding">
      <Intro
        {...t}
        eyebrow="End-to-end product · PrideCom · Feb–Jun 2024"
        title="Kallos: turning scattered employer-brand signals into one score HR can act on"
        lede="PrideCom, an HR communications consultancy, wanted to turn its manual, expensive employer-branding audits into a product SMEs could use on their own. I led Kallos end to end, from expert research and UX to a Flask backend, encrypted data and a local LLM, and delivered a working, user-validated prototype."
        ctas={[
          { label: "View on GitHub", href: "https://github.com/martalendinez/Kallos" },
        ]}
        facts={[
          { k: "Role", v: "UX engineer · product design · AI integration" },
          { k: "Timeline", v: "Feb–Jun 2024 · bachelor thesis" },
          { k: "Client", v: "PrideCom, HR communications" },
          { k: "Stack", v: "Flask · PostgreSQL · Llama 3 · PyNaCl · Docker" },
        ]}
      />

      <button type="button" onClick={() => open(mockupImg, "Kallos screens")} className="mt-10 block w-full cursor-zoom-in">
        <img src={mockupImg} alt="Kallos platform screens: landing page, dashboard and recommendations" className="block w-full h-auto rounded-[20px]" />
      </button>

      <div className="mt-6">
        <BehindTheScenes project="kallos" theme={theme} tint={TINT} onOpenWindow={onOpenWindow} />
      </div>

      <CaseStudySection id="glance" title="At a glance" subtitle="The 30-second version" theme={theme}>
        <AtAGlance
          {...t}
          items={[
            { label: "Problem", text: "Employer-branding analysis was manual consultancy: slow, expensive and out of reach for SMEs, while the HR data behind it is fragmented and highly sensitive." },
            { label: "What I did", text: "Defined requirements from research, designed the flows, dashboard and design system, then built it: Flask backend, database architecture, Meta Llama analysis, encryption and GDPR-minded data handling." },
            { label: "Outcome", text: "A working prototype that turns PrideCom’s methodology into software. In two testing rounds, every participant completed the core tasks and 90% found the AI recommendations actionable." },
          ]}
        />
        <div className="mt-10">
          <Stats
            {...t}
            items={[
              { value: "100%", label: "completed the core tasks (11 participants)" },
              { value: "90%", label: "found the AI recommendations actionable" },
              { value: "82%", label: "reported high clarity reading the dashboard" },
              { value: "75%", label: "understood their employer-branding gaps better" },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The problem" subtitle="Consultancy doesn’t scale" theme={theme}>
        <Lead theme={theme}>
          PrideCom’s consultants could tell a company exactly how strong its employer brand was. But every audit was manual, time-intensive and expensive, so the companies that needed it most,
          small and medium-sized ones, couldn’t afford it.
        </Lead>
        <div className="mt-8">
          <ProblemCards theme={theme} />
        </div>
        <p className="mt-6">Existing tools like CultureAmp, Eletive and Populum each measure one slice, mostly through surveys. Nobody connected the slices into guidance an HR team could act on.</p>
        <p className={`mt-6 pl-4 border-l-2 text-[18px] font-semibold tracking-[-0.01em] ${theme.textMain}`} style={{ borderColor: TINT }}>
          How might we turn a consultancy methodology into a self-serve product, without losing analytical depth or compromising data security?
        </p>
      </CaseStudySection>

      <CaseStudySection id="process" title="Process & goals" subtitle="Double Diamond, three stakeholder groups, six goals" theme={theme}>
        <p className="mb-8">The project followed the Double Diamond, from exploring the problem with experts to delivering a tested, containerised prototype.</p>
        <DoubleDiamondPro theme={theme} />
        <H3 theme={theme} className="mt-12">
          Who it had to work for
        </H3>
        <div className="mt-4 grid grid-cols-1 @3xl:grid-cols-3 gap-4">
          {[
            ["PrideCom consultants", "Domain experts who own the employer-branding methodology. The product had to encode their thinking faithfully."],
            ["HR professionals", "The end users: busy, non-technical, needing to evaluate and improve their employer brand."],
            ["Product & tech team", "Turning a consultancy process into a scalable, secure platform."],
          ].map(([h, d]) => (
            <div key={h} className="pt-4 border-t-2" style={{ borderColor: TINT }}>
              <div className={`text-[15px] font-semibold ${theme.textMain}`}>{h}</div>
              <p className="mt-1.5 text-[14px] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <H3 theme={theme} className="mt-12">
          Six goals
        </H3>
        <ol className="mt-4 grid grid-cols-1 @3xl:grid-cols-2 gap-x-8 gap-y-4">
          {[
            ["Digitalise the methodology", "Translate PrideCom’s manual process into a scalable product without losing analytical depth."],
            ["Recommendations first", "A dashboard that prioritises clear, structured guidance over overwhelming metrics."],
            ["Transparent automation", "Use LLMs and rule-based logic to automate analysis while staying reliable and explainable."],
            ["Privacy from the foundation", "Encryption, secure authentication and a privacy-first architecture from day one."],
            ["Low cognitive load", "Help HR professionals spot gaps and opportunities quickly."],
            ["Built to grow", "A clean, modular backend (OOP, SOLID, containers) ready for SaaS expansion."],
          ].map(([h, d], i) => (
            <li key={h} className="grid grid-cols-[36px_1fr] gap-x-3">
              <span className="text-[13px] font-semibold tabular-nums pt-[3px]" style={{ color: TINT }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className={`font-semibold ${theme.textMain}`}>{h}.</span> {d}
              </div>
            </li>
          ))}
        </ol>
      </CaseStudySection>

      <CaseStudySection id="research" title="Research" subtitle="Competitors, experts, literature" theme={theme}>
        <p>
          I combined competitor analysis, desk research on employer branding, dashboard design and data privacy, and interviews with five experts who would each stress the product differently:
          the HR Director at Toyota Material Handling, the Candidate Marketing Lead at Accenture, and an AI engineer, a data engineer and a software engineer.
        </p>
        <div className="mt-8">
          <Insights
            {...t}
            items={[
              { title: "Employer-branding data is fragmented.", text: "Surveys, reviews, KPIs and web data live in different places and formats.", so: "one data-input module feeding one holistic score." },
              { title: "People need guidance, not raw metrics.", text: "HR teams wanted to know what to do next, not stare at more charts.", so: "a recommendation-first dashboard with three priority levels." },
              { title: "Hierarchy is everything.", text: "Showing every metric at once would overwhelm a non-technical user.", so: "KPIs grouped into themes, the most important insights first." },
              { title: "Trust and scale from the start.", text: "Sensitive HR data and future SaaS growth both demand a solid architecture.", so: "encryption, local AI and a modular, containerised backend." },
            ]}
          />
        </div>
        <H3 theme={theme} className="mt-12">
          The expert panel
        </H3>
        <p className="mt-2 mb-5">Five interviews, each chosen to stress a different part of the product: the HR reality, the candidate side, the AI, the data and the security.</p>
        <ExpertPanel theme={theme} />
        <H3 theme={theme} className="mt-12">
          Competitor analysis
        </H3>
        <p className="mt-2 mb-5">Every competitor collected data mainly through surveys and stopped at analytics. None turned the analysis into guidance a small HR team could follow.</p>
        <CompetitorTable theme={theme} />
        <p className={`mt-10 pl-4 border-l-2 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`} style={{ borderColor: TINT }}>
          A scalable employer-branding platform must prioritise clarity, actionable recommendations and data security over feature complexity.
        </p>
        <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-6">
          <Figure theme={theme} src={personaImg} alt="Persona: Elena, HR coordinator" caption="Elena Jiménez, 28, HR coordinator at a small IT company: no budget, no in-house expertise, and responsible for recruitment, onboarding and admin." onOpen={open} framed={false} />
          <Figure theme={theme} src={empathyMapImg} alt="Empathy map" caption="Empathy map: time pressure and uncertainty were the recurring feelings." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="lofi" title="Sketches & lo-fi" subtitle="Pencil first, structure second" theme={theme}>
        <p>
          I sketched the five screens that carry the core flow on a printed 12-column browser template: data in (surveys and upload states), insight (the dashboard), and action
          (recommendations), plus onboarding. Each numbered note records the decision behind a screen.
        </p>
        <div className="mt-8">
          <UXSketchSheet theme={theme} />
        </div>
        <H3 theme={theme} className="mt-12">
          The design flowchart
        </H3>
        <p className="mt-2 mb-6">
          Before any UI, the flowchart mapped every route: onboarding tutorials, survey upload, the dashboard, benchmarking, recommendations and profile settings, including every error and
          confirmation state.
        </p>
        <Figure theme={theme} src={iaImg} alt="Design flowchart" caption="Core workflow, from data submission to AI-generated insights, with every decision branch." onOpen={open} />
        <div className="mt-8 grid grid-cols-1 @3xl:grid-cols-3 gap-4">
          {[
            ["Onboarding gate", "The “Done” button stays disabled until every tutorial is watched, with progress shown as a percentage."],
            ["Upload rules", "Files are checked for size (10 MB max) and format, with a specific error message for each failure."],
            ["Safe deletes", "Deleting surveys, questions or account data always asks for confirmation first."],
          ].map(([h, d]) => (
            <div key={h} className={`rounded-[14px] p-4 ${theme.isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"}`}>
              <div className={`text-[14px] font-semibold ${theme.textMain}`}>{h}</div>
              <p className="mt-1 text-[13.5px] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <H3 theme={theme} className="mt-12">
          Lo-fi wireframes
        </H3>
        <p className="mt-2 mb-6">Greyscale wireframes of the four key screens validated structure and hierarchy before PrideCom’s orange went in. Switch between them:</p>
        <LofiWireframes theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="system" title="Design system" subtitle="Built on PrideCom’s brand" theme={theme}>
        <p>
          The palette comes entirely from PrideCom’s existing identity: a warm orange accent on graphite neutrals, so dense HR data still feels approachable. Secondary colours carry chart
          categories, and two state colours (restrictive red, approved green) handle alerts and errors.
        </p>
        <div className="mt-8">
          <KallosSystem />
        </div>
        <Caption theme={theme}>The Kallos design system, rebuilt live: copy a colour or switch recommendation levels.</Caption>
      </CaseStudySection>

      <CaseStudySection id="hifi" title="Product & key decisions" subtitle="Four modules, one workflow, and the choices behind it" theme={theme}>
        <p className="mb-8">The hi-fi prototype lets stakeholders enter real data, navigate dashboards and interpret AI-generated insights exactly as they would in a live SaaS product. Two design challenges shaped all of it:</p>
        <div className="mb-10">
          <Changes
            {...t}
            labels={["Design challenge", "Design response"]}
            items={[
              { found: "Employer branding involves large amounts of qualitative and quantitative data. Showing it all at once would overwhelm users.", changed: "The interface prioritises recommendations and key insights, so HR spots the most important improvement areas first." },
              { found: "A consultancy works through conversations and expert judgment, not screens.", changed: "A structured workflow replicates the process: data input → analysis → actionable recommendations." },
            ]}
          />
        </div>

        <div className="mt-10 space-y-14">
          {[
            { n: "01", h: "Data input", d: "Structured surveys and question banks collect metrics like eNPS, candidate experience and retention. Users can create, edit, delete or update their data at any time.", img: iterationsImg, url: "questions" },
            { n: "02", h: "Dashboard", d: "KPIs grouped into themes for a clear hierarchy: a radar chart compares perception dimensions at once, and bar charts compare recruitment-channel performance.", img: dashboardImg, url: "dashboard", dt: "Decision: one score, never a black box", tr: "A single number can oversimplify, so it always sits next to the category breakdown that explains it." },
            { n: "03", h: "The KPI framework", d: "Behind the dashboard: twelve HR metrics from PrideCom’s methodology, grouped into four themes so HR reads them as a story, not a spreadsheet. Tap a KPI to highlight it.", kpi: true },
            { n: "04", h: "Recommendations", d: "A performance score built on PrideCom’s methodology, with structured advice across three priority levels, and an explanation of how the score is derived.", img: recommendationsImg, url: "recommendations", dt: "Decision: advice matched to maturity", tr: "Levels add a concept to learn. Testing showed friction, so each level got a short explanation." },
          ].map((m, i) => (
            <div key={m.n} className={`grid grid-cols-1 @3xl:grid-cols-[1fr_1.35fr] gap-6 @3xl:gap-10 items-center ${i % 2 ? "@3xl:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: TINT }}>
                  Module {m.n}
                </div>
                <div className={`mt-1 text-[22px] font-bold tracking-[-0.02em] ${theme.textMain}`}>{m.h}</div>
                <p className="mt-2 text-[15px] leading-relaxed">{m.d}</p>
                {m.dt && (
                  <div className="mt-4 pl-4 border-l-2" style={{ borderColor: TINT }}>
                    <div className={`text-[14px] font-semibold ${theme.textMain}`}>{m.dt}</div>
                    <p className={`mt-1 text-[13.5px] leading-relaxed ${theme.textSub}`}>
                      <b>Trade-off:</b> {m.tr}
                    </p>
                  </div>
                )}
              </div>
              {m.kpi ? <KPIFramework theme={theme} /> : <BrowserFrame theme={theme} src={m.img} alt={m.h} url={`${URL}/${m.url}`} onOpen={open} />}
            </div>
          ))}
        </div>
        <div className="mt-14">
        <Decision {...t} n={1} title="Privacy by design" tradeoff="Encryption and GDPR flows took real time out of a 4-month build. The experts made it clear the product was worthless without them.">
          Sensitive fields are encrypted with PyNaCl before they reach PostgreSQL, data handling follows GDPR, and LLaMA 3 runs locally through LM Studio, so survey answers never have to leave our own
          environment.
        </Decision>
        </div>
        <H3 theme={theme} className="mt-14">
          Edge cases, designed in
        </H3>
        <p className="mt-2 mb-6">The upload component follows the flowchart exactly. Try the three example files:</p>
        <UploadCard />
      </CaseStudySection>

      <CaseStudySection id="build" title="Design → code" subtitle="The engineering behind the experience" theme={theme}>
        <p>
          Being the designer <i>and</i> the developer meant the UI never promised something the backend couldn’t deliver. I implemented the backend, designed the database, integrated Meta Llama
          for the analysis, and built security and GDPR-minded data handling in from the first commit.
        </p>
        <div className="mt-8">
          <TechStack theme={theme} />
        </div>

        <H3 theme={theme} className="mt-14">
          1 · Architecture
        </H3>
        <p className="mt-2 mb-5">
          A Flask app split into blueprints (auth and views) talks to PostgreSQL through the SQLAlchemy ORM, encrypts sensitive fields on the way in, and calls a Llama model hosted locally in LM
          Studio, so survey answers never leave our environment. Everything ships in one Docker container.
        </p>
        <ArchitectureDiagram theme={theme} />
        <div className="mt-5">
          <CodeToggle label="View the app factory">
            <AppFactoryCode />
          </CodeToggle>
        </div>

        <H3 theme={theme} className="mt-14">
          2 · The AI pipeline
        </H3>
        <p className="mt-2 mb-5">
          Following the AI engineer’s advice, Kallos uses a pre-trained model instead of training its own: there was no labelled HR dataset, and GDPR made collecting one unrealistic. The LLM
          reads and interprets; PrideCom’s rules decide the score, which keeps the result explainable.
        </p>
        <AIPipeline theme={theme} />

        <H3 theme={theme} className="mt-14">
          3 · Data model & encryption
        </H3>
        <p className="mt-2 mb-5">
          The user table separates what Kallos needs to log you in from what it should never be able to read in plain text. Personal and company fields are encrypted; the password is never stored,
          only its hash. Toggle the panel to see the difference.
        </p>
        <DataModel theme={theme} />
        <div className="mt-5">
          <CodeToggle label="View encryption.py">
            <EncryptionCode />
          </CodeToggle>
        </div>

        <H3 theme={theme} className="mt-14">
          4 · Security flow
        </H3>
        <p className="mt-2 mb-5">From the browser to the database, every request passes through the same six steps.</p>
        <SecurityFlow theme={theme} />

        <H3 theme={theme} className="mt-14">
          5 · Validation as UX
        </H3>
        <p className="mt-2 mb-5">
          Sign-up checks every rule and returns a clear, human message for each one, instead of a generic “invalid password”. Here are those exact rules, rebuilt as live feedback:
        </p>
        <PasswordRules />
      </CaseStudySection>

      <CaseStudySection id="testing" title="Testing & iteration" subtitle="2 rounds · 11 participants · 5 core tasks" theme={theme}>
        <p>
          I ran two rounds of prototype testing with 11 participants: HR professionals from PrideCom’s clients and internal stakeholders familiar with employer branding. They worked through five core tasks,
          such as submitting employer-branding data, navigating the insights dashboard, interpreting recommendations and identifying priority improvement areas. Sessions measured task
          completion, clarity of insights and the perceived usefulness of the AI recommendations.
        </p>
        <div className="mt-8">
          <Stats
            {...t}
            items={[
              { value: "100%", label: "completed the core tasks" },
              { value: "90%", label: "found the AI recommendations actionable" },
              { value: "82%", label: "reported high clarity interpreting the dashboard" },
              { value: "75%", label: "understood their employer-branding gaps better" },
            ]}
          />
        </div>
        <PullQuote {...t} quotes={["“Everything is very clear.”", "“Very good, very in line with HR vocabulary.”", "“Very modern and professional.”"]} who="HR professionals during usability testing" />
        <H3 theme={theme} className="mt-10">
          What changed, and why it helped
        </H3>
        <p className="mt-2 mb-6">Five iterations came straight out of the sessions. Each one is shown as it was tested and as it shipped.</p>
        <BeforeAfter theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Impact & metrics" subtitle="What shipped, and how I’d measure it next" theme={theme}>
        <H3 theme={theme}>
          Business impact
        </H3>
        <CaseStudyBulletList
          items={[
            "Turned PrideCom’s consultancy methodology into a working digital product.",
            "Reduced dependency on manual employer-branding audits.",
            "Laid the foundation for a SaaS product, validated by the HR professionals it’s for.",
          ]}
        />
        <div className="mt-10 grid grid-cols-1 @3xl:grid-cols-2 gap-8">
          <div>
            <H3 theme={theme}>Honest constraints</H3>
            <CaseStudyBulletList
              items={[
                "A graduation prototype, built within time and resource limits, so no full SaaS deployment yet.",
                "The LLM ran in a locally hosted environment that would need optimising for enterprise scale.",
                "Real HR datasets were restricted by confidentiality and GDPR, limiting large-scale quantitative validation.",
              ]}
            />
          </div>
          <div>
            <H3 theme={theme}>What’s next</H3>
            <CaseStudyBulletList
              items={[
                "Advanced analytics dashboards for deeper talent-perception insights.",
                "Full SaaS deployment so companies can use Kallos independently.",
                "Recommendations that update continuously with employer-branding trends.",
              ]}
            />
          </div>
        </div>
        <H3 theme={theme} className="mt-12">
          How I’d measure success with real customers
        </H3>
        <p className="mt-2 mb-6">Testing showed HR teams understood and trusted the product. With real customers, these numbers would show whether Kallos changes how they work.</p>
        <MetricsPlan
          {...t}
          items={[
            { metric: "Time to first score", why: "The promise is understanding your brand in one sitting, not weeks of consultancy.", how: "Time from sign-up to a first employer-brand score.", target: "North star" },
            { metric: "Recommendations acted on", why: "A score only matters if it leads to action.", how: "Share of Level 1 steps checked off within 30 days.", target: "Impact" },
            { metric: "Data completeness", why: "Better inputs give a more accurate score; manual KPI entry exists so nobody gets stuck.", how: "Share of companies with surveys, questions and benchmarks all filled in.", target: "Quality" },
            { metric: "Score over time", why: "The real outcome: a stronger employer brand.", how: "Change in score between quarterly re-analyses.", target: "Outcome" },
          ]}
          note="Planned metrics, not results: Kallos was a thesis prototype tested with HR professionals, not a launched product."
        />
      </CaseStudySection>

      <CaseStudySection id="learnings" title="What I learned" subtitle="Reflection" theme={theme}>
        <Learnings
          {...t}
          items={[
            { title: "Trust is designed, not added.", text: "Encryption, local AI and GDPR shaped the product from day one. It cost build time, but the experts made it clear Kallos was useless without them." },
            { title: "Speak the user’s language.", text: "The feedback testers valued most wasn’t visual: it was recommendations written “in line with HR vocabulary”." },
            { title: "Explain the AI from the start.", text: "Next time I’d prototype the explanation layer first. Transparency is what makes people trust a score." },
            { title: "Test wider, earlier.", text: "A broader range of HR roles and real datasets earlier would have caught edge cases sooner and sharpened the recommendations." },
          ]}
        />
      </CaseStudySection>

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
