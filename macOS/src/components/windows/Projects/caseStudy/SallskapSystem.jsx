// src/components/windows/Projects/caseStudy/SallskapSystem.jsx
// Sällskap's design system as a live, crisp bento board (instead of screenshots).
// Palette sampled from the Sällskap design-system export; fonts are the real pair (DM Serif Display + Inter).
import { useEffect } from "react";
import { motion } from "framer-motion";

const STONE = ["#f9f8f6", "#f2f0ed", "#e3e1dd", "#cbc8c2", "#a4a098", "#797d86", "#5b5f67", "#42454d", "#292c32", "#1c1e22", "#0d0f11"];
const FOREST = ["#f2f8f5", "#deede7", "#bfd9ce", "#8fbcac", "#568f7a", "#3d6658", "#325348", "#254139", "#1b322c", "#11221e", "#08110f"];
const AMBER = ["#fef8ec", "#fbeed0", "#f6daa2", "#efbf6c", "#e7a540", "#df8f20", "#b8731e", "#92571c", "#6b4019", "#472a15", "#26160d"];
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const SERIF = '"DM Serif Display", Georgia, serif';
const SANS = 'Inter, -apple-system, "Helvetica Neue", sans-serif';
const INK = STONE[9];

function useFonts() {
  useEffect(() => {
    const id = "sallskap-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}

function Card({ children, className = "", style, i = 0 }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-[18px] p-5 @2xl:p-6 ${className}`}
      style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(28,30,34,0.06), 0 18px 40px -26px rgba(28,30,34,0.35)", ...style }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children, color = STONE[5] }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color, fontFamily: SANS }}>
      {children}
    </div>
  );
}

function Ramp({ name, colors }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] font-semibold" style={{ color: INK, fontFamily: SANS }}>
          {name}
        </span>
        <span className="text-[10px] tabular-nums" style={{ color: STONE[5], fontFamily: SANS }}>
          {colors[5]}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-11 gap-[3px]">
        {colors.map((c, i) => (
          <div key={c} className="group/sw relative">
            <div className={`h-9 @2xl:h-11 ${i === 0 ? "rounded-l-[8px]" : ""} ${i === 10 ? "rounded-r-[8px]" : ""}`} style={{ background: c, boxShadow: i === 0 ? "inset 0 0 0 1px rgba(0,0,0,0.06)" : undefined }} />
            <div className="mt-1 text-center text-[8.5px] tabular-nums" style={{ color: STONE[5], fontFamily: SANS }}>
              {STEPS[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ICONS = [
  ["House", "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"],
  ["Heart", "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"],
  ["Calendar", "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"],
  ["Users", "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.5 3.5 5.2"],
  ["Clock", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2"],
  ["Pin", "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
  ["Vegan", "M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7"],
  ["Star", "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"],
];

export default function SallskapSystem() {
  useFonts();
  return (
    <div className="rounded-[24px] p-3 @2xl:p-4" style={{ background: STONE[1], fontFamily: SANS }}>
      <div className="grid grid-cols-1 @3xl:grid-cols-6 gap-3 @2xl:gap-4">
        {/* Typography */}
        <Card className="@3xl:col-span-4" i={0}>
          <Label>Typography</Label>
          <div className="mt-4 text-[38px] @2xl:text-[52px] leading-[0.98] tracking-[-0.01em]" style={{ fontFamily: SERIF, color: INK }}>
            Dining,
            <br />
            coordinated.
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: STONE[2] }}>
            <div>
              <div className="text-[30px] leading-none" style={{ fontFamily: SERIF, color: INK }}>
                Aa
              </div>
              <div className="mt-2 text-[12px] font-semibold" style={{ color: INK }}>
                DM Serif Display
              </div>
              <div className="text-[11px]" style={{ color: STONE[5] }}>
                Headings · hero · numbers
              </div>
            </div>
            <div>
              <div className="text-[30px] leading-none font-medium" style={{ color: INK }}>
                Aa
              </div>
              <div className="mt-2 text-[12px] font-semibold" style={{ color: INK }}>
                Inter 400 · 500 · 600
              </div>
              <div className="text-[11px]" style={{ color: STONE[5] }}>
                Body · labels · UI
              </div>
            </div>
          </div>
        </Card>

        {/* Primary */}
        <Card className="@3xl:col-span-2 flex flex-col justify-between min-h-[200px]" style={{ background: FOREST[5] }} i={1}>
          <Label color="rgba(255,255,255,0.7)">Primary</Label>
          <div>
            <div className="text-[64px] leading-none text-white" style={{ fontFamily: SERIF }}>
              Aa
            </div>
            <div className="mt-3 flex items-end justify-between text-white">
              <span className="text-[13px] font-semibold">Forest 500</span>
              <span className="text-[11px] tabular-nums text-white/70">{FOREST[5]}</span>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full" style={{ background: FOREST[4], opacity: 0.35 }} />
        </Card>

        {/* Colour */}
        <Card className="@3xl:col-span-6" i={2}>
          <Label>Colour · 11 shades each, 50 → 950</Label>
          <div className="mt-4 grid grid-cols-1 @3xl:grid-cols-3 gap-5">
            <Ramp name="Stone" colors={STONE} />
            <Ramp name="Forest" colors={FOREST} />
            <Ramp name="Amber" colors={AMBER} />
          </div>
        </Card>

        {/* Components */}
        <Card className="@3xl:col-span-4" i={3}>
          <Label>Components</Label>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <span className="px-5 py-2.5 rounded-[6px] text-[13px] font-medium text-white" style={{ background: FOREST[5] }}>
              Continue to Restaurants
            </span>
            <span className="px-4 py-2.5 rounded-[6px] text-[13px] font-medium" style={{ color: INK, boxShadow: `inset 0 0 0 1px ${STONE[2]}` }}>
              ← Back
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-[10.5px] font-semibold tracking-[0.06em]" style={{ background: STONE[1], color: STONE[7] }}>
              ◇ ORGANIZER
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["No beef", "Vegetarian", "Lactose-free", "No pork"].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-[4px] text-[12px] font-medium" style={{ background: STONE[1], color: STONE[8] }}>
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1.5 max-w-[320px]">
            {["17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"].map((t) => {
              const on = t === "20:00" || t === "21:00";
              return (
                <span
                  key={t}
                  className="py-1.5 rounded-[5px] text-center text-[12px] tabular-nums font-medium"
                  style={on ? { background: FOREST[5], color: "#fff" } : { background: STONE[0], color: STONE[7], boxShadow: `inset 0 0 0 1px ${STONE[2]}` }}
                >
                  {t}
                </span>
              );
            })}
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: AMBER[1], color: AMBER[7] }}>
            ★ 4.8 · Pending confirmation
          </div>
        </Card>

        {/* Icons + spacing */}
        <Card className="@3xl:col-span-2" i={4}>
          <Label>Icons · Phosphor outline</Label>
          <div className="mt-4 grid grid-cols-4 gap-y-4">
            {ICONS.map(([n, d], k) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill={k === 1 ? "#e5484d" : "none"} stroke={k === 1 ? "#e5484d" : INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={d} />
                </svg>
                <span className="text-[9px]" style={{ color: STONE[5] }}>
                  {n}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t" style={{ borderColor: STONE[2] }}>
            <Label>Spacing · 8px grid</Label>
            <div className="mt-3 space-y-1.5">
              {[4, 8, 16, 24, 32, 48, 64].map((v) => (
                <div key={v} className="flex items-center gap-2">
                  <span className="w-7 text-right text-[9px] tabular-nums" style={{ color: STONE[5] }}>
                    {v}
                  </span>
                  <span className="h-[7px] rounded-full" style={{ width: v * 1.6, background: FOREST[5] }} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
