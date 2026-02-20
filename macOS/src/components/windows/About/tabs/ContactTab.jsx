// src/components/windows/About/tabs/ContactTab.jsx
import contactAvatar from "../../../../imgs/avatar/Avatar1.jpg";

import LinkRow from "../components/LinkRow";
import { Input, Textarea, QuickBtn } from "../components/FormFields";

export default function ContactTab({ styles }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
          <LinkRow styles={styles} icon="✉️" label="Email" value="casandra.lendinez@outlook.com" />
          <LinkRow styles={styles} icon="🔗" label="LinkedIn" value="www.linkedin.com/in/marta-casandra-lendínez-ibáñez-959259200" />
          <LinkRow styles={styles} icon="🐙" label="GitHub" value="https://github.com/martalendinez" />
          <LinkRow styles={styles} icon="📄" label="Resume" value="resume.pdf" />
          <LinkRow styles={styles} icon="🖼️" label="Portfolio" value="marta.lendinez.portfolio.com" />
        </div>
      </div>

      <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
        <div className={`${styles.textStrong} font-semibold mb-2`}>Let’s Connect!</div>
        <div className={`${styles.textSub} text-sm leading-relaxed`}>
          I’d love to hear about opportunities, collaborations, or just chat about design!
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <QuickBtn styles={styles} label="Send email" />
          <QuickBtn styles={styles} label="View code" />
        </div>

        <div className={`mt-5 rounded-xl ${styles.cardBgSoft} border ${styles.cardBorder} p-4`}>
          <div className={`${styles.textMain} text-sm font-medium mb-3`}>Send a message</div>

          <div className="grid grid-cols-1 gap-3">
            <Input styles={styles} label="Name" placeholder="Your name" />
            <Input styles={styles} label="Email" placeholder="you@email.com" />
            <Input styles={styles} label="Subject" placeholder="Hello!" />
            <Textarea styles={styles} label="Message" placeholder="Type your message here..." />
          </div>

          <div className="mt-4 flex justify-between">
            <button type="button" className={`px-4 py-2 rounded-xl ${styles.btn} text-sm transition`}>
              Cancel
            </button>
            <button type="button" className={`px-4 py-2 rounded-xl ${styles.btnPrimary} text-sm transition`}>
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}