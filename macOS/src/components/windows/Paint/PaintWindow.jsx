// src/components/windows/Paint/PaintWindow.jsx
// Simple drawing app: brush, highlighter, eraser, colors, sizes, undo, save as PNG.
import { useEffect, useRef, useState } from "react";

const SWATCHES = ["#1c1c1e", "#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#00c7be", "#007aff", "#5856d6", "#af52de", "#ff2d55", "#a2845e", "#ffffff"];
const TOOLS = [
  { id: "brush", label: "Brush", icon: "🖌️" },
  { id: "marker", label: "Highlighter", icon: "🖍️" },
  { id: "eraser", label: "Eraser", icon: "🧽" },
];

export default function PaintWindow({ theme = "light" }) {
  const isDark = theme === "dark";
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const drawing = useRef(null);
  const history = useRef([]);
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#007aff");
  const [size, setSize] = useState(8);
  const [canUndo, setCanUndo] = useState(false);

  // keep the canvas sized to the window (and keep the drawing when resizing)
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext("2d");
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      // clientWidth ignores CSS transforms (the window zooms in from 90% when it opens)
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;
      const copy = document.createElement("canvas");
      copy.width = canvas.width;
      copy.height = canvas.height;
      if (canvas.width) copy.getContext("2d").drawImage(canvas, 0, 0);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (copy.width) ctx.drawImage(copy, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  function pos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    const dpr = canvasRef.current.width / r.width;
    return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr, dpr };
  }

  function snapshot() {
    const c = canvasRef.current;
    history.current.push(c.getContext("2d").getImageData(0, 0, c.width, c.height));
    if (history.current.length > 25) history.current.shift();
    setCanUndo(true);
  }

  function start(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    snapshot();
    const p = pos(e);
    drawing.current = { last: p, mid: p };
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = tool === "marker" ? 0.35 : 1;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.fillStyle = ctx.strokeStyle;
    const w = (tool === "marker" ? size * 2.5 : tool === "eraser" ? size * 3 : size) * p.dpr;
    ctx.lineWidth = w;
    // a single click leaves a dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, w / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function move(e) {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    const { last, mid } = drawing.current;
    const nextMid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
    // smooth the stroke with quadratic curves between midpoints
    ctx.beginPath();
    ctx.moveTo(mid.x, mid.y);
    ctx.quadraticCurveTo(last.x, last.y, nextMid.x, nextMid.y);
    ctx.stroke();
    drawing.current = { last: p, mid: nextMid };
  }

  function end() {
    drawing.current = null;
  }

  function undo() {
    const prev = history.current.pop();
    if (prev) canvasRef.current.getContext("2d").putImageData(prev, 0, 0);
    setCanUndo(history.current.length > 0);
  }

  function clear() {
    snapshot();
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  function save() {
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "my-masterpiece.png";
    a.click();
  }

  const bar = isDark ? "bg-[#2a2a2c] border-white/10 text-white/85" : "bg-[#ececec] border-black/10 text-black/80";
  const btn = isDark ? "hover:bg-white/10" : "hover:bg-black/5";
  const on = isDark ? "bg-white/15" : "bg-black/10";

  return (
    <div className="no-darkwin h-full flex flex-col">
      <div className={`shrink-0 px-3 py-2 flex flex-wrap items-center gap-3 border-b ${bar}`}>
        <div className="flex gap-1">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`h-8 px-2.5 rounded-md text-[13px] flex items-center gap-1.5 ${tool === t.id ? on : btn}`}
              aria-pressed={tool === t.id}
              title={t.label}
            >
              <span>{t.icon}</span>
              <span className="hidden @2xl:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {SWATCHES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setColor(s);
                if (tool === "eraser") setTool("brush");
              }}
              className={`w-5 h-5 rounded-full border transition ${color === s ? "scale-125 border-[#007aff] border-2" : "border-black/20"}`}
              style={{ background: s }}
              aria-label={`Color ${s}`}
            />
          ))}
          <label className="w-6 h-6 rounded-full overflow-hidden border border-black/20 cursor-pointer ml-1" title="Custom color" style={{ background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)" }}>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
          </label>
        </div>

        <label className="flex items-center gap-2 text-[12px]">
          Size
          <input type="range" min="2" max="40" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24 accent-[#007aff]" />
        </label>

        <div className="ml-auto flex gap-1">
          <button onClick={undo} disabled={!canUndo} className={`h-8 px-3 rounded-md text-[13px] disabled:opacity-35 ${btn}`}>
            ↶ Undo
          </button>
          <button onClick={clear} className={`h-8 px-3 rounded-md text-[13px] ${btn}`}>
            Clear
          </button>
          <button onClick={save} className="h-8 px-3 rounded-md text-[13px] bg-[#007aff] text-white hover:bg-[#0a84ff]">
            Save PNG
          </button>
        </div>
      </div>

      <div ref={wrapRef} className="relative flex-1 min-h-0 bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ cursor: "crosshair" }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
      </div>
    </div>
  );
}
