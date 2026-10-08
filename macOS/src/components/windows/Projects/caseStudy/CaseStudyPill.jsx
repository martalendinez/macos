export default function CaseStudyPill({ children, theme }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-[3px] rounded-md text-[12px] font-medium border ${theme.pillClass}`}>
      {children}
    </span>
  );
}
