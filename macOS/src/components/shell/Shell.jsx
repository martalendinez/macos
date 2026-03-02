// src/components/shell/Shell.jsx
export default function Shell({ children, fontScale = 1, baseTextClass = "", wallpaperUrl, loaded }) {
  return (
    <div
      className={[
        "fixed inset-0 overflow-hidden", // ✅ lock the whole app to the viewport
        baseTextClass,
        loaded ? "opacity-100" : "opacity-0",
        "transition-opacity duration-300",
      ].join(" ")}
      style={{
        fontSize: `${fontScale}em`,
      }}
    >
      {/* ✅ Wallpaper: fixed layer that NEVER scrolls */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : undefined,
        }}
      />

      {/* ✅ Optional: subtle overlay to prevent banding/white edges */}
      <div className="fixed inset-0 -z-10 bg-black/10" />

      {/* ✅ Foreground app layer */}
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}