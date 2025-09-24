import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ExperienceItem } from "./experience-item";
import { PROFILE } from "@/content/profile";

export function Experiences() {
  return (
    <Panel id={PROFILE.sections.experiences.id}>
      <PanelHeader>
        <PanelTitle>{PROFILE.sections.experiences.name}</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {PROFILE.sections.experiences.items.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </Panel>
  );
}
