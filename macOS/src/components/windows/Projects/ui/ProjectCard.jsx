import { motion } from "framer-motion";

export default function ProjectCard({ item, styles, mode = "projects", onAction }) {
  const lines = mode === "secret" ? item.overview ?? [] : item.bullets ?? [];

  function handleOpen() {
    if (mode === "secret") {
      onAction?.({ action: "openSecretWindow", id: item.id });
      return;
    }

    if (item.links?.[0]) {
      onAction?.(item.links[0]);
    }
  }

  return (
    <motion.div
      className={`rounded-2xl overflow-hidden shadow-sm ${styles.cardClass}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Thumbnail */}
      {item.thumbnail && (
        <button type="button" onClick={handleOpen} className="block w-full text-left">
          <div className="overflow-hidden">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="
                w-full
                h-auto
                object-cover
                transition-transform
                duration-300
                hover:scale-[1.02]
              "
              draggable="false"
            />
          </div>
        </button>
      )}

      {/* Content */}
      <div className="p-4">
        <div className={`text-[19px] font-semibold leading-tight ${styles.textMain}`}>
          {item.title}
        </div>

        {item.subtitle && (
          <div className={`mt-2 text-sm leading-relaxed ${styles.textSub}`}>
            {item.subtitle}
          </div>
        )}

        {!!lines.length && (
          <ul className={`mt-1 space-y-0.1 text-sm ${styles.textMain}`}>
            {lines.map((b) => (
              <li key={b} className="flex gap-2">
                <span className={`${styles.textSub} mt-[1px]`}>•</span>
                <span
                  className={`${
                    styles.isMac ? "text-black/80" : "text-white/85"
                  } leading-relaxed`}
                >
                  {b}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(item.tags ?? []).map((t) => (
              <span key={t} className={`px-2.5 py-1 rounded-full text-xs ${styles.chipClass}`}>
                {t}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all ${styles.linkBtnClass}`}
          >
            <span className="text-base">↗</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
