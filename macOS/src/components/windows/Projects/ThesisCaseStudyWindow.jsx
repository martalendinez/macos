import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyPill from "./caseStudy/CaseStudyPill";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudySection from "./caseStudy/CaseStudySection";
import { Gallery2, Gallery3 } from "./caseStudy/CaseStudyGalleries";
import CaseStudyImageTile from "./caseStudy/CaseStudyImageTile";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";

export default function ThesisCaseStudyWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast });

  const IMAGES = useMemo(
  () => ({
    hero: null,

    // Workflow stages
    intent: null,
    context: null,
    options: null,
    critique: null,
    improve: null,
    trace: null,

    // Additional features
    mixMatch: null,
    reasoning: null,

    // Research + process
    researchOverview: null,
    study1: null,
    study2: null,

    // System design
    architecture: null,
    workflowDiagram: null,

    // Final UI
    finalScreens: null,
  }),
  []
);


  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const openLightbox = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: null, alt: "" });

 const sections = useMemo(
  () => [
    { id: "overview", label: "Overview" },
    { id: "summary", label: "Summary" },
    { id: "role", label: "My role" },
    { id: "goals", label: "Goals" },
    { id: "researchMethods", label: "Research methods" },
    { id: "study1", label: "Study I" },
    { id: "study2", label: "Study II" },
    { id: "workflow", label: "Workflow design" },
    { id: "ia", label: "Information architecture" },
    { id: "features", label: "Core features" },
    { id: "design", label: "Design decisions" },
    { id: "outcome", label: "Final outcome" },
  ],
  []

    
  );

  const [active, setActive] = useState("overview");
  function scrollToSection(id) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function HeroCover() {
    return (
      <div className={`mt-10 rounded-[28px] overflow-hidden border ${theme.softCard}`}>
        <button
          type="button"
          onClick={() => openLightbox(IMAGES.hero, "Cover image")}
          className="w-full text-left"
          disabled={!IMAGES.hero}
          title={IMAGES.hero ? "Click to zoom" : "Hero placeholder — set IMAGES.hero"}
        >
          {IMAGES.hero ? (
            <img src={IMAGES.hero} alt="Cover" className="w-full h-auto object-cover" />
          ) : (
            <div className="w-full aspect-[16/7] flex items-center justify-center">
              <div className="text-center px-6">
                <div className={`text-sm font-semibold ${theme.textMain}`}>Cover image (hero)</div>
                <div className={`mt-2 text-xs ${theme.textSub}`}>
                  Add a wide screenshot of your <span className="font-semibold">Welcome</span> page / dashboard.
                  <br />
                  Set it as <span className="font-semibold">IMAGES.hero</span>.
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    );
  }

 const metaPills = [
  "Research-through-design",
  "AI-assisted design",
  "UX Research",
  "Prototype development",
  "Human–AI collaboration"
];

const facts = [
  { k: "What it is", v: "An AI-assisted design reflection tool supporting early-stage reasoning" },
  { k: "Core promise", v: "Help designers think better, not faster — without replacing human agency" },
  { k: "Structure", v: "Six-stage workflow: Intent · Context · Options · Critique · Improve · Trace" },
  { k: "Focus areas", v: "Designer agency, explainability, critique quality, reflective decision-making" }
];


  return (
    <div className="h-full w-full">
      <div className="h-full overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`mx-auto w-full max-w-[1150px] rounded-[28px] ${theme.pageCard}`}
        >
          <div className="px-6 md:px-10 pt-8 md:pt-10 pb-10">
            <div className="flex flex-wrap gap-2">
              {metaPills.map((p) => (
                <CaseStudyPill key={p} theme={theme}>
                  {p}
                </CaseStudyPill>
              ))}
            </div>

            <div className={`mt-5 text-4xl md:text-5xl font-semibold tracking-tight ${theme.textMain}`}>
  AI Design Reflection Assistant — Supporting Early‑Stage Reasoning
</div>
<div className={`mt-3 text-base md:text-lg ${theme.textSub}`}>
  A research‑through‑design project exploring how AI can support reflective, early‑stage design decision‑making without reducing human agency. The system guides designers through a structured workflow that surfaces intent, context, critiques, and reasoning.
</div>


          {/* CTA row */}
<div className="mt-6 flex flex-wrap gap-2">
  <a
    href="https://github.com/YOUR-REPO"
    target="_blank"
    rel="noreferrer"
    className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
  >
    View on GitHub
  </a>

  <a
    href="/pdfs/Your_Thesis_Paper.pdf"
    target="_blank"
    rel="noreferrer"
    className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
  >
    Read Thesis Paper
  </a>

  <a
    href="/pdfs/Your_Case_Study.pdf"
    target="_blank"
    rel="noreferrer"
    className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
  >
    Read Full Case Study
  </a>
</div>


          <div id="overview" className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6">
  <div>
    <div className={`text-lg font-semibold ${theme.textMain}`}>Overview</div>
    <div className={`mt-3 text-[15px] leading-7 ${theme.textBody}`}>
      The AI Design Reflection Assistant is a research-through-design project exploring how AI can support 
      early-stage reasoning without reducing designer agency. Instead of generating final solutions, the system 
      structures the design process into a reflective workflow—helping designers articulate intent, surface 
      context, explore alternatives, critique ideas, and consolidate their reasoning.
      <br />
      <br />
      The workflow is organised into six stages:
      <span className={`font-semibold ${theme.textMain}`}> Intent</span> (what you’re trying to achieve),
      <span className={`font-semibold ${theme.textMain}`}> Context</span> (constraints + insights),
      <span className={`font-semibold ${theme.textMain}`}> Options</span> (AI-generated alternatives),
      <span className={`font-semibold ${theme.textMain}`}> Critique</span> (blind spots + risks),
      <span className={`font-semibold ${theme.textMain}`}> Improve</span> (refinement),
      and <span className={`font-semibold ${theme.textMain}`}> Trace</span> (a transparent record of decisions).
    </div>
  </div>

  <div>
    <div className={`text-lg font-semibold ${theme.textMain}`}>Quick facts</div>

    <div className={`mt-3 rounded-2xl p-5 border ${theme.softCard}`}>
      <div className="grid grid-cols-1 gap-3">
        {facts.map((f) => (
          <div key={f.k} className={`pb-3 border-b last:border-b-0 ${theme.divider}`}>
            <div className={`text-xs ${theme.textSub}`}>{f.k}</div>
            <div className={`mt-1 text-sm font-medium ${theme.textMain}`}>{f.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["UX Research", "AI", "Prototype", "Workflow Design", "Explainability", "Human–AI Collaboration"].map((t) => (
          <CaseStudyPill key={t} theme={theme}>
            {t}
          </CaseStudyPill>
        ))}
                  </div>
                </div>
              </div>
            </div>

            <HeroCover />

            {/* Contents */}
            <div className={`mt-10 rounded-2xl p-5 border ${theme.softCard}`}>
              <div className={`text-sm font-semibold ${theme.textMain}`}>Contents</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {sections.map((s) => {
                  const isActive = active === s.id;
                  const activeClass = theme.isMac || theme.isGlassDarkText
                    ? `${theme.accentSoftBg} ${theme.accentBorder} ${theme.accentText}`
                    : "bg-white/20 border-white/15 text-white";

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        isActive ? activeClass : theme.pillClass
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
{/* CONTEXT */}
<CaseStudySection
  id="context"
  title="Context"
  subtitle="Designers increasingly use AI, but not always with clarity or control"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      AI tools are becoming part of everyday design practice, but most of them focus on generating outputs rather
      than supporting the thinking that leads to good design. Early‑stage exploration is messy, iterative, and
      reflective — yet current AI tools often collapse this process into a single prompt–response exchange.
    </div>

    <CaseStudyBulletList
      items={[
        "Reasoning becomes opaque and difficult to trace",
        "Designers lose agency and control over the process",
        "Decision‑making becomes harder to justify to stakeholders",
        "Teams struggle to align on intent and rationale"
      ]}
    />
  </div>
</CaseStudySection>

{/* PROBLEM */}
<CaseStudySection
  id="problem"
  title="Problem"
  subtitle="AI helps produce ideas, but not understand them"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      Designers struggle to articulate intent, compare alternatives, and explain why a direction makes sense.
      Existing AI tools accelerate output but do not support reflection.
    </div>

    <CaseStudyBulletList
      items={[
        "AI tools generate ideas without showing reasoning",
        "Designers cannot trace how decisions were formed",
        "Critiques are shallow or missing entirely",
        "Workflows become linear and brittle"
      ]}
    />
  </div>
</CaseStudySection>

{/* WHY IT MATTERS */}
<CaseStudySection
  id="why"
  title="Why this matters"
  subtitle="Reflection is core to design quality"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      Early‑stage reasoning shapes the entire design direction. When reflection is shallow or rushed, teams
      struggle to justify decisions, communicate rationale, or align on intent.
    </div>

    <CaseStudyBulletList
      items={[
        "Reflection improves clarity and alignment",
        "Transparent reasoning increases trust in AI",
        "Structured thinking reduces design risk",
        "Better early decisions reduce downstream rework"
      ]}
    />
  </div>
</CaseStudySection>

{/* MY ROLE */}
<CaseStudySection
  id="role"
  title="My role"
  subtitle="I designed and built the system end‑to‑end"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <CaseStudyBulletList
      items={[
        "Designed the six‑stage workflow (Intent → Context → Options → Critique → Improve → Trace)",
        "Created the information architecture and interaction flows",
        "Developed the UX and UI for all core features",
        "Implemented the full prototype (frontend, backend, AI integration)",
        "Integrated LLM‑based reasoning, critique generation, and grounding",
        "Designed and ran two usability studies",
        "Synthesised findings into design principles for reflective AI tools"
      ]}
    />
  </div>
</CaseStudySection>

{/* GOALS */}
<CaseStudySection
  id="goals"
  title="Goals"
  subtitle="What I set out to understand"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <CaseStudyBulletList
      items={[
        "How AI can support early‑stage reasoning without reducing agency",
        "How structured workflows influence clarity and decision‑making",
        "How designers interpret AI critiques and reasoning",
        "How to make AI outputs transparent and explainable",
        "What principles should guide reflective AI tools"
      ]}
    />
  </div>
</CaseStudySection>

{/* LITERATURE REVIEW */}
<CaseStudySection
  id="literature"
  title="Literature review"
  subtitle="What existing research says about AI, reflection, and design workflows"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      I reviewed work across human–AI collaboration, reflective practice, and design cognition. Several themes
      emerged that directly shaped the system.
    </div>

    <CaseStudyBulletList
      items={[
        "AI often accelerates ideation but reduces transparency, making reasoning harder to follow.",
        "Design cognition research shows that articulating intent improves decision quality.",
        "Reflection‑in‑action is essential for navigating ambiguity in early‑stage design.",
        "Critique is a core mechanism for surfacing blind spots and strengthening ideas.",
        "Few tools operationalise reflective practice in a structured, designer‑friendly workflow.",
        "Explainability research highlights the need for visible reasoning to build trust in AI systems."
      ]}
    />
  </div>
</CaseStudySection>

{/* EXPERT INTERVIEWS */}
<CaseStudySection
  id="interviews"
  title="Expert interviews"
  subtitle="Understanding how designers actually use AI today"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      I conducted semi‑structured interviews with five experts:
    </div>

    <CaseStudyBulletList
      items={[
        "2 senior UX designers using AI for early ideation",
        "1 design lead integrating AI into team workflows",
        "1 product designer experimenting with AI critique tools",
        "1 HCI researcher studying human–AI collaboration"
      ]}
    />

    <div className={`mt-3 text-[15px] leading-7 ${theme.textBody}`}>
      Key insights:
    </div>

    <CaseStudyBulletList
      items={[
        "AI is good for generating starting points, but not for reasoning.",
        "Designers want tools that help them compare and critique ideas.",
        "They need transparency: why did the AI suggest this?",
        "They want to keep control, not be overridden by automation.",
        "They need a way to document rationale for stakeholders.",
        "They want AI to help them think, not think for them."
      ]}
    />
  </div>
</CaseStudySection>

{/* WORKFLOW DESIGN */}
<CaseStudySection
  id="workflow"
  title="Workflow design"
  subtitle="Structuring reflective reasoning"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      The workflow mirrors how designers naturally think: starting with intent, grounding in context, exploring
      options, critiquing ideas, refining them, and documenting rationale.
    </div>

    <CaseStudyBulletList
      items={[
        "Each stage is intentionally lightweight to reduce cognitive load",
        "Non‑linear navigation supports real design practice",
        "AI is positioned as a thinking partner, not an answer generator",
        "Traceability is built in from the start"
      ]}
    />

    <div className="mt-4">
      <CaseStudyImageTile
        src={IMAGES.workflowDiagram}
        alt="Workflow diagram"
        caption="The six‑stage reflective workflow."
        aspect="16/9"
        theme={theme}
        onOpen={openLightbox}
      />
    </div>
  </div>
</CaseStudySection>

{/* FEATURES */}
<CaseStudySection
  id="features"
  title="Features"
  subtitle="The core capabilities that make the system work"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <CaseStudyBulletList
      items={[
        "Guided intent definition with microcopy",
        "Context grounding for more relevant AI outputs",
        "Multi‑option generation with visible reasoning",
        "Critique engine surfacing blind spots and risks",
        "Mix & Match for recombining ideas across options",
        "Editable trace log capturing the final rationale",
        "Memory of rejected ideas to avoid repetition",
        "Structured reasoning presented as bullet points"
      ]}
    />
  </div>
</CaseStudySection>

{/* USER TESTING I */}
<CaseStudySection
  id="study1"
  title="User testing I"
  subtitle="Validating the conceptual workflow"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      The first study evaluated the low‑fidelity prototype.
    </div>

    <CaseStudyBulletList
      items={[
        "Terminology was unclear (intent vs context)",
        "Linear flow felt too rigid",
        "Users wanted to jump between stages",
        "Critiques were helpful but needed more depth",
        "Trace log was useful but needed editability"
      ]}
    />

    <div className="mt-4 font-semibold">What I changed</div>
    <CaseStudyBulletList
      items={[
        "Renamed stages and rewrote microcopy for clarity",
        "Enabled non‑linear navigation",
        "Added deeper critique prompts",
        "Made the trace log editable and structured"
      ]}
    />

    <div className="mt-4">
      <CaseStudyImageTile
        src={IMAGES.study1}
        alt="Study I prototype"
        caption="Low-fidelity prototype used in Study I."
        aspect="16/9"
        theme={theme}
        onOpen={openLightbox}
      />
    </div>
  </div>
</CaseStudySection>

{/* USER TESTING II */}
<CaseStudySection
  id="study2"
  title="User testing II"
  subtitle="Evaluating the functional prototype"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-[15px] leading-7 ${theme.textBody}`}>
      The second study focused on collaboration quality and perceived control.
    </div>

    <CaseStudyBulletList
      items={[
        "AI sometimes reintroduced rejected ideas",
        "Users wanted clearer labels and tooltips",
        "Reasoning increased trust but needed more structure",
        "Critiques helped identify blind spots",
        "Users wanted a 'Go back' button"
      ]}
    />

    <div className="mt-4 font-semibold">What I changed</div>
    <CaseStudyBulletList
      items={[
        "Added memory of rejected ideas",
        "Improved labels, tooltips, and microcopy",
        "Structured reasoning into bullet points",
        "Added a global back button",
        "Improved critique variety and grounding"
      ]}
    />

    <div className="mt-4">
      <CaseStudyImageTile
        src={IMAGES.study2}
        alt="Study II prototype"
        caption="High-fidelity prototype evaluated in Study II."
        aspect="16/9"
        theme={theme}
        onOpen={openLightbox}
      />
    </div>
  </div>
</CaseStudySection>

{/* FINAL OUTCOME */}
<CaseStudySection
  id="outcome"
  title="Final outcome"
  subtitle="A functional prototype and design principles"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <CaseStudyBulletList
      items={[
        "Fully implemented prototype (frontend, backend, AI integration)",
        "Six‑stage workflow supporting reflective design reasoning",
        "Mix & Match, critique engine, and editable trace log",
        "Design principles for building transparent, collaborative AI tools"
      ]}
    />

    <div className="mt-4">
      <CaseStudyImageTile
        src={IMAGES.finalScreens}
        alt="Final UI screens"
        caption="Final high-fidelity screens of the system."
        aspect="16/9"
        theme={theme}
        onOpen={openLightbox}
      />
    </div>
  </div>
</CaseStudySection>

{/* IMPACT */}
<CaseStudySection
  id="impact"
  title="Impact"
  subtitle="What this project contributes to design practice"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <CaseStudyBulletList
      items={[
        "A validated workflow for reflective AI‑assisted design",
        "A functional prototype demonstrating how AI can support reasoning, not replace it",
        "Design principles for building transparent, agency‑preserving AI tools",
        "A model for integrating critique, reasoning, and traceability into AI systems",
        "A research‑through‑design methodology applicable to future AI design tools"
      ]}
    />
  </div>
</CaseStudySection>




            <div className="mt-10" />
          </div>
        </motion.div>

        <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} theme={theme} />
      </div>
    </div>
  );
}