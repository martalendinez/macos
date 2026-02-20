// src/components/windows/About/components/SkillRow.jsx
import { levelToPct } from "../utils/levelToPct";

export default function SkillRow({ styles, name, level }) {
  const isMac = !!styles?.isMac;
  const isDarkGlass = !isMac && !!styles?.glassDarkText;

  const trackClass = isMac || isDarkGlass ? "bg-black/10" : "bg-white/15";
  const fillClass = isMac
    ? "bg-[hsl(var(--accent))]"
    : isDarkGlass
    ? "bg-black/60"
    : "bg-white/70";

  return (
    <div className="flex items-center gap-4">
      <div className={`w-40 ${styles.textMain} text-sm`}>{name}</div>

      <div className="flex-1">
        <div className={`h-1.5 rounded-full ${trackClass}`}>
          <div
            className={`h-full rounded-full ${fillClass}`}
            style={{ width: levelToPct(level) }}
          />
        </div>
      </div>

      <div className={`w-28 ${styles.textSub} text-sm`}>{level}</div>
    </div>
  );
}