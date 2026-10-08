// src/components/windows/Notes/NotesWindow.jsx
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PINNED_NOTES } from "./notesData";
import useLocalState from "../../../hooks/useLocalState";

const YELLOW = "#e5b700";

function NoteBody({ blocks, isDark }) {
  return (
    <div className="space-y-3 text-[15px] leading-relaxed">
      {blocks.map((b, i) => {
        if (b.h) return <h2 key={i} className={`${i === 0 ? "text-[24px]" : "text-[17px] pt-2"} font-bold`}>{b.h}</h2>;
        if (b.p) return <p key={i}>{b.p}</p>;
        if (b.quote)
          return (
            <blockquote key={i} className="border-l-[3px] pl-4 italic opacity-90" style={{ borderColor: YELLOW }}>
              “{b.quote}”
            </blockquote>
          );
        if (b.ul)
          return (
            <ul key={i} className="list-disc pl-6 space-y-1">
              {b.ul.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          );
        if (b.check)
          return (
            <ul key={i} className="space-y-1.5">
              {b.check.map(([t, done]) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span
                    className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center text-[11px] ${
                      done ? "text-white border-transparent" : isDark ? "border-white/30" : "border-black/25"
                    }`}
                    style={done ? { background: YELLOW } : undefined}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <span className={done ? "" : "opacity-70"}>{t}</span>
                </li>
              ))}
            </ul>
          );
        return null;
      })}
    </div>
  );
}

// Defined at module level so it isn't remounted on every render (which swallowed clicks)
function NoteRow({ id, title, preview, meta, selected, onSelect, isDark, rowActive, sub }) {
  const active = selected === id;
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full text-left rounded-lg px-3 py-2 ${active ? rowActive : isDark ? "hover:bg-white/5" : "hover:bg-black/[0.04]"}`}
    >
      <div className="text-[13px] font-semibold truncate">{title || "New Note"}</div>
      <div className={`text-[12px] truncate ${active ? "opacity-75" : sub}`}>
        {meta && <span className="mr-1.5 font-medium">{meta}</span>}
        {preview || "No additional text"}
      </div>
    </button>
  );
}

function timeLabel(ts) {
  const d = new Date(ts);
  const today = new Date().toDateString() === d.toDateString();
  return today
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function NotesWindow({ theme = "light" }) {
  const isDark = theme === "dark";
  const [mine, setMine] = useLocalState("portfolio.notes", []); // { id, text, updated }
  const [selected, setSelected] = useState(PINNED_NOTES[0].id);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const pinned = useMemo(
    () => PINNED_NOTES.filter((n) => !q || JSON.stringify(n).toLowerCase().includes(q)),
    [q]
  );
  const own = useMemo(
    () => [...mine].sort((a, b) => b.updated - a.updated).filter((n) => !q || n.text.toLowerCase().includes(q)),
    [mine, q]
  );

  // narrow windows / phones show one pane at a time: the list, or the open note
  const [narrowView, setNarrowView] = useState("list");
  const select = (id) => {
    setSelected(id);
    setNarrowView("note");
  };

  const pinnedNote = PINNED_NOTES.find((n) => n.id === selected);
  const myNote = mine.find((n) => n.id === selected);

  function newNote() {
    const n = { id: `n${Date.now()}`, text: "", updated: Date.now() };
    setMine((m) => [n, ...m]);
    setSelected(n.id);
    setNarrowView("note");
    setQuery("");
  }

  function updateNote(text) {
    setMine((m) => m.map((n) => (n.id === selected ? { ...n, text, updated: Date.now() } : n)));
  }

  function deleteNote() {
    setMine((m) => m.filter((n) => n.id !== selected));
    setSelected(PINNED_NOTES[0].id);
    setNarrowView("list");
  }

  const side = isDark ? "bg-[#232325] border-white/10" : "bg-[#f6f5f2] border-black/10";
  const main = isDark ? "bg-[#1c1c1e] text-white/90" : "bg-white text-black/85";
  const rowActive = isDark ? "bg-[#7a6200]/70" : "bg-[#ffe27a]";
  const sub = isDark ? "text-white/45" : "text-black/45";
  const rowProps = { selected, onSelect: select, isDark, rowActive, sub };
  const toolBtn = `w-8 h-7 rounded-md flex items-center justify-center ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`;


  return (
    <div className={`no-darkwin h-full flex ${isDark ? "text-white" : "text-black"}`}>
      <aside className={`${narrowView === "note" ? "hidden @2xl:flex" : "flex"} w-full @2xl:w-[260px] shrink-0 border-r flex-col ${side}`}>
        <div className="p-2 flex items-center gap-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="⌕ Search"
            aria-label="Search notes"
            className={`flex-1 min-w-0 rounded-md px-2 py-1 text-[13px] outline-none ${isDark ? "bg-white/10 placeholder:text-white/40" : "bg-black/5 placeholder:text-black/40"}`}
          />
          <button onClick={newNote} className={toolBtn} title="New Note" aria-label="New note">
            <svg viewBox="0 0 20 20" className="w-[17px] h-[17px]" fill="none" stroke={YELLOW} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 3.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h10a1.5 1.5 0 0 0 1.5-1.5v-4M14.5 2.8l2.7 2.7L10 12.7l-3.4.7.7-3.4z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {pinned.length > 0 && <div className={`px-3 pt-2 pb-1 text-[11px] font-bold ${sub}`}>📌 Pinned by Marta</div>}
          {pinned.map((n) => (
            <NoteRow key={n.id} id={n.id} title={n.title} preview={n.preview} {...rowProps} />
          ))}

          <div className={`px-3 pt-4 pb-1 text-[11px] font-bold ${sub}`}>Your notes</div>
          {own.length === 0 ? (
            <button onClick={newNote} className={`w-full text-left px-3 py-2 text-[12px] ${sub} hover:underline`}>
              + Write a note (it's saved in this browser only)
            </button>
          ) : (
            <AnimatePresence initial={false}>
              {own.map((n) => {
                const [title, ...rest] = n.text.split("\n");
                return (
                  <motion.div key={n.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <NoteRow id={n.id} title={title} preview={rest.join(" ").trim()} meta={timeLabel(n.updated)} {...rowProps} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </aside>

      <main className={`${narrowView === "list" ? "hidden @2xl:flex" : "flex"} flex-1 min-w-0 flex-col ${main}`}>
        <div className={`h-10 shrink-0 px-4 flex items-center justify-between gap-2 text-[11px] ${sub}`}>
          <button onClick={() => setNarrowView("list")} className="@2xl:hidden -ml-1 flex items-center gap-0.5 text-[14px] font-medium text-[#e5b700]">
            ‹ Notes
          </button>
          <span className="truncate">{pinnedNote ? "Pinned by Marta · read-only" : myNote ? `Edited ${timeLabel(myNote.updated)}` : ""}</span>
          {myNote && (
            <button onClick={deleteNote} className={`${toolBtn} w-auto px-2`} title="Delete note">
              🗑 Delete
            </button>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-5 @2xl:px-10 pb-10">
          <AnimatePresence mode="wait">
            <motion.div key={selected} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              {pinnedNote ? (
                <NoteBody blocks={pinnedNote.blocks} isDark={isDark} />
              ) : myNote ? (
                <textarea
                  autoFocus
                  value={myNote.text}
                  onChange={(e) => updateNote(e.target.value)}
                  placeholder={"Title\nStart typing…"}
                  className="w-full h-full min-h-[300px] resize-none bg-transparent outline-none text-[15px] leading-relaxed first-line:font-bold first-line:text-[24px]"
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
