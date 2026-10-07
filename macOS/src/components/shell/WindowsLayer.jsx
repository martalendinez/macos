// src/components/shell/WindowsLayer.jsx
import { Suspense, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import MacWindow from "../windows/MacWindow";
import Loader from "../../ui/Loader";
import { MENU_BAR_H } from "../../config/shell";

export default function WindowsLayer({
  openWindows = [],
  activeWindow,
  zMap = {},
  maxMap = {},
  minMap = {},
  focusWindow,
  closeWindow,
  minimizeWindow,
  toggleMaximize,
  uiTheme,
  theme = "light",
  windowDefs = {},
  appApi,
}) {
  // windows can be dragged anywhere below the menu bar
  const boundsRef = useRef(null);

  return (
    <>
      <div
        ref={boundsRef}
        aria-hidden="true"
        className="fixed left-0 right-0 bottom-0 pointer-events-none"
        style={{ top: MENU_BAR_H }}
      />

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
              onMinimize={minimizeWindow}
              uiTheme={uiTheme}
              theme={theme}
              isMaximized={!!maxMap?.[id]}
              isMinimized={!!minMap?.[id]}
              onToggleMaximize={toggleMaximize}
              dragBoundsRef={boundsRef}
              resizable={def.resizable !== false}
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader size={20} />
                  </div>
                }
              >
                <WindowComponent {...appApi} />
              </Suspense>
            </MacWindow>
          );
        })}
      </AnimatePresence>
    </>
  );
}
