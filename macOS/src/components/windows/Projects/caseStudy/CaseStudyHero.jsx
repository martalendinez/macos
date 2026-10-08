// Full-width cover image, editorial style.
import { motion } from "framer-motion";
import { ZoomBadge } from "./CaseStudyImageTile";

export default function CaseStudyHero({ src, alt = "Cover image", onOpen, theme }) {
  return (
    <motion.figure
      className="relative mt-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={() => src && onOpen?.(src, alt)}
        className={`group relative block w-full overflow-hidden rounded-2xl cursor-zoom-in disabled:cursor-default ${
          theme.isDark ? "ring-1 ring-white/10" : "ring-1 ring-black/[0.06]"
        } shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]`}
        disabled={!src}
        title={src ? "Click to enlarge" : "Hero placeholder: set IMAGES.hero"}
      >
        {src ? (
          <img src={src} alt={alt} className="block w-full h-auto transition duration-700 group-hover:scale-[1.01]" />
        ) : (
          <div className={`w-full aspect-[16/7] flex items-center justify-center text-sm ${theme.textSub}`}>Cover image (set IMAGES.hero)</div>
        )}
        {src && <ZoomBadge />}
      </button>
    </motion.figure>
  );
}

export function CaseStudyIconChip({ theme }) {
  if (!theme.isMac) return null;
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-[hsl(var(--accent)/0.12)] border border-[hsl(var(--accent)/0.3)]">
      <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))]" />
    </span>
  );
}
