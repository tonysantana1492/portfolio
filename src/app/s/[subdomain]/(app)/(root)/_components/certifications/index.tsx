import { Panel, PanelHeader, PanelTitle } from "../panel";
import { CertificationItem } from "./certification-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import type { Profile } from "@/dtos/profile.dto";

export function Certifications({
  className,
  profile,
}: React.ComponentProps<typeof Panel> & { profile: Profile }) {
  return (
    <Panel className={className} id={profile.sections.certifications?.id}>
      <PanelHeader>
        <PanelTitle>
          {profile.sections.certifications?.name}
          <sup className="ml-1 select-none font-medium font-mono text-muted-foreground text-sm">
            ({profile.sections.certifications?.items.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={profile.sections.certifications?.items ?? []}
        max={8}
        renderItem={(item) => <CertificationItem certification={item} />}
      />
    </Panel>
  );
}
