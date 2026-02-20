export default function MiniCover({ title, cover, cardBorder, cardBgSoft, textSub2 }) {
  const letter = (title?.trim()?.[0] || "♪").toUpperCase();

  return (
    <div className={`w-12 h-12 rounded-xl overflow-hidden border ${cardBorder} shrink-0`}>
      {cover ? (
        <img src={cover} alt={`${title} cover`} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${cardBgSoft}`}>
          <div className={`${textSub2} text-sm font-semibold`}>{letter}</div>
        </div>
      )}
    </div>
  );
}