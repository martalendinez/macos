// src/components/windows/FundSim/FundSimWindow.jsx
// "Fund Simulator": an interactive private-markets explainer (J-curve, capital calls, TVPI/DPI/IRR).
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { GLOSSARY, SCENARIOS, STRATEGIES, simulate } from "./fundModel";

const EASE = [0.22, 1, 0.36, 1];
// validated pair (dataviz validator, light + dark): calls = orange, distributions = blue
const COLORS = {
  light: { call: "#eb6834", dist: "#2a78d6", line: "#1d1d1f", grid: "rgba(0,0,0,0.07)", axis: "rgba(0,0,0,0.45)", surface: "#ffffff" },
  dark: { call: "#d95926", dist: "#3987e5", line: "#f5f5f7", grid: "rgba(255,255,255,0.08)", axis: "rgba(255,255,255,0.5)", surface: "#1e1e20" },
};

const eur = (v, d = 1) => `€${Math.abs(v).toFixed(d)}M`;
const signed = (v) => `${v < 0 ? "−" : "+"}${eur(v)}`;
const pct = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : "—");

function Segmented({ t, options, value, onChange, layoutId }) {
  return (
    <div className={`flex rounded-[8px] p-0.5 text-[12px] font-medium ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
      {options.map(([k, label]) => (
        <button key={k} onClick={() => onChange(k)} className={`relative flex-1 px-2.5 py-1 rounded-[6px] whitespace-nowrap ${value === k ? t.textMain : t.textSub}`}>
          {value === k && <motion.span layoutId={layoutId} className={`absolute inset-0 rounded-[6px] ${t.isDark ? "bg-white/20" : "bg-white shadow-sm"}`} />}
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}

function Stat({ t, label, value, sub, i }) {
  return (
    <motion.div
      className={`rounded-xl p-3 ${t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.07]" : "bg-[#f5f5f7]"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, ease: EASE }}
    >
      <div className={`text-[11px] font-medium ${t.textSub}`}>{label}</div>
      <motion.div key={value} className={`mt-0.5 text-[22px] font-bold tabular-nums tracking-[-0.02em] ${t.textMain}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
        {value}
      </motion.div>
      <div className={`text-[11px] ${t.textSub}`}>{sub}</div>
    </motion.div>
  );
}

/** Calls (below zero) and distributions (above zero) per year, with the cumulative net line (the J-curve). */
function JCurveChart({ t, result, year, setYear }) {
  const wrap = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  const c = t.isDark ? COLORS.dark : COLORS.light;
  const H = 260;
  const pad = { l: 44, r: 12, t: 12, b: 26 };
  const ys = result.years;
  const maxV = Math.max(...ys.map((y) => Math.max(y.dist, y.cumulative)), 1);
  const minV = Math.min(...ys.map((y) => Math.min(-y.call, y.cumulative)), -1);
  const span = maxV - minV;
  const yScale = (v) => pad.t + ((maxV - v) / span) * (H - pad.t - pad.b);
  const band = (w - pad.l - pad.r) / ys.length;
  const xMid = (i) => pad.l + band * i + band / 2;
  const barW = Math.max(6, Math.min(26, band * 0.5));
  const zero = yScale(0);
  const step = span > 12 ? 5 : span > 5 ? 2 : 1;
  const ticks = [];
  for (let v = Math.ceil(minV / step) * step; v <= maxV; v += step) ticks.push(v);

  const linePath = ys.map((y, i) => `${i ? "L" : "M"}${xMid(i)},${yScale(y.cumulative)}`).join(" ");
  const hi = ys.findIndex((y) => y.year === year);
  const hv = ys[hi];
  const tipLeft = Math.min(Math.max(xMid(hi) - 90, 0), w - 180);

  return (
    <div ref={wrap} className="relative select-none">
      <svg width={w} height={H} role="img" aria-label="J-curve chart of yearly capital calls, distributions and cumulative net cash flow">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={w - pad.r} y1={yScale(v)} y2={yScale(v)} stroke={v === 0 ? c.axis : c.grid} strokeWidth={v === 0 ? 1 : 1} />
            <text x={pad.l - 8} y={yScale(v) + 4} textAnchor="end" fontSize="10" fill={c.axis} className="tabular-nums">
              {v === 0 ? "0" : `${v > 0 ? "" : "−"}${Math.abs(v)}`}
            </text>
          </g>
        ))}
        {ys.map((y, i) => (
          <g key={y.year} opacity={hi === i ? 1 : 0.88}>
            {y.call > 0.005 && (
              <motion.rect
                initial={false}
                animate={{ y: zero + 1, height: Math.max(1, yScale(-y.call) - zero - 1) }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
                x={xMid(i) - barW / 2}
                width={barW}
                rx={4}
                fill={c.call}
              />
            )}
            {y.dist > 0.005 && (
              <motion.rect
                initial={false}
                animate={{ y: yScale(y.dist), height: Math.max(1, zero - yScale(y.dist) - 1) }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
                x={xMid(i) - barW / 2}
                width={barW}
                rx={4}
                fill={c.dist}
              />
            )}
            <text x={xMid(i)} y={H - 8} textAnchor="middle" fontSize="10" fill={hi === i ? c.line : c.axis} fontWeight={hi === i ? 700 : 400}>
              Y{y.year}
            </text>
          </g>
        ))}
        <motion.path initial={false} animate={{ d: linePath }} transition={{ type: "spring", stiffness: 200, damping: 26 }} fill="none" stroke={c.line} strokeWidth={2} strokeLinejoin="round" />
        {ys.map((y, i) => (
          <motion.circle key={y.year} initial={false} animate={{ cy: yScale(y.cumulative) }} cx={xMid(i)} r={hi === i ? 5 : 3.2} fill={c.line} stroke={c.surface} strokeWidth={2} />
        ))}
        {/* crosshair */}
        <line x1={xMid(hi)} x2={xMid(hi)} y1={pad.t} y2={H - pad.b} stroke={c.axis} strokeDasharray="3 3" strokeWidth={1} />
        {/* hit targets: one full-height column per year */}
        {ys.map((y, i) => (
          <rect
            key={`hit-${y.year}`}
            x={pad.l + band * i}
            y={0}
            width={band}
            height={H}
            fill="transparent"
            onPointerEnter={() => setYear(y.year)}
            onPointerDown={() => setYear(y.year)}
          />
        ))}
      </svg>

      {hv && (
        <div
          className={`pointer-events-none absolute top-1 w-[180px] rounded-lg px-3 py-2 text-[11px] shadow-lg ring-1 ${t.isDark ? "bg-[#2c2c2e] ring-white/10" : "bg-white ring-black/10"}`}
          style={{ left: tipLeft }}
        >
          <div className={`font-semibold ${t.textMain}`}>Year {hv.year}</div>
          {[
            ["Capital called", hv.call ? `−${eur(hv.call, 2)}` : "—", c.call],
            ["Distributed", hv.dist ? `+${eur(hv.dist, 2)}` : "—", c.dist],
            ["Net cumulative", signed(hv.cumulative), c.line],
            ["NAV", eur(hv.nav, 2), null],
          ].map(([k, v, col]) => (
            <div key={k} className="flex items-center justify-between gap-2 mt-0.5">
              <span className={`flex items-center gap-1.5 ${t.textSub}`}>
                {col && <span className="w-2 h-2 rounded-full" style={{ background: col }} />}
                {k}
              </span>
              <span className={`tabular-nums font-medium ${t.textMain}`}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FundSimWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const [tab, setTab] = useState("sim");
  const [strategy, setStrategy] = useState("pe");
  const [scenario, setScenario] = useState("base");
  const [commitment, setCommitment] = useState(10);
  const [showTable, setShowTable] = useState(false);
  const result = useMemo(() => simulate(strategy, scenario, commitment), [strategy, scenario, commitment]);
  const [year, setYear] = useState(result.years.length);
  useEffect(() => setYear((y) => Math.min(y, result.years.length)), [result.years.length]);

  const s = STRATEGIES[strategy];
  const yr = result.years[year - 1] ?? result.years[result.years.length - 1];
  const tvpiAt = (yr.distributed + yr.nav) / Math.max(yr.paidIn, 1e-9);
  const dpiAt = yr.distributed / Math.max(yr.paidIn, 1e-9);
  const c = t.isDark ? COLORS.dark : COLORS.light;

  return (
    <div className={`no-darkwin h-full w-full flex flex-col ${t.windowBg}`}>
      {/* toolbar */}
      <div className={`h-12 shrink-0 px-4 flex items-center gap-3 border-b ${t.divider} ${t.toolbarBg}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white text-[14px] shadow-sm" style={{ background: "linear-gradient(135deg,#0a84ff,#5e5ce6)" }}>
            ↗
          </span>
          <div className="min-w-0 hidden @lg:block">
            <div className={`text-[14px] font-semibold leading-tight ${t.textMain}`}>Fund Simulator</div>
            <div className={`text-[11px] leading-tight ${t.textSub}`}>Private markets, explained</div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="w-[200px]">
          <Segmented t={t} layoutId="fs-tab" value={tab} onChange={setTab} options={[["sim", "Simulator"], ["learn", "Glossary"]]} />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "sim" ? (
            <motion.div key="sim" className="max-w-[980px] mx-auto px-4 @lg:px-6 py-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <h1 className={`text-[26px] @lg:text-[30px] font-bold tracking-[-0.03em] leading-tight ${t.textMain}`}>See how a private markets fund behaves</h1>
              <p className={`mt-1 max-w-[640px] text-[14px] leading-relaxed ${t.textSub}`}>
                Pick a strategy and commitment. Investors pay in over the first years (capital calls), then get cash back as investments mature (distributions). That dip-then-rise is the famous <b className={t.textMain}>J-curve</b>.
              </p>

              {/* controls */}
              <div className="mt-5 grid grid-cols-1 @3xl:grid-cols-[1.4fr_1fr_1fr] gap-4 items-end">
                <div>
                  <div className={`text-[11px] font-semibold uppercase tracking-[0.06em] mb-1.5 ${t.textSub}`}>Strategy</div>
                  <Segmented t={t} layoutId="fs-strat" value={strategy} onChange={setStrategy} options={Object.entries(STRATEGIES).map(([k, v]) => [k, v.short])} />
                </div>
                <div>
                  <div className={`flex justify-between text-[11px] font-semibold uppercase tracking-[0.06em] mb-1.5 ${t.textSub}`}>
                    <span>Commitment</span>
                    <span className={`tabular-nums normal-case tracking-normal ${t.textMain}`}>{eur(commitment, 0)}</span>
                  </div>
                  <input type="range" min={1} max={50} value={commitment} onChange={(e) => setCommitment(Number(e.target.value))} className="w-full accent-[hsl(var(--accent))]" aria-label="Commitment in millions of euros" />
                </div>
                <div>
                  <div className={`text-[11px] font-semibold uppercase tracking-[0.06em] mb-1.5 ${t.textSub}`}>Market</div>
                  <Segmented t={t} layoutId="fs-scen" value={scenario} onChange={setScenario} options={Object.entries(SCENARIOS).map(([k, v]) => [k, v.label])} />
                </div>
              </div>
              <p className={`mt-3 text-[13px] ${t.textBody}`}>
                <b className={t.textMain}>{s.label}:</b> {s.blurb}
              </p>

              {/* metrics */}
              <div className="mt-5 grid grid-cols-2 @3xl:grid-cols-4 gap-3">
                <Stat t={t} i={0} label="Net IRR (full life)" value={pct(result.irr)} sub="annualised return" />
                <Stat t={t} i={1} label={`TVPI · year ${yr.year}`} value={`${tvpiAt.toFixed(2)}x`} sub="total value ÷ paid in" />
                <Stat t={t} i={2} label={`DPI · year ${yr.year}`} value={`${dpiAt.toFixed(2)}x`} sub="cash back ÷ paid in" />
                <Stat t={t} i={3} label="Breakeven" value={result.breakeven ? `Year ${result.breakeven}` : "—"} sub={`deepest point ${signed(result.trough)}`} />
              </div>

              {/* chart */}
              <div className={`mt-5 rounded-2xl p-4 ${t.isDark ? "bg-white/[0.03] ring-1 ring-white/[0.07]" : "bg-white ring-1 ring-black/[0.06]"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className={`text-[14px] font-semibold ${t.textMain}`}>Cash flows per year (€M)</div>
                  <div className={`flex flex-wrap items-center gap-3 text-[11px] ${t.textSub}`}>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: c.call }} /> Capital calls
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: c.dist }} /> Distributions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-[2px]" style={{ background: c.line }} /> Net cumulative (J-curve)
                    </span>
                    <button onClick={() => setShowTable((v) => !v)} className={`ml-1 px-2 py-0.5 rounded-md ${t.hoverBg} ${t.accentText} font-medium`}>
                      {showTable ? "Chart" : "Table"}
                    </button>
                  </div>
                </div>
                {showTable ? (
                  <div className="overflow-x-auto">
                    <table className={`w-full text-[12px] tabular-nums ${t.textMain}`}>
                      <thead className={t.textSub}>
                        <tr>
                          {["Year", "Called", "Distributed", "NAV", "Net cumulative"].map((h) => (
                            <th key={h} className="text-right first:text-left font-medium py-1.5 px-2">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.years.map((y) => (
                          <tr key={y.year} className={`border-t ${t.divider}`}>
                            <td className="py-1.5 px-2">Y{y.year}</td>
                            <td className="text-right px-2">{y.call ? `−${eur(y.call, 2)}` : "—"}</td>
                            <td className="text-right px-2">{y.dist ? `+${eur(y.dist, 2)}` : "—"}</td>
                            <td className="text-right px-2">{eur(y.nav, 2)}</td>
                            <td className="text-right px-2 font-semibold">{signed(y.cumulative)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <JCurveChart t={t} result={result} year={yr.year} setYear={setYear} />
                )}
              </div>

              <p className={`mt-4 text-[11px] leading-relaxed ${t.textSub}`}>
                Educational illustration built with the Takahashi–Alexander (Yale) cash-flow model and typical textbook assumptions. Not real fund data, not investment advice, and not ROYC’s product.
              </p>
            </motion.div>
          ) : (
            <motion.div key="learn" className="max-w-[760px] mx-auto px-4 @lg:px-6 py-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <h1 className={`text-[26px] @lg:text-[30px] font-bold tracking-[-0.03em] ${t.textMain}`}>Private markets glossary</h1>
              <p className={`mt-1 text-[14px] ${t.textSub}`}>The vocabulary I design with every day, in plain language.</p>
              <div className={`mt-5 rounded-xl divide-y ${t.isDark ? "bg-white/[0.05] divide-white/[0.07]" : "bg-[#f5f5f7] divide-black/[0.06]"}`}>
                {GLOSSARY.map(([term, def], i) => (
                  <motion.div key={term} className="px-4 py-3" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}>
                    <div className={`text-[14px] font-semibold ${t.textMain}`}>{term}</div>
                    <div className={`text-[13px] leading-relaxed ${t.textBody}`}>{def}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
