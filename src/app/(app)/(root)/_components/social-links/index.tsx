import { Panel } from "../panel";
import { SocialLinkItem } from "./social-link-item";
import type { IProfile } from "@/content/profile";

export function SocialLinks({
  profile,
  className,
}: React.ComponentProps<typeof Panel> & { profile: IProfile }) {
  return (
    <Panel className={className} id={profile.sections.socialLinks?.id}>
      <h2 className="sr-only">{profile.sections.socialLinks?.name}</h2>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-edge border-r"></div>
          <div className="border-edge border-l"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profile.sections.socialLinks?.items.map((link) => {
            return <SocialLinkItem key={link.href} {...link} />;
          })}
        </div>
      </div>
    </Panel>
  );
}
