// src/components/windows/Trash/TrashWindow.jsx
// The Trash, with a personality: every designer's deleted regrets. Click a file to read its story.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FILES = [
  { name: "final_final_v7_REAL.fig", kind: "fig", size: "48 MB", note: "There was a v8. There is always a v8." },
  { name: "Comic Sans.ttf", kind: "font", size: "120 KB", note: "Deleted for everyone’s safety. You’re welcome." },
  { name: "lorem ipsum.txt", kind: "txt", size: "2 KB", note: "Dolor sit amet… real copy arrived 2 days before launch." },
  { name: "make the logo bigger.pdf", kind: "pdf", size: "1 KB", note: "Client feedback, round 14. It was already big." },
  { name: "spaghetti_code.js", kind: "js", size: "640 KB", note: "It worked. Nobody knew why. Refactored with love 🍝" },
  { name: "dark mode (2 hours).mov", kind: "mov", size: "3 GB", note: "“Can we just add dark mode?” Famous last words." },
  { name: "TODO_tomorrow.txt", kind: "txt", size: "4 KB", note: "Written yesterday. And the day before. And… 🙈" },
  { name: "paella_receta_secreta.pdf", kind: "pdf", size: "89 KB", note: "¡Ups! This one should NOT be in the trash. Restoring… 🥘" },
];

const TINT = { fig: "#a259ff", font: "#ff9f0a", txt: "#8e8e93", pdf: "#ff3b30", js: "#e8c400", mov: "#0a84ff" };
const EXT = { fig: "FIG", font: "TTF", txt: "TXT", pdf: "PDF", js: "JS", mov: "MOV" };

function FileIcon({ kind }) {
  return (
    <span className="relative w-12 h-14 rounded-[6px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] ring-1 ring-black/5 flex items-end justify-center pb-1.5">
      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#e8e8ec] rounded-bl-[4px]" />
      <span className="text-[9px] font-bold text-white rounded-[3px] px-1" style={{ background: TINT[kind] }}>
        {EXT[kind]}
      </span>
    </span>
  );
}

export default function TrashWindow({ theme = "light" }) {
  const dark = theme === "dark";
  const [items, setItems] = useState(FILES);
  const [sel, setSel] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [emptied, setEmptied] = useState(false);
  const file = items.find((f) => f.name === sel);

  const empty = () => {
    setConfirm(false);
    setSel(null);
    setItems([]);
    setEmptied(true);
  };

  return (
    <div className={`@container h-full flex flex-col ${dark ? "bg-[#1e1e20] text-white" : "bg-white text-[#1d1d1f]"}`}>
      <div className={`shrink-0 flex items-center gap-3 px-4 h-11 border-b text-[13px] ${dark ? "border-white/10 bg-white/[0.03]" : "border-black/[0.06] bg-[#f6f6f8]"}`}>
        <span className="font-semibold">Trash</span>
        <span className={dark ? "text-white/45" : "text-black/45"}>{items.length} items</span>
        <button
          type="button"
          disabled={!items.length}
          onClick={() => setConfirm(true)}
          className={`ml-auto px-3 py-1 rounded-md text-[12px] font-medium disabled:opacity-40 ${dark ? "bg-white/10 hover:bg-white/15" : "bg-black/[0.05] hover:bg-black/[0.08]"}`}
        >
          Empty
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex">
        <div className="flex-1 overflow-y-auto p-5" onClick={() => setSel(null)}>
          {emptied ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2">
              <span className="text-[44px]">🧹</span>
              <div className="text-[15px] font-semibold">Trash emptied</div>
              <p className={`text-[13px] max-w-[260px] ${dark ? "text-white/55" : "text-black/50"}`}>So clean. So minimal. Dieter Rams would be proud.</p>
              <button type="button" onClick={() => { setItems(FILES); setEmptied(false); }} className="mt-2 text-[12.5px] font-semibold text-[#0a84ff] hover:underline">
                Put everything back (I’m a hoarder)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 @lg:grid-cols-4 gap-x-3 gap-y-5">
              {items.map((f, i) => (
                <motion.button
                  key={f.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSel(f.name);
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col items-center gap-1.5 outline-none"
                >
                  <FileIcon kind={f.kind} />
                  <span className={`text-[11.5px] leading-tight text-center px-1.5 py-0.5 rounded-[4px] max-w-[110px] break-words ${sel === f.name ? "bg-[#0a84ff] text-white" : ""}`}>{f.name}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {file && (
            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              className={`w-[230px] shrink-0 border-l p-5 flex flex-col items-center text-center ${dark ? "border-white/10 bg-white/[0.03]" : "border-black/[0.06] bg-[#fafafb]"}`}
            >
              <FileIcon kind={file.kind} />
              <div className="mt-3 text-[13px] font-semibold break-words">{file.name}</div>
              <div className={`text-[11.5px] ${dark ? "text-white/45" : "text-black/45"}`}>{file.size} · in Trash</div>
              <p className="mt-4 text-[13px] leading-snug">{file.note}</p>
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {confirm && (
            <motion.div className="absolute inset-0 z-10 flex items-center justify-center bg-black/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} className={`w-[280px] rounded-[14px] p-5 text-center shadow-2xl ${dark ? "bg-[#2c2c2e]" : "bg-white"}`}>
                <div className="text-[32px]">🥲</div>
                <div className="mt-1 text-[14px] font-semibold">Empty the Trash?</div>
                <p className={`mt-1 text-[12.5px] ${dark ? "text-white/60" : "text-black/55"}`}>These are my memories. Also, my mistakes. Mostly mistakes.</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setConfirm(false)} className={`flex-1 py-1.5 rounded-lg text-[13px] font-medium ${dark ? "bg-white/10" : "bg-black/[0.06]"}`}>
                    Keep them
                  </button>
                  <button type="button" onClick={empty} className="flex-1 py-1.5 rounded-lg text-[13px] font-semibold text-white bg-[#ff3b30]">
                    Empty
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
