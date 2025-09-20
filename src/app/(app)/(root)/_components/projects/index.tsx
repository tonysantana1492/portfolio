import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ProjectItem } from "./project-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import { PROJECTS } from "@/config/projects";

export function Projects() {
  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          Projects
          <sup className="ml-1 select-none font-mono text-muted-foreground text-sm">
            ({PROJECTS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={PROJECTS}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  );
}
