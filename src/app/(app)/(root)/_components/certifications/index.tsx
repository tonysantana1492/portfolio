import { Panel, PanelHeader, PanelTitle } from "../panel";
import { CertificationItem } from "./certification-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import { CERTIFICATIONS } from "@/config/certifications";

export function Certifications() {
  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>
          Certifications
          <sup className="ml-1 select-none font-medium font-mono text-muted-foreground text-sm">
            ({CERTIFICATIONS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={CERTIFICATIONS}
        max={8}
        renderItem={(item) => <CertificationItem certification={item} />}
      />
    </Panel>
  );
}
