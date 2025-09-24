import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { Markdown } from "@/components/shared/markdown";
import { Prose } from "@/components/ui/typography";
import { PROFILE } from "@/content/profile";

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>{PROFILE.about.label}</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <Prose>
          <Markdown>{PROFILE.about.content}</Markdown>
        </Prose>
      </PanelContent>
    </Panel>
  );
}
