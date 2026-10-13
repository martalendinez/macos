// src/components/windows/DemoBanner.jsx
// Slim banner shown when an app is opened on a case-study workspace: it's a demo of how Marta works,
// recreated inside this OS, not the original project files.
export default function DemoBanner({ project = "Trace", onBack, dark = false, className = "" }) {
  return (
    <div
      className={`shrink-0 flex items-center gap-2.5 px-3 py-1.5 text-[11.5px] leading-tight ${className}`}
      style={{ background: dark ? "rgba(124,124,232,0.14)" : "#f1f0fd", color: dark ? "#c9c9ff" : "#4a48b0", borderBottom: `1px solid ${dark ? "rgba(124,124,232,0.25)" : "#e2e0fa"}` }}
    >
      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ background: dark ? "rgba(124,124,232,0.3)" : "#e2e0fa" }}>
        Demo
      </span>
      <span className="min-w-0 truncate">A recreation of my {project} workspace, to show how I work. Not the live project files.</span>
      {onBack && (
        <button type="button" onClick={onBack} className="ml-auto shrink-0 font-semibold hover:underline">
          ← Case study
        </button>
      )}
    </div>
  );
}
