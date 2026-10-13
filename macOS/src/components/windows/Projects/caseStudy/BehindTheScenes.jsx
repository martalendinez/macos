// src/components/windows/Projects/caseStudy/BehindTheScenes.jsx
// "How I worked": a demo walkthrough that opens each app of this OS on the project, in process order.
import { openWorkspace } from "../../../../config/workspaceBus";
import { APP_STEPS, WORKSPACE_PROJECTS } from "../../../../config/projectWorkspaces";

export default function BehindTheScenes({ project, theme, tint, onOpenWindow }) {
  const ws = WORKSPACE_PROJECTS[project];
  if (!ws) return null;
  const steps = Object.entries(ws.apps);
  const dark = theme.isDark;
  const open = (app) => {
    openWorkspace(app, project);
    onOpenWindow?.(app);
  };
  return (
    <div className="rounded-[20px] px-5 pt-5 pb-6 @2xl:px-7" style={{ background: dark ? "rgba(255,255,255,0.03)" : "#fafafc", boxShadow: dark ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ background: `${tint}14`, color: tint }}>
          Interactive demo
        </span>
        <span className={`text-[16px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>How I worked on {ws.name}</span>
      </div>
      <p className={`mt-1.5 text-[13.5px] leading-relaxed max-w-[560px] ${theme.textSub}`}>
        A walkthrough recreated inside this OS: open each tool on the project to see how I went from research to {ws.apps.vscode ? "shipped code" : "the final app"}.
      </p>

      <div className="relative mt-6 mx-auto" style={{ maxWidth: steps.length * 150 }}>
        <div className="absolute top-[22px] h-px" style={{ left: `${50 / steps.length}%`, right: `${50 / steps.length}%`, background: dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)" }} />
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map(([app, desc], i) => {
            const [step, name] = APP_STEPS[app];
            return (
              <li key={app} className="flex justify-center">
                <button type="button" onClick={() => open(app)} className="group flex flex-col items-center text-center px-1 outline-none" aria-label={`${step}: open ${name}`}>
                  <span className="w-11 h-11 rounded-[12px] flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2" style={{ background: dark ? "#1d1d22" : "#fafafc", boxShadow: `0 0 0 6px ${dark ? "#1b1b20" : "#fafafc"}`, "--tw-ring-color": tint }}>
                    <img src={`/icons/apps/${app}.svg`} alt="" className="w-11 h-11 drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]" />
                  </span>
                  <span className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: tint }}>
                    {String(i + 1).padStart(2, "0")} {step}
                  </span>
                  <span className={`mt-0.5 text-[14px] font-semibold ${theme.textMain}`}>{name}</span>
                  <span className={`text-[12px] leading-snug hidden @xl:block ${theme.textSub}`}>{desc}</span>
                  <span className="mt-1 text-[11.5px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: tint }}>
                    Open →
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      {ws.note && <p className={`mt-5 text-center text-[12px] ${theme.textSub}`}>{ws.note}</p>}
    </div>
  );
}
