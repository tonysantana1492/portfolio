import dayjs from "dayjs";

import { AwardItem } from "@/app/(app)/(root)/_components/awards/award-item";
import { CollapsibleList } from "@/components/shared/collapsible-list";
import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { AWARDS } from "@/config/awards";

const SORTED_AWARDS = [...AWARDS].sort((a, b) => {
  return dayjs(b.date).diff(dayjs(a.date));
});

export function Awards() {
  return (
    <Panel id="awards">
      <PanelHeader>
        <PanelTitle>
          Honors & Awards
          <sup className="ml-1 select-none font-medium font-mono text-muted-foreground text-sm">
            ({AWARDS.length})
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
