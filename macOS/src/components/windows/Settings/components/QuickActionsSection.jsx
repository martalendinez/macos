// src/components/windows/Settings/components/QuickActionsSection.jsx
import { useRef, useState } from "react";
import QuickAction from "./QuickAction";
import { sharePortfolio } from "../utils";

export default function QuickActionsSection({ uiTheme, onDownloadResume, onResetLayout }) {
  const [shareLabel, setShareLabel] = useState("Share portfolio");
  const busyRef = useRef(false);

  async function onShare() {
    if (busyRef.current) return;
    busyRef.current = true;

    const res = await sharePortfolio();

    if (res.status === "copied") setShareLabel("Copied!");
    else if (res.status === "failed") setShareLabel("Copy failed");

    if (res.status === "copied" || res.status === "failed") {
      window.setTimeout(() => setShareLabel("Share portfolio"), 1200);
    }

    busyRef.current = false;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <QuickAction uiTheme={uiTheme} label={shareLabel} icon="↗" onClick={onShare} />
      <QuickAction uiTheme={uiTheme} label="Download Resume" icon="⬇" onClick={onDownloadResume} />
      <QuickAction uiTheme={uiTheme} label="Reset window layout" icon="🗔" onClick={onResetLayout} />
      <QuickAction uiTheme={uiTheme} label="About this portfolio" icon="ℹ" />
    </div>
  );
}