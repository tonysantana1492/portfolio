import { Panel, PanelHeader, PanelTitle } from "../panel";
import { EducationItem } from "@/app/s/[subdomain]/(app)/(root)/_components/educations/education-item";
import type { IProfile } from "@/content/profile";

export function Educations({
  className,
  profile,
}: React.ComponentProps<typeof Panel> & { profile: IProfile }) {
  return (
    <Panel className={className} id={profile.sections.educations?.id}>
      <PanelHeader>
        <PanelTitle>{profile.sections.educations?.name}</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {profile.sections.educations?.items.map((education) => (
          <EducationItem key={education.id} education={education} />
        ))}
      </div>
    </Panel>
  );
}
