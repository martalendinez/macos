// src/components/windows/Projects/ThesisCaseStudyWindow.jsx
// Case study: Trace, an AI design-reflection plugin (master thesis on human–AI collaboration in UX).
// Content from the thesis "Human-Centered AI Assistance in Design Tools" (KTH, 2026) and the Trace_Plugin repo.
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import { AtAGlance, Caption, Changes, Decision, Figure, H3, Insights, Intro, Lead, Learnings, MetricsPlan, PullQuote, Stats } from "./caseStudy/Editorial";
import { ExperimentCompare, FrameworkExplorer, MixMatch, SynthesisBoard, TraceArchitecture, TraceLofi, TraceProblems, TraceStack, TryTrace } from "./caseStudy/TraceVisuals";
import { CodeToggle } from "./caseStudy/KallosDeep";
import { TraceGallery, TraceHero, TraceIterations, TracePanel } from "./caseStudy/TracePanels";


const TINT = "#5b5bd6";
const REPO = "https://github.com/martalendinez/Trace_Plugin";
const THESIS_PDF = "/pdfs/Human-Centered-AI-Assistance-in-Design-Tools.pdf";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "synthesis", label: "Synthesis" },
  { id: "flow", label: "The framework" },
  { id: "lofi", label: "Lo-fi" },
  { id: "decisions", label: "Key decisions" },
  { id: "try", label: "Try Trace" },
  { id: "testing", label: "Testing & iteration" },
  { id: "build", label: "Design → code" },
  { id: "outcome", label: "Impact & metrics" },
  { id: "learnings", label: "What I learned" },
]

/* ---------- local visuals ---------- */

/** Automation → Augmentation → Partnership, with Trace placed on the spectrum. */
function Spectrum({ theme }) {
  const models = [
    { name: "Automation", line: "AI does the task for you.", eg: "“Generate me a login screen.”" },
    { name: "Augmentation", line: "AI makes you faster at the task.", eg: "“Suggest spacing for this card.”" },
    { name: "Partnership", line: "AI thinks with you about the task.", eg: "“What am I missing in this flow?”", trace: true },
  ];
  return (
    <div>
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
        <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: `linear-gradient(90deg, #c7c7d1, ${TINT})` }} initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <div className="mt-5 grid grid-cols-1 @3xl:grid-cols-3 gap-6">
        {models.map((m, i) => (
          <div key={m.name}>
            <div className="flex items-center gap-2">
              <span className={`text-[12px] font-semibold tabular-nums ${theme.textSub}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={`text-[17px] font-semibold ${theme.textMain}`}>{m.name}</span>
              {m.trace && (
                <span className="px-2 py-[2px] rounded-full text-[11px] font-bold text-white" style={{ background: TINT }}>
                  Trace lives here
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[15px]">{m.line}</p>
            <p className={`mt-1 text-[13px] italic ${theme.textSub}`}>{m.eg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Small code excerpt, styled like an editor. */
function CodeBlock({ theme, title, children }) {
  return (
    <figure className="rounded-[14px] overflow-hidden" style={{ background: "#16161d", boxShadow: theme.isDark ? "0 0 0 0.5px rgba(255,255,255,0.12)" : "0 20px 40px -24px rgba(0,0,0,0.45)" }}>
      <div className="h-8 px-3 flex items-center gap-1.5 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-white/45 font-mono">{title}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[12.5px] leading-[1.7] font-mono text-[#d6d6e7]">{children}</pre>
    </figure>
  );
}

const k = (s) => <span className="text-[#c792ea]">{s}</span>;
const str = (s) => <span className="text-[#c3e88d]">{s}</span>;
const cm = (s) => <span className="text-white/35">{s}</span>;

export default function ThesisCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  return (
    <CaseStudyLayout tint={TINT} canvas={false} onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Trace · Master thesis">
      <Intro
        {...t}
        eyebrow="Master thesis · KTH · 2026"
        title="Trace: an AI co-pilot that helps designers think, instead of thinking for them"
        lede="Most AI design tools race to generate screens. My master thesis asked how AI could support UX designers’ exploration and decision-making without taking away their agency. I combined a literature review, expert interviews and a design experiment into a framework, then built Trace, a task-aware AI co-pilot, and tested it with 12 people."
        ctas={[
          { label: "Read the thesis", href: THESIS_PDF },
          { label: "View on GitHub", href: REPO },
        ]}
        facts={[
          { k: "Role", v: "Researcher, UX designer & developer" },
          { k: "Programme", v: "MSc Interactive Media Technology, KTH" },
          { k: "Method", v: "Research through design" },
          { k: "Stack", v: "React · TypeScript · Express · LLaMA" },
        ]}
      />

      <div className="mt-10">
        <TraceHero onOpen={open} />
      </div>

      <CaseStudySection id="glance" title="At a glance" subtitle="The 30-second version" theme={theme}>
        <AtAGlance
          {...t}
          items={[
            { label: "Problem", text: "AI design tools prioritise automation over collaboration. Designers get output faster, but lose control, transparency and ownership, and become passive reviewers of answers they can’t explain." },
            { label: "What I did", text: "Interviewed 5 experts, designed the same feature with and without AI, and turned the findings into a six-stage framework. Then I built Trace on it and tested two versions with 12 participants." },
            { label: "Outcome", text: "Designers described Trace as a thinking partner, not a decision-maker. They felt in control throughout: “It feels like the AI is giving me angles to think about, but I still decide what matters.”" },
          ]}
        />
        <div className="mt-10">
          <Stats
            {...t}
            items={[
              { value: "5", label: "expert interviews in the formative study" },
              { value: "12", label: "participants across two usability studies" },
              { value: "6", label: "stages in the framework, from intent to trace" },
              { value: "2", label: "rounds of iteration on the prototype" },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The problem" subtitle="Faster isn’t the same as better" theme={theme}>
        <Lead theme={theme}>
          Generative tools can produce a layout in seconds. But the most valuable part of design isn’t the layout. It’s the reasoning behind it: why this option, for whom, and at what cost.
        </Lead>
        <p className="mt-5">
          AI assistants are now built into developers’ everyday tools, but in UX design they mostly generate interfaces. Designers report hallucinated elements, outputs that miss their intent,
          and prompting that doesn’t fit visual, iterative work. When AI hands over finished answers with little insight into how they were made, designers become passive recipients
          instead of active participants, and the reflective thinking design depends on starts to fade.
        </p>
        <div className="mt-8 mb-8">
          <TraceProblems theme={theme} />
        </div>
        <p className={`mt-2 text-[12px] font-semibold uppercase tracking-[0.08em] ${theme.textSub}`}>Research question</p>
        <p className={`mt-2 pl-4 border-l-2 text-[18px] font-semibold tracking-[-0.01em] ${theme.textMain}`} style={{ borderColor: TINT }}>
          What design principles enable task-aware AI assistance to support UX designers’ exploration and decision-making while preserving transparency and human agency?
        </p>
      </CaseStudySection>

      <CaseStudySection id="research" title="Research" subtitle="Literature, experts and a design experiment" theme={theme}>
        <p>I combined three sources of evidence so the framework wouldn’t rest on any single one:</p>
        <CaseStudyBulletList
          items={[
            "Literature review across the ACM Digital Library, IEEE Xplore and Google Scholar on generative AI in UX, human–AI collaboration and AI design tools.",
            "Formative study: semi-structured interviews with 5 experts in UX design, software engineering and human–AI interaction research, analysed thematically.",
            "Design experiment: I designed the same loyalty feature twice, with and without AI, logging decisions, prompts, artefacts and moments of friction.",
          ]}
        />
        <H3 theme={theme} className="mt-10">
          What the experts told me
        </H3>
        <div className="mt-5">
          <Insights
            {...t}
            items={[
              { title: "AI shines early, then fades.", text: "Experts used AI to draft, organise and diverge early on. Its value dropped as work became complex, contextual or sensitive.", so: "Trace focuses on early- and mid-stage exploration." },
              { title: "Over-automation kills engagement.", text: "One expert called it “cognitive offloading”: the system does the thinking and the user becomes a passive evaluator.", so: "options and critiques, never finished answers." },
              { title: "Confident tone, miscalibrated trust.", text: "Polished answers lead to either over-reliance or exhausting verification.", so: "visible reasoning and honest uncertainty." },
              { title: "Nobody knows where AI belongs.", text: "The hard part isn’t how AI works, but knowing when it’s appropriate to rely on it.", so: "the designer states the task type and stage up front." },
              { title: "Failures break the flow.", text: "Repetitive outputs, hallucinations and loops forced manual correction.", so: "steerable outputs and recovery paths at every step." },
            ]}
          />
        </div>
        <H3 theme={theme} className="mt-12">
          Designing with and without AI
        </H3>
        <p className="mt-2 mb-5">The experiment made the difference tangible, and it matched exactly what the experts described.</p>
        <ExperimentCompare theme={theme} />
        <H3 theme={theme} className="mt-12">
          From automation to partnership
        </H3>
        <p className="mt-2 mb-6">Most AI design tools sit at the automation end. The research pointed Trace towards partnership.</p>
        <Spectrum theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="synthesis" title="Synthesis" subtitle="From three sources of evidence to one framework" theme={theme}>
        <p className="mb-8">
          I built the framework abductively: notes from the literature, the expert interviews and my own design experiment went on one board, were clustered, and the recurring patterns
          became six workflow stages.
        </p>
        <SynthesisBoard theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="flow" title="The framework" subtitle="Task-aware, human-centred AI assistance" theme={theme}>
        <p>The framework rests on four foundations from the research:</p>
        <ol className="mt-4 mb-10 space-y-3">
          {[
            ["Keep designers reasoning.", "AI scaffolds engagement; it doesn’t replace it."],
            ["Make reasoning visible.", "Designers need to see why an output was produced to judge it."],
            ["Treat AI output as provisional.", "Everything is material for critique, not a final answer."],
            ["Context is everything.", "AI works best when the task, information and constraints are explicit."],
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
        <p className="mb-8">It organises AI-assisted design into six stages, with cross-cutting guardrails running through all of them. Hover a stage to see who does what:</p>
        <FrameworkExplorer theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="lofi" title="Lo-fi" subtitle="A panel next to the canvas" theme={theme}>
        <p className="mb-8">
          Trace was designed as a plugin panel that sits beside the designer’s canvas, never on top of it. I wireframed each stage in greyscale to test the structure before any visual design:
        </p>
        <TraceLofi theme={theme} />
        <H3 theme={theme} className="mt-14">
          From lo-fi to hi-fi
        </H3>
        <p className="mt-2 mb-6">The coded prototype brought each stage to life as a panel beside the canvas:</p>
        <TraceGallery theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="decisions" title="Key decisions" subtitle="What I chose, and what it cost" theme={theme}>
        <Decision {...t} n={1} title="No generated UI. Ever." tradeoff="It’s less flashy than a tool that spits out screens. That’s the point: the thinking stays with the designer." visual={<div className="flex justify-center"><TracePanel screen="Options" width={300} /></div>}>
          Trace outputs <b className={theme.textMain}>3–5 options</b>, each with a title, summary, the problem it addresses, its underlying assumption, a design principle and an explicit trade-off.
          Options are things to reason about, not artefacts to paste in. The reasoning plays in progressively, so designers can see how the AI got there without being overwhelmed.
        </Decision>
        <Decision
          {...t}
          n={2}
          title="Feedback that knows where you are"
          tradeoff="The designer has to tell Trace which stage they’re in. One extra input, but it stops pixel-level feedback from derailing a problem-definition session."
        >
          Feedback on a wireframe shouldn’t be about colours. Trace adapts what the AI focuses on, and what it must avoid, across <b className={theme.textMain}>eight design stages</b>, from problem
          definition to usability testing.
        </Decision>
        <Decision {...t} n={3} title="Critiques that admit uncertainty" tradeoff="Hedged feedback can feel less authoritative. That’s deliberate: the designer, not the model, makes the call.">
          Each critique has a category, a concern, a concrete suggestion, and an <b className={theme.textMain}>uncertainty note</b> explaining what the AI can’t know. Designers choose the lenses
          (accessibility, usability, consistency, edge cases, interaction complexity), and if they mention accessibility needs, the AI is instructed to prioritise them.
        </Decision>
        <Decision {...t} n={4} title="Mix and match, don’t just pick one" tradeoff="More freedom means more decisions. The drag-and-drop keeps it playful and fast.">
          Good solutions are often hybrids. Designers can drag a title, principle or trade-off from one option onto another to compose their own, or open a refinement chat to push one option
          further.
        </Decision>
        <div className="mb-10">
          <MixMatch theme={theme} />
          <p className={`mt-2 text-[11.5px] ${theme.textSub}`}>Example options for an onboarding flow, like the task in the usability study.</p>
        </div>
        <Decision
          {...t}
          n={5}
          title="A trace you can edit and keep"
          tradeoff="Documenting takes a moment at the end. In return, the reasoning is still there in the review, the hand-off, and three months later."
          visual={
<div className="flex justify-center"><TracePanel screen="Trace" width={300} /></div>
          }
        >
          The final stage turns the session into a <b className={theme.textMain}>trace log</b>: the intent, the critiques reviewed and the improvements applied, all editable. It makes AI-assisted
          decisions auditable instead of invisible.
        </Decision>
      </CaseStudySection>

      <CaseStudySection id="try" title="Try Trace" subtitle="The critique stage, live" theme={theme}>
        <p className="mb-8">
          This runs on Trace’s real critique library and stage rules. Change the design stage to see how the AI’s focus shifts, choose your lenses, then apply or reject critiques. Rejected ones
          never come back, the fix testers asked for most.
        </p>
        <TryTrace theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="testing" title="Testing & iteration" subtitle="Two studies, 12 participants" theme={theme}>
        <p>
          I evaluated Trace twice, at different levels of fidelity, using think-aloud tasks around improving an onboarding flow, followed by interviews on usefulness, transparency, control and
          trust.
        </p>
        <div className="mt-8">
          <Stats
            {...t}
            items={[
              { value: "12", label: "participants across both studies" },
              { value: "45–60", label: "minutes per session" },
              { value: "5", label: "task scenarios in the hi-fi study" },
              { value: "9", label: "iterations shipped from the findings" },
            ]}
          />
        </div>

        <H3 theme={theme} className="mt-10">
          Round 1 · Low fidelity, 4 participants
        </H3>
        <p className="mt-2">
          A clickable prototype of all six stages, tested with UX designers, non-designers and students. People understood the logic and called the interface clean and trustworthy, but the flow felt
          rigid and some inputs were unclear.
        </p>
        <PullQuote {...t} quotes={["“I want to ask the AI to elaborate, not just read static cards.”"]} who="Participant, low-fidelity study" />
        <Changes
          {...t}
          items={[
            { found: "“I’m not always sure what the system expects me to write here.”", changed: "Rewrote labels, added one-line descriptions, placeholder examples and tooltips." },
            { found: "The steps felt rigid; people wanted to skip and revisit.", changed: "Non-linear navigation: skip buttons, a sidebar and go-back." },
            { found: "Critique cards felt static.", changed: "A refinement chat to iterate on any option conversationally." },
            { found: "The trace felt fixed and not theirs.", changed: "An editable, structured trace log." },
          ]}
        />

        <H3 theme={theme} className="mt-12">
          Round 2 · High fidelity, 8 participants
        </H3>
        <p className="mt-2">
          The coded prototype, tested with UX and product designers, researchers and students with 1–9 years of experience, on a realistic task: exploring onboarding directions for a fintech app
          across five scenarios, plus a questionnaire covering eight UX dimensions.
        </p>
        <PullQuote
          {...t}
          quotes={["“It feels like the AI is giving me angles to think about, but I still decide what matters.”", "“I could always add my own inputs and wasn’t forced to choose an option.”"]}
          who="Participants, high-fidelity study"
        />
        <p>Everyone valued the structure and the sense of control. The pain points were specific:</p>
        <div className="mt-4">
          <Changes
            {...t}
            items={[
              { found: "“If I say no, I want the system to drop it.” The AI reintroduced rejected ideas.", changed: "Memory of rejected ideas, plus Apply / Suggest / Reject controls." },
              { found: "Critiques felt like “reminders rather than deep insights.”", changed: "More varied critiques, grounded in the design stage." },
              { found: "“I want to see how the AI thinks.”", changed: "Visible reasoning explaining why a suggestion might help." },
              { found: "Options lacked variety and couldn’t be combined.", changed: "Mix & match across options." },
              { found: "Navigation felt stuck, especially after the trace.", changed: "A global “Go back” and fixes for improvement bugs." },
            ]}
          />
        </div>
        <H3 theme={theme} className="mt-12">
          Before and after, side by side
        </H3>
        <p className="mt-2 mb-6">The screens as tested and as shipped after each round.</p>
        <TraceIterations theme={theme} />
      </CaseStudySection>

      <CaseStudySection id="build" title="Design → code" subtitle="From research to a working prototype" theme={theme}>
        <p>I built Trace myself, so every research principle had to survive contact with real code and a real model.</p>
        <div className="mt-8">
          <TraceStack theme={theme} />
        </div>
        <H3 theme={theme} className="mt-12">
          1 · One request, end to end
        </H3>
        <p className="mt-2 mb-5">Follow a critique request from the designer’s input to the cards on screen:</p>
        <TraceArchitecture theme={theme} />
        <H3 theme={theme} className="mt-12">
          2 · Prompt design is UX design
        </H3>
        <p className="mt-2 mb-5">
          The stage rules are the most important “screen” in Trace: they decide what the AI talks about and, just as important, what it must not. Accessibility needs mentioned by the designer are
          always prioritised.
        </p>
        <CodeToggle label="View the stage rules">
          <CodeBlock theme={theme} title="server/reflect.ts">
            {cm("// prompt rules change with the design stage")}
            {"\n"}
            {k("If")} stage includes {str('"problem-definition"')}:{"\n"}
            {"  "}- Focus on the problem, constraints, user needs.{"\n"}
            {"  "}- Avoid UI-level feedback.{"\n\n"}
            {k("If")} stage includes {str('"wireframe"')}:{"\n"}
            {"  "}- Focus on hierarchy, navigation, usability.{"\n"}
            {"  "}- Avoid visual styling feedback.{"\n\n"}
            {k("If")} stage includes {str('"high-fidelity"')}:{"\n"}
            {"  "}- Focus on polish, accessibility, consistency.{"\n\n"}
            {cm("// if the designer mentions accessibility needs,")}
            {"\n"}
            {cm("// you MUST prioritise accessibility issues")}
          </CodeBlock>
        </CodeToggle>
        <p className={`mt-8 text-[14px] ${theme.textSub}`}>
          The response format already includes change instructions tied to design nodes: groundwork for applying suggestions directly on a canvas once Trace is connected to a design tool.
        </p>
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Impact & metrics" subtitle="What it showed, and how I’d measure it next" theme={theme}>
        <Lead theme={theme}>
          Designers don’t mainly want AI that produces solutions for them. They want tools that help them think. The question isn’t “how good is AI at wireframing?” but “how should designers
          think with AI?”
        </Lead>
        <div className="mt-8 grid grid-cols-1 @3xl:grid-cols-2 gap-8">
          <div>
            <H3 theme={theme}>Contributions</H3>
            <CaseStudyBulletList
              items={[
                "Empirical insights on how designers and experts use, trust and resist AI.",
                "A framework for task-aware, human-centred AI assistance.",
                "A working prototype showing AI as a collaborative design partner.",
              ]}
            />
          </div>
          <div>
            <H3 theme={theme}>What’s next</H3>
            <CaseStudyBulletList
              items={[
                "Integrate with Figma and other tools so Trace works on real design files.",
                "Support uploads, screenshots and visual previews, which participants asked for most.",
                "Study long-term use: how trust and reliance evolve over weeks.",
                "Extend the framework to teams and asynchronous collaboration.",
              ]}
            />
          </div>
        </div>
        <H3 theme={theme} className="mt-12">
          How I’d measure success in the field
        </H3>
        <p className="mt-2 mb-6">The thesis evaluated short sessions. In real use, these signals would show whether Trace keeps designers in charge over time.</p>
        <MetricsPlan
          {...t}
          items={[
            { metric: "Rejection rate", why: "If designers never reject anything, they may be over-relying on the AI.", how: "Share of critiques rejected or edited vs. accepted as-is.", target: "Agency" },
            { metric: "Own ideas added", why: "The goal is thinking with AI, so designers should keep contributing.", how: "Designer-written options and improvements per session.", target: "Engagement" },
            { metric: "Trace reuse", why: "A trace only matters if it’s used in reviews and hand-offs.", how: "Trace logs exported or revisited after the session.", target: "Accountability" },
            { metric: "Perceived control", why: "The core promise: “I still decide what matters.”", how: "Post-session agency and trust ratings over repeated use.", target: "North star" },
          ]}
          note="Planned metrics, not results: the thesis evaluation was qualitative and short-term."
        />
        <Caption theme={theme}>
          Read the full thesis{" "}
          <a href={THESIS_PDF} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4" style={{ color: TINT }}>
            here ↗
          </a>
          . Code and setup instructions are on{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4" style={{ color: TINT }}>
            GitHub ↗
          </a>
        </Caption>
      </CaseStudySection>

      <CaseStudySection id="learnings" title="What I learned" subtitle="Reflection" theme={theme}>
        <Learnings
          {...t}
          items={[
            { title: "Structure beats prompting.", text: "Guiding the AI through stages lifted the burden of writing the perfect prompt, for designers and for the model." },
            { title: "Agency is fragile.", text: "One rejected idea coming back was enough to make people feel unheard. Respecting a “no” became a core feature." },
            { title: "Researching and building keep each other honest.", text: "Every principle from the literature had to survive real code, a real model and real participants." },
            { title: "Reflective tools have to earn their place.", text: "In an industry that rewards speed, slowing down only works if it clearly makes decisions better." },
          ]}
        />
      </CaseStudySection>

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
