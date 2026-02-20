// src/components/windows/About/tabs/OverviewTab.jsx
import overviewPhoto from "../../../../imgs/avatar/profile.jpeg";

import PhotoLocation from "../components/PhotoLocation";
import InfoBlock from "../components/InfoBlock";
import ActionButton from "../components/ActionButton";

export default function OverviewTab({ styles, onOpenWindow }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border ${styles.cardBorder} ${styles.cardBgSoft}`}>
            <img src={overviewPhoto} alt="Marta portrait" className="w-full h-full object-cover" />
            <PhotoLocation styles={styles} text="Niagara Falls, CA" />
          </div>

          <div className="mt-4">
            <div className={`${styles.textStrong} text-xl font-semibold leading-tight`}>Marta Lendínez</div>
            <div className={`${styles.textSub} text-sm mt-1`}>
              UX Engineer <span className={styles.textSub2}>•</span> UI Designer
            </div>

            <div className={`${styles.textSub} mt-3 text-sm leading-relaxed`}>
              Master’s in Interactive Media Technology <span className={styles.accentText}>@</span>{" "}
              <a
                href="https://www.kth.se/en/studies/master/interactive-media-technology"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.accentText} hover:underline`}
              >
                KTH
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <InfoBlock styles={styles} icon="📍" title="Location" value="Stockholm, Sweden" />
          <InfoBlock styles={styles} icon="🎓" title="Education" value="Master’s in Interactive Media Technology • KTH" />
          <InfoBlock styles={styles} icon="💼" title="Experience" value="UX/UI Designer • Frontend Developer • 1+ year" />
          <InfoBlock styles={styles} icon="🌍" title="International background" value="ES Spain • NL Netherlands • DE Germany • SE Sweden • CA Canada" />
          <InfoBlock
            styles={styles}
            icon="💡"
            title="Design philosophy"
            value="I approach design with the belief that software is ultimately built for humans, so empathy, curiosity, and diverse perspectives sit at the center of my process!"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <ActionButton
          styles={styles}
          icon="⬇️"
          label="Download Resume"
          onClick={() => {
            const a = document.createElement("a");
            a.href = "/resume.pdf";
            a.download = "Marta_Lendinez_Resume.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}
        />
        <ActionButton styles={styles} icon="🗂️" label="View Projects" onClick={() => onOpenWindow?.("projects")} />
      </div>
    </div>
  );
}