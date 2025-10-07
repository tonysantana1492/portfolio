import { MapPinIcon } from "lucide-react";

import { EmailItem } from "@/app/s/[subdomain]/(app)/(root)/_components/overview/email-item";
import { IntroItem } from "@/app/s/[subdomain]/(app)/(root)/_components/overview/intro-item";
import { JobItem } from "@/app/s/[subdomain]/(app)/(root)/_components/overview/job-item";
import { PhoneItem } from "@/app/s/[subdomain]/(app)/(root)/_components/overview/phone-item";
import {
  Panel,
  PanelContent,
} from "@/app/s/[subdomain]/(app)/(root)/_components/panel";
import type { Profile } from "@/dtos/profile.dto";
import { getLastCompany } from "@/services/blog";

export function Overview({
  profile,
  className,
}: React.ComponentProps<typeof Panel> & { profile: Profile }) {
  const lastCompany = getLastCompany(profile.sections.experiences?.items ?? []);

  return (
    <Panel className={className}>
      <h2 className="sr-only">Overview</h2>

      <PanelContent className="space-y-2">
        {lastCompany && (
          <JobItem
            key={lastCompany.companyName}
            title={lastCompany.positions[0].title}
            company={lastCompany.companyName}
            website={lastCompany.website ?? ""}
          />
        )}

        <IntroItem icon={MapPinIcon} content={profile.address} />

        <PhoneItem phoneNumber={profile.phoneNumber} />

        <EmailItem email={profile.email} />

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
