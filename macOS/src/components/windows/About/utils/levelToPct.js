// src/components/windows/About/utils/levelToPct.js
export function levelToPct(level) {
  const map = {
    Basic: "20%",
    "Working knowledge": "25%",
    Intermediate: "40%",
    Proficient: "55%",
    Advanced: "75%",
    Expert: "92%",
  };
  return map[level] ?? "50%";
}