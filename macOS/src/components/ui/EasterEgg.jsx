// src/components/ui/EasterEgg.jsx
// A little blue speech bubble (iMessage-style) that pops out when you hover or focus something.
// The bubble renders in a portal with fixed positioning, so menu bars and clipped widgets never cut it off.
// Usage: <EasterEgg say="MAR-ta len-DEE-neth 🇪🇸">Marta Lendínez</EasterEgg>
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const GAP = 10;
const EDGE = 8;

export default function EasterEgg({ say, side = "right", children, className = "", bubbleClass = "max-w-[340px]", focusable = true }) {
  const anchor = useRef(null);
  const bubble = useRef(null);
  const [rect, setRect] = useState(null);
  const [pos, setPos] = useState(null);

  const show = () => setRect(anchor.current?.getBoundingClientRect() ?? null);
  const hide = () => {
    setRect(null);
    setPos(null);
  };

  // place the bubble once it has a size, and keep it inside the viewport
  useLayoutEffect(() => {
    if (!rect || !bubble.current) return;
    const b = bubble.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left;
    let top;
    if (side === "right") {
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - b.height / 2;
      if (left + b.width > vw - EDGE) left = rect.left - GAP - b.width; // flip to the left
    } else {
      left = rect.left;
      top = side === "top" ? rect.top - GAP - b.height : rect.bottom + GAP;
      if (side === "top" && top < EDGE) top = rect.bottom + GAP;
      if (side === "bottom" && top + b.height > vh - EDGE) top = rect.top - GAP - b.height;
    }
    left = Math.max(EDGE, Math.min(vw - b.width - EDGE, left));
    top = Math.max(EDGE, Math.min(vh - b.height - EDGE, top));
    setPos({ left, top });
  }, [rect, side]);

  const tail = side === "bottom" ? "rounded-tl-[6px]" : "rounded-bl-[6px]";

  return (
    <span
      ref={anchor}
      className={`relative inline-block outline-none ${focusable ? "cursor-help" : ""} ${className}`}
      tabIndex={focusable ? 0 : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {rect &&
        createPortal(
          <span
            ref={bubble}
            role="tooltip"
            className={`pointer-events-none fixed z-[20000] w-max ${bubbleClass} rounded-[18px] ${tail} bg-[#0a84ff] px-3.5 py-2 text-left text-[13.5px] font-medium leading-snug tracking-normal text-white shadow-[0_8px_24px_-8px_rgba(10,132,255,0.55)] transition-[opacity,transform] duration-200`}
            style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999, opacity: pos ? 1 : 0, transform: pos ? "none" : "translateY(4px)" }}
          >
            {say}
          </span>,
          document.body
        )}
    </span>
  );
}
