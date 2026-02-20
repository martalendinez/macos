// src/components/windows/terminal/utils.js
export function promptText(raw) {
  return `marta@portfolio ~ % ${raw}`;
}

export function downloadResume() {
  const a = document.createElement("a");
  a.href = "/resume.pdf";
  a.download = "Marta_Lendinez_Resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function levelToBar(level) {
  const map = {
    Basic: 2,
    Intermediate: 3,
    Proficient: 4,
    Advanced: 5,
    Expert: 6,
  };
  const filled = map[level] ?? 3;
  const total = 6;
  return "●".repeat(filled) + "○".repeat(total - filled);
}