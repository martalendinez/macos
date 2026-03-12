export default function CaseStudyImageTile({
  src,
  alt,
  caption,
  aspect = "16/9",
  fit = "cover",
  theme,
  onOpen,
}) {
  const aspectClass =
    aspect === "auto"
      ? ""
      : aspect === "16/9"
      ? "aspect-[16/9]"
      : aspect === "4/3"
      ? "aspect-[4/3]"
      : aspect === "16/10"
      ? "aspect-[16/10]"
      : aspect === "1/1"
      ? "aspect-square"
      : "aspect-[16/9]";

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  const isAuto = aspect === "auto";

  return (
    <div className={`rounded-3xl overflow-hidden border ${theme.softCard}`}>
      <button
        type="button"
        onClick={() => src && onOpen?.(src, alt)}
        className="w-full text-left"
        disabled={!src}
        title={src ? "Click to zoom" : "Placeholder — set an image in IMAGES"}
      >
        <div
          className={`${aspectClass} w-full bg-white/40 flex items-center justify-center ${
            isAuto ? "min-h-[300px] p-4" : ""
          }`}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className={`${
                isAuto ? "w-full max-h-[300px]" : "w-full h-full"
              } ${fitClass} object-top`}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-xs ${theme.textSub} px-6 text-center`}
            >
              Add image:{" "}
              <span className="font-semibold">{alt || "placeholder"}</span>
            </div>
          )}
        </div>
      </button>

      {caption ? (
        <div
          className={`px-5 py-4 text-xs ${theme.textSub} border-t ${theme.divider}`}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}