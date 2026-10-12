// src/components/windows/Projects/caseStudy/SallskapPlay.jsx
// Interactive demos for the Sällskap case study, built on the real app's data and logic
// (src/data/restaurants.json, the 17:00–23:00 slots in Availability.tsx, filterRestaurants in utils/filtering.ts).
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FOREST = "hsl(158,19%,29%)";
const AMBER = "#df8f20";
const PS = '"Public Sans", Inter, -apple-system, sans-serif';

const RESTRICTIONS = ["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free", "halal"];
const RESTAURANTS = [
  { name: "Lykke", cuisine: "Nordic Modern", price: "$$$", rating: 4.8, ok: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { name: "Kall", cuisine: "Oyster Bar", price: "$$$$", rating: 4.9, ok: ["gluten-free", "nut-free", "dairy-free"] },
  { name: "Stilla", cuisine: "Plant-Based", price: "$$", rating: 4.6, ok: ["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free", "halal"] },
  { name: "Eld", cuisine: "Open Fire", price: "$$$", rating: 4.7, ok: ["gluten-free", "dairy-free", "nut-free", "halal"] },
  { name: "Hemma", cuisine: "Swedish Home Cooking", price: "$$", rating: 4.5, ok: ["vegetarian", "nut-free"] },
];
const TIMES = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const shell = (theme) => ({
  fontFamily: PS,
  background: theme.isDark ? "rgba(255,255,255,0.04)" : "#fff",
  boxShadow: theme.isDark ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "0 0 0 1px rgba(0,0,0,0.06), 0 16px 34px -24px rgba(0,0,0,0.3)",
});

const MEMBERS = [
  { name: "Elin", role: "Organizer", init: ["vegetarian"], times: ["19:00", "20:00", "21:00"] },
  { name: "Omar", init: ["halal"], times: ["18:00", "19:00", "20:00"] },
  { name: "Sara", init: [], times: ["19:00", "20:00", "22:00"] },
];

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-medium transition"
      style={on ? { background: FOREST, color: "#fff" } : { background: "#fff", color: "rgba(0,0,0,0.55)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
    >
      {on && "✓ "}
      {children}
    </button>
  );
}

/** Each member picks dietary needs privately → only restaurants that fit everyone remain. */
export function GroupMatcher({ theme }) {
  const [needs, setNeeds] = useState(() => Object.fromEntries(MEMBERS.map((m) => [m.name, m.init])));
  const [who, setWho] = useState("Omar");
  const group = useMemo(() => [...new Set(Object.values(needs).flat())], [needs]);
  const toggle = (r) => setNeeds((n) => ({ ...n, [who]: n[who].includes(r) ? n[who].filter((x) => x !== r) : [...n[who], r] }));
  const fits = (rest) => group.every((g) => rest.ok.includes(g));
  const matches = RESTAURANTS.filter(fits);

  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[1fr_1.15fr] gap-4">
      <div className="p-5" style={shell(theme)}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">Private dietary input</div>
        <div className="mt-3 flex gap-2">
          {MEMBERS.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => setWho(m.name)}
              className="flex-1 px-2 py-2 text-left transition"
              style={who === m.name ? { background: "rgba(61,102,88,0.1)", boxShadow: `inset 0 0 0 1.5px ${FOREST}` } : { boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }}
            >
              <div className="text-[13px] font-semibold text-[#1a1a1a]">{m.name}</div>
              <div className="text-[10.5px] text-black/45">{who === m.name ? "editing (only you see this)" : `${needs[m.name].length} private`}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 text-[12px] font-semibold text-[#1a1a1a]">{who}’s restrictions</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {RESTRICTIONS.map((r) => (
            <Chip key={r} on={needs[who].includes(r)} onClick={() => toggle(r)}>
              {cap(r)}
            </Chip>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-black/[0.07] text-[11.5px] text-black/55">
          The organizer only sees the combined needs:{" "}
          <span className="font-semibold text-[#1a1a1a]">{group.length ? group.map(cap).join(", ") : "none"}</span>
        </div>
      </div>

      <div className="p-5" style={shell(theme)}>
        <div className="flex items-baseline justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">Restaurants that fit everyone</div>
          <motion.span key={matches.length} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-[12px] font-bold" style={{ color: matches.length ? FOREST : "#d0453a" }}>
            {matches.length} of {RESTAURANTS.length}
          </motion.span>
        </div>
        <div className="mt-3 space-y-1.5">
          {RESTAURANTS.map((r) => {
            const ok = fits(r);
            const missing = group.filter((g) => !r.ok.includes(g));
            return (
              <motion.div key={r.name} layout animate={{ opacity: ok ? 1 : 0.38 }} className="flex items-center gap-3 px-3 py-2" style={{ boxShadow: ok ? `inset 3px 0 0 ${FOREST}, inset 0 0 0 1px rgba(0,0,0,0.06)` : "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[#1a1a1a]">{r.name}</span>
                    <span className="text-[11px] text-black/45 truncate">
                      {r.cuisine} · {r.price}
                    </span>
                  </div>
                  {!ok && <div className="text-[10.5px] text-[#d0453a]">Not {missing.map(cap).join(", ")}</div>}
                </div>
                <span className="text-[11.5px] font-semibold" style={{ color: AMBER }}>
                  ★ {r.rating}
                </span>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-black/45 font-mono">restrictions.every(r =&gt; restaurant.accommodates(r))</p>
      </div>
    </div>
  );
}

/** Tap time slots per member → the overlap appears automatically. */
export function AvailabilityOverlap({ theme }) {
  const [slots, setSlots] = useState(() => Object.fromEntries(MEMBERS.map((m) => [m.name, m.times])));
  const toggle = (name, t) => setSlots((s) => ({ ...s, [name]: s[name].includes(t) ? s[name].filter((x) => x !== t) : [...s[name], t] }));
  const overlap = TIMES.filter((t) => MEMBERS.every((m) => slots[m.name].includes(t)));
  return (
    <div className="p-5" style={shell(theme)}>
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">Everyone’s availability · tap to change</div>
        <span className="text-[12px] font-semibold" style={{ color: overlap.length ? FOREST : "#d0453a" }}>
          {overlap.length ? `Best time: ${overlap[0]}` : "No shared time yet"}
        </span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[520px] grid gap-y-2" style={{ gridTemplateColumns: `90px repeat(${TIMES.length}, 1fr)` }}>
          <span />
          {TIMES.map((t) => (
            <span key={t} className="text-center text-[11px] font-medium tabular-nums text-black/45">
              {t}
            </span>
          ))}
          {MEMBERS.map((m) => (
            <Row key={m.name} m={m} slots={slots} toggle={toggle} overlap={overlap} />
          ))}
          <span className="text-[12px] font-bold self-center" style={{ color: FOREST }}>
            Group
          </span>
          {TIMES.map((t) => {
            const on = overlap.includes(t);
            return (
              <div key={t} className="mx-1 h-8 flex items-center justify-center text-[11px] font-bold transition" style={on ? { background: FOREST, color: "#fff" } : { background: "rgba(0,0,0,0.03)", color: "rgba(0,0,0,0.25)" }}>
                <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>}</AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-[11.5px] text-black/50">No more “does Thursday work?”: the app intersects everyone’s slots, so the organizer never has to.</p>
    </div>
  );
}

function Row({ m, slots, toggle, overlap }) {
  return (
    <>
      <span className="text-[12.5px] font-semibold text-[#1a1a1a] self-center">
        {m.name}
        {m.role && <span className="ml-1 text-[9.5px] font-medium text-black/40">org.</span>}
      </span>
      {TIMES.map((t) => {
        const on = slots[m.name].includes(t);
        return (
          <button
            key={t}
            type="button"
            onClick={() => toggle(m.name, t)}
            className="mx-1 h-8 transition active:scale-95"
            aria-label={`${m.name} ${t}`}
            style={on ? { background: overlap.includes(t) ? FOREST : "rgba(61,102,88,0.35)" } : { background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
          />
        );
      })}
    </>
  );
}

/* ---------- competitive matrix (rebuilt from the research doc) ---------- */
const PLATFORMS = ["OpenTable", "Resy", "TheFork", "Bookatable", "Quandoo"];
// 0 = missing, 1 = partial, 2 = supported
const MATRIX = [
  ["Group coordination", [0, 0, 0, 0, 0], "Shared availability and needs in one flow"],
  ["Preference collection", [0, 0, 1, 0, 1], "Dietary, ambiance, seating and time per person"],
  ["Dietary filters", [1, 0, 1, 1, 1], "Built into the matching, not just a filter"],
  ["Ambiance info", [0, 1, 0, 0, 0], "Ambiance matched to the occasion"],
  ["Personalised recommendations", [0, 0, 1, 0, 0], "Shortlist matched to the whole group"],
  ["Seating preferences", [1, 1, 0, 1, 2], "Seating built into the booking flow"],
  ["Time-slot flexibility", [0, 0, 0, 0, 0], "People share ranges, the app finds the overlap"],
];
function Mark({ v }) {
  const c = ["#d0453a", AMBER, FOREST][v];
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold" style={{ color: c, background: `${c}18` }} title={["Not supported", "Partial", "Supported"][v]}>
      {["✕", "~", "✓"][v]}
    </span>
  );
}
export function CompetitiveMatrix({ theme }) {
  const [row, setRow] = useState(null);
  return (
    <div style={shell(theme)} className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-[12.5px]" style={{ fontFamily: PS }}>
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.08em] text-black/45">
            <th className="px-4 py-3 font-semibold">Feature</th>
            {PLATFORMS.map((p) => (
              <th key={p} className="px-2 py-3 font-semibold text-center">
                {p}
              </th>
            ))}
            <th className="px-4 py-3 font-semibold text-white" style={{ background: FOREST }}>
              Sällskap
            </th>
          </tr>
        </thead>
        <tbody>
          {MATRIX.map(([f, vals, ours], i) => (
            <tr key={f} onMouseEnter={() => setRow(i)} onMouseLeave={() => setRow(null)} className="border-t border-black/[0.06] transition-colors" style={row === i ? { background: "rgba(61,102,88,0.05)" } : undefined}>
              <td className="px-4 py-2.5 font-semibold text-[#1a1a1a]">{f}</td>
              {vals.map((v, k) => (
                <td key={k} className="px-2 py-2.5 text-center">
                  <Mark v={v} />
                </td>
              ))}
              <td className="px-4 py-2.5 font-medium" style={{ background: "rgba(61,102,88,0.07)", color: FOREST }}>
                ✓ {ours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2.5 flex gap-4 text-[11px] text-black/45 border-t border-black/[0.06]">
        <span className="inline-flex items-center gap-1.5"><Mark v={2} /> supported</span>
        <span className="inline-flex items-center gap-1.5"><Mark v={1} /> partial</span>
        <span className="inline-flex items-center gap-1.5"><Mark v={0} /> missing</span>
      </div>
    </div>
  );
}

/* ---------- interview synthesis: affinity clusters ---------- */
const CLUSTERS = [
  { h: "WhatsApp is the coordination hub", c: "#3b8ef0", notes: ["Everyone uses WhatsApp polls to find availability", "The process is slow and fragmented", "One person books, then shares details back in the chat"], key: 1 },
  { h: "Groups have their own needs", c: AMBER, notes: ["Cuisine preferences must be balanced across the group", "Price matters more for groups", "Larger groups prefer set menus", "Booking usually happens about a week ahead"] },
  { h: "Gap: no group booking tools", c: "#3d6658", notes: ["Current platforms don’t support group coordination", "No way to share availability and preferences in one place"], key: "all" },
];
export function InterviewClusters({ theme }) {
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-4">
      {CLUSTERS.map((cl, i) => (
        <motion.div key={cl.h} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-4" style={{ ...shell(theme), boxShadow: `inset 0 3px 0 ${cl.c}, ${shell(theme).boxShadow}` }}>
          <div className="text-[13.5px] font-bold text-[#1a1a1a]">{cl.h}</div>
          <div className="mt-3 space-y-2">
            {cl.notes.map((n, k) => {
              const key = cl.key === "all" || cl.key === k;
              return (
                <div key={n} className="px-3 py-2 text-[12px] leading-snug transition hover:-translate-y-0.5" style={{ background: key ? `${cl.c}1f` : "rgba(0,0,0,0.035)", color: "#2a2a2a", rotate: `${[-0.6, 0.5, -0.3, 0.4][k % 4]}deg` }}>
                  {n}
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
