import { Panel, PanelHeader, PanelTitle } from "../panel";
import { EducationItem } from "@/app/(app)/(root)/_components/educations/education-item";
import { EDUCATIONS } from "@/config/experiences";

export function Educations() {
  return (
    <Panel id="education">
      <PanelHeader>
        <PanelTitle>Education</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {EDUCATIONS.map((education) => (
          <EducationItem key={education.id} education={education} />
        ))}
      </div>
    </Panel>
  );
}
