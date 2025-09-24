import { Panel, PanelHeader, PanelTitle } from "../panel";
import { CertificationItem } from "./certification-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import { PROFILE } from "@/content/profile";

export function Certifications() {
  return (
    <Panel id={PROFILE.sections.certifications.id}>
      <PanelHeader>
        <PanelTitle>
          {PROFILE.sections.certifications.name}
          <sup className="ml-1 select-none font-medium font-mono text-muted-foreground text-sm">
            ({PROFILE.sections.certifications.items.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={PROFILE.sections.certifications.items}
        max={8}
        renderItem={(item) => <CertificationItem certification={item} />}
      />
    </Panel>
  );
}
