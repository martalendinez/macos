// src/components/windows/Notes/notesData.js
// Marta's pinned notes (read-only). Content is taken from About / Recruiter Mode.
// ✏️ Block types: { h }, { p }, { ul: [] }, { check: [[text, done]] }, { quote }

export const PINNED_NOTES = [
  {
    id: "readme",
    title: "👋 Read me first",
    preview: "Hi, I'm Marta! A quick guide to this portfolio",
    blocks: [
      { h: "Hi, I'm Marta!" },
      { p: "UX Engineer & UI Designer based in Stockholm, doing my Master's in Interactive Media Technology at KTH." },
      { p: "I bridge UX thinking and front-end execution: research → flows → high-fidelity UI → clean components." },
      { h: "How to explore" },
      {
        ul: [
          "⚡ Short on time? Open Recruiter Mode on the desktop.",
          "🗂️ Projects has my case studies. Employer Branding is a great place to start.",
          "⌘K (or Ctrl+K) opens Spotlight to jump anywhere.",
          "💬 Messages lets you chat with a pre-recorded me.",
          "🎮 Extras & Fun has games, photos and more.",
        ],
      },
    ],
  },
  {
    id: "philosophy",
    title: "💡 Design philosophy",
    preview: "Software is ultimately built for humans",
    blocks: [
      { h: "Design philosophy" },
      {
        quote:
          "I approach design with the belief that software is ultimately built for humans, so empathy, curiosity, and diverse perspectives sit at the center of my process!",
      },
      { p: "In practice: I bridge UX thinking and front-end execution, so ideas go from research to flows to polished, working UI." },
    ],
  },
  {
    id: "toolbox",
    title: "🧰 My toolbox",
    preview: "Figma, React, TypeScript, user interviews…",
    blocks: [
      { h: "Design" },
      { check: [["Figma (advanced)", true], ["Adobe XD (advanced)", true], ["Photoshop (proficient)", true], ["Illustrator (intermediate)", true], ["Framer (learning!)", false]] },
      { h: "Development" },
      { check: [["React", true], ["TypeScript", true], ["HTML / CSS", true], ["JavaScript", true], ["Tailwind CSS", true], ["Python & SQL", true], ["Git", true], ["Docker (learning!)", false]] },
      { h: "UX research" },
      { check: [["User interviews", true], ["Usability testing", true], ["Survey design", true], ["Personas & journey maps", true], ["A/B testing", true]] },
    ],
  },
  {
    id: "timeline",
    title: "🗓️ Timeline",
    preview: "KTH, STUDS, PrideCom, Extra Nice",
    blocks: [
      { h: "Sep 2024 → · KTH" },
      { p: "Master's in Interactive Media Technology: interaction design & prototyping, frontend development, usability testing." },
      { h: "Sep 2024 – Jun 2025 · STUDS" },
      { p: "Vice Project Manager. Co-led the team and ran networking events between Master's students and Swedish IT companies." },
      { h: "Feb – Jun 2024 · PrideCom" },
      { p: "Led end-to-end design and development of an employer-branding platform for SMBs, from user interviews to a full-stack app (Python, Flask, PostgreSQL)." },
      { h: "Feb – Jun 2023 · Extra Nice" },
      { p: "Built gameplay prototypes in Unity and C#, and ran playtests to gather insights." },
    ],
  },
];
