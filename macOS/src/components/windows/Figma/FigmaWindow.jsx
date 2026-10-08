// src/components/windows/Figma/FigmaWindow.jsx
// A small, working Figma: draw, select, move, resize, auto layout, components/instances, layers, undo.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { layout, parentOf, removeNode, sampleDoc, uid } from "./figmaDoc";

const BLUE = "#0d99ff";
const PURPLE = "#9747ff";
const SWATCHES = ["#ffffff", "#1d1d1f", "#f5f5f7", "#0a84ff", "#5e5ce6", "#30d158", "#ff9f0a", "#ff375f", "#e8f0fd", "#efeefe", "transparent"];
const TOOLS = [
  { id: "move", key: "v", label: "Move", icon: "M5 3l11 7-5 1.3L8.6 16z" },
  { id: "frame", key: "f", label: "Frame", icon: "M6 2v16M14 2v16M2 6h16M2 14h16" },
  { id: "rect", key: "r", label: "Rectangle", icon: "M4 5h12v10H4z" },
  { id: "ellipse", key: "o", label: "Ellipse", icon: "M10 4.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" },
  { id: "text", key: "t", label: "Text", icon: "M4 5h12M10 5v11" },
  { id: "hand", key: "h", label: "Hand", icon: "M7 10V5a1.3 1.3 0 0 1 2.6 0v4M9.6 9V4a1.3 1.3 0 0 1 2.6 0v5M12.2 9V5.5a1.3 1.3 0 0 1 2.6 0V12a5 5 0 0 1-5 5H9a4.5 4.5 0 0 1-3.6-1.8L3.6 12.8a1.3 1.3 0 0 1 2-1.6L7 12.6" },
];
const TYPE_ICON = { frame: "#", rect: "▭", ellipse: "○", text: "T", instance: "◈" };
const MARTA_SPOTS = [
  [420, 140],
  [260, 230],
  [520, 290],
  [160, 120],
  [600, 110],
];

function Icon({ d, className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function NumField({ label, value, onChange, ui, disabled }) {
  return (
    <label className={`flex items-center gap-1.5 rounded-md px-2 h-7 ${ui.field} ${disabled ? "opacity-40" : ""}`}>
      <span className={`text-[10px] w-3 ${ui.sub}`}>{label}</span>
      <input
        type="number"
        disabled={disabled}
        value={Math.round(value ?? 0)}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full min-w-0 bg-transparent outline-none text-[11px] tabular-nums ${ui.text}`}
      />
    </label>
  );
}

// module-level so clicks aren't lost to remounts when the window re-renders
function LayerRow({ id, depth, N, selected, setSelected, setHovered, patch, ui }) {
  const n = N[id];
  if (!n) return null;
  const isSel = selected === id;
  const purple = n.component || n.type === "instance";
  return (
    <>
      <div
        onClick={() => setSelected(id)}
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        className={`group flex items-center gap-1.5 h-7 pr-2 text-[11px] cursor-default ${isSel ? ui.sel : ui.hover} ${n.hidden ? "opacity-40" : ""}`}
        style={{ paddingLeft: 10 + depth * 14 }}
      >
        <span className="w-3 text-center text-[11px]" style={{ color: purple ? PURPLE : undefined }}>
          {n.component ? "❖" : TYPE_ICON[n.type]}
        </span>
        <span className={`flex-1 truncate ${ui.text}`} style={{ color: purple ? PURPLE : undefined, fontWeight: n.component ? 600 : 400 }}>
          {n.name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            patch(id, { hidden: !n.hidden });
          }}
          className={`opacity-0 group-hover:opacity-100 ${n.hidden ? "opacity-100" : ""} ${ui.sub}`}
          aria-label={n.hidden ? "Show layer" : "Hide layer"}
        >
          {n.hidden ? "◌" : "👁"}
        </button>
      </div>
      {n.children?.map((c) => <LayerRow key={c} id={c} depth={depth + 1} N={N} selected={selected} setSelected={setSelected} setHovered={setHovered} patch={patch} ui={ui} />)}
    </>
  );
}


export default function FigmaWindow({ theme = "light" }) {
  const dark = theme === "dark";
  const ui = dark
    ? { panel: "bg-[#2c2c2c] border-[#444]", canvas: "#1e1e1e", text: "text-white/90", sub: "text-white/50", field: "bg-white/[0.06] hover:ring-1 ring-white/15", hover: "hover:bg-white/[0.06]", sel: "bg-[#0d99ff]/25", divide: "border-[#444]" }
    : { panel: "bg-white border-[#e6e6e6]", canvas: "#f5f5f5", text: "text-[#1e1e1e]", sub: "text-black/45", field: "bg-black/[0.035] hover:ring-1 ring-black/10", hover: "hover:bg-black/[0.04]", sel: "bg-[#0d99ff]/15", divide: "border-[#e6e6e6]" };

  const [doc, setDoc] = useState(sampleDoc);
  const history = useRef([]);
  const [selected, setSelected] = useState("card");
  const [hovered, setHovered] = useState(null);
  const [tool, setTool] = useState("move");
  const [view, setView] = useState({ x: 20, y: 20, z: 1 });
  const [draft, setDraft] = useState(null); // shape being drawn
  const [panelTab, setPanelTab] = useState("layers");
  const [marta, setMarta] = useState(0);
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const drag = useRef(null);
  const spaceDown = useRef(false);

  const boxes = useMemo(() => layout(doc), [doc]);
  const N = doc.nodes;
  const sel = selected && N[selected] ? N[selected] : null;
  const selParent = selected ? parentOf(doc, selected) : null;
  const inAuto = selParent && N[selParent]?.auto;
  const instancesOf = (cid) => Object.values(N).filter((n) => n.type === "instance" && n.of === cid).length;

  // Marta's multiplayer cursor wanders around
  useEffect(() => {
    const id = setInterval(() => setMarta((m) => (m + 1) % MARTA_SPOTS.length), 3200);
    return () => clearInterval(id);
  }, []);

  function commit(next) {
    history.current = [...history.current.slice(-49), doc];
    setDoc(next);
  }
  function patch(id, p, record = true) {
    const next = { ...doc, nodes: { ...doc.nodes, [id]: { ...doc.nodes[id], ...p } } };
    if (record) commit(next);
    else setDoc(next);
  }
  function undo() {
    const prev = history.current.pop();
    if (prev) setDoc(prev);
  }

  const toWorld = (cx, cy) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: (cx - r.left - view.x) / view.z, y: (cy - r.top - view.y) / view.z };
  };

  // ---------- canvas pointer handling ----------
  function onCanvasDown(e) {
    rootRef.current?.focus();
    const panning = tool === "hand" || spaceDown.current || e.button === 1;
    if (panning) {
      drag.current = { kind: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    if (tool === "move") {
      setSelected(null);
      return;
    }
    const p = toWorld(e.clientX, e.clientY);
    if (tool === "text") {
      const id = uid("t");
      commit({ ...doc, nodes: { ...doc.nodes, [id]: { id, type: "text", name: "Text", x: p.x, y: p.y, text: "Type something", size: 16, weight: 500, color: dark ? "#ffffff" : "#1d1d1f" }, page: { ...N.page, children: [...N.page.children, id] } } });
      setSelected(id);
      setTool("move");
      return;
    }
    drag.current = { kind: "draw", sx: p.x, sy: p.y };
    setDraft({ x: p.x, y: p.y, w: 0, h: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onNodeDown(e, id) {
    if (tool !== "move" || spaceDown.current) return;
    e.stopPropagation();
    rootRef.current?.focus();
    setSelected(id);
    const parent = parentOf(doc, id);
    const movable = !(parent && N[parent]?.auto);
    if (!movable) return;
    history.current = [...history.current.slice(-49), doc];
    drag.current = { kind: "move", id, sx: e.clientX, sy: e.clientY, ox: N[id].x ?? 0, oy: N[id].y ?? 0 };
    canvasRef.current.setPointerCapture(e.pointerId);
  }

  function onHandleDown(e, corner) {
    e.stopPropagation();
    history.current = [...history.current.slice(-49), doc];
    const n = N[selected];
    drag.current = { kind: "resize", id: selected, corner, sx: e.clientX, sy: e.clientY, o: { x: n.x ?? 0, y: n.y ?? 0, w: n.w ?? 100, h: n.h ?? 100 } };
    canvasRef.current.setPointerCapture(e.pointerId);
  }

  function onMove(e) {
    const d = drag.current;
    if (!d) return;
    if (d.kind === "pan") return setView((v) => ({ ...v, x: d.vx + e.clientX - d.sx, y: d.vy + e.clientY - d.sy }));
    const dx = (e.clientX - d.sx) / view.z;
    const dy = (e.clientY - d.sy) / view.z;
    if (d.kind === "move") return patch(d.id, { x: Math.round(d.ox + dx), y: Math.round(d.oy + dy) }, false);
    if (d.kind === "resize") {
      const { o, corner } = d;
      const np = { ...o };
      if (corner.includes("e")) np.w = Math.max(8, o.w + dx);
      if (corner.includes("s")) np.h = Math.max(8, o.h + dy);
      if (corner.includes("w")) {
        np.w = Math.max(8, o.w - dx);
        np.x = o.x + o.w - np.w;
      }
      if (corner.includes("n")) {
        np.h = Math.max(8, o.h - dy);
        np.y = o.y + o.h - np.h;
      }
      if (e.shiftKey) np.h = np.w; // keep it square
      return patch(d.id, { x: Math.round(np.x), y: Math.round(np.y), w: Math.round(np.w), h: Math.round(np.h) }, false);
    }
    if (d.kind === "draw") {
      const p = toWorld(e.clientX, e.clientY);
      setDraft({ x: Math.min(d.sx, p.x), y: Math.min(d.sy, p.y), w: Math.abs(p.x - d.sx), h: Math.abs(p.y - d.sy) });
    }
  }

  function onUp() {
    const d = drag.current;
    drag.current = null;
    if (d?.kind === "draw" && draft) {
      const w = draft.w < 4 ? 100 : draft.w;
      const h = draft.h < 4 ? 100 : draft.h;
      const id = uid(tool[0]);
      const base = { id, x: Math.round(draft.x), y: Math.round(draft.y), w: Math.round(w), h: Math.round(h) };
      const node =
        tool === "frame"
          ? { ...base, type: "frame", name: `Frame ${id.slice(1)}`, fill: "#ffffff", radius: 0, children: [] }
          : tool === "ellipse"
          ? { ...base, type: "ellipse", name: `Ellipse ${id.slice(1)}`, fill: "#5e5ce6" }
          : { ...base, type: "rect", name: `Rectangle ${id.slice(1)}`, fill: "#d9d9d9", radius: 0 };
      commit({ ...doc, nodes: { ...doc.nodes, [id]: node, page: { ...N.page, children: [...N.page.children, id] } } });
      setSelected(id);
      setTool("move");
      setDraft(null);
    }
  }

  function onWheel(e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const r = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      setView((v) => {
        const z = Math.min(4, Math.max(0.25, v.z * (1 - e.deltaY * 0.01)));
        return { z, x: mx - ((mx - v.x) / v.z) * z, y: my - ((my - v.y) / v.z) * z };
      });
    } else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
  }
  // wheel must be non-passive to preventDefault
  useEffect(() => {
    const el = canvasRef.current;
    const h = (e) => onWheel(e);
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  });

  function onKeyDown(e) {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === "z") {
      e.preventDefault();
      return undo();
    }
    if (e.key === " ") {
      spaceDown.current = true;
      e.preventDefault();
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && selected && selected !== "page") {
      e.preventDefault();
      commit(removeNode(doc, selected));
      setSelected(null);
      return;
    }
    if (e.key === "Escape") return setSelected(null);
    const t = TOOLS.find((x) => x.key === k);
    if (t && !e.metaKey && !e.ctrlKey) setTool(t.id);
  }

  function insertInstance() {
    const id = uid("i");
    commit({ ...doc, nodes: { ...doc.nodes, [id]: { id, type: "instance", name: "Button", of: "btnMain", x: 470 + Math.round(Math.random() * 60), y: 320 + Math.round(Math.random() * 40) }, page: { ...N.page, children: [...N.page.children, id] } } });
    setSelected(id);
  }

  // ---------- render helpers ----------
  const S = (b) => ({ left: b.x * view.z + view.x, top: b.y * view.z + view.y, width: b.w * view.z, height: b.h * view.z });
  const selBox = selected ? boxes[selected] : null;
  const hovBox = hovered && hovered !== selected ? boxes[hovered] : null;
  const resizable = sel && !inAuto && (sel.type === "rect" || sel.type === "ellipse" || (sel.type === "frame" && !sel.auto));
  const topFrames = N.page.children.filter((c) => (N[c]?.type === "frame" || N[c]?.type === "instance") && boxes[c]);

  const renderNode = (key) => {
    const b = boxes[key];
    const n = b.node;
    const ownerId = b.instance ?? key; // clicks inside an instance select the instance
    const base = {
      position: "absolute",
      left: b.x,
      top: b.y,
      width: b.w,
      height: b.h,
      opacity: n.opacity ?? 1,
    };
    if (n.type === "instance") return null;
    if (n.type === "text")
      return (
        <div
          key={key}
          onPointerDown={(e) => onNodeDown(e, ownerId)}
          onPointerEnter={() => setHovered(ownerId)}
          onPointerLeave={() => setHovered(null)}
          style={{ ...base, fontSize: n.size, fontWeight: n.weight, color: n.color, lineHeight: 1.3, whiteSpace: "nowrap", fontFamily: '-apple-system, "Inter", sans-serif' }}
        >
          {n.text}
        </div>
      );
    return (
      <div
        key={key}
        onPointerDown={(e) => onNodeDown(e, ownerId)}
        onPointerEnter={() => setHovered(ownerId)}
        onPointerLeave={() => setHovered(null)}
        style={{
          ...base,
          background: n.fill,
          borderRadius: n.type === "ellipse" ? "50%" : n.radius ?? 0,
          boxShadow: n.type === "frame" && b.parent === "page" && n.fill !== "transparent" ? "0 1px 3px rgba(0,0,0,0.08)" : undefined,
        }}
      />
    );
  };

  const selName = sel?.type === "instance" ? "Instance" : sel?.component ? "Main component" : sel ? sel.type[0].toUpperCase() + sel.type.slice(1) : "";

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onKeyUp={(e) => e.key === " " && (spaceDown.current = false)}
      className={`no-darkwin h-full w-full flex flex-col outline-none select-none ${ui.text}`}
      style={{ fontFamily: '-apple-system, "Inter", sans-serif' }}
    >
      {/* top toolbar */}
      <div className="h-11 shrink-0 flex items-center gap-1 px-2 bg-[#2c2c2c] text-white">
        <div className="flex items-center gap-0.5">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={`${t.label} (${t.key.toUpperCase()})`}
              aria-label={t.label}
              className={`w-8 h-8 rounded-md flex items-center justify-center ${tool === t.id ? "bg-[#0d99ff]" : "hover:bg-white/10"}`}
            >
              <Icon d={t.icon} />
            </button>
          ))}
          <div className="w-px h-5 bg-white/15 mx-1" />
          <button onClick={insertInstance} title="Insert Button instance" aria-label="Insert component instance" className="h-8 px-2 rounded-md flex items-center gap-1.5 hover:bg-white/10 text-[11px]" style={{ color: "#c7a6ff" }}>
            ❖ <span className="hidden @2xl:inline">Button</span>
          </button>
        </div>
        <div className="flex-1 text-center text-[12px] truncate">
          <span className="text-white/50">Drafts / </span>Fund dashboard <span className="text-white/40">· sample file</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            <span className="w-6 h-6 rounded-full bg-[#ff375f] ring-2 ring-[#2c2c2c] text-[10px] font-bold flex items-center justify-center">M</span>
            <span className="w-6 h-6 rounded-full bg-[#0d99ff] ring-2 ring-[#2c2c2c] text-[10px] font-bold flex items-center justify-center">Y</span>
          </div>
          <button onClick={undo} title="Undo (⌘Z)" className="hidden @lg:block h-7 px-2 rounded-md hover:bg-white/10 text-[11px]">
            ↶ Undo
          </button>
          <span className="text-[11px] text-white/60 tabular-nums w-10 text-right">{Math.round(view.z * 100)}%</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* left: layers / assets */}
        <aside className={`w-[220px] shrink-0 border-r flex-col hidden @2xl:flex ${ui.panel}`}>
          <div className={`flex gap-3 px-3 h-10 items-center border-b text-[11px] font-semibold ${ui.divide}`}>
            {["layers", "assets"].map((k) => (
              <button key={k} onClick={() => setPanelTab(k)} className={panelTab === k ? ui.text : ui.sub}>
                {k === "layers" ? "Layers" : "Assets"}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {panelTab === "layers" ? (
              N.page.children.map((c) => <LayerRow key={c} id={c} depth={0} N={N} selected={selected} setSelected={setSelected} setHovered={setHovered} patch={patch} ui={ui} />)
            ) : (
              <div className="p-3">
                <div className={`text-[11px] font-semibold mb-2 ${ui.sub}`}>Local components</div>
                <button onClick={insertInstance} className={`w-full rounded-lg p-3 text-left ${ui.field}`}>
                  <div className="rounded-md px-3 py-1.5 text-white text-[12px] font-semibold inline-block" style={{ background: N.btnMain?.fill ?? "#0a84ff" }}>
                    {N.btnTxt?.text ?? "Button"}
                  </div>
                  <div className="mt-2 text-[11px]" style={{ color: PURPLE }}>
                    ❖ Button · click to insert
                  </div>
                </button>
              </div>
            )}
          </div>
          <div className={`px-3 py-2 border-t text-[10px] leading-snug ${ui.divide} ${ui.sub}`}>V move · R rect · O ellipse · F frame · T text · Space+drag pan · ⌘/Ctrl+scroll zoom · ⌘Z undo</div>
        </aside>

        {/* canvas */}
        <div
          ref={canvasRef}
          className="relative flex-1 min-w-0 overflow-hidden touch-none"
          style={{
            background: ui.canvas,
            cursor: tool === "hand" ? "grab" : tool === "move" ? "default" : "crosshair",
          }}
          onPointerDown={onCanvasDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* world */}
          <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})` }}>
            {Object.keys(boxes).map(renderNode)}
            {draft && <div className="absolute border border-[#0d99ff] bg-[#0d99ff]/10" style={{ left: draft.x, top: draft.y, width: draft.w, height: draft.h, borderRadius: tool === "ellipse" ? "50%" : 0 }} />}
          </div>

          {/* frame labels (screen space) */}
          {topFrames.map((id) => {
            const b = boxes[id];
            const n = N[id];
            const purple = n.component || n.type === "instance";
            return (
              <div
                key={`lbl-${id}`}
                onPointerDown={(e) => onNodeDown(e, id)}
                className="absolute text-[11px] whitespace-nowrap"
                style={{ left: b.x * view.z + view.x, top: b.y * view.z + view.y - 18, color: purple ? PURPLE : selected === id ? BLUE : dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)" }}
              >
                {n.component ? "❖ " : n.type === "instance" ? "◈ " : ""}
                {n.name}
              </div>
            );
          })}

          {/* hover + selection overlays */}
          {hovBox && <div className="absolute pointer-events-none border" style={{ ...S(hovBox), borderColor: N[hovered]?.type === "instance" || N[hovered]?.component ? PURPLE : BLUE }} />}
          {selBox && (
            <div className="absolute pointer-events-none border-2" style={{ ...S(selBox), borderColor: sel?.type === "instance" || sel?.component ? PURPLE : BLUE }}>
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-6 px-1.5 py-0.5 rounded text-[10px] text-white tabular-nums whitespace-nowrap"
                style={{ background: sel?.type === "instance" || sel?.component ? PURPLE : BLUE }}
              >
                {Math.round(selBox.w)} × {Math.round(selBox.h)}
              </div>
              {resizable &&
                ["nw", "ne", "sw", "se"].map((c) => (
                  <div
                    key={c}
                    onPointerDown={(e) => onHandleDown(e, c)}
                    className="absolute w-2.5 h-2.5 bg-white border-2 pointer-events-auto"
                    style={{
                      borderColor: BLUE,
                      left: c.includes("w") ? -6 : undefined,
                      right: c.includes("e") ? -6 : undefined,
                      top: c.includes("n") ? -6 : undefined,
                      bottom: c.includes("s") ? -6 : undefined,
                      cursor: c === "nw" || c === "se" ? "nwse-resize" : "nesw-resize",
                    }}
                  />
                ))}
            </div>
          )}

          {/* Marta's multiplayer cursor */}
          <motion.div
            className="absolute pointer-events-none"
            animate={{ left: MARTA_SPOTS[marta][0] * view.z + view.x, top: MARTA_SPOTS[marta][1] * view.z + view.y }}
            transition={{ type: "spring", stiffness: 40, damping: 12 }}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 drop-shadow" aria-hidden="true">
              <path d="M2 1.5l11 6.2-4.7 1.2-2 4.6z" fill="#ff375f" stroke="#fff" strokeWidth="1" />
            </svg>
            <span className="ml-3 -mt-0.5 inline-block px-1.5 py-0.5 rounded-md bg-[#ff375f] text-white text-[10px] font-semibold whitespace-nowrap">Marta</span>
          </motion.div>

          {/* zoom controls */}
          <div className={`absolute right-3 bottom-3 flex rounded-lg overflow-hidden border text-[13px] ${ui.panel}`}>
            <button onClick={() => setView((v) => ({ ...v, z: Math.max(0.25, v.z / 1.25) }))} className={`w-8 h-8 ${ui.hover}`} aria-label="Zoom out">
              −
            </button>
            <button onClick={() => setView({ x: 20, y: 20, z: 1 })} className={`px-2 h-8 text-[11px] ${ui.hover}`}>
              Reset
            </button>
            <button onClick={() => setView((v) => ({ ...v, z: Math.min(4, v.z * 1.25) }))} className={`w-8 h-8 ${ui.hover}`} aria-label="Zoom in">
              +
            </button>
          </div>
        </div>

        {/* right: design panel */}
        <aside className={`w-[240px] shrink-0 border-l overflow-y-auto hidden @3xl:block ${ui.panel}`}>
          <div className={`flex gap-3 px-3 h-10 items-center border-b text-[11px] font-semibold ${ui.divide}`}>
            <span>Design</span>
            <span className={ui.sub}>Prototype</span>
          </div>
          <AnimatePresence mode="wait">
            {!sel ? (
              <motion.div key="none" className={`p-4 text-[11px] leading-relaxed ${ui.sub}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Select a layer to edit it, or pick a tool and drag on the canvas to draw.
                <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(151,71,255,0.1)", color: PURPLE }}>
                  ❖ Tip: change the <b>Button</b> component’s fill or label. Every instance updates.
                </div>
              </motion.div>
            ) : (
              <motion.div key={selected} className="text-[11px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={`px-3 py-3 border-b ${ui.divide}`}>
                  <div className="font-semibold" style={{ color: sel.type === "instance" || sel.component ? PURPLE : undefined }}>
                    {selName}
                  </div>
                  <input value={sel.name} onChange={(e) => patch(selected, { name: e.target.value }, false)} className={`mt-1.5 w-full rounded-md px-2 h-7 outline-none ${ui.field} ${ui.text}`} aria-label="Layer name" />
                  {sel.component && <div className={`mt-1.5 ${ui.sub}`}>{instancesOf(selected)} instances use this component</div>}
                  {sel.type === "instance" && (
                    <button onClick={() => setSelected(sel.of)} className="mt-2 w-full rounded-md h-7 text-white font-medium" style={{ background: PURPLE }}>
                      Go to main component
                    </button>
                  )}
                </div>

                {sel.x !== undefined && !inAuto && (
                  <div className={`px-3 py-3 border-b grid grid-cols-2 gap-1.5 ${ui.divide}`}>
                    <NumField ui={ui} label="X" value={sel.x} onChange={(v) => patch(selected, { x: v })} />
                    <NumField ui={ui} label="Y" value={sel.y} onChange={(v) => patch(selected, { y: v })} />
                    {resizable && (
                      <>
                        <NumField ui={ui} label="W" value={sel.w} onChange={(v) => patch(selected, { w: Math.max(1, v) })} />
                        <NumField ui={ui} label="H" value={sel.h} onChange={(v) => patch(selected, { h: Math.max(1, v) })} />
                      </>
                    )}
                  </div>
                )}

                {sel.type === "frame" && (
                  <div className={`px-3 py-3 border-b ${ui.divide}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Auto layout</span>
                      <button
                        onClick={() => patch(selected, { auto: sel.auto ? undefined : { dir: "column", gap: 10, pad: 16 } })}
                        className={`w-6 h-6 rounded ${ui.hover} text-[14px]`}
                        title={sel.auto ? "Remove auto layout" : "Add auto layout"}
                      >
                        {sel.auto ? "−" : "+"}
                      </button>
                    </div>
                    {sel.auto && (
                      <div className="mt-2 space-y-1.5">
                        <div className={`flex rounded-md p-0.5 ${ui.field}`}>
                          {[
                            ["column", "↓ Vertical"],
                            ["row", "→ Horizontal"],
                          ].map(([k, l]) => (
                            <button key={k} onClick={() => patch(selected, { auto: { ...sel.auto, dir: k } })} className={`flex-1 h-6 rounded ${sel.auto.dir === k ? (dark ? "bg-white/15" : "bg-white shadow-sm") : ui.sub}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <NumField ui={ui} label="↔" value={sel.auto.gap} onChange={(v) => patch(selected, { auto: { ...sel.auto, gap: Math.max(0, v) } })} />
                          <NumField ui={ui} label="▢" value={sel.auto.pad} onChange={(v) => patch(selected, { auto: { ...sel.auto, pad: Math.max(0, v) } })} />
                        </div>
                        <div className={`text-[10px] ${ui.sub}`}>Gap · padding. The frame hugs its content.</div>
                      </div>
                    )}
                  </div>
                )}

                {sel.type === "text" && (
                  <div className={`px-3 py-3 border-b space-y-1.5 ${ui.divide}`}>
                    <div className="font-semibold">Text</div>
                    <textarea value={sel.text} onChange={(e) => patch(selected, { text: e.target.value }, false)} rows={2} className={`w-full rounded-md p-2 outline-none resize-none ${ui.field} ${ui.text}`} aria-label="Text content" />
                    <div className="grid grid-cols-2 gap-1.5">
                      <NumField ui={ui} label="Aa" value={sel.size} onChange={(v) => patch(selected, { size: Math.max(6, v) })} />
                      <select value={sel.weight} onChange={(e) => patch(selected, { weight: Number(e.target.value) })} className={`rounded-md px-1.5 h-7 outline-none ${ui.field} ${ui.text}`}>
                        {[400, 500, 600, 700].map((w) => (
                          <option key={w} value={w}>
                            {{ 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold" }[w]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {sel.type !== "instance" && (
                  <div className={`px-3 py-3 border-b ${ui.divide}`}>
                    <div className="font-semibold mb-1.5">{sel.type === "text" ? "Color" : "Fill"}</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(sel.type === "text" ? sel.color : sel.fill)?.startsWith("#") ? (sel.type === "text" ? sel.color : sel.fill) : "#ffffff"}
                        onChange={(e) => patch(selected, sel.type === "text" ? { color: e.target.value } : { fill: e.target.value }, false)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent"
                        aria-label="Pick color"
                      />
                      <span className={`font-mono ${ui.sub}`}>{sel.type === "text" ? sel.color : sel.fill}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {SWATCHES.map((c) => (
                        <button
                          key={c}
                          onClick={() => patch(selected, sel.type === "text" ? { color: c } : { fill: c })}
                          className="w-5 h-5 rounded ring-1 ring-black/15"
                          style={{ background: c === "transparent" ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 8px 8px" : c }}
                          title={c}
                          aria-label={`Fill ${c}`}
                        />
                      ))}
                    </div>
                    <div className={`mt-1.5 text-[10px] ${ui.sub}`}>Swatches = the portfolio’s design tokens</div>
                  </div>
                )}

                {(sel.type === "rect" || sel.type === "frame") && (
                  <div className={`px-3 py-3 border-b ${ui.divide}`}>
                    <div className="font-semibold mb-1.5">Corner radius</div>
                    <input type="range" min={0} max={40} value={Math.min(40, sel.radius ?? 0)} onChange={(e) => patch(selected, { radius: Number(e.target.value) }, false)} className="w-full accent-[#0d99ff]" aria-label="Corner radius" />
                  </div>
                )}

                <div className="px-3 py-3">
                  <div className="font-semibold mb-1.5">Layer</div>
                  <input type="range" min={0.1} max={1} step={0.05} value={sel.opacity ?? 1} onChange={(e) => patch(selected, { opacity: Number(e.target.value) }, false)} className="w-full accent-[#0d99ff]" aria-label="Opacity" />
                  <button
                    onClick={() => {
                      commit(removeNode(doc, selected));
                      setSelected(null);
                    }}
                    className="mt-3 w-full h-7 rounded-md text-[#ff453a] hover:bg-[#ff453a]/10"
                  >
                    Delete layer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
