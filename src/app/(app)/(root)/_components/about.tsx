import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { Markdown } from "@/components/shared/markdown";
import { Prose } from "@/components/ui/typography";
import { USER } from "@/config/user.config";

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <Prose>
          <Markdown>{USER.about}</Markdown>
        </Prose>
      </PanelContent>
    </Panel>
  );
}
