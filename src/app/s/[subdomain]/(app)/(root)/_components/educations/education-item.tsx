import { ExperiencePositionItem } from "@/app/s/[subdomain]/(app)/(root)/_components/experiences/experience-position-item";
import type { Experience } from "@/content/profile";

export function EducationItem({ education }: { education: Experience }) {
  return (
    <div className="screen-line-after space-y-4 py-4">
      <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
        {education?.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
}
