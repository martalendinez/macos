// src/components/windows/About/tabs/ContactTab.jsx
import contactAvatar from "../../../../imgs/avatar/Avatar1.jpg";

import LinkRow from "../components/LinkRow";
import { QuickBtn } from "../components/FormFields";

const EMAIL = "casandra.lendinez@outlook.com";
const REPO_URL = "https://github.com/martalendinez/macOS";

export default function ContactTab({ styles }) {
  function openEmail() {
    window.location.href = `mailto:${EMAIL}`;
  }

  function openRepo() {
    window.open(REPO_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* LEFT CARD */}
      <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full overflow-hidden border ${styles.cardBorder}`}>
            <img src={contactAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>

          <div>
            <div className={`${styles.textStrong} font-semibold`}>Marta Casandra Lendínez</div>
            <div className={`${styles.textSub} text-sm`}>UX Engineer</div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <LinkRow styles={styles} icon="✉️" label="Email" value={EMAIL} />
          <LinkRow
            styles={styles}
            icon="🔗"
            label="LinkedIn"
            value="www.linkedin.com/in/marta-casandra-lendínez-ibáñez-959259200"
          />
          <LinkRow styles={styles} icon="🐙" label="GitHub" value="https://github.com/martalendinez" />
          <LinkRow styles={styles} icon="📄" label="Resume" value="resume.pdf" />
          <LinkRow styles={styles} icon="🖼️" label="Portfolio" value="https://portfolio-martalendinez.netlify.app" />
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
        <div className={`${styles.textStrong} font-semibold mb-2`}>Let’s Connect!</div>
        <div className={`${styles.textSub} text-sm leading-relaxed`}>
          I’d love to hear about opportunities or collaborations.
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <QuickBtn
            styles={styles}
            label="Send email"
            onClick={openEmail}
          />

          <QuickBtn
            styles={styles}
            label="View code"
            onClick={openRepo}
          />
        </div>
      </div>
    </div>
  );
}