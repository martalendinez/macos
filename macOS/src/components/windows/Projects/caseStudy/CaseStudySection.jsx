import { motion } from "framer-motion";
import { useCaseStudyContext } from "./CaseStudyLayout";

export default function CaseStudySection({ id, title, subtitle, theme, children }) {
  const { sections } = useCaseStudyContext();
  const index = sections.findIndex((s) => s.id === id);

  return (
    <motion.section
      id={id}
      className="scroll-mt-16 mt-20 first:mt-12"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2.5">
        {index >= 0 && (
          <span className={`text-[12px] font-semibold tabular-nums ${theme.accentText}`}>{String(index + 1).padStart(2, "0")}</span>
        )}
        <span className={`h-px w-6 ${theme.isDark ? "bg-white/20" : "bg-black/15"}`} />
        {subtitle ? <span className={`text-[12px] font-medium uppercase tracking-[0.06em] ${theme.textSub}`}>{subtitle}</span> : null}
      </div>
      <h2 className={`mt-2 text-[28px] @2xl:text-[32px] font-bold tracking-[-0.02em] leading-tight ${theme.textMain}`}>{title}</h2>
      <div className={`mt-6 text-[16px] leading-[1.8] ${theme.textBody}`}>{children}</div>
    </motion.section>
  );
}
