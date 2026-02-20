export default function PhotoRow({ photos, onOpen, textSub }) {
  if (!photos?.length) {
    return <div className={`${textSub} text-xs opacity-70`}>No photos added yet.</div>;
  }

  return (
    <div
      className="
        flex flex-nowrap gap-3 overflow-x-auto pb-2 whitespace-nowrap
        snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent
      "
    >
      {photos.map((src, i) => (
        <button
          key={i}
          onClick={() => onOpen(i)}
          className="w-32 h-24 rounded-xl overflow-hidden border border-black/10 hover:scale-[1.02] transition snap-start shrink-0"
          type="button"
        >
          <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
        </button>
      ))}
    </div>
  );
}