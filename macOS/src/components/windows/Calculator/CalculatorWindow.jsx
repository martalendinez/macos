// src/components/windows/Calculator/CalculatorWindow.jsx
// macOS Calculator. Click the window, then you can type: digits, + - * / . % Enter, Backspace, Esc.
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const OPS = { "÷": (a, b) => a / b, "×": (a, b) => a * b, "−": (a, b) => a - b, "+": (a, b) => a + b };

function format(str) {
  if (str === "Error") return str;
  const n = Number(str);
  if (!Number.isFinite(n)) return "Error";
  if (str.endsWith(".") || (str.includes(".") && str.endsWith("0") && !str.includes("e"))) {
    // keep what the user is typing, e.g. "3." or "0.50"
    const [int, dec] = str.split(".");
    return `${Number(int).toLocaleString("en-US")}.${dec}`;
  }
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4).replace("e+", "e");
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

export default function CalculatorWindow() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(false); // next digit starts a new number
  const [pressed, setPressed] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => rootRef.current?.focus(), []);

  function compute(a, b, o) {
    const r = OPS[o](a, b);
    return Number.isFinite(r) ? String(parseFloat(r.toPrecision(12))) : "Error";
  }

  function digit(d) {
    if (display === "Error" || fresh) {
      setDisplay(d === "." ? "0." : d);
      setFresh(false);
      return;
    }
    if (d === "." && display.includes(".")) return;
    if (display.replace(/[-.]/g, "").length >= 9) return;
    setDisplay(display === "0" && d !== "." ? d : display + d);
  }

  function operator(o) {
    const cur = Number(display);
    if (op && !fresh && acc != null) {
      const r = compute(acc, cur, op);
      setDisplay(r);
      setAcc(r === "Error" ? null : Number(r));
    } else {
      setAcc(cur);
    }
    setOp(o);
    setFresh(true);
  }

  function equals() {
    if (!op || acc == null) return;
    const r = compute(acc, Number(display), op);
    setDisplay(r);
    setAcc(null);
    setOp(null);
    setFresh(true);
  }

  function clear() {
    if (display !== "0" && !fresh) {
      setDisplay("0"); // C: clear entry
      return;
    }
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(false);
  }

  function press(key) {
    setPressed(key);
    setTimeout(() => setPressed(null), 120);
    if (/^[0-9.]$/.test(key)) digit(key);
    else if (OPS[key]) operator(key);
    else if (key === "=") equals();
    else if (key === "AC" || key === "C") clear();
    else if (key === "±") setDisplay((d) => (d === "0" || d === "Error" ? d : d.startsWith("-") ? d.slice(1) : "-" + d));
    else if (key === "%") setDisplay((d) => (d === "Error" ? d : String(Number(d) / 100)));
    else if (key === "⌫") setDisplay((d) => (fresh || d.length <= 1 || d === "Error" ? "0" : d.slice(0, -1)));
  }

  function onKeyDown(e) {
    const map = { "/": "÷", "*": "×", x: "×", "-": "−", "+": "+", Enter: "=", "=": "=", Escape: "AC", Backspace: "⌫", "%": "%", ",": "." };
    const k = /^[0-9.]$/.test(e.key) ? e.key : map[e.key];
    if (k) {
      e.preventDefault();
      press(k);
    }
  }

  const clearLabel = display !== "0" && !fresh ? "C" : "AC";
  const rows = [
    [clearLabel, "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const shown = format(display);
  const size = shown.length > 9 ? Math.max(28, 54 - (shown.length - 9) * 4) : 54;

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="no-darkwin h-full flex flex-col bg-[#2a2a2c] text-white outline-none select-none"
      aria-label="Calculator"
    >
      <div className="flex-1 min-h-[80px] flex items-end justify-end px-5 pb-1 font-light tabular-nums overflow-hidden" style={{ fontSize: size }} aria-live="polite">
        {shown}
      </div>
      <div className="grid grid-cols-4 gap-[1px] bg-[#1c1c1e] p-0">
        {rows.flat().map((k) => {
          const isOp = OPS[k] || k === "=";
          const isFn = ["AC", "C", "±", "%"].includes(k);
          const active = OPS[k] && op === k && fresh;
          const bg = isOp ? (active ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a]") : isFn ? "bg-[#5a5a5c]" : "bg-[#7a7a7c]";
          return (
            <motion.button
              key={k}
              onClick={() => press(k)}
              animate={{ filter: pressed === k ? "brightness(1.35)" : "brightness(1)" }}
              transition={{ duration: 0.12 }}
              className={`h-[52px] text-[22px] ${isOp ? "font-normal" : "font-light"} ${bg} ${k === "0" ? "col-span-2 text-left pl-6" : ""} active:brightness-125`}
              aria-label={k}
            >
              {k}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
