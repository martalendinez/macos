// src/components/windows/Figma/ProjectFigmaFile.jsx
// A project design file (one per case study): pages, frames, Marta's review comments, and Dev Mode
// links from screens to their real source files in VS Code. Page data lives in figmaProjects.jsx.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { openWorkspace } from "../../../config/workspaceBus";
import { WORKSPACE_PROJECTS } from "../../../config/projectWorkspaces";
import { FIGMA_FILES } from "./figmaProjects";

const BLUE = "#0d99ff";
function bounds(frames) {
  const xs = frames.flatMap((f) => [f.x, f.x + f.w]);
  const ys = frames.flatMap((f) => [f.y - 24, f.y + f.h]);
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
}

export default function ProjectFigmaFile({ project, dark, onOpenWindow }) {
  const file = FIGMA_FILES[project];
  const PAGES = file.pages;
  const [pageId, setPageId] = useState(file.startPage);
  const page = PAGES.find((p) => p.id === pageId) || PAGES[0];
  const [sel, setSel] = useState(null);
  const [mode, setMode] = useState("design"); // design | dev
  const [openComment, setOpenComment] = useState(null);
  const [view, setView] = useState({ x: 40, y: 40, z: 0.5 });
  const canvas = useRef(null);
  const drag = useRef(null);

  const fit = () => {
    const el = canvas.current;
    if (!el) return;
    const b = bounds(page.frames);
    const W = el.clientWidth;
    const H = el.clientHeight;
    const z = Math.min(1, (W - 80) / b.w, (H - 80) / b.h);
    setView({ z, x: (W - b.w * z) / 2 - b.x * z, y: (H - b.h * z) / 2 - b.y * z });
  };
  useLayoutEffect(fit, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const ro = new ResizeObserver(() => fit());
    if (canvas.current) ro.observe(canvas.current);
    return () => ro.disconnect();
  }, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onWheel = (e) => {
    const r = canvas.current.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    if (e.ctrlKey || e.metaKey) {
      const z = Math.max(0.1, Math.min(3, view.z * (1 - e.deltaY * 0.01)));
      setView((v) => ({ z, x: mx - ((mx - v.x) / v.z) * z, y: my - ((my - v.y) / v.z) * z }));
    } else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
  };
  const zoomBy = (f) => {
    const el = canvas.current;
    const mx = el.clientWidth / 2;
    const my = el.clientHeight / 2;
    setView((v) => {
      const z = Math.max(0.1, Math.min(3, v.z * f));
      return { z, x: mx - ((mx - v.x) / v.z) * z, y: my - ((my - v.y) / v.z) * z };
    });
  };

  const frame = page.frames.find((f) => f.id === sel);
  const ui = dark
    ? { panel: "bg-[#2c2c2c] border-[#444] text-white/90", sub: "text-white/50", canvas: "#1e1e1e", hover: "hover:bg-white/[0.06]", selBg: "bg-[#0d99ff]/25" }
    : { panel: "bg-white border-[#e6e6e6] text-[#1e1e1e]", sub: "text-black/45", canvas: "#f5f5f5", hover: "hover:bg-black/[0.04]", selBg: "bg-[#0d99ff]/15" };

  const openCode = (path) => {
    openWorkspace("vscode", { project, file: path });
    onOpenWindow?.("vscode");
  };

  return (
    <div className="relative flex-1 min-h-0 flex">
      {/* pages + layers */}
      <aside className={`w-[220px] shrink-0 border-r flex-col hidden @2xl:flex ${ui.panel}`}>
        <div className={`px-3 h-10 flex items-center text-[11px] font-semibold border-b ${dark ? "border-[#444]" : "border-[#e6e6e6]"}`}>Pages</div>
        <div className="py-1">
          {PAGES.map((p) => (
            <button key={p.id} type="button" onClick={() => { setPageId(p.id); setSel(null); setOpenComment(null); }} className={`w-full text-left px-3 h-7 text-[11.5px] flex items-center gap-2 ${p.id === pageId ? "font-semibold" : ui.hover}`}>
              <span className="w-3">{p.id === pageId ? "✓" : ""}</span>
              {p.name}
            </button>
          ))}
        </div>
        <div className={`px-3 h-10 flex items-center text-[11px] font-semibold border-y ${dark ? "border-[#444]" : "border-[#e6e6e6]"}`}>Layers</div>
        <div className="flex-1 overflow-y-auto py-1">
          {page.frames.map((f) => (
            <button key={f.id} type="button" onClick={() => setSel(f.id)} className={`w-full text-left px-3 h-7 text-[11.5px] flex items-center gap-2 truncate ${sel === f.id ? ui.selBg : ui.hover}`}>
              <span className={ui.sub}>#</span>
              <span className="truncate">{f.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* canvas */}
      <div
        ref={canvas}
        className="relative flex-1 min-w-0 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ background: ui.canvas }}
        onWheel={onWheel}
        onPointerDown={(e) => {
          if (e.target === canvas.current) {
            setSel(null);
            setOpenComment(null);
          }
          drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !(e.buttons & 1)) return;
          setView((v) => ({ ...v, x: drag.current.vx + e.clientX - drag.current.x, y: drag.current.vy + e.clientY - drag.current.y }));
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})` }}>
          {page.frames.map((f) => (
            <div key={f.id} className="absolute" style={{ left: f.x, top: f.y, width: f.w, height: f.h }}>
              <div className={`absolute -top-6 left-0 text-[12px] whitespace-nowrap ${sel === f.id ? "text-[#0d99ff] font-semibold" : ui.sub}`} style={{ fontSize: 12 / Math.max(view.z, 0.35) * 0.9 }}>
                {f.name}
              </div>
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSel(f.id);
                  setOpenComment(null);
                }}
                className="absolute inset-0 overflow-hidden"
                style={{ background: f.bg, outline: sel === f.id ? `${2 / view.z}px solid ${BLUE}` : "none" }}
              >
                {f.render()}
              </div>
              {mode === "dev" && f.code && (
                <div className="absolute -bottom-9 left-0 text-[12px] font-mono rounded-[4px] px-2 py-1 bg-[#0d99ff] text-white whitespace-nowrap" style={{ transform: `scale(${1 / Math.max(view.z, 0.5)})`, transformOrigin: "top left" }}>
                  {"</>"} {f.code.split("/").pop()}
                </div>
              )}
            </div>
          ))}
          {mode === "design" &&
            page.comments.map((cm, i) => (
              <button
                key={i}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setOpenComment(openComment === i ? null : i)}
                className="absolute flex items-center justify-center rounded-full rounded-bl-none text-white text-[11px] font-bold shadow-lg"
                style={{ left: cm.x, top: cm.y, width: 30 / view.z, height: 30 / view.z, fontSize: 11 / view.z, background: cm.resolved ? "#6b6b6b" : "#ff375f", border: `${2 / view.z}px solid #fff` }}
                aria-label={`Comment ${i + 1}`}
              >
                ML
              </button>
            ))}
        </div>

        {/* open comment thread (screen space) */}
        <AnimatePresence>
          {openComment != null && page.comments[openComment] && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-10 w-[280px] rounded-[10px] bg-white text-[#1e1e1e] shadow-2xl p-3 text-[12.5px] leading-snug"
              style={{ left: Math.min(view.x + page.comments[openComment].x * view.z + 26, (canvas.current?.clientWidth ?? 600) - 300), top: Math.max(8, view.y + page.comments[openComment].y * view.z) }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#ff375f] text-white text-[10px] font-bold flex items-center justify-center">ML</span>
                <span className="font-semibold">Marta</span>
                {page.comments[openComment].resolved && <span className="ml-auto text-[10.5px] rounded-full bg-[#e8f8ec] text-[#1a7f37] px-2 py-0.5 font-semibold">✓ Resolved</span>}
              </div>
              <p className="mt-2">{page.comments[openComment].text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* zoom controls */}
        <div className={`absolute right-3 bottom-3 flex items-center gap-1 rounded-[8px] px-1 py-1 text-[11px] shadow ${ui.panel}`} onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => zoomBy(1 / 1.25)} className={`w-6 h-6 rounded ${ui.hover}`} aria-label="Zoom out">−</button>
          <button type="button" onClick={fit} className={`px-1.5 h-6 rounded tabular-nums ${ui.hover}`}>{Math.round(view.z * 100)}%</button>
          <button type="button" onClick={() => zoomBy(1.25)} className={`w-6 h-6 rounded ${ui.hover}`} aria-label="Zoom in">+</button>
        </div>
      </div>

      {/* right panel: design / dev mode */}
      <aside className={`w-[240px] shrink-0 border-l flex-col hidden @3xl:flex ${ui.panel}`}>
        <div className={`flex items-center gap-1 px-2 h-10 border-b ${dark ? "border-[#444]" : "border-[#e6e6e6]"}`}>
          {[
            ["design", "Design"],
            ["dev", "Dev Mode"],
          ].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setMode(k)} className={`px-2 h-7 rounded-md text-[11.5px] font-semibold ${mode === k ? (k === "dev" ? "bg-[#0d99ff] text-white" : dark ? "bg-white/10" : "bg-black/[0.06]") : ui.sub}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-3 text-[12px]">
          {mode === "design" ? (
            <>
              <div className={`text-[11px] font-semibold ${ui.sub}`}>{frame ? frame.name : page.name}</div>
              {frame && (
                <div className="mt-2 grid grid-cols-2 gap-1.5 tabular-nums">
                  {[["W", frame.w], ["H", frame.h], ["X", frame.x], ["Y", frame.y]].map(([k, v]) => (
                    <div key={k} className={`rounded-md px-2 h-7 flex items-center gap-1.5 ${dark ? "bg-white/[0.06]" : "bg-black/[0.035]"}`}>
                      <span className={ui.sub}>{k}</span> {v}
                    </div>
                  ))}
                </div>
              )}
              <div className={`mt-4 text-[11px] font-semibold ${ui.sub}`}>Comments on this page</div>
              <div className="mt-2 space-y-2">
                {page.comments.length === 0 && <div className={ui.sub}>None.</div>}
                {page.comments.map((cm, i) => (
                  <button key={i} type="button" onClick={() => setOpenComment(i)} className={`w-full text-left rounded-[8px] p-2 leading-snug ${ui.hover}`}>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-4 h-4 rounded-full text-white text-[8px] flex items-center justify-center" style={{ background: cm.resolved ? "#6b6b6b" : "#ff375f" }}>ML</span>
                      Marta {cm.resolved && <span className={`font-normal ${ui.sub}`}>· resolved</span>}
                    </span>
                    <span className={`block mt-1 line-clamp-3 ${ui.sub}`}>{cm.text}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="rounded-[8px] p-2.5 bg-[#0d99ff]/10 leading-snug">
                <span className="font-semibold text-[#0d99ff]">Dev Mode</span>
                <span className={`block mt-1 ${ui.sub}`}>{file.devIntro}</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {page.frames.filter((f) => f.code).map((f) => (
                  <button key={f.id} type="button" onClick={() => { setSel(f.id); openCode(f.code); }} className={`w-full text-left rounded-[8px] p-2 ${sel === f.id ? ui.selBg : ui.hover}`}>
                    <span className="block font-semibold">{f.name}</span>
                    <span className="block font-mono text-[11px] text-[#0d99ff] truncate">{f.code}</span>
                  </button>
                ))}
                {(file.devFiles || []).map(([label, path]) => (
                  <button key={path} type="button" onClick={() => openCode(path)} className={`w-full text-left rounded-[8px] p-2 ${ui.hover}`}>
                    <span className="block font-semibold">{label}</span>
                    <span className="block font-mono text-[11px] text-[#0d99ff] truncate">{path}</span>
                  </button>
                ))}
                {!page.frames.some((f) => f.code) && file.devHint && <div className={`pt-1 ${ui.sub}`}>{file.devHint}</div>}
              </div>
            </>
          )}
        </div>
        <div className={`p-3 border-t ${dark ? "border-[#444]" : "border-[#e6e6e6]"}`}>
          <button type="button" onClick={() => onOpenWindow?.(WORKSPACE_PROJECTS[project].caseStudy)} className="text-[11.5px] font-semibold text-[#0d99ff]">← Back to the case study</button>
        </div>
      </aside>
    </div>
  );
}
