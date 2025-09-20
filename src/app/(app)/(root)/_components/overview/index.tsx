import { MapPinIcon } from "lucide-react";

import { EmailItem } from "@/app/(app)/(root)/_components/overview/email-item";
import { IntroItem } from "@/app/(app)/(root)/_components/overview/intro-item";
import { JobItem } from "@/app/(app)/(root)/_components/overview/job-item";
import { PhoneItem } from "@/app/(app)/(root)/_components/overview/phone-item";
import { Panel, PanelContent } from "@/app/(app)/(root)/_components/panel";
import { USER } from "@/config/user.config";

export function Overview() {
  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>

      <PanelContent className="space-y-2">
        {USER.jobs.map((job) => {
          return (
            <JobItem
              key={job.company}
              title={job.title}
              company={job.company}
              website={job.website}
            />
          );
        })}

        <IntroItem icon={MapPinIcon} content={USER.address} />

        <PhoneItem phoneNumber={USER.phoneNumber} />

        <EmailItem email={USER.email} />

        {/* <IntroItem
          icon={GlobeIcon}
          content={urlToName(USER.website)}
          href={USER.website}
        /> */}

        {/* <IntroItem
          icon={USER.gender === "male" ? MarsIcon : VenusIcon}
          content={USER.pronouns}
        /> */}
      </PanelContent>
    </Panel>
  );
}
