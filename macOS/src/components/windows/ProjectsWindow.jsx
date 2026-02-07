import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function ProjectsWindow({ uiTheme = "glass" }) {
  const [activeTag, setActiveTag] = useState("All");

  const projects = useMemo(
    () => [
      {
        title: "Human–AI Collaboration in UX Design (Thesis)",
        subtitle: "Exploring AI-assisted wireframing + user flow design",
        tags: ["Research", "AI", "UX"],
        bullets: [
          "Literature review: human–AI co-creation, design cognition, AI-assisted workflows",
          "Methods: interviews + comparative tool analysis + prototype concepts",
          "Focus: collaboration patterns (automation vs partnership) + designer control",
        ],
        links: [
          { label: "Notes", href: "#" },
          { label: "PDF", href: "#" },
        ],
      },
      {
        title: "Neighbor Conflict Resolution Platform",
        subtitle: "Guidelines + themes/statistics to mitigate recurring issues",
        tags: ["UX", "Product", "Concept"],
        bullets: [
          "Designed a flow for agreeing on conflict-resolution rules as neighbors",
          "Surfaced prominent themes via aggregated neighborhood stats",
          "Emphasis on trust, clarity, and reducing escalation",
        ],
        links: [{ label: "Case study", href: "#" }],
      },
      {
        title: "STUDS 2024 — Networking Platform + Comms",
        subtitle: "Nonprofit project at KTH for CS master’s networking",
        tags: ["UX", "Leadership", "Design Ops"],
        bullets: [
          "Vice project manager: coordination, planning, stakeholder alignment",
          "Produced recruitment material + structured applicant interview scheduling",
          "Focused on clear communication and low-friction participation",
        ],
        links: [{ label: "Overview", href: "#" }],
      },
      {
        title: "Sleep & Sound Study",
        subtitle: "Experiment + survey on sound effects on sleep",
        tags: ["Research", "Data", "UX"],
        bullets: [
          "Designed study plan (experiment + survey) and analysis approach",
          "Considered PRISMA-informed structuring from the literature review",
          "Focused on usable insights + clear visualization of results",
        ],
        links: [{ label: "Draft", href: "#" }],
      },
    ],
    []
  );

  const allTags = useMemo(() => {
    const set = new Set(["All"]);
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeTag === "All") return projects;
    return projects.filter((p) => p.tags.includes(activeTag));
  }, [projects, activeTag]);

  const cardClass =
    uiTheme === "macos"
      ? "bg-white/80 border border-black/10"
      : "bg-white/10 border border-white/15 backdrop-blur-xl";

  const chipClass =
    uiTheme === "macos"
      ? "bg-black/5 text-black/80 border border-black/10"
      : "bg-white/10 text-white/90 border border-white/15";

  const textMain = uiTheme === "macos" ? "text-black/90" : "text-white/95";
  const textSub = uiTheme === "macos" ? "text-black/60" : "text-white/70";

  return (
    <div className={`h-full w-full ${uiTheme === "macos" ? "bg-transparent" : ""}`}>
      {/* scroll container */}
      <div className="h-full overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`text-2xl font-semibold ${textMain}`}>Projects</div>
            <div className={`mt-1 text-sm ${textSub}`}>
              A curated selection of UX + research work. (You can replace these with your real
              projects anytime.)
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {allTags.map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    active
                      ? uiTheme === "macos"
                        ? "bg-black/10 text-black"
                        : "bg-white/20 text-white"
                      : chipClass
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <motion.div
              key={p.title}
              className={`rounded-2xl p-5 shadow-sm ${cardClass}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`text-lg font-semibold ${textMain}`}>{p.title}</div>
                  <div className={`mt-1 text-sm ${textSub}`}>{p.subtitle}</div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {p.tags.map((t) => (
                    <span key={t} className={`px-2 py-[3px] rounded-full text-xs ${chipClass}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <ul className={`mt-4 space-y-2 text-sm ${textMain}`}>
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className={`${textSub}`}>•</span>
                    <span className={`${uiTheme === "macos" ? "text-black/80" : "text-white/85"}`}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Links */}
              <div className="mt-5 flex items-center gap-2">
                {(p.links ?? []).map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      uiTheme === "macos"
                        ? "bg-black/5 hover:bg-black/10 text-black/80 border border-black/10"
                        : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15"
                    }`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer spacing */}
        <div className="h-6" />
      </div>
    </div>
  );
}
