export default function PhotoViewer({
  open,
  photos,
  index,
  setIndex,
  zoomed,
  setZoomed,
  onClose,
  onNext,
  onPrev,
  theme = "light",
}) {
  if (!open || !photos?.length) return null;

  const isDark = theme === "dark";

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col
        ${isDark ? "bg-black/30" : "bg-white/20"}
        backdrop-blur-[70px]
        backdrop-saturate-150
      `}
    >
      {/* Close */}
      <div className="flex justify-end px-6 pt-6">
        <button
          onClick={onClose}
          className={`
            text-2xl font-light transition
            ${isDark ? "text-white/80 hover:text-white" : "text-black/70 hover:text-black"}
          `}
          type="button"
        >
          ×
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center px-6 pb-10">
        <button
          onClick={onPrev}
          className={`
            hidden sm:flex items-center justify-center
            w-10 h-10 rounded-full
            ${isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white/40 hover:bg-white/60 text-black/80"}
            backdrop-blur-md
            shadow-md mr-6 transition
          `}
          type="button"
        >
          ‹
        </button>

        <img
          src={photos[index]}
          alt=""
          onClick={() => setZoomed((z) => !z)}
          className={[
            "rounded-2xl shadow-2xl transition-transform duration-300 max-h-[60vh] w-auto object-contain",
            zoomed ? "scale-105" : "scale-100",
          ].join(" ")}
        />

        <button
          onClick={onNext}
          className={`
            hidden sm:flex items-center justify-center
            w-10 h-10 rounded-full
            ${isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white/40 hover:bg-white/60 text-black/80"}
            backdrop-blur-md
            shadow-md ml-6 transition
          `}
          type="button"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center pb-8 gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setZoomed(false);
            }}
            className={`
              w-2.5 h-2.5 rounded-full transition
              ${
                i === index
                  ? isDark
                    ? "bg-white"
                    : "bg-black/70"
                  : isDark
                  ? "bg-white/30"
                  : "bg-black/20"
              }
            `}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}