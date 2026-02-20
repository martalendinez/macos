// src/components/windows/About/components/LinkRow.jsx
import { linkHref } from "../utils/linkHref";

export default function LinkRow({ icon, label, value, styles }) {
  const { href, isEmail } = linkHref(label, value);

  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl ${styles.cardBg} border ${styles.cardBorder} px-4 py-3`}>
      <div className={`flex items-center gap-2 ${styles.textSub}`}>
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>

      <a
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        className={`${styles.textMain} text-sm truncate max-w-[60%] hover:underline transition`}
        title={value}
      >
        {value}
      </a>
    </div>
  );
}