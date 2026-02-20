// src/components/windows/About/components/InfoBlock.jsx
export default function InfoBlock({ styles, icon, title, value }) {
  return (
    <div className={`rounded-xl ${styles.cardBg} border ${styles.cardBorder} p-4`}>
      <div className={`flex items-center gap-2 ${styles.textMain} text-sm font-medium`}>
        <span className="text-base">{icon}</span>
        <span>{title}</span>
      </div>
      <div className={`mt-1 ${styles.textSub} text-sm leading-relaxed`}>{value}</div>
    </div>
  );
}