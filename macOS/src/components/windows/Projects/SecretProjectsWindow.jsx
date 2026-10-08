import TagBar from "./ui/TagBar";
import ProjectCard from "./ui/ProjectCard";
import useProjectStyles from "./ui/useProjectStyles";
import useTagFilter from "./hooks/useTagFilter";
import { SECRET_PROJECTS } from "./data/secretProjectsData";

export default function SecretProjectsWindow({ uiTheme = "glass", onOpenWindow }) {
  const styles = useProjectStyles(uiTheme, "secret");
  const { activeTag, setActiveTag, allTags, filtered } = useTagFilter(SECRET_PROJECTS);

  function handleAction(action) {
    if (!action) return;
    if (action.action === "openSecretWindow" && action.id) {
      onOpenWindow?.(action.id); // opens "behindTheButton"
    }
  }

  return (
    <div className={`h-full w-full ${styles.isMac ? "bg-transparent" : ""}`}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`text-2xl font-semibold ${styles.textMain}`}>
              Secret Projects{" "}
              <span className={`${styles.textSub} text-sm align-middle`}>(work in progress)</span>
            </div>

            <div className={`mt-1 text-sm ${styles.textSub}`}>
              This is a <span className="font-medium">WIP vault</span> — unfinished concepts and
              “to-do next” ideas. Open any card to see the full draft in its own window.
            </div>

            {!styles.isMac && (
              <div className="mt-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs">
                <span style={{ color: "hsl(var(--accent))" }}>STATUS</span>{" "}
                <span className="text-white/70">WIP · prototypes pending · research queued</span>
              </div>
            )}
          </div>

          <TagBar tags={allTags} activeTag={activeTag} onPick={setActiveTag} styles={styles} />
        </div>

        <div className="mt-6 grid grid-cols-1 @4xl:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} item={p} styles={styles} mode="secret" onAction={handleAction} />
          ))}
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}