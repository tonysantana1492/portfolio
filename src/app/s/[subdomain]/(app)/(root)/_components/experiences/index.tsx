import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ExperienceItem } from "./experience-item";
import type { IProfile } from "@/content/profile";

export function Experiences({
  className,
  profile,
}: React.ComponentProps<typeof Panel> & { profile: IProfile }) {
  return (
    <Panel className={className} id={profile.sections.experiences?.id}>
      <PanelHeader>
        <PanelTitle>{profile.sections.experiences?.name}</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {profile.sections.experiences?.items.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </Panel>
  );
}
