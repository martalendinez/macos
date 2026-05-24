import { PROJECTS } from "../components/windows/Projects/data/projectData";
import { MARTA_INFO } from "../components/windows/Projects/data/martaInfo";

// ---------- INTENTS ----------

const INTENTS = [
  {
    name: "about_marta",
    keywords: ["who is", "about marta", "tell me about marta", "who's marta"],
  },
  {
    name: "interests",
    keywords: ["interests", "into", "likes", "hobbies", "what is she into"],
  },
  {
    name: "projects_general",
    keywords: ["projects", "work", "portfolio", "what has she done"],
  },
  {
    name: "project_specific",
    keywords: [
      "thesis",
      "master thesis",
      "bachelor thesis",
      "employer branding",
      "branding",
      "trivia",
      "restaurant",
      "coordination",
      "group dining",
      "kth app",
    ],
  },
];

function detectIntent(q) {
  const lower = q.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keywords.some(k => lower.includes(k))) {
      return intent.name;
    }
  }
  return "unknown";
}

// ---------- REASONING TEXT ----------

function generateReasoning(intent) {
  const thoughts = {
    about_marta: "Thinking about Marta’s background...",
    interests: "Checking what Marta is into...",
    projects_general: "Looking through Marta’s project history...",
    project_specific: "Finding the project that matches your question...",
    unknown: "Trying to understand your question...",
  };

  return thoughts[intent] || thoughts.unknown;
}

// ---------- TEMPLATES ----------

const aboutMartaTemplates = [
  () =>
    `${MARTA_INFO.summary} She works with ${MARTA_INFO.skills.join(", ")}.`,
  () =>
    `Marta is ${MARTA_INFO.role.toLowerCase()}. ${MARTA_INFO.summary} Her main skills include ${MARTA_INFO.skills.join(
      ", "
    )}.`,
  () =>
    `Quick snapshot of Marta: ${MARTA_INFO.summary} She’s especially strong in ${MARTA_INFO.skills.join(
      ", "
    )}.`,
];

const interestsTemplates = [
  () => `Marta is into ${MARTA_INFO.interests.join(", ")}.`,
  () =>
    `She gravitates towards ${MARTA_INFO.interests.join(
      ", "
    )} — especially when working on new projects.`,
  () =>
    `Her main interests include ${MARTA_INFO.interests.join(
      ", "
    )}, and she often blends them in her work.`,
];

function randomTemplate(arr) {
  return arr[Math.floor(Math.random() * arr.length)]();
}

// ---------- PROJECT MATCHING ----------

function findProject(q) {
  const lower = q.toLowerCase();

  return (
    PROJECTS.find(p => {
      const allKeywords = [
        p.id,
        p.title.toLowerCase(),
        p.subtitle.toLowerCase(),
        ...p.tags.map(t => t.toLowerCase()),
      ];
      return allKeywords.some(k => lower.includes(k));
    }) || null
  );
}

function formatProjectAnswer(project) {
  return `${project.title}
${project.subtitle}

Key points:
- ${project.bullets.join("\n- ")}

You can explore more in the case study: ${project.links[0]?.label}.
`;
}

// ---------- MAIN ENTRY ----------

export function getAiResponse(question) {
  const q = question.trim();
  if (!q) {
    return "Ask me anything about Marta, her projects, her background, or what she’s into.";
  }

  const intent = detectIntent(q);
  const reasoning = generateReasoning(intent);

  let coreAnswer = "";

  if (intent === "about_marta") {
    coreAnswer = randomTemplate(aboutMartaTemplates);
  } else if (intent === "interests") {
    coreAnswer = randomTemplate(interestsTemplates);
  } else if (intent === "projects_general") {
    coreAnswer = `Marta has worked on ${PROJECTS.length} major projects, including ${PROJECTS.map(
      p => p.title
    ).join(", ")}. You can ask about any of them specifically.`;
  } else if (intent === "project_specific") {
    const project = findProject(q);
    if (project) {
      coreAnswer = formatProjectAnswer(project);
    } else {
      coreAnswer =
        "I think you're asking about one of Marta’s projects, but I couldn’t match it exactly. Try mentioning “thesis”, “trivia app”, or “restaurant coordination”.";
    }
  } else {
    const project = findProject(q);
    if (project) {
      coreAnswer = formatProjectAnswer(project);
    } else {
      coreAnswer =
        "I'm not fully sure yet, but you can ask about Marta, her interests, or any of her projects.";
    }
  }

  return `🤖 ${reasoning}\n\n${coreAnswer}`;
}
