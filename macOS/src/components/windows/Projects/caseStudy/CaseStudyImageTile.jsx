// Editorial image: sits directly on the page (no card), small caption underneath.
const ASPECTS = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "16/10": "aspect-[16/10]",
  "1/1": "aspect-square",
};

export function ZoomBadge() {
  return (
    <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 backdrop-blur-md text-white flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition duration-200">
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" />
      </svg>
    </span>
  );
}

export default function CaseStudyImageTile({ src, alt, caption, aspect = "16/9", fit = "cover", theme, onOpen }) {
  // "contain"/"auto" images keep their natural proportions; "cover" crops to the aspect ratio
  const natural = fit === "contain" || aspect === "auto";
  // cropped screenshots get a hairline edge; full images (mockups, diagrams) sit directly on the page
  const frame = natural ? "" : theme.isDark ? "ring-1 ring-white/10" : "ring-1 ring-black/[0.07]";

  return (
    <figure className="group">
      <button
        type="button"
        onClick={() => src && onOpen?.(src, alt)}
        className={`relative block w-full overflow-hidden rounded-xl ${frame} cursor-zoom-in disabled:cursor-default ${
          natural ? "" : ASPECTS[aspect] ?? ASPECTS["16/9"]
        }`}
        disabled={!src}
        title={src ? "Click to enlarge" : "Placeholder: set an image in IMAGES"}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            decoding="async"
            className={`block w-full transition duration-500 group-hover:scale-[1.015] ${natural ? "h-auto" : "h-full object-cover object-top"}`}
          />
        ) : (
          <div className={`w-full aspect-[16/9] flex items-center justify-center text-xs ${theme.textSub}`}>
            Add image: <span className="font-semibold ml-1">{alt || "placeholder"}</span>
          </div>
        )}
        {src && <ZoomBadge />}
      </button>

      {caption ? <figcaption className={`mt-2.5 text-[13px] leading-snug ${theme.textSub}`}>{caption}</figcaption> : null}
    </figure>
  );
}
