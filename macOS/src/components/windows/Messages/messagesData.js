// src/components/windows/Messages/messagesData.js
// Pre-written answers from "Marta". All facts come from the About / Recruiter / Map content.
// ✏️ Edit freely — each reply is a list of bubbles plus optional action buttons.
import { placeDetails } from "../Map/data/placesData";

export const EMAIL = "casandra.lendinez@outlook.com";
export const LINKEDIN = "https://www.linkedin.com/in/marta-casandra-lendínez-ibáñez-959259200";
export const GITHUB = "https://github.com/martalendinez";

const FUN_FACTS = Object.values(placeDetails).flatMap((p) => p.funFacts);

export const GREETING = [
  "Hi! 👋 I'm Marta.",
  "This is a pre-recorded version of me, but ask me anything below and I'll do my best 😄",
];

export const INTENTS = [
  {
    id: "who",
    question: "Who are you? 👋",
    keywords: ["who", "hello", "hi", "hey", "about", "yourself", "introduce"],
    reply: () => ({
      bubbles: [
        "I'm a UX Engineer & UI Designer based in Stockholm 🇸🇪",
        "I'm doing my Master's in Interactive Media Technology at KTH.",
        "I bridge UX thinking and front-end execution: research → flows → high-fidelity UI → clean components.",
      ],
      actions: [{ label: "About me", windowId: "about" }],
    }),
  },
  {
    id: "work",
    question: "Show me your best work 💼",
    keywords: ["work", "project", "case", "portfolio", "best", "show"],
    reply: () => ({
      bubbles: [
        "Start with my Employer Branding case study. It's the fastest way to see how I work end to end.",
        "I led the design and development of an employer-branding platform at PrideCom, from user interviews to a full-stack app.",
      ],
      actions: [
        { label: "Open case study", windowId: "employerBrandingCaseStudy" },
        { label: "All projects", windowId: "projects" },
      ],
    }),
  },
  {
    id: "skills",
    question: "What are your skills? 🛠️",
    keywords: ["skill", "tool", "stack", "figma", "react", "code", "tech", "know"],
    reply: () => ({
      bubbles: [
        "🎨 Design: Figma, Adobe XD, Photoshop, Illustrator",
        "💻 Code: React, TypeScript, JavaScript, HTML/CSS, Tailwind, Python, SQL, Git",
        "🔬 Research: user interviews, usability testing, surveys, personas, journey maps, A/B testing",
      ],
      actions: [{ label: "See all skills", windowId: "about" }],
    }),
  },
  {
    id: "places",
    question: "Where have you lived? 🌍",
    keywords: ["live", "lived", "where", "country", "countries", "from", "travel", "spain", "sweden"],
    reply: () => ({
      bubbles: [
        "Spain 🇪🇸 → Netherlands 🇳🇱 → Germany 🇩🇪 → Canada 🇨🇦 → Sweden 🇸🇪",
        "Each place shaped me differently. Stockholm is where everything finally clicked 🤍",
      ],
      actions: [
        { label: "Open Maps", windowId: "map" },
        { label: "See photos", windowId: "instagram" },
      ],
    }),
  },
  {
    id: "hire",
    question: "Are you open to work? 🚀",
    keywords: ["hire", "job", "open", "available", "role", "position", "work with", "recruit"],
    reply: () => ({
      bubbles: [
        "Yes! I'm a great fit for UX Engineer roles that mix design and React, in Stockholm or remote within the EU.",
        "Teams that need clarity, structure and polished delivery are my favorite 💛",
      ],
      actions: [
        { label: "View résumé", href: "/resume.pdf" },
        { label: "Email me", href: `mailto:${EMAIL}` },
      ],
    }),
  },
  {
    id: "fun",
    question: "Tell me something fun 🎲",
    keywords: ["fun", "fact", "random", "secret", "surprise", "joke"],
    reply: () => ({
      bubbles: [FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)], "Ask again for another one 😉"],
    }),
  },
  {
    id: "contact",
    question: "How can I contact you? 💌",
    keywords: ["contact", "email", "mail", "reach", "linkedin", "github", "talk"],
    reply: () => ({
      bubbles: ["The real me is happy to chat! Email is the fastest way to reach me ✉️"],
      actions: [
        { label: "Email", href: `mailto:${EMAIL}` },
        { label: "LinkedIn", href: LINKEDIN },
        { label: "GitHub", href: GITHUB },
      ],
    }),
  },
];

export function fallbackReply(text) {
  return {
    bubbles: [
      "Ooh, good question! I'm only the pre-recorded Marta 🤖 so I can't answer that one.",
      "But the real me can. Want to send it to me as an email?",
    ],
    actions: [
      {
        label: "Send as email",
        href: `mailto:${EMAIL}?subject=${encodeURIComponent("Hi Marta! (from your portfolio)")}&body=${encodeURIComponent(text)}`,
      },
    ],
  };
}

export function matchIntent(text) {
  const t = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    // match at word starts so "hi" doesn't fire on "this"
    const score = intent.keywords.reduce((n, k) => n + (new RegExp(`(^|[^a-z])${k}`).test(t) ? 1 : 0), 0);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best;
}
