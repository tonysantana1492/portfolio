import dayjs from "dayjs";

import { AwardItem } from "@/app/(app)/(root)/_components/awards/award-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { PROFILE } from "@/content/profile";

export function Awards() {
  const SORTED_AWARDS = [...PROFILE.sections.awards.items].sort((a, b) => {
    return dayjs(b.date).diff(dayjs(a.date));
  });

  return (
    <Panel id={PROFILE.sections.awards.id}>
      <PanelHeader>
        <PanelTitle>
          {PROFILE.sections.awards.name}
          <sup className="ml-1 select-none font-medium font-mono text-muted-foreground text-sm">
            ({SORTED_AWARDS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={SORTED_AWARDS}
        max={8}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <AwardItem award={item} />}
      />
    </Panel>
  );
}
