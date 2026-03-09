// src/components/shell/WindowsLayer.jsx
import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import MacWindow from "../windows/MacWindow";

export default function WindowsLayer({
  openWindows = [],
  activeWindow,
  zMap = {},
  maxMap = {},
  focusWindow,
  closeWindow,
  toggleMaximize,
  uiTheme,
  theme = "light",
  windowDefs = {},
  appApi,
}) {
  return (
    <AnimatePresence>
      {openWindows.map((id) => {
        const def = windowDefs[id];
        if (!def) return null;

        const WindowComponent = def.Component;

        return (
          <MacWindow
            key={id}
            id={id}
            title={def.title}
            width={def.width}
            height={def.height}
            initialPos={def.initialPos}
            isActive={activeWindow === id}
            zIndex={zMap[id] ?? 999}
            onFocus={focusWindow}
            onClose={closeWindow}
            uiTheme={uiTheme}
            theme={theme}
            isMaximized={!!maxMap?.[id]}
            onToggleMaximize={toggleMaximize}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-sm opacity-70">
                  Loading window...
                </div>
              }
            >
              <WindowComponent {...appApi} />
            </Suspense>
          </MacWindow>
        );
      })}
    </AnimatePresence>
  );
}