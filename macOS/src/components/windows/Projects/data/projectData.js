import thesisThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import employerThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import restaurantThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import loyaltyThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";
import stardewThumb from "../../../../imgs/case-study/kallos/Thumbnail_Kallos.avif";

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
      { label: "Case Study", href: "#" },
      { label: "PDF", href: "#" },
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
    id: "restaurantCoordination",
    title: "Group Restaurant Coordination System",
    subtitle: "Smart restaurant discovery + group booking for friends and teams",
    thumbnail: restaurantThumb,
    tags: ["UX", "UI", "Frontend", "Product"],
    bullets: [
      "Designed a restaurant recommendation system for both individual discovery and group decision-making",
      "Developed a group-booking flow that collects preferences and availability from all participants to suggest optimal restaurants",
      "Implemented the UX, UI, and frontend for a seamless end-to-end booking experience",
      "Focused on reducing coordination friction and making group dining decisions fast, fair, and transparent",
    ],
    links: [{ label: "Case Study", href: "#" }],
  },
  {
    id: "loyaltySystem",
    title: "Unified Loyalty System",
    subtitle: "All your loyalty cards and rewards in one place",
    thumbnail: loyaltyThumb,
    tags: ["UX", "UI", "Frontend", "Product"],
    bullets: [
      "Designed a loyalty-card aggregation system that centralizes memberships from multiple stores into a single app",
      "Built a demo Matcha café experience to showcase how points are collected, tracked, and redeemed",
      "Created the UX, UI, and frontend implementation for a smooth, intuitive user journey",
      "Focused on simplifying reward management and making loyalty programs more transparent and engaging",
    ],
    links: [{ label: "Case Study", href: "#" }],
  },
  {
    id: "stardewNotion",
    title: "Gamified Productivity System",
    subtitle: "A Stardew-Valley-inspired workflow built in Notion",
    thumbnail: stardewThumb,
    tags: ["UX", "UI", "Systems Design"],
    bullets: [
      "Designed a gamified productivity system inspired by cozy-game progression loops and reward mechanics",
      "Built the full experience in Notion, including tasks, leveling, streaks, and resource-based incentives",
      "Created the UX and UI structure to make daily planning feel playful, motivating, and easy to maintain",
      "Focused on blending game-like feedback with practical productivity workflows",
    ],
    links: [{ label: "Case Study", action: "openStardewNotionCaseStudy" }],
  },
];