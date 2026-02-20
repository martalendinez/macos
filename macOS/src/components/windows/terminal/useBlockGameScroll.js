// src/components/windows/terminal/useBlockGameScroll.js
import { useEffect } from "react";

export default function useBlockGameScroll({ activeGame, scrollRef }) {
  useEffect(() => {
    const el = scrollRef?.current;
    const blockKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];

    function onKeyDownCapture(e) {
      if (!activeGame) return;
      if (blockKeys.includes(e.key)) e.preventDefault();
    }

    if (el) el.addEventListener("keydown", onKeyDownCapture, { capture: true });
    window.addEventListener("keydown", onKeyDownCapture, { capture: true });

    return () => {
      if (el) el.removeEventListener("keydown", onKeyDownCapture, { capture: true });
      window.removeEventListener("keydown", onKeyDownCapture, { capture: true });
    };
  }, [activeGame, scrollRef]);
}