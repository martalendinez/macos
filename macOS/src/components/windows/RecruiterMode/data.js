// src/components/windows/RecruiterMode/data.js

export const recruiterSteps = [
  {
    kicker: "Role fit",
    title: "Marta Lendi — UX Engineer (Design + React), Stockholm.",
    chips: ["UX Engineer", "Product/UX", "Stockholm", "EU/Remote"],
    body: [
      "I bridge UX thinking and front-end execution: research → flows → high-fidelity UI → clean components.",
      "Strong fit for teams that need clarity, structure, and polished delivery.",
    ],
  },
  {
    kicker: "Best work",
    title: "Open one of my strongest case studies.",
    body: ["Employer Branding is the fastest “work-ready” signal."],
    featured: [
      {
        title: "Employer Branding — Case Study",
        subtitle: "UX strategy + structured narrative + UI execution.",
        windowId: "employerBrandingCaseStudy",
      },
      {
        title: "Gamified Notion Template — Case Study",
        subtitle: "Interaction design + product thinking + delightful UX.",
        windowId: "stardewNotionCaseStudy",
      },
      {
        title: "Master Thesis — AI plugin for designers",
        subtitle: "Controlled AI assistance inside tools (designer stays in charge).",
        windowId: "projects", // swap to "thesis" later if you create a dedicated thesis window
      },
    ],
  },
  {
    kicker: "Next step",
    title: "Resume + quick contact, then pick a deep dive.",
    body: [
      "Fast path: open Projects → skim 1 case study end-to-end.",
    ],
  },
];