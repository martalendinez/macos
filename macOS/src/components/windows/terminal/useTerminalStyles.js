// src/components/windows/terminal/useTerminalStyles.js
export default function useTerminalStyles(isMac) {
  // “Real macOS Terminal basic” look:
  // - black text on light background
  // - accent used for prompt + highlights
  return {
    // base text
    text: "text-black",
    dim: "text-black/55",
    faint: "text-black/40",

    // semantic colors
    accent: "text-[hsl(var(--accent))]",
    warn: "text-amber-700",
    error: "text-red-700",
    ok: "text-emerald-700",

    // spacing
    line: "whitespace-pre-wrap break-words",

    // links / command-ish
    link: "underline underline-offset-2 text-blue-700 hover:text-blue-800",
    cmd: "text-blue-700",

    // borders if used anywhere
    border: isMac ? "border-black/10" : "border-black/10",
    bg: "bg-[#fbfbfb]",
    chip: "", // ← important: remove “card” vibes
    textDim: "text-black/55",
  };
}