// src/components/windows/SecretProjectsWindow.jsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function SecretProjectsWindow({ uiTheme = "glass", onOpenWindow }) {
  const [activeTag, setActiveTag] = useState("All");

  const projects = useMemo(
    () => [
      {
        title: "Prototype: ‘Verdé’ UX Tool (WIP)",
        subtitle: "AI-supported workflow to help designers go from messy inputs → crisp IA & flows",
        tags: ["WIP", "Research", "AI", "UX"],
        bullets: [
          "Early concept exploring AI as a thinking partner (not an autopilot) for UX problem framing",
          "Focus on: synthesis → requirements → information architecture → user flows",
          "Design goal: keep the human in control; make reasoning visible and auditable",
          "Currently iterating on interaction model + trust/verification patterns",
        ],
        links: [{ label: "Notes", href: "#" }],
      },
      {
        title: "‘Recruiter Speedrun’ Mode",
        subtitle: "A compressed, playful story-mode of the portfolio (30 seconds)",
        tags: ["UI", "Frontend", "Playful"],
        bullets: [
          "Fast ‘guided tour’ interaction that highlights strongest work first",
          "Optimized for scanning: visuals + outcomes + one-click case studies",
          "Animation and pacing tuned to feel intentional (not gimmicky)",
          "A/B ideas: recruiter persona toggles + skill emphasis",
        ],
        links: [{ label: "Open", action: "open30SecondsMode" }],
      },
      {
        title: "Terminal Game Arcade",
        subtitle: "Mini-games in a faux terminal (because why not)",
        tags: ["Frontend", "Interaction", "Fun"],
        bullets: [
          "Keyboard-first interactions and input handling without breaking page scroll",
          "Reusable GameHost wrapper; consistent exit patterns (Esc / exit command)",
          "Designed for delight without distracting from the ‘serious’ portfolio",
          "Serves as a subtle signal of engineering craft + personality",
        ],
        links: [{ label: "Open Extras", action: "openExtrasAndFun" }],
      },
      {
        title: "Coliving Community App Concept",
        subtitle: "Systems for neighbors to coordinate, resolve friction, and build trust",
        tags: ["UX", "Product", "Systems"],
        bullets: [
          "Explores conflict themes + shared guidelines as a lightweight resolution tool",
          "Emphasis on transparency, fairness, and clear norms",
          "Stats layer: highlight recurring issues without exposing individuals",
          "Interaction design focused on low-friction participation",
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

  const isMac = uiTheme === "macos";

  const cardClass = isMac
    ? "bg-white/80 border border-black/10"
    : "bg-black/40 border border-white/15 backdrop-blur-xl";

  const chipClass = isMac
    ? "bg-white text-black/80 border border-black/10 hover:bg-[hsl(var(--accent)/0.12)] hover:border-[hsl(var(--accent)/0.35)] transition"
    : "bg-white/10 text-white/90 border border-white/15";

  const textMain = isMac ? "text-black/90" : "text-white/95";
  const textSub = isMac ? "text-black/60" : "text-white/70";

  const linkBtnClass = isMac
    ? "bg-white text-black/80 border border-black/10 hover:bg-[hsl(var(--accent)/0.12)] hover:border-[hsl(var(--accent)/0.35)] hover:text-[hsl(var(--accent))] transition"
    : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15";

  function handleLinkClick(link) {
    if (link.action === "open30SecondsMode") {
      onOpenWindow?.("recruiterMode"); // change if your id is different
      return;
    }
    if (link.action === "openExtrasAndFun") {
      onOpenWindow?.("fun");
      return;
    }
    if (link.href && link.href !== "#") {
      window.open(link.href, "_blank", "noreferrer");
    }
  }

  return (
    <div className={`h-full w-full ${isMac ? "bg-transparent" : ""}`}>
      <div className="h-full overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`text-2xl font-semibold ${textMain}`}>
              Secret Projects{" "}
              <span className={`${textSub} text-sm align-middle`}>
                (hacker mode)
              </span>
            </div>

            <div className={`mt-1 text-sm ${textSub}`}>
              A hidden stash of experiments, WIP concepts, and playful builds. Nothing classified…
              just the stuff that shows how I think.
            </div>

            {!isMac && (
              <div className="mt-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs">
                <span style={{ color: "hsl(var(--accent))" }}>ACCESS</span>{" "}
                <span className="text-white/70">granted · vault synced · trace</span>{" "}
                <span className="text-white/60">disabled</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-end">
            {allTags.map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    active
                      ? isMac
                        ? "bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))] border border-[hsl(var(--accent)/0.35)]"
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
                    <span className={`${isMac ? "text-black/80" : "text-white/85"}`}>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-2">
                {(p.links ?? []).map((l) => (
                  <button
                    key={l.label}
                    onClick={() => handleLinkClick(l)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${linkBtnClass}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
