import Image from "next/image";

import { ExperiencePositionItem } from "@/app/(app)/(root)/_components/experiences/experience-position-item";
import type { Experience } from "@/content/profile";

export function EducationItem({ education }: { education: Experience }) {
  return (
    <div className="screen-line-after space-y-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center">
          {education.companyLogo ? (
            <Image
              src={education.companyLogo}
              alt={education.companyName}
              width={24}
              height={24}
              quality={100}
              className="rounded-full"
              unoptimized
              aria-hidden
            />
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <h3 className="font-medium text-lg leading-snug">
          {education.companyName}
        </h3>

        {education.isCurrentEmployer && (
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-info opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-info" />
            <span className="sr-only">Current Employer</span>
          </span>
        )}
      </div>

      <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
        {education.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
}
