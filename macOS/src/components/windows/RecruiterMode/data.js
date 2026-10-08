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
    text: "I design the platform's UI in Figma, building a scalable, responsive component library with auto layout, and implement it in TypeScript & React.",
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
    projectId: "employerBranding",
    badge: "Graduation Internship",
    title: "AI platform for employer-branding analysis",
    subtitle: "Turned manual branding audits into a scalable, automated analysis platform.",
    windowId: "employerBrandingCaseStudy",
  },
  {
    projectId: "kthTriviaApp",
    badge: "University Group Project",
    title: "Trivia App Game",
    subtitle: "A fast, modern trivia game with ranked challenges and casual play.",
    windowId: "triviaCaseStudy",
  },
];
