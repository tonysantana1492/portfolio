import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { Markdown } from "@/components/shared/markdown";
import { Prose } from "@/components/ui/typography";
import type { IProfile } from "@/content/profile";

export function About({
  profile,
  className,
}: React.ComponentProps<typeof Panel> & { profile: IProfile }) {
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
