import { PROJECTS } from "../components/windows/Projects/data/projectData";
import { MARTA_INFO } from "../components/windows/Projects/data/martaInfo";

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
    keywords: ["thesis", "master thesis", "bachelor thesis", "employer branding", "branding", "trivia", "restaurant", "coordination", "group dining", "kth app"],
  },
  {
    name: "career_goals",
    keywords: ["career", "goals", "future plans", "where do you see yourself"],
  },
  {
    name: "design_philosophy",
    keywords: ["design philosophy", "design approach", "how do you design"],
  },
  {
    name: "general_questions",
    keywords: ["tell me", "what do you think about", "how do you feel about", "what is your opinion"],
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

function generateReasoning(intent) {
  const thoughts = {
    unknown: getRandomUnknownResponse(),
  };
  return thoughts[intent] || "";
}

function getRandomUnknownResponse() {
  const responses = [
    "Hmm, that's an interesting question!",
    "I need a moment to think about that...",
    "I’m not sure, but let me try to help!",
    "That's a great question! Let me find out more.",
    "Can you provide a bit more detail on that?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

const aboutMartaTemplates = [
  () => `${MARTA_INFO.summary} She works with ${MARTA_INFO.skills.join(", ")}.`,
  () => `Marta is ${MARTA_INFO.role.toLowerCase()}. ${MARTA_INFO.summary} Her main skills include ${MARTA_INFO.skills.join(", ")}.`,
  () => `Quick snapshot of Marta: ${MARTA_INFO.summary} She’s especially strong in ${MARTA_INFO.skills.join(", ")}.`,
];

const interestsTemplates = [
  () => `Marta is into ${MARTA_INFO.interests.join(", ")}.`,
  () => `She gravitates towards ${MARTA_INFO.interests.join(", ")} — especially when working on new projects.`,
  () => `Her main interests include ${MARTA_INFO.interests.join(", ")}, and she often blends them in her work.`,
];

function randomTemplate(arr) {
  return arr[Math.floor(Math.random() * arr.length)]();
}

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

export function getAiResponse(question) {
  const q = question.trim();
  if (!q) {
    return "Ask me anything about Marta, her projects, her background, or what she’s into.";
  }

  const intent = detectIntent(q);
  let coreAnswer = "";

  if (intent === "about_marta") {
    coreAnswer = randomTemplate(aboutMartaTemplates);
  } else if (intent === "interests") {
    coreAnswer = randomTemplate(interestsTemplates);
  } else if (intent === "projects_general") {
    coreAnswer = `Marta has worked on ${PROJECTS.length} major projects, including ${PROJECTS.map(p => p.title).join(", ")}. You can ask about any of them specifically.`;
  } else if (intent === "project_specific") {
    const project = findProject(q);
    if (project) {
      coreAnswer = formatProjectAnswer(project);
    } else {
      coreAnswer = "I couldn't find that project. Try asking about Marta's thesis or her portfolio!";
    }
  } else if (intent === "career_goals") {
    coreAnswer = "I aim to develop innovative UX solutions that enhance user experiences and leverage AI technologies. I see myself leading design projects that focus on human-centered design.";
  } else if (intent === "design_philosophy") {
    coreAnswer = "My design philosophy centers around empathy and user-centricity. I believe in iterative design processes that involve user feedback and testing.";
  } else if (intent === "general_questions") {
    coreAnswer = "I'm here to provide insights on Marta's work and background. If you have a specific question in mind, feel free to ask!";
  } else {
    coreAnswer = getRandomUnknownResponse();
  }

  return coreAnswer;
}