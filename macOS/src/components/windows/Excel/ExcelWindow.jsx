// src/components/windows/Excel/ExcelWindow.jsx
// "Excel → Product": a fund cash-flow model as a spreadsheet (blue inputs, black formulas, live IRR/DPI),
// and the same numbers redesigned as a product screen. Shows how spreadsheets become software.
// The fund and its cash flows are fictional.
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const YEARS = 11;
const CALLS0 = [150, 250, 250, 150, 100, 50, 0, 0, 0, 0, 0];
const DISTS0 = [0, 0, 20, 60, 150, 250, 320, 350, 280, 150, 80];
const START_YEAR = 2016;
const ROW0 = 5; // first data row in the sheet

function irr(flows) {
  const npv = (r) => flows.reduce((s, v, t) => s + v / Math.pow(1 + r, t), 0);
  let lo = -0.99;
  let hi = 1;
  if (npv(lo) * npv(hi) > 0) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

function model(calls, dists) {
  const net = calls.map((c, i) => dists[i] - c);
  let run = 0;
  const cum = net.map((n) => (run += n));
  const paid = calls.reduce((a, b) => a + b, 0);
  const dist = dists.reduce((a, b) => a + b, 0);
  const trough = Math.min(...cum);
  const breakeven = cum.findIndex((v, i) => i > 0 && v >= 0 && cum[i - 1] < 0);
  return { net, cum, paid, dist, dpi: paid ? dist / paid : 0, irr: irr(net), trough, breakeven };
}

/* accounting format: negatives in parentheses */
const acct = (x) => {
  const n = x || 0; // avoid "-0"
  return n < 0 ? `(${Math.abs(n).toLocaleString("en-US")})` : n.toLocaleString("en-US");
};
const eurK = (k) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(k * 1000);

const COLS = ["A", "B", "C", "D", "E"];

/* ---------- spreadsheet ---------- */
const SheetCtx = createContext(null);

function Cell({ r, c, children, className = "", style, colSpan }) {
  const { sel, setSel, edit, setEdit, startEdit, commit, isInput, g, inputRef } = useContext(SheetCtx);
  const selected = sel.r === r && sel.c === c;
  const editing = edit && edit.r === r && edit.c === c;
  return (
    <td
      colSpan={colSpan}
      onClick={() => setSel({ r, c })}
      onDoubleClick={() => startEdit(r, c)}
      className={`relative h-[24px] px-1.5 text-[12.5px] whitespace-nowrap tabular-nums ${className}`}
      style={{ border: `1px solid ${g.grid}`, background: g.cell, color: isInput(r, c) ? g.input : g.text, outline: selected ? `2px solid ${g.sel}` : "none", outlineOffset: -1, ...style }}
    >
      {editing ? (
        <input
          ref={inputRef}
          defaultValue={edit.v}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(e.currentTarget.value);
            if (e.key === "Escape") setEdit(null);
          }}
          className="absolute inset-0 w-full px-1.5 text-right outline-none tabular-nums"
          style={{ background: g.cell, color: g.input }}
        />
      ) : (
        children
      )}
    </td>
  );
}


function Sheet({ calls, dists, setCalls, setDists, m, dark }) {
  const [sel, setSel] = useState({ r: ROW0, c: "B" });
  const [edit, setEdit] = useState(null);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);

  const isInput = (r, c) => r >= ROW0 && r < ROW0 + YEARS && (c === "B" || c === "C");
  const rowTotal = ROW0 + YEARS;
  const rowsOut = { paid: rowTotal + 2, dist: rowTotal + 3, dpi: rowTotal + 4, irr: rowTotal + 5 };

  const formula = (r, c) => {
    if (r >= ROW0 && r < rowTotal) {
      const i = r - ROW0;
      if (c === "A") return String(START_YEAR + i);
      if (c === "B") return String(calls[i]);
      if (c === "C") return String(dists[i]);
      if (c === "D") return `=C${r}-B${r}`;
      if (c === "E") return i === 0 ? `=D${r}` : `=E${r - 1}+D${r}`;
    }
    if (r === rowTotal) return { A: "Total", B: `=SUM(B${ROW0}:B${rowTotal - 1})`, C: `=SUM(C${ROW0}:C${rowTotal - 1})`, D: `=SUM(D${ROW0}:D${rowTotal - 1})`, E: "" }[c];
    if (r === rowsOut.paid && c === "B") return `=B${rowTotal}`;
    if (r === rowsOut.dist && c === "B") return `=C${rowTotal}`;
    if (r === rowsOut.dpi && c === "B") return `=B${rowsOut.dist}/B${rowsOut.paid}`;
    if (r === rowsOut.irr && c === "B") return `=IRR(D${ROW0}:D${rowTotal - 1})`;
    return "";
  };

  const commit = (val) => {
    if (!edit) return;
    const n = Math.max(0, Math.round(Number(String(val).replace(/[^0-9.]/g, "")) || 0));
    const i = edit.r - ROW0;
    if (edit.c === "B") setCalls((a) => a.map((v, j) => (j === i ? n : v)));
    else setDists((a) => a.map((v, j) => (j === i ? n : v)));
    setEdit(null);
  };
  const startEdit = (r, c) => {
    if (isInput(r, c)) setEdit({ r, c, v: formula(r, c) });
    else {
      setToast("This cell is a formula. Blue cells are inputs.");
      setTimeout(() => setToast(null), 1800);
    }
  };
  useEffect(() => {
    if (edit) inputRef.current?.select();
  }, [edit]);

  const g = dark
    ? { grid: "#3a3a3a", head: "#2b2b2b", headText: "#bdbdbd", cell: "#1f1f1f", text: "#e6e6e6", input: "#6ea8ff", sel: "#21a366", fill: "#262626", neg: "#ff7b72" }
    : { grid: "#e1e1e1", head: "#f3f3f3", headText: "#555", cell: "#ffffff", text: "#1b1b1b", input: "#0b44c8", sel: "#107c41", fill: "#f7f7f7", neg: "#c00000" };

  const ctx = { sel, setSel, edit, setEdit, startEdit, commit, isInput, g, inputRef };

  const rows = [];
  rows.push(
    <tr key="r1">
      <Cell r={1} c="A" colSpan={5} className="font-bold text-[13.5px]">Aurora Growth Fund II · cash flows (€k)</Cell>
    </tr>,
    <tr key="r2">
      <Cell r={2} c="A" colSpan={5} className="italic" style={{ color: "#7a7a7a" }}>Fictional fund. Blue = inputs, black = formulas. Double-click a blue cell.</Cell>
    </tr>,
    <tr key="r3">{COLS.map((c) => <Cell key={c} r={3} c={c} />)}</tr>,
    <tr key="r4">
      {["Year", "Called", "Distributed", "Net cash flow", "Cumulative"].map((h, i) => (
        <Cell key={h} r={4} c={COLS[i]} className={`font-bold ${i ? "text-right" : ""}`} style={{ background: g.fill }}>{h}</Cell>
      ))}
    </tr>
  );
  for (let i = 0; i < YEARS; i++) {
    const r = ROW0 + i;
    rows.push(
      <tr key={r}>
        <Cell r={r} c="A">{START_YEAR + i}</Cell>
        <Cell r={r} c="B" className="text-right">{acct(-calls[i])}</Cell>
        <Cell r={r} c="C" className="text-right">{acct(dists[i])}</Cell>
        <Cell r={r} c="D" className="text-right" style={{ color: m.net[i] < 0 ? g.neg : g.text }}>{acct(m.net[i])}</Cell>
        <Cell r={r} c="E" className="text-right" style={{ color: m.cum[i] < 0 ? g.neg : g.text }}>{acct(m.cum[i])}</Cell>
      </tr>
    );
  }
  rows.push(
    <tr key="tot">
      <Cell r={rowTotal} c="A" className="font-bold" style={{ borderTop: `2px solid ${g.text}` }}>Total</Cell>
      <Cell r={rowTotal} c="B" className="text-right font-bold" style={{ borderTop: `2px solid ${g.text}` }}>{acct(-m.paid)}</Cell>
      <Cell r={rowTotal} c="C" className="text-right font-bold" style={{ borderTop: `2px solid ${g.text}` }}>{acct(m.dist)}</Cell>
      <Cell r={rowTotal} c="D" className="text-right font-bold" style={{ borderTop: `2px solid ${g.text}` }}>{acct(m.dist - m.paid)}</Cell>
      <Cell r={rowTotal} c="E" style={{ borderTop: `2px solid ${g.text}` }} />
    </tr>,
    <tr key="gap">{COLS.map((c) => <Cell key={c} r={rowTotal + 1} c={c} />)}</tr>
  );
  [
    [rowsOut.paid, "Paid-in", acct(m.paid)],
    [rowsOut.dist, "Distributed", acct(m.dist)],
    [rowsOut.dpi, "DPI", `${m.dpi.toFixed(2)}x`],
    [rowsOut.irr, "IRR", m.irr == null ? "#NUM!" : `${(m.irr * 100).toFixed(1)}%`],
  ].forEach(([r, l, v]) =>
    rows.push(
      <tr key={r}>
        <Cell r={r} c="A" className="font-semibold">{l}</Cell>
        <Cell r={r} c="B" className="text-right font-semibold" style={{ background: dark ? "#2a3326" : "#e2efda" }}>{v}</Cell>
        {COLS.slice(2).map((c) => <Cell key={c} r={r} c={c} />)}
      </tr>
    )
  );

  return (
    <div className="h-full flex flex-col" style={{ background: g.cell }}>
      <div className="shrink-0 flex items-center gap-2 px-2 py-1 text-[12.5px]" style={{ borderBottom: `1px solid ${g.grid}`, background: g.cell, color: g.text }}>
        <span className="w-14 text-center rounded-[3px] py-0.5" style={{ border: `1px solid ${g.grid}` }}>{sel.c}{sel.r}</span>
        <span className="italic font-serif px-1" style={{ color: g.headText }}>fx</span>
        <span className="flex-1 font-mono truncate px-2 py-0.5 rounded-[3px]" style={{ border: `1px solid ${g.grid}`, color: isInput(sel.r, sel.c) ? g.input : g.text }}>{formula(sel.r, sel.c) || " "}</span>
      </div>
      <div className="relative flex-1 min-h-0 overflow-auto">
        <SheetCtx.Provider value={ctx}>
        <table className="border-collapse select-none" style={{ color: g.text, tableLayout: "fixed", width: 40 + 130 + 4 * 120 }}>
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-10 w-10" style={{ background: g.head, border: `1px solid ${g.grid}` }} />
              {COLS.map((c, i) => (
                <th key={c} className="sticky top-0 h-[22px] text-[11.5px] font-normal" style={{ width: i === 0 ? 130 : 120, minWidth: i === 0 ? 130 : 120, background: sel.c === c ? (dark ? "#334" : "#d3f0e0") : g.head, color: g.headText, border: `1px solid ${g.grid}` }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="sticky left-0 text-center text-[11.5px] w-10" style={{ background: sel.r === i + 1 ? (dark ? "#334" : "#d3f0e0") : g.head, color: g.headText, border: `1px solid ${g.grid}` }}>{i + 1}</td>
                {row.props.children}
              </tr>
            ))}
          </tbody>
        </table>
        </SheetCtx.Provider>
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-[6px] bg-[#323130] text-white text-[12.5px] px-3 py-2 shadow-lg whitespace-nowrap">
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="shrink-0 flex items-center gap-1 px-2 text-[12px] whitespace-nowrap overflow-hidden" style={{ background: g.head, borderTop: `1px solid ${g.grid}`, color: g.headText }}>
        <span className="px-3 py-1 font-semibold" style={{ background: g.cell, color: g.sel, borderBottom: `2px solid ${g.sel}` }}>Cash flows</span>
        <span className="px-3 py-1">Assumptions</span>
        <span className="px-3 py-1">Fees</span>
        <span className="ml-auto pl-2 pr-2 tabular-nums">DPI {m.dpi.toFixed(2)}x · IRR {m.irr == null ? "–" : `${(m.irr * 100).toFixed(1)}%`}</span>
      </div>
    </div>
  );
}

/* ---------- product ---------- */
function Term({ word, def, dark }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} tabIndex={0}>
      <span className="underline decoration-dotted underline-offset-[3px] cursor-help">{word}</span>
      <AnimatePresence>
        {open && (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`absolute left-0 top-full mt-1.5 z-20 w-[220px] rounded-[8px] px-3 py-2 text-[12px] font-normal normal-case tracking-normal leading-snug shadow-xl ${dark ? "bg-[#2b2f36] text-white" : "bg-[#111827] text-white"}`}>
            {def}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function Product({ m, calls, dists, dark }) {
  const [hover, setHover] = useState(null);
  const c = dark
    ? { bg: "#0f1115", card: "#181b21", text: "#e8eaee", muted: "#8b93a1", line: "rgba(255,255,255,0.08)", accent: "#6b9dff", out: "#f97366", inn: "#34d399" }
    : { bg: "#f6f7f9", card: "#ffffff", text: "#111827", muted: "#6b7280", line: "#e5e7eb", accent: "#1d4ed8", out: "#dc5a4b", inn: "#0f8a5f" };
  const W = 640;
  const H = 220;
  const pad = { l: 44, r: 12, t: 14, b: 26 };
  const maxBar = Math.max(...calls, ...dists, 1);
  const cumMax = Math.max(...m.cum.map(Math.abs), 1);
  const scaleMax = Math.max(maxBar, cumMax);
  const x = (i) => pad.l + (i + 0.5) * ((W - pad.l - pad.r) / YEARS);
  const y = (v) => pad.t + (1 - (v + scaleMax) / (2 * scaleMax)) * (H - pad.t - pad.b);
  const bw = ((W - pad.l - pad.r) / YEARS) * 0.32;
  const line = m.cum.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const multiple = m.dpi;

  return (
    <div className="h-full overflow-y-auto p-5 @2xl:p-8" style={{ background: c.bg, color: c.text, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div className="max-w-[760px] mx-auto">
        <div className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: c.muted }}>Growth equity · Vintage {START_YEAR}</div>
        <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.02em]">Aurora Growth Fund II</h2>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: c.muted }}>
          For every <b style={{ color: c.text }}>€1</b> you paid in, you’ve received <b style={{ color: c.text }}>€{multiple.toFixed(2)}</b> back.
          {m.breakeven > 0 && <> You broke even in <b style={{ color: c.text }}>{START_YEAR + m.breakeven}</b>.</>}
        </p>

        <div className="mt-5 grid grid-cols-2 @3xl:grid-cols-4 gap-3">
          {[
            [<Term key="t" word="IRR" def="Internal rate of return: the yearly growth rate your money earned, accounting for when it went in and came out." dark={dark} />, m.irr == null ? "–" : `${(m.irr * 100).toFixed(1)}%`, "a year"],
            [<Term key="t" word="DPI" def="Distributions to paid-in: cash you’ve got back divided by cash you’ve put in." dark={dark} />, `${m.dpi.toFixed(2)}x`, "cash back"],
            ["Paid in", eurK(m.paid), "total called"],
            ["Deepest dip", eurK(m.trough), `in ${START_YEAR + m.cum.indexOf(m.trough)}`],
          ].map(([l, v, s], i) => (
            <div key={i} className="rounded-[12px] p-4" style={{ background: c.card, boxShadow: `0 0 0 1px ${c.line}` }}>
              <div className="text-[12px]" style={{ color: c.muted }}>{l}</div>
              <motion.div key={v} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="mt-1 text-[22px] font-semibold tabular-nums">{v}</motion.div>
              <div className="text-[11.5px]" style={{ color: c.muted }}>{s}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[12px] p-4" style={{ background: c.card, boxShadow: `0 0 0 1px ${c.line}` }}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]" style={{ color: c.muted }}>
            <span className="text-[14px] font-semibold mr-auto" style={{ color: c.text }}>The <Term word="J-curve" def="Early on you pay in before investments grow, so you’re down. As companies are sold, cash flows back and the line climbs: a J." dark={dark} /></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: c.out }} />Paid in</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: c.inn }} />Paid out</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: c.accent }} />Your position</span>
          </div>
          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full h-auto" role="img" aria-label={`Cumulative cash position from ${START_YEAR} to ${START_YEAR + YEARS - 1}, lowest ${eurK(m.trough)}, ending ${eurK(m.cum[YEARS - 1])}`}>
              <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke={c.line} strokeWidth="1.5" />
              <text x={pad.l - 8} y={y(0) + 4} textAnchor="end" fontSize="10.5" fill={c.muted}>€0</text>
              <text x={pad.l - 8} y={y(scaleMax) + 8} textAnchor="end" fontSize="10.5" fill={c.muted}>{eurK(scaleMax).replace(",000", "k").replace(/,\d{3}$/, "k")}</text>
              <text x={pad.l - 8} y={y(-scaleMax)} textAnchor="end" fontSize="10.5" fill={c.muted}>−{eurK(scaleMax).replace(",000", "k").replace(/,\d{3}$/, "k")}</text>
              {calls.map((v, i) => (
                <g key={i}>
                  {v > 0 && <rect x={x(i) - bw - 1} y={y(0)} width={bw} height={y(-v) - y(0)} rx="2" fill={c.out} opacity={hover == null || hover === i ? 0.85 : 0.35} />}
                  {dists[i] > 0 && <rect x={x(i) + 1} y={y(dists[i])} width={bw} height={y(0) - y(dists[i])} rx="2" fill={c.inn} opacity={hover == null || hover === i ? 0.85 : 0.35} />}
                  <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill={c.muted}>{String(START_YEAR + i).slice(2)}’</text>
                  <rect x={x(i) - bw - 4} y={pad.t} width={bw * 2 + 8} height={H - pad.t - pad.b} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
                </g>
              ))}
              <path d={line} fill="none" stroke={c.accent} strokeWidth="2.5" strokeLinejoin="round" pointerEvents="none" />
              {m.cum.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3} fill={c.accent} stroke={c.card} strokeWidth="2" pointerEvents="none" />)}
            </svg>
            {hover != null && (
              <div className="absolute pointer-events-none rounded-[8px] px-3 py-2 text-[12px] shadow-lg" style={{ left: `${(x(hover) / W) * 100}%`, top: 0, transform: `translateX(${hover > YEARS / 2 ? "-105%" : "8%"})`, background: dark ? "#2b2f36" : "#111827", color: "#fff" }}>
                <div className="font-semibold">{START_YEAR + hover}</div>
                <div>Paid in {eurK(calls[hover])}</div>
                <div>Paid out {eurK(dists[hover])}</div>
                <div className="mt-0.5 font-semibold">Position {eurK(m.cum[hover])}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 @2xl:grid-cols-3 gap-3 text-[13px]">
          {[
            ["Formulas hidden, meaning shown", "“=IRR(D5:D15)” becomes “the yearly growth rate your money earned”."],
            ["Jargon explained in place", "IRR, DPI and J-curve explain themselves on hover, so nobody needs a glossary."],
            ["One number, one story", "The headline turns DPI into a sentence: for every €1 in, €" + multiple.toFixed(2) + " back."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-[12px] p-4" style={{ background: dark ? "rgba(107,157,255,0.08)" : "#eef2ff" }}>
              <div className="font-semibold">{t}</div>
              <p className="mt-1 leading-snug" style={{ color: c.muted }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExcelWindow({ theme = "light" }) {
  const dark = theme === "dark";
  const [calls, setCalls] = useState(CALLS0);
  const [dists, setDists] = useState(DISTS0);
  const [view, setView] = useState("sheet");
  const m = useMemo(() => model(calls, dists), [calls, dists]);
  const changed = calls.some((v, i) => v !== CALLS0[i]) || dists.some((v, i) => v !== DISTS0[i]);

  return (
    <div className="@container no-darkwin h-full flex flex-col" style={{ background: dark ? "#1f1f1f" : "#fff" }}>
      <div className="shrink-0 text-white" style={{ background: "#107c41" }}>
        <div className="flex items-center gap-3 px-3 h-9 text-[12.5px]">
          <span className="w-5 h-5 rounded-[3px] bg-white/95 text-[#107c41] text-[11px] font-black flex items-center justify-center">X</span>
          <span className="font-semibold">Fund model.xlsx</span>
          <span className="opacity-75 hidden @2xl:inline">{changed ? "Edited" : "Saved"}</span>
          <div role="tablist" className="ml-auto flex rounded-[7px] p-0.5 bg-black/20 text-[12px] font-semibold">
            {[
              ["sheet", "Spreadsheet"],
              ["product", "Product"],
            ].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={view === k} type="button" onClick={() => setView(k)} className="relative px-3 py-1 rounded-[5px]">
                {view === k && <motion.span layoutId="xl-view" className="absolute inset-0 rounded-[5px] bg-white" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                <span className="relative" style={{ color: view === k ? "#107c41" : "#fff" }}>{l}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 px-3 h-8 text-[12px]" style={{ background: dark ? "#2b2b2b" : "#f3f3f3", color: dark ? "#ddd" : "#333" }}>
          {["Home", "Insert", "Formulas", "Data", "Review"].map((t, i) => (
            <span key={t} className={i === 0 ? "font-semibold" : ""} style={i === 0 ? { color: "#107c41", borderBottom: "2px solid #107c41", paddingBottom: 2 } : undefined}>{t}</span>
          ))}
          {changed && (
            <button type="button" onClick={() => { setCalls(CALLS0); setDists(DISTS0); }} className="ml-auto font-semibold" style={{ color: "#107c41" }}>
              Reset model
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div key={view} className="h-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {view === "sheet" ? <Sheet calls={calls} dists={dists} setCalls={setCalls} setDists={setDists} m={m} dark={dark} /> : <Product m={m} calls={calls} dists={dists} dark={dark} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
