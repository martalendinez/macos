import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function ProjectsWindow({ uiTheme = "glass" }) {
  const [activeTag, setActiveTag] = useState("All");

  const projects = useMemo(
    () => [
      {
        title: "Human–AI Collaboration in UX Design (Master Thesis)",
subtitle: "Designing AI as a thinking partner for UX workflows",
tags: ["Research", "AI", "UX"],
bullets: [
  "Investigates how designers collaborate with AI during early‑stage ideation and wireframing",
  "Combines literature review, interviews, and comparative analysis of AI‑assisted design tools",
  "Explores collaboration models: automation, augmentation, and true partnership",
  "Proposes a concept for an AI‑supported UX tool that enhances designer cognition",
],
links: [
  { label: "Case Study", href: "#" },
  { label: "PDF", href: "#" },
],

      },
      {
        title: "Employer Branding Platform (Bachelor Thesis)",
subtitle: "AI‑powered analysis + recommendations for stronger employer brands",
tags: ["UX", "Product", "AI", "Full‑stack"],
bullets: [
  "Bachelor thesis in collaboration with PrideCom, designing and developing an AI‑driven employer‑branding platform",
  "Built end‑to‑end: UX research, wireframes, UI design, frontend, backend, and Dockerized deployment",
  "Used Meta’s LLaMA to analyze companies’ employer branding and generate tailored improvement recommendations",
  "Created a full workflow for assessing brand maturity and guiding companies toward clearer, more consistent communication",
],
links: [
  { label: "Case Study", href: "#" },
],

      },
      {
        title: "Group Restaurant Coordination System", subtitle: "Smart restaurant discovery + group booking for friends and teams", tags: ["UX", "UI", "Frontend", "Product"], bullets: [ "Designed a restaurant recommendation system for both individual discovery and group decision‑making", "Developed a group‑booking flow that collects preferences and availability from all participants to suggest optimal restaurants", "Implemented the UX, UI, and frontend for a seamless end‑to‑end booking experience", "Focused on reducing coordination friction and making group dining decisions fast, fair, and transparent", ], links: [{ label: "Case Study", href: "#" }],
      },
      {
        title: "Unified Loyalty System",
subtitle: "All your loyalty cards and rewards in one place",
tags: ["UX", "UI", "Frontend", "Product"],
bullets: [
  "Designed a loyalty‑card aggregation system that centralizes memberships from multiple stores into a single app",
  "Built a demo Matcha café experience to showcase how points are collected, tracked, and redeemed",
  "Created the UX, UI, and frontend implementation for a smooth, intuitive user journey",
  "Focused on simplifying reward management and making loyalty programs more transparent and engaging",
],
links: [{ label: "Case Study", href: "#" }],

      },
       {
        title: "Gamified Productivity System",
subtitle: "A Stardew‑Valley‑inspired workflow built in Notion",
tags: ["UX", "UI", "Systems Design"],
bullets: [
  "Designed a gamified productivity system inspired by cozy‑game progression loops and reward mechanics",
  "Built the full experience in Notion, including tasks, leveling, streaks, and resource‑based incentives",
  "Created the UX and UI structure to make daily planning feel playful, motivating, and easy to maintain",
  "Focused on blending game‑like feedback with practical productivity workflows",
],
links: [
  { label: "Case Study", href: "#" },
],

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
              A hand‑picked collection of my UX and research projects.Feel free to explore any project, dive into the case studies, and get a sense of my thinking and process!
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
