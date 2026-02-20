// src/components/windows/About/AboutWindow.jsx
import { useMemo, useState } from "react";
import useAboutStyles from "./useAboutStyles";

import OverviewTab from "./tabs/OverviewTab";
import ExperienceTab from "./tabs/ExperienceTab";
import SkillsTab from "./tabs/SkillsTab";
import ContactTab from "./tabs/ContactTab";

export default function AboutWindow({
  uiTheme = "glass",
  glassContrast = "light",
  onOpenWindow,
}) {
  const styles = useAboutStyles(uiTheme, glassContrast);

  const tabs = useMemo(() => ["Overview", "Experience", "Skills", "Contact"], []);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className={`h-full flex flex-col ${styles.textMain}`}>
      {/* Top tabs */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center gap-4 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`relative transition ${
                activeTab === t ? styles.tabActive : styles.tab
              }`}
            >
              <span className="px-1">{t}</span>
              {activeTab === t && (
                <span
                  className={`absolute left-1 right-1 -bottom-2 h-[2px] rounded-full ${styles.accentUnderline}`}
                />
              )}
            </button>
          ))}
        </div>
        <div className={`mt-4 h-px ${styles.divider}`} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === "Overview" && (
          <OverviewTab styles={styles} onOpenWindow={onOpenWindow} />
        )}
        {activeTab === "Experience" && <ExperienceTab styles={styles} />}
        {activeTab === "Skills" && <SkillsTab styles={styles} />}
        {activeTab === "Contact" && <ContactTab styles={styles} />}
      </div>
    </div>
  );
}