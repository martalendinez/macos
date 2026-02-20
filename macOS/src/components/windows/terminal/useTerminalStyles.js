// src/components/windows/terminal/useTerminalStyles.js
import { useMemo } from "react";

export default function useTerminalStyles(isMac) {
  return useMemo(() => {
    return {
      text: isMac ? "text-black/80" : "text-white/90",
      textDim: isMac ? "text-black/50" : "text-white/60",
      bg: isMac ? "bg-white" : "bg-black/30",
      border: isMac ? "border-black/10" : "border-white/10",
      chip: isMac ? "bg-black/5" : "bg-white/5",
      panel: isMac ? "bg-black/5" : "bg-white/5",
    };
  }, [isMac]);
}