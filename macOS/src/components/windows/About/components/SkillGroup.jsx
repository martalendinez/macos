// src/components/windows/About/components/SkillGroup.jsx
export default function SkillGroup({ styles, title, icon, children }) {
  return (
    <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
      <div className={`flex items-center gap-2 ${styles.textMain} text-sm font-semibold mb-4`}>
        <span>{icon}</span>
        <span className="tracking-wide">{title}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}