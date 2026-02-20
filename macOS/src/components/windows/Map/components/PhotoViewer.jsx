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
}) {
  if (!open || !photos?.length) return null;

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        backdrop-blur-3xl supports-[backdrop-filter]:backdrop-saturate-150
        bg-black/20 flex flex-col
      "
    >
      {/* Close */}
      <div className="flex justify-end px-6 pt-6">
        <button onClick={onClose} className="text-white text-2xl font-light hover:opacity-70 transition" type="button">
          ×
        </button>
      </div>

      {/* Image + arrows */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <button
          onClick={onPrev}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white mr-4"
          type="button"
          aria-label="Previous photo"
        >
          ‹
        </button>

        <div
          className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center"
          onClick={() => setZoomed((z) => !z)}
          role="button"
          tabIndex={0}
        >
          <img
            src={photos[index]}
            alt=""
            className={[
              "rounded-2xl shadow-2xl transition-transform duration-300 max-h-[65vh] w-auto object-contain",
              zoomed ? "scale-105" : "scale-100",
            ].join(" ")}
          />
        </div>

        <button
          onClick={onNext}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white ml-4"
          type="button"
          aria-label="Next photo"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center pb-6 gap-1">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setZoomed(false);
            }}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}