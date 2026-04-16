import TagBar from "./ui/TagBar";
import ProjectCard from "./ui/ProjectCard";
import useProjectStyles from "./ui/useProjectStyles";
import useTagFilter from "./hooks/useTagFilter";
import { PROJECTS } from "./data/projectData";

export default function ProjectsWindow({ uiTheme = "glass", onOpenWindow }) {
  const styles = useProjectStyles(uiTheme, "projects");
  const { activeTag, setActiveTag, allTags, filtered } = useTagFilter(PROJECTS);

  function handleLinkClick(link) {
    if (!link) return;

    if (link.action === "openEmployerBrandingCaseStudy") {
      onOpenWindow?.("employerBrandingCaseStudy");
      return;
    }

    if (link.action === "openStardewNotionCaseStudy") {
      onOpenWindow?.("stardewNotionCaseStudy");
      return;
    }

    // ⭐ NEW: Sällskap case study
    if (link.action === "openGroupDiningCaseStudy") {
      onOpenWindow?.("groupDiningCaseStudy");
      return;
    }

    if (link.action === "openThesisCaseStudy") {
  onOpenWindow?.("GroupDiningCaseStudyWindow");
  return;
}

    if (link.href && link.href !== "#") {
      window.open(link.href, "_blank", "noreferrer");
    }
  }

  return (
    <div className={`h-full w-full ${styles.isMac ? "bg-transparent" : ""}`}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`text-2xl font-semibold ${styles.textMain}`}>Projects</div>
            <div className={`mt-1 text-sm ${styles.textSub}`}>
              A hand-picked collection of my UX and research projects. Feel free to explore any
              project, dive into the case studies, and get a sense of my thinking and process!
            </div>
          </div>

          <TagBar tags={allTags} activeTag={activeTag} onPick={setActiveTag} styles={styles} />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              item={p}
              styles={styles}
              mode="projects"
              onAction={handleLinkClick}
            />
          ))}
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
