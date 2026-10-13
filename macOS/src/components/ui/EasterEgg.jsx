// src/components/ui/EasterEgg.jsx
// A little blue speech bubble (iMessage-style) that pops out when you hover or focus something.
// Usage: <EasterEgg say="MAR-ta len-DEE-neth 🇪🇸">Marta Lendínez</EasterEgg>
export default function EasterEgg({ say, side = "right", children, className = "" }) {
  const pos =
    side === "right"
      ? "left-full top-1/2 ml-3 -translate-y-1/2 -translate-x-1 group-hover/egg:translate-x-0 group-focus/egg:translate-x-0 rounded-bl-[6px]"
      : side === "top"
        ? "left-0 bottom-full mb-2 translate-y-1 group-hover/egg:translate-y-0 group-focus/egg:translate-y-0 rounded-bl-[6px]"
        : "left-0 top-full mt-2 -translate-y-1 group-hover/egg:translate-y-0 group-focus/egg:translate-y-0 rounded-tl-[6px]";
  return (
    <span className={`group/egg relative inline-block cursor-help outline-none ${className}`} tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-20 w-max max-w-[340px] rounded-[18px] bg-[#0a84ff] px-3.5 py-2 text-left text-[13.5px] font-medium leading-snug tracking-normal text-white opacity-0 shadow-[0_8px_24px_-8px_rgba(10,132,255,0.55)] transition duration-200 group-hover/egg:opacity-100 group-focus/egg:opacity-100 ${pos}`}
      >
        {say}
      </span>
    </span>
  );
}
