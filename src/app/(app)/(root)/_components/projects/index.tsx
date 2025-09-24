import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ProjectItem } from "./project-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import { PROFILE } from "@/content/profile";

export function Projects() {
  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          {PROFILE.sections.projects.name}
          <sup className="ml-1 select-none font-mono text-muted-foreground text-sm">
            ({PROFILE.sections.projects.items.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={PROFILE.sections.projects.items}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  );
}
