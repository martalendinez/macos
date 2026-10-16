// src/components/windows/RecruiterMode/data.js
// Content for the 30-second Recruiter Mode overview. ✏️ Edit freely.

export const PITCH =
  "I bridge UX thinking and front-end execution: research → flows → high-fidelity UI → clean components.";

export const QUICK_FACTS = [
  { label: "Current role", value: "Design Engineer @ ROYC", sub: "Fintech · private markets · since Aug 2026", icon: "💼" },
  { label: "Education", value: "MSc Interactive Media Tech", sub: "KTH Royal Institute of Technology", icon: "🎓" },
  { label: "Based in", value: "Stockholm, Sweden", sub: "EU / Remote", icon: "📍" },
  { label: "Domain", value: "Fintech & B2B SaaS", sub: "Complex, regulated products made clear", icon: "💳" },
];

export const STRENGTHS = [
  {
    title: "Fintech & B2B SaaS",
    text: "At ROYC I design a white-label platform that runs the full private markets lifecycle for banks, wealth and asset managers.",
    tint: "#5e5ce6",
    icon: "💳",
  },
  {
    title: "Design + code, one person",
    text: "At ROYC I take features from problem framing and Figma to production React code, and keep the design system and its coded components in sync.",
    tint: "#0a84ff",
    icon: "⌘",
  },
  {
    title: "Research-driven",
    text: "User interviews and usability testing shape every flow, from research to flows to high-fidelity UI.",
    tint: "#34c759",
    icon: "🔬",
  },
];

// projectId refers to Projects/data/projectData.js (for thumbnail + color)
export const HIGHLIGHTS = [
  {
    projectId: "thesis",
    badge: "Master Thesis · KTH",
    title: "Trace: an AI co-pilot for design decisions",
    subtitle: "Research + build: a task-aware AI that helps designers think, tested with 12 participants.",
    windowId: "thesisCaseStudy",
  },
  {
    projectId: "employerBranding",
    badge: "Bachelor Thesis · PrideCom",
    title: "AI platform for employer-branding analysis",
    subtitle: "Designed and built end to end: one score and concrete next steps for HR teams.",
    windowId: "employerBrandingCaseStudy",
  },
];

// "At a glance": the answers recruiters screen for. ✏️ Keep these short and true.
export const GLANCE = [
  { key: "role", label: "Role", value: "Design Engineer", sub: "at ROYC · since Aug 2026", tint: "#5e5ce6" },
  { key: "edu", label: "Education", value: "MSc Interactive Media Tech", sub: "KTH · graduated Jun 2026", tint: "#bf5af2" },
  { key: "loc", label: "Location", value: "Open to relocation", sub: "EU or remote · now in Stockholm", tint: "#ff9f0a" },
  { key: "domain", label: "Domain", value: "Fintech & B2B SaaS", sub: "complex, regulated products", tint: "#30d158" },
  { key: "tools", label: "Toolkit", value: "Figma · React · TypeScript", sub: "plus GitHub, Claude & user research", tint: "#0a84ff" },
  { key: "lang", label: "Languages", value: "Spanish · English · German", sub: "three languages", tint: "#ff375f" },
]

// ✏️ Shown with a green dot. Change to e.g. "Open to new roles" if you're actively looking.
export const STATUS = "Happy to chat";
