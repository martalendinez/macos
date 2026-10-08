// src/components/windows/ActivityMonitor/ActivityMonitorWindow.jsx
// Activity Monitor look-alike. CPU tab: Marta's skills as "processes" (CPU ≈ how much she uses them, from her skill levels).
// Windows tab: the portfolio's real open windows — "Quit" actually closes them.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { LEVELS, SKILL_GROUPS } from "../About/aboutData";
import { WINDOW_DEFS } from "../../../config/windowDefs";
import { ACHIEVEMENTS } from "../../../config/achievements";
import { getApps } from "../../../config/apps";

const BASE_CPU = { 1: 2, 2: 5, 3: 9, 4: 15, 5: 22 }; // skill level → typical "% CPU"

// fun reasons a skill process refuses to quit
const QUIT_REPLIES = {
  Figma: "Figma is in use by ROYC’s component library. Try again after the next design review 😅",
  React: "React can’t be quit: it’s rendering this very window.",
  TypeScript: "TypeScript refused: type 'quit' is not assignable to type 'Marta'.",
  "GitHub Copilot": "Copilot suggested not quitting. Marta agreed.",
  "User Interviews": "User Interviews is still listening.",
};

const hashStr = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const fmtTime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

function Sparkline({ data, color, isDark }) {
  const w = 280;
  const h = 64;
  const max = 100;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - (v / max) * h]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-[64px]" role="img" aria-label="CPU load over the last minute">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"} />
      ))}
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={color} opacity="0.18" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function ActivityMonitorWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light", openWindows = [], activeWindow, closeWindow, focusOrRestore, unlockedAchievements = {}, iconTheme = "glass" }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const [tab, setTab] = useState("cpu");
  const [tick, setTick] = useState(0);
  const [sort, setSort] = useState({ key: "cpu", dir: -1 });
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);
  const [query, setQuery] = useState("");
  const history = useRef(Array.from({ length: 40 }, () => 40));
  const opened = useRef({});

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1500);
    return () => clearInterval(id);
  }, []);

  // remember when each window was first seen open
  openWindows.forEach((id) => (opened.current[id] ??= Date.now()));

  const skills = useMemo(() => {
    return SKILL_GROUPS.flatMap((g) =>
      g.skills.map(([name, level]) => {
        const lv = LEVELS[level] ?? 3;
        const h = hashStr(name);
        const wobble = Math.sin(tick * 0.9 + (h % 17)) * 0.35 + ((h + tick * 13) % 10) / 30;
        return {
          id: name,
          name,
          group: g.title,
          icon: g.icon,
          level,
          cpu: Math.max(0.1, BASE_CPU[lv] * (1 + wobble)),
          threads: 4 + (h % 28) + lv * 3,
          pid: 400 + (h % 9000),
          cpuTime: (lv * 1800 + (h % 3600)) * 12 + tick * lv,
        };
      })
    );
  }, [tick]);

  // overall load: average skill CPU scaled to a realistic 30–60% range
  const total = Math.min(95, (skills.reduce((a, s) => a + s.cpu, 0) / skills.length) * 3.2);
  useEffect(() => {
    history.current = [...history.current.slice(1), total];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const apps = useMemo(() => getApps(iconTheme), [iconTheme]);
  const windows = openWindows.map((id) => {
    const app = apps.find((a) => a.windowId === id);
    const h = hashStr(id);
    return {
      id,
      name: WINDOW_DEFS[id]?.title ?? id,
      img: app?.icon,
      active: id === activeWindow,
      time: (Date.now() - opened.current[id]) / 1000,
      mem: 120 + (h % 380) + Math.sin(tick + h) * 6,
      pid: 1000 + (h % 8000),
    };
  });

  const rows = (tab === "cpu" ? skills : windows).filter((r) => !query || r.name.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...rows].sort((a, b) => {
    const k = sort.key;
    const va = a[k] ?? 0;
    const vb = b[k] ?? 0;
    return (typeof va === "string" ? va.localeCompare(vb) : va - vb) * sort.dir;
  });

  const COLS =
    tab === "cpu"
      ? [
          ["name", "Process Name", "text-left"],
          ["cpu", "% CPU"],
          ["cpuTime", "CPU Time"],
          ["threads", "Threads"],
          ["level", "Level"],
          ["pid", "PID"],
        ]
      : [
          ["name", "Window", "text-left"],
          ["mem", "Memory"],
          ["time", "Open for"],
          ["pid", "PID"],
        ];

  function quit() {
    if (!selected) return;
    if (tab === "windows") {
      closeWindow?.(selected);
      setSelected(null);
      return;
    }
    setAlert({ icon: "🧠", title: "Can’t quit this process", text: QUIT_REPLIES[selected] ?? `“${selected}” is part of Marta’s toolbox and can’t be quit.` });
  }

  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedAchievements[a.key]).length;
  const uptime = performance.now() / 1000; // since the page loaded
  const blue = t.isDark ? "#3987e5" : "#2a78d6";
  const zebra = t.isDark ? "odd:bg-white/[0.03]" : "odd:bg-black/[0.025]";
  const sel = "bg-[hsl(var(--accent))] text-white";

  return (
    <div className={`no-darkwin relative h-full w-full flex flex-col ${t.windowBg}`}>
      {/* toolbar */}
      <div className={`h-12 shrink-0 px-3 flex items-center gap-2 border-b ${t.divider} ${t.toolbarBg}`}>
        <button
          onClick={quit}
          disabled={!selected}
          title={tab === "windows" ? "Quit window" : "Quit process"}
          aria-label="Quit selected"
          className={`w-8 h-7 rounded-md flex items-center justify-center text-[15px] disabled:opacity-30 ${t.textMain} ${t.hoverBg}`}
        >
          ⓧ
        </button>
        <button
          onClick={() => {
            if (!selected) return;
            const sk = skills.find((x) => x.id === selected);
            setAlert(
              tab === "windows"
                ? { icon: "🪟", title: WINDOW_DEFS[selected]?.title ?? selected, text: "Running smoothly ✨" }
                : { icon: sk?.icon ?? "ℹ️", title: selected, text: `${sk?.level} · part of ${sk?.group}` }
            );
          }}
          disabled={!selected}
          aria-label="Inspect selected"
          title="Inspect"
          className={`w-8 h-7 rounded-md flex items-center justify-center text-[14px] disabled:opacity-30 ${t.textMain} ${t.hoverBg}`}
        >
          ⓘ
        </button>
        <div className="flex-1 flex justify-center">
          <div className={`flex rounded-[8px] p-0.5 text-[12px] font-medium ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            {[
              ["cpu", "CPU"],
              ["windows", `Windows (${openWindows.length})`],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => {
                  setTab(k);
                  setSelected(null);
                  setSort({ key: k === "cpu" ? "cpu" : "time", dir: -1 });
                }}
                className={`relative px-3 py-1 rounded-[6px] ${tab === k ? t.textMain : t.textSub}`}
              >
                {tab === k && <motion.span layoutId="am-tab" className={`absolute inset-0 rounded-[6px] ${t.isDark ? "bg-white/20" : "bg-white shadow-sm"}`} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search processes"
          className={`hidden @lg:block w-[150px] rounded-[7px] px-2 h-7 text-[12px] outline-none ${t.textMain} ${t.isDark ? "bg-white/10 placeholder:text-white/40" : "bg-black/[0.06] placeholder:text-black/40"}`}
        />
      </div>

      {/* table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className={`w-full text-[12px] tabular-nums ${t.textMain}`}>
          <thead className={`sticky top-0 z-10 ${t.isDark ? "bg-[#262628]" : "bg-[#f6f6f6]"}`}>
            <tr>
              {COLS.map(([k, label, align], i) => (
                <th
                  key={k}
                  onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? -s.dir : -1 }))}
                  className={`px-3 py-1.5 font-medium cursor-default select-none border-b ${t.divider} ${align ?? "text-right"} ${t.textSub} ${i > 2 ? "hidden @2xl:table-cell" : ""}`}
                >
                  {label} {sort.key === k ? (sort.dir < 0 ? "▾" : "▴") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const isSel = selected === r.id;
              return (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  onDoubleClick={() => tab === "windows" && focusOrRestore?.(r.id)}
                  className={isSel ? sel : zebra}
                >
                  <td className="px-3 py-1 text-left">
                    <span className="flex items-center gap-2 min-w-0">
                      {r.img ? <img src={r.img} alt="" className="w-4 h-4 object-contain" /> : <span className="w-4 text-center text-[12px]">{r.icon ?? "▫️"}</span>}
                      <span className="truncate">{r.name}</span>
                      {r.active && <span className={`text-[10px] ${isSel ? "text-white/80" : t.textSub}`}>(active)</span>}
                    </span>
                  </td>
                  {tab === "cpu" ? (
                    <>
                      <td className="px-3 py-1 text-right">{r.cpu.toFixed(1)}</td>
                      <td className="px-3 py-1 text-right">{fmtTime(r.cpuTime)}</td>
                      <td className="px-3 py-1 text-right hidden @2xl:table-cell">{r.threads}</td>
                      <td className="px-3 py-1 text-right hidden @2xl:table-cell">{r.level}</td>
                      <td className="px-3 py-1 text-right hidden @2xl:table-cell">{r.pid}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-1 text-right">{r.mem.toFixed(1)} MB</td>
                      <td className="px-3 py-1 text-right">{fmtTime(r.time)}</td>
                      <td className="px-3 py-1 text-right hidden @2xl:table-cell">{r.pid}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {sorted.length === 0 && <div className={`py-10 text-center text-[13px] ${t.textSub}`}>{tab === "windows" ? "No windows open" : "No matching processes"}</div>}
      </div>

      {/* bottom stats panel */}
      <div className={`shrink-0 border-t ${t.divider} ${t.sidebarBg} px-4 py-3 grid grid-cols-1 @2xl:grid-cols-[1fr_1.2fr_1fr] gap-4 items-center text-[12px]`}>
        <div className="space-y-0.5">
          {[
            ["Skill load", `${total.toFixed(1)}%`],
            ["Idle", `${(100 - total).toFixed(1)}%`],
            ["Processes", skills.length],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className={t.textSub}>{k}:</span>
              <span className="font-medium tabular-nums">{v}</span>
            </div>
          ))}
        </div>
        <div className={`rounded-lg overflow-hidden ring-1 ${t.isDark ? "ring-white/10 bg-black/30" : "ring-black/10 bg-white"}`}>
          <div className={`px-2 pt-1 text-[10px] font-medium ${t.textSub}`}>CPU LOAD</div>
          <Sparkline data={history.current} color={blue} isDark={t.isDark} />
        </div>
        <div className="space-y-0.5">
          {[
            ["Uptime", fmtTime(uptime)],
            ["Windows open", openWindows.length],
            ["Achievements", `${unlockedCount}/${ACHIEVEMENTS.length}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className={t.textSub}>{k}:</span>
              <span className="font-medium tabular-nums">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`shrink-0 px-4 pb-2 text-[10px] ${t.sidebarBg} ${t.textSub}`}>
        {tab === "cpu" ? "Processes are Marta’s skills; % CPU reflects how much she uses each one (based on her skill level)." : "These are the windows open in this portfolio right now. Select one and press ⓧ to quit it."}
      </div>

      {/* alert sheet */}
      <AnimatePresence>
        {alert && (
          <motion.div className="absolute inset-0 z-20 flex items-start justify-center bg-black/20 pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAlert(null)}>
            <motion.div
              className={`w-[300px] rounded-2xl p-5 text-center shadow-2xl ${t.isDark ? "bg-[#2c2c2e] text-white" : "bg-[#f2f2f7] text-black"}`}
              initial={{ y: -20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -10, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[34px]">{alert.icon}</div>
              <div className="mt-1 text-[14px] font-semibold">{alert.title}</div>
              <div className={`mt-1 text-[12px] leading-snug ${t.textSub}`}>{alert.text}</div>
              <button onClick={() => setAlert(null)} className="mt-4 w-full rounded-lg py-1.5 text-[13px] font-semibold text-white bg-[hsl(var(--accent))]">
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
