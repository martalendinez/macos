// src/components/windows/Settings/components/QuickAction.jsx
export default function QuickAction({ uiTheme = "glass", label, icon, onClick }) {
  const isMac = uiTheme === "macos";

  // Base surface
  const base = isMac
    ? "bg-white border border-black/10 text-black/85"
    : "bg-white/10 border border-white/15 text-white/90 backdrop-blur-xl";

  // ✅ Accent hover (cleaner, softer)
  const accentHover =
    "hover:bg-[hsl(var(--accent)/0.12)] hover:border-[hsl(var(--accent)/0.40)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-left transition duration-150 ${base} ${accentHover}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-base opacity-75">{icon}</span>
      </div>
    </button>
  );
}