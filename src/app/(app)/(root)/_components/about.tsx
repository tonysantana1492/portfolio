import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { Markdown } from "@/components/shared/markdown";
import { Prose } from "@/components/ui/typography";
import type { IProfile } from "@/content/profile";

export function About({
  profile,
  className,
}: React.ComponentProps<typeof Panel> & { profile: IProfile }) {
  return (
    <Panel className={className} id="about">
      <PanelHeader>
        <PanelTitle>{profile.about.label}</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <Prose>
          <Markdown>{profile.about.content}</Markdown>
        </Prose>
      </PanelContent>
    </Panel>
  );
}
