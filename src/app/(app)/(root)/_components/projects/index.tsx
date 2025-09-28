import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ProjectItem } from "./project-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import type { IProfile } from "@/content/profile";

export function Projects({
  className,
  profile,
}: React.ComponentProps<typeof Panel> & { profile: IProfile }) {
  return (
    <Panel className={className} id={profile.sections.projects?.id}>
      <PanelHeader>
        <PanelTitle>
          {profile.sections.projects?.name}
          <sup className="ml-1 select-none font-mono text-muted-foreground text-sm">
            ({profile.sections.projects?.items.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={profile.sections.projects?.items ?? []}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  );
}
