import thesisThumb from "../../../../imgs/case-study/trace/Trace_Shot_web.jpg";
import employerThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import restaurantThumb from "../../../../imgs/case-study/sallskap/Sallskap_Shot.png";
import loyaltyThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import stardewThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import triviaThumb from "../../../../imgs/case-study/trivia/Trivia_Shot.png";
import portfolioThumb from "../../../../imgs/case-study/portfolio/desktop.jpg";

export const PROJECTS = [
  {
    id: "thesis",
    shortTitle: "Trace · AI Co-Pilot",
    meta: ["2026", "Master thesis · KTH", "Research + Build"],
    tint: "#5b5bd6",
    title: "Trace: Human-Centered AI Assistance in Design Tools (Master Thesis)",
    subtitle: "A task-aware AI co-pilot that helps designers think, not just generate",
    thumbnail: thesisThumb,
    tags: ["UX", "AI", "Research", "Frontend"],
    bullets: [
      "Master thesis at KTH on how AI can support UX designers’ exploration and decision-making without taking away their agency",
      "Expert interviews and a with/without-AI design experiment shaped a six-stage framework: Intent → Context → Options → Critique → Improve → Trace",
      "Built a working React + LLaMA prototype and iterated it through two usability studies with 12 participants",
    ],
    links: [{ label: "Case Study", action: "openThesisCaseStudy" }],
  },

  {
    id: "employerBranding",
    shortTitle: "Employer Branding",
    meta: ["2024", "PrideCom", "UX + Full-stack"], // from the case study
    tint: "#f28b4b",
    title: "Employer Branding Platform (Bachelor Thesis)",
    subtitle: "AI-powered analysis + recommendations for stronger employer brands",
    thumbnail: employerThumb,
    tags: ["UX", "Product", "AI", "Full-stack"],
    bullets: [
      "Bachelor thesis in collaboration with PrideCom, designing and developing an AI-driven employer-branding platform",
      "Built end-to-end: UX research, wireframes, UI design, frontend, backend, and Dockerized deployment",
      "Used Meta’s LLaMA to analyze companies’ employer branding and generate tailored improvement recommendations",
    ],
    links: [{ label: "Case Study", action: "openEmployerBrandingCaseStudy" }],
  },
  {
  id: "kthTriviaApp",
  shortTitle: "Trivia App",
  meta: ["2026", "KTH group project", "Mobile app"],
  tint: "#7b6cf6",
  title: "Trivia App (Master Group Project)",
  subtitle: "React Native MVP powered by external trivia API",
  thumbnail: triviaThumb,
  tags: ["UX", "Frontend", "React Native", "App Dev"],
  bullets: [
    "University group project at KTH: designed and developed a mobile trivia app as an MVP",
    "Built with React Native and integrated with a public trivia API for dynamic question generation",
    "Led the UI design and implemented the frontend, ensuring smooth navigation and a clean, engaging experience",
  ],
  links: [{ label: "Case Study", action: "openTriviaCaseStudy" }],
},

  {
    id: "restaurantCoordination",
    shortTitle: "Sällskap",
    meta: ["2026", "Personal project", "UX + Full-stack"],
    tint: "#34b27b",
    title: "Group Restaurant Coordination System",
    subtitle: "Smart restaurant discovery + group booking for friends and teams",
    thumbnail: restaurantThumb,
    tags: ["UX", "UI", "Frontend", "Product"],
    bullets: [
      "Designed a website‑first group dining platform with a responsive mobile experience for on‑the‑go coordination",
      "Designed a smart recommendation flow that matches restaurants to group availability, dietary needs, and preferences",
      "Created a collaborative booking process where each member contributes inputs to reach a fair, transparent decision",
      "Implemented the full UX, UI, and frontend for a seamless end‑to‑end reservation journey",
    ],

    // ⭐ NEW: Sällskap case study link
    links: [{ label: "Case Study", action: "openGroupDiningCaseStudy" }],
  },

  {
    id: "portfolio",
    shortTitle: "This Portfolio",
    meta: ["2026", "Personal project", "Design + Build"],
    tint: "#0a84ff",
    title: "This Portfolio: a macOS-style OS",
    subtitle: "A portfolio that is the work sample itself, with fast paths for people short on time",
    thumbnail: portfolioThumb,
    tags: ["UX", "Frontend", "Product"],
    bullets: [
      "Designed and built a macOS-style OS where every app is a way into my work",
      "Recruiter Mode and a plain HTML page give people short on time a fast way out",
      "OS-wide accessibility settings, full-screen apps on phones and around 30 lazy-loaded apps",
    ],
    links: [{ label: "Case Study", action: "openPortfolioCaseStudy" }],
  },
  

];
