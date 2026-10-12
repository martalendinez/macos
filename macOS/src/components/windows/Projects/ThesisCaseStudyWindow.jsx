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
import { AtAGlance, Caption, Changes, Decision, Figure, H3, Insights, Intro, Lead, PanelShot, PullQuote, Stage, Stats } from "./caseStudy/Editorial";

import heroImg from "../../../imgs/case-study/trace/Trace_Shot_web.jpg";
import traceScreen from "../../../imgs/case-study/trace/screen_trace.png";
import optionsScreen from "../../../imgs/case-study/trace/screen_options.png";
import fig2Img from "../../../imgs/case-study/trace/fig2_figma.jpg";
import fig3Img from "../../../imgs/case-study/trace/fig3_features.jpg";
import fig4Img from "../../../imgs/case-study/trace/fig4_features.jpg";
import fig5Img from "../../../imgs/case-study/trace/fig5_lofi_iteration.jpg";
import fig6Img from "../../../imgs/case-study/trace/fig6_hifi_iteration.jpg";

const TINT = "#5b5bd6";
const REPO = "https://github.com/martalendinez/Trace_Plugin";
const THESIS_PDF = "/pdfs/Human-Centered-AI-Assistance-in-Design-Tools.pdf";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "flow", label: "The framework" },
  { id: "decisions", label: "Key decisions" },
  { id: "testing", label: "Testing & iteration" },
  { id: "build", label: "Build" },
  { id: "outcome", label: "Outcome & next" },
];

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

const STAGES = [
  { n: "Intent", d: "Say what you’re trying to achieve, and for whom." },
  { n: "Context", d: "Design stage, constraints, user problems, hypotheses, anything else." },
  { n: "Options", d: "3–5 directions, each with its principle, trade-off and reasoning." },
  { n: "Critique", d: "Each option reviewed through lenses like accessibility and edge cases." },
  { n: "Improve", d: "Refine an option in a chat, mix fields across options, apply suggestions." },
  { n: "Trace", d: "An editable log of intent, critiques and what you decided." },
];

function StageFlow({ theme }) {
  return (
    <ol className="grid grid-cols-2 @3xl:grid-cols-6 gap-x-4 gap-y-6">
      {STAGES.map((s, i) => (
        <motion.li key={s.n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: i === 5 ? TINT : `${TINT}${i === 0 ? "88" : "aa"}` }}>
              {i + 1}
            </span>
            <span className={`hidden @3xl:block flex-1 h-px ${i === 5 ? "opacity-0" : ""}`} style={{ background: theme.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }} />
          </div>
          <div className={`mt-2.5 text-[15px] font-semibold ${theme.textMain}`}>{s.n}</div>
          <p className={`mt-1 text-[13px] leading-snug ${theme.textSub}`}>{s.d}</p>
        </motion.li>
      ))}
    </ol>
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
    <CaseStudyLayout tint={TINT} onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Trace · Master thesis">
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

      <Stage {...t} className="mt-10" pad="p-0">
        <button type="button" onClick={() => open(heroImg, "Trace screens")} className="block w-full cursor-zoom-in">
          <img src={heroImg} alt="Trace plugin screens: trace log, option refinement chat and critiques" className={`block w-full h-auto ${theme.isDark ? "" : "mix-blend-multiply"}`} />
        </button>
      </Stage>

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
        <p className="mt-2">
          The experiment made the difference tangible. Without AI, I structured problems and reasoned iteratively. With AI, I caught myself offloading thinking, changing direction because a suggestion
          said so, and struggling to put visual intent into words. Those were exactly the patterns the experts described.
        </p>
        <H3 theme={theme} className="mt-12">
          From automation to partnership
        </H3>
        <p className="mt-2 mb-6">Most AI design tools sit at the automation end. The research pointed Trace towards partnership.</p>
        <Spectrum theme={theme} />
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
        <p className="mb-8">It organises AI-assisted design into six stages, with cross-cutting components (steerable outputs, visible uncertainty, built-in verification and recovery paths) running through all of them.</p>
        <StageFlow theme={theme} />
        <div className="mt-10">
          <Figure theme={theme} src={fig3Img} alt="Intent, context and options screens" caption="Stages 1–3: intent, context and option generation." onOpen={open} />
        </div>
        <div className="mt-6">
          <Figure theme={theme} src={fig4Img} alt="Mix and match, critiques and trace" caption="Mix & match, critiques, and the trace where designers consolidate their reasoning." onOpen={open} />
        </div>
        <div className="mt-6">
          <Figure theme={theme} src={fig2Img} alt="Trace as a plugin inside a design tool" caption="The vision: Trace as a panel inside a design tool, next to the canvas." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="decisions" title="Key decisions" subtitle="What I chose, and what it cost" theme={theme}>
        <Decision {...t} n={1} title="No generated UI. Ever." tradeoff="It’s less flashy than a tool that spits out screens. That’s the point: the thinking stays with the designer." visual={<PanelShot {...t} src={optionsScreen} alt="Options step: generated directions with principle and trade-off" onOpen={open} maxW={300} />}>
          Trace outputs <b className={theme.textMain}>3–5 options</b>, each with a title, summary, the problem it addresses, its underlying assumption, a design principle and an explicit trade-off.
          Options are things to reason about, not artefacts to paste in. The reasoning plays in progressively, so designers can see how the AI got there without being overwhelmed.
        </Decision>
        <Decision
          {...t}
          n={2}
          title="Feedback that knows where you are"
          tradeoff="The designer has to tell Trace which stage they’re in. One extra input, but it stops pixel-level feedback from derailing a problem-definition session."
          visual={
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
              {"  "}- Focus on polish, accessibility, consistency.
            </CodeBlock>
          }
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
        <Decision
          {...t}
          n={5}
          title="A trace you can edit and keep"
          tradeoff="Documenting takes a moment at the end. In return, the reasoning is still there in the review, the hand-off, and three months later."
          visual={
<PanelShot {...t} src={traceScreen} alt="Trace log: intent, critiques and improvements" onOpen={open} />
          }
        >
          The final stage turns the session into a <b className={theme.textMain}>trace log</b>: the intent, the critiques reviewed and the improvements applied, all editable. It makes AI-assisted
          decisions auditable instead of invisible.
        </Decision>
      </CaseStudySection>

      <CaseStudySection id="testing" title="Testing & iteration" subtitle="Two studies, 12 participants" theme={theme}>
        <p>
          I evaluated Trace twice, at different levels of fidelity, using think-aloud tasks around improving an onboarding flow, followed by interviews on usefulness, transparency, control and
          trust.
        </p>

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
        <div className="mt-8">
          <Figure theme={theme} src={fig5Img} alt="Changes after the low-fidelity study" caption="Before → after the first study." onOpen={open} />
        </div>

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
        <div className="mt-8">
          <Figure theme={theme} src={fig6Img} alt="Changes after the high-fidelity study" caption="Before → after the second study." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="build" title="Build" subtitle="From research to a working prototype" theme={theme}>
        <p>I built Trace myself, so every research principle had to survive contact with real code and a real model.</p>
        <div className="mt-6 grid grid-cols-1 @3xl:grid-cols-2 gap-8">
          <div>
            <H3 theme={theme}>Frontend</H3>
            <CaseStudyBulletList
              items={[
                "React 19 + TypeScript, built with Vite and styled with Tailwind.",
                "The six-stage flow runs on a React Context + reducer, so every stage shares one source of truth.",
                "dnd-kit for mix-and-match, Framer Motion for the reasoning animations.",
              ]}
            />
          </div>
          <div>
            <H3 theme={theme}>Backend & AI</H3>
            <CaseStudyBulletList
              items={[
                "Node + Express, calling a LLaMA model hosted on Groq.",
                "Strict JSON responses, validated and normalised before they reach the UI.",
                "Stateless by design, so the model layer can be swapped without touching the interaction design.",
              ]}
            />
          </div>
        </div>
        <p className={`mt-8 text-[14px] ${theme.textSub}`}>
          The response format already includes change instructions tied to design nodes: groundwork for applying suggestions directly on a canvas once Trace is connected to a design tool.
        </p>
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Outcome & next" subtitle="Where Trace goes from here" theme={theme}>
        <Lead theme={theme}>
          Designers don’t mainly want AI that produces solutions for them. They want tools that help them think. The question isn’t “how good is AI at wireframing?” but “how should designers
          think with AI?”
        </Lead>
        <div className="mt-8 grid grid-cols-1 @3xl:grid-cols-2 gap-8">
          <div>
            <H3 theme={theme}>What’s next</H3>
            <CaseStudyBulletList
              items={[
                "Integrate with Figma and other tools so Trace works on real design files.",
                "Support uploads, screenshots and visual previews, which participants asked for most.",
                "Study long-term use: how trust and reliance evolve over weeks, not one session.",
                "Extend the framework to teams and asynchronous collaboration.",
              ]}
            />
          </div>
          <div>
            <H3 theme={theme}>What it taught me</H3>
            <CaseStudyBulletList
              items={[
                "Structure beats prompting: guiding the AI through stages lifted the burden of writing the perfect prompt.",
                "Agency is fragile. One rejected idea coming back was enough to make people feel unheard.",
                "There’s a real tension with an industry that rewards speed. Reflective tools have to earn their place by making decisions better.",
              ]}
            />
          </div>
        </div>
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

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
