import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { Markdown } from "@/components/shared/markdown";
import { Prose } from "@/components/ui/typography";
import type { Profile } from "@/dtos/profile.dto";

export function About({
  profile,
  className,
}: React.ComponentProps<typeof Panel> & { profile: Profile }) {
  return (
    <Panel className={className} id={profile.sections.about?.id}>
      <PanelHeader>
        <PanelTitle>{profile.sections.about?.name}</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <Prose>
          <Markdown>{profile.sections.about?.content}</Markdown>
        </Prose>
      </PanelContent>
    </Panel>
  );
}
