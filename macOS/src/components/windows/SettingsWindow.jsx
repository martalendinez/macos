export default function SettingsWindow({ uiTheme, setUiTheme }) {
  const isMac = uiTheme === "macos";

  const textMain = isMac ? "text-black/80" : "text-white/90";
  const textSub = isMac ? "text-black/60" : "text-white/70";

  const sidebarBg = isMac ? "bg-[#efefec]" : "bg-white/5";
  const sidebarBorder = isMac ? "border-black/10" : "border-white/10";

  const mainBg = isMac ? "bg-[#f7f7f4]" : "";
  const cardBg = isMac ? "bg-white" : "bg-white/6";
  const cardBorder = isMac ? "border-black/10" : "border-white/10";
  const cardHover = isMac ? "hover:bg-black/5" : "hover:bg-white/10";

  const sidebarItem = isMac
    ? "hover:bg-[#d9e8ff] text-black/80"
    : "bg-white/5 hover:bg-white/10 text-white/90";

  const btnBase = "px-3 py-2 rounded-xl text-sm transition";
  const btnSelected = isMac ? "bg-black/10 text-black/90" : "bg-white/20 text-white";
  const btnUnselected = isMac
    ? "bg-white text-black/80 border border-black/10 hover:bg-black/5"
    : "bg-white/10 text-white/85 hover:bg-white/15";

  return (
    <div className={`h-full flex ${isMac ? "text-black" : "text-white"}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r ${sidebarBorder} ${sidebarBg} p-4`}>
        <div className={`${textSub} text-xs mb-3`}>Settings</div>

        <div className="space-y-2">
          {["General", "Appearance", "Desktop & Dock", "Wallpaper"].map((item) => (
            <div
              key={item}
              className={`px-3 py-2 rounded-lg cursor-pointer transition ${sidebarItem}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className={`flex-1 p-6 ${mainBg}`}>
        <div className={`${textMain} text-xl font-semibold mb-4`}>General</div>

        {/* ✅ Appearance toggle */}
        <div className="mb-6">
          <div className={`${textSub} text-xs mb-2`}>Appearance</div>
          <div className="flex gap-2">
            <button
              className={`${btnBase} ${uiTheme === "glass" ? btnSelected : btnUnselected}`}
              onClick={() => setUiTheme?.("glass")}
              type="button"
            >
              Glass
            </button>
            <button
              className={`${btnBase} ${uiTheme === "macos" ? btnSelected : btnUnselected}`}
              onClick={() => setUiTheme?.("macos")}
              type="button"
            >
              macOS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            "About",
            "Software Update",
            "Storage",
            "AirDrop & Handoff",
            "Login Items",
            "Language & Region",
            "Date & Time",
            "Sharing",
          ].map((row) => (
            <div
              key={row}
              className={`rounded-xl ${cardBg} border ${cardBorder} p-4 ${textMain} text-sm transition cursor-pointer ${cardHover}`}
            >
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
