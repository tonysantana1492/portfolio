import { Panel, PanelHeader, PanelTitle } from "../panel";
import { EducationItem } from "@/app/(app)/(root)/_components/educations/education-item";
import { PROFILE } from "@/content/profile";

export function Educations() {
  return (
    <Panel id={PROFILE.sections.educations.id}>
      <PanelHeader>
        <PanelTitle>{PROFILE.sections.educations.name}</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {PROFILE.sections.educations.items.map((education) => (
          <EducationItem key={education.id} education={education} />
        ))}
      </div>
    </Panel>
  );
}
