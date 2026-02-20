export default function VisualTile({ emoji, title, desc, cta, onClick, tileClass, ctaClass, textStrong, textSub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "text-left rounded-2xl border p-6 transition-all relative overflow-hidden",
        "hover:-translate-y-[2px] hover:shadow-md",
        tileClass,
      ].join(" ")}
    >
      <div className="text-3xl">{emoji}</div>

      <div className={`mt-4 font-semibold ${textStrong}`}>{title}</div>
      <div className={`mt-1 text-sm leading-relaxed ${textSub}`}>{desc}</div>

      <div className="mt-6">
        <span className={`inline-flex w-fit items-center justify-center rounded-xl px-4 py-2 text-sm transition ${ctaClass}`}>
          {cta} <span className="ml-2 opacity-60">↗</span>
        </span>
      </div>
    </button>
  );
}