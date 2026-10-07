// src/components/windows/Stickies/StickiesWindow.jsx
// Draggable sticky notes, saved in this browser.
import { useRef } from "react";
import { AnimatePresence, motion, useDragControls, useMotionValue } from "framer-motion";
import useLocalState from "../../../hooks/useLocalState";

const COLORS = [
  { id: "yellow", bg: "#fff59a", bar: "#f5e663" },
  { id: "blue", bg: "#b9e6ff", bar: "#9ad6f7" },
  { id: "green", bg: "#c8f7a8", bar: "#acec85" },
  { id: "pink", bg: "#ffc8e4", bar: "#ffaed6" },
  { id: "purple", bg: "#ddd0ff", bar: "#c9b8ff" },
  { id: "gray", bg: "#eeeeee", bar: "#dddddd" },
];
const colorOf = (id) => COLORS.find((c) => c.id === id) ?? COLORS[0];

const SEED = [
  { id: "s1", x: 40, y: 36, color: "yellow", rot: -2, text: "Hi! 👋 Leave yourself a note here.\n\nDrag me by the top bar, change my color, or make a new one with ＋" },
  { id: "s2", x: 300, y: 70, color: "pink", rot: 2, text: "Ideas to try:\n• play tetris in Terminal\n• take a selfie in Photo Booth\n• ask Marta a question in Messages" },
  { id: "s3", x: 120, y: 280, color: "blue", rot: 1, text: "Notes are saved in this browser only 🔒" },
];

function Sticky({ note, bounds, onChange, onDelete, onFront }) {
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const c = colorOf(note.color);

  return (
    <motion.div
      className="absolute w-[220px] h-[200px] flex flex-col shadow-[0_8px_18px_rgba(0,0,0,0.22)]"
      style={{ left: note.x, top: note.y, x, y, background: c.bg, rotate: note.rot ?? 0, zIndex: note.z ?? 1 }}
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.15 } }}
      whileDrag={{ scale: 1.04, boxShadow: "0 18px 36px rgba(0,0,0,0.3)" }}
      onDragEnd={() => {
        onChange({ x: note.x + x.get(), y: note.y + y.get() });
        x.set(0);
        y.set(0);
      }}
      onPointerDown={onFront}
    >
      {/* top bar: drag handle + delete + colors */}
      <div
        className="group h-[22px] shrink-0 flex items-center justify-between px-1.5 cursor-grab active:cursor-grabbing touch-none"
        style={{ background: c.bar }}
        onPointerDown={(e) => {
          if (!e.target.closest("button")) controls.start(e);
        }}
      >
        <button onClick={onDelete} className="w-3.5 h-3.5 rounded-[3px] border border-black/25 text-[9px] leading-none text-black/60 opacity-0 group-hover:opacity-100" aria-label="Delete note" title="Delete">
          ✕
        </button>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          {COLORS.map((col) => (
            <button
              key={col.id}
              onClick={() => onChange({ color: col.id })}
              className={`w-3 h-3 rounded-full border ${note.color === col.id ? "border-black/60" : "border-black/15"}`}
              style={{ background: col.bg }}
              aria-label={`Make note ${col.id}`}
            />
          ))}
        </div>
      </div>

      <textarea
        value={note.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Write something…"
        className="flex-1 w-full resize-none bg-transparent outline-none px-3 py-2 text-[14px] leading-snug text-black/80 placeholder:text-black/35"
        style={{ fontFamily: '"Marker Felt", "Chalkboard SE", "Comic Sans MS", cursive' }}
      />
    </motion.div>
  );
}

export default function StickiesWindow() {
  const [notes, setNotes] = useLocalState("portfolio.stickies", SEED);
  const boundsRef = useRef(null);
  const zTop = useRef(Math.max(1, ...notes.map((n) => n.z ?? 1)));

  const update = (id, patch) => setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, ...patch } : n)));

  function bringFront(id) {
    zTop.current += 1;
    update(id, { z: zTop.current });
  }

  function addNote() {
    zTop.current += 1;
    setNotes((ns) => [
      ...ns,
      {
        id: `s${Date.now()}`,
        x: 60 + Math.round(Math.random() * 300),
        y: 40 + Math.round(Math.random() * 200),
        color: COLORS[Math.floor(Math.random() * COLORS.length)].id,
        rot: Math.round(Math.random() * 6 - 3),
        text: "",
        z: zTop.current,
      },
    ]);
  }

  return (
    <div className="no-darkwin relative h-full flex flex-col">
      <div className="h-10 shrink-0 px-3 flex items-center gap-2 bg-[#ececec] border-b border-black/10 text-black/75">
        <button onClick={addNote} className="px-3 py-1 rounded-md bg-white border border-black/10 text-[13px] hover:bg-black/5">
          ＋ New note
        </button>
        <button onClick={() => setNotes(SEED)} className="px-3 py-1 rounded-md text-[13px] hover:bg-black/5" title="Restore the example notes">
          Reset
        </button>
        <span className="ml-auto text-[12px] text-black/45">{notes.length} notes · saved in this browser</span>
      </div>

      <div
        ref={boundsRef}
        className="relative flex-1 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1.5px), radial-gradient(circle at 30% 20%, #c79a64 0%, #a87a48 60%, #8e6538 100%)",
          backgroundSize: "7px 7px, 100% 100%",
        }}
      >
        <AnimatePresence>
          {notes.map((n) => (
            <Sticky
              key={n.id}
              note={n}
              bounds={boundsRef}
              onChange={(patch) => update(n.id, patch)}
              onDelete={() => setNotes((ns) => ns.filter((x) => x.id !== n.id))}
              onFront={() => bringFront(n.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
