// src/components/windows/terminal/fs.js
// Virtual file system for the Terminal, generated from the portfolio's real content.
import { CONTACT, PROFILE, SKILL_GROUPS } from "../About/aboutData";
import { PROJECTS } from "../Projects/data/projectData";
import { placeDetails } from "../Map/data/placesData";

export const HOME = "/Users/marta";
export const GAME_LIST = ["snake", "pong", "tetris", "2048", "breakout", "flappy"];

const dir = (children) => ({ type: "dir", children });
const file = (lines, extra = {}) => ({ type: "file", lines, ...extra });

const CASE_STUDY_WINDOWS = {
  employerBranding: "employerBrandingCaseStudy",
  kthTriviaApp: "triviaCaseStudy",
  restaurantCoordination: "groupDiningCaseStudy",
};

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function projectFiles() {
  const out = {};
  PROJECTS.forEach((p) => {
    out[`${slug(p.shortTitle ?? p.title)}.md`] = file(
      [
        `# ${p.title}`,
        p.subtitle,
        "",
        ...(p.bullets ?? []).map((b) => `- ${b}`),
        "",
        `tags: ${(p.tags ?? []).join(", ")}`,
        "",
        `→ run \`open ${slug(p.shortTitle ?? p.title)}.md\` to read the full case study`,
      ],
      { open: { window: CASE_STUDY_WINDOWS[p.id] } }
    );
  });
  return out;
}

function placeFiles() {
  const out = {};
  Object.values(placeDetails).forEach((p) => {
    const name = slug(p.label.split(",")[0]);
    out[`${name}.txt`] = file([`📍 ${p.label}  (${p.year})`, p.description, "", ...p.funFacts.map((f) => `• ${f}`)], { open: { window: "map" } });
  });
  return out;
}

export function buildFS() {
  return dir({
    Users: dir({
      marta: dir({
        "about.txt": file([
          `${PROFILE.name} — ${PROFILE.role} @ ${PROFILE.company.name}`,
          `${PROFILE.secondaryRole} · ${PROFILE.location}`,
          `${PROFILE.education.label} · ${PROFILE.education.school}`,
          "",
          "I bridge UX thinking and front-end execution: research → flows → high-fidelity UI → clean components.",
          "",
          `“${PROFILE.philosophy}”`,
        ], { open: { window: "about" } }),
        "contact.txt": file([
          `email     ${CONTACT.email}`,
          ...CONTACT.links.filter((l) => ["LinkedIn", "GitHub"].includes(l.label)).map((l) => `${l.label.toLowerCase().padEnd(9)} ${l.href}`),
        ]),
        "skills.md": file(
          SKILL_GROUPS.flatMap((g) => [`## ${g.icon} ${g.title}`, ...g.skills.map(([n, lvl]) => `  ${n.padEnd(36)} ${lvl}`), ""])
        ),
        "resume.pdf": file(["%PDF-1.7 … (binary file — run `open resume.pdf`)"], { open: { url: "/resume.pdf" } }),
        projects: dir(projectFiles()),
        places: dir(placeFiles()),
        games: dir(Object.fromEntries(GAME_LIST.map((g) => [g, file(["(binary executable — run ./" + g + ")"], { exec: g })]))),
      }),
    }),
  });
}

export function resolvePath(cwd, input = "") {
  let p = input.trim();
  if (!p || p === "~") return HOME;
  if (p.startsWith("~")) p = HOME + p.slice(1);
  const parts = (p.startsWith("/") ? p : `${cwd}/${p}`).split("/");
  const stack = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return "/" + stack.join("/");
}

export function getNode(fs, path) {
  if (path === "/") return fs;
  let node = fs;
  for (const part of path.split("/").filter(Boolean)) {
    if (node?.type !== "dir") return null;
    node = node.children[part];
    if (!node) return null;
  }
  return node;
}

export const prettyPath = (path) => (path === HOME ? "~" : path.startsWith(HOME + "/") ? "~" + path.slice(HOME.length) : path);
