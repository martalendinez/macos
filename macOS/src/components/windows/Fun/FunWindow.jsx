import { useMemo } from "react";
import { getTokens } from "../../../ui/themeTokens";
import { getFunApps } from "./data/funApps";
import VisualTile from "./components/VisualTile";

export default function FunWindow({ uiTheme = "glass", glassContrast = "light", onOpenWindow }) {
  const t = getTokens(uiTheme, glassContrast);

  const apps = useMemo(() => getFunApps(onOpenWindow), [onOpenWindow]);

  const tileClass = t.isMac
    ? "bg-white border-black/10"
    : "bg-white/8 border-white/12 backdrop-blur-xl";

  // CTA button (neutral, mac hover uses accent)
  const ctaClass = t.isMac
    ? "bg-white border border-black/10 text-black/80 hover:bg-[hsl(var(--accent)/0.10)] hover:border-[hsl(var(--accent)/0.35)]"
    : "bg-white/10 border border-white/12 text-white/90 hover:bg-white/15";

  const tipClass = t.isMac
    ? "bg-white border-black/10"
    : "bg-white/8 border-white/12 backdrop-blur-xl";

  return (
    <div className={`h-full flex flex-col ${t.isMac ? "bg-transparent" : ""} ${t.textMain}`}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className={`${t.isMac ? "text-black" : "text-white"} text-lg font-semibold`}>Extras & Fun</div>
        <div className={`${t.textSub} text-sm mt-1`}>Welcome to the playground! This is where the fun little apps live 😊</div>
        <div className={`mt-4 h-px ${t.divider}`} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {apps.map((a) => (
            <VisualTile
              key={a.key}
              {...a}
              tileClass={tileClass}
              ctaClass={ctaClass}
              textStrong={t.isMac ? "text-black" : "text-white"}
              textSub={t.textSub}
            />
          ))}
        </div>

        <div className={`mt-6 rounded-2xl border p-5 ${tipClass}`}>
          <div className={`${t.isMac ? "text-black" : "text-white"} font-semibold`}>💡 Tip</div>
          <div className={`${t.textSub} text-sm mt-1 leading-relaxed`}>
            You can keep Music open while exploring other windows — it’s designed to feel like a tiny OS!
          </div>
        </div>
      </div>
    </div>
  );
}