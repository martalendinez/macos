import thesisThumb from "../../../../imgs/case-study/trace/Trace_Shot.png";
import employerThumb from "../../../../imgs/case-study/kallos/Kallos_Mockup.png";
import restaurantThumb from "../../../../imgs/case-study/sallskap/Dining_Overall.png";
import loyaltyThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import stardewThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import triviaThumb from "../../../../imgs/case-study/trivia/Trivia_Shot.png";

export const PROJECTS = [
 {
  id: "thesis",
  title: "Human–AI Collaboration in UX Design (Master Thesis)",
  subtitle: "Designing AI as a thinking partner for UX workflows",
  thumbnail: thesisThumb,
  tags: ["Research", "AI", "UX"],
  bullets: [
    "Investigates how designers collaborate with AI during early-stage ideation and wireframing",
    "Combines literature review, interviews, and comparative analysis of AI-assisted design tools",
    "Explores collaboration models: automation, augmentation, and true partnership",
    "Proposes a concept for an AI-supported UX tool that enhances designer cognition",
  ],
  links: [
    { label: "Case Study", action: "openThesisCaseStudy" }, // ✅ THIS
  ],
},

  {
    id: "employerBranding",
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
  

];
