// src/components/windows/About/tabs/SkillsTab.jsx
import SkillGroup from "../components/SkillGroup";
import SkillRow from "../components/SkillRow";

export default function SkillsTab({ styles }) {
  const isMac = styles.isMac;

  return (
    <div className="space-y-5">
      <SkillGroup styles={styles} title="DESIGN TOOLS" icon="🎨">
        <SkillRow styles={styles} isMac={isMac} name="Figma" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Adobe XD" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Photoshop" level="Proficient" />
        <SkillRow styles={styles} isMac={isMac} name="Illustrator" level="Intermediate" />
        <SkillRow styles={styles} isMac={isMac} name="Framer" level="Basic" />
      </SkillGroup>

      <SkillGroup styles={styles} title="DEVELOPMENT" icon="💻">
        <SkillRow styles={styles} isMac={isMac} name="React" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="TypeScript" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="HTML/CSS" level="Expert" />
        <SkillRow styles={styles} isMac={isMac} name="JavaScript" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Tailwind CSS" level="Proficient" />
        <SkillRow styles={styles} isMac={isMac} name="Python" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="SQL" level="Proficient" />
        <SkillRow styles={styles} isMac={isMac} name="Docker" level="Basic" />
        <SkillRow styles={styles} isMac={isMac} name="Git" level="Advanced" />
      </SkillGroup>

      <SkillGroup styles={styles} title="AI TOOLS" icon="🤖">
        <SkillRow styles={styles} isMac={isMac} name="Claude" level="Intermediate" />
        <SkillRow styles={styles} isMac={isMac} name="Supabase" level="Intermediate" />
        <SkillRow styles={styles} isMac={isMac} name="Loveable" level="Intermediate" />
      </SkillGroup>

      <SkillGroup styles={styles} title="UX RESEARCH & METHODS" icon="🔬">
        <SkillRow styles={styles} isMac={isMac} name="User Interviews" level="Expert" />
        <SkillRow styles={styles} isMac={isMac} name="Usability Testing" level="Expert" />
        <SkillRow styles={styles} isMac={isMac} name="Survey Design" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Persona Creation" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Journey Mapping" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="A/B Testing" level="Advanced" />
      </SkillGroup>
    </div>
  );
}