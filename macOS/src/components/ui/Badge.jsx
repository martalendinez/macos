// src/components/ui/Badge.jsx
// The red iOS/macOS app badge ("1"), pinned to the top-right corner of an icon.
export default function Badge({ count = 0, className = "" }) {
  if (!count) return null;
  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[20px] h-[20px] px-[5px] rounded-full bg-[#ff3b30] text-white text-[12px] font-semibold leading-none flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.3)] [text-shadow:none] pointer-events-none ${className}`}
      aria-label={`${count} unread`}
    >
      {count}
    </span>
  );
}
