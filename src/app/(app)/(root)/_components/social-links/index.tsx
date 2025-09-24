import { Panel } from "../panel";
import { SocialLinkItem } from "./social-link-item";
import { PROFILE } from "@/content/profile";

export function SocialLinks() {
  return (
    <Panel>
      <h2 className="sr-only">{PROFILE.sections.socialLinks.name}</h2>

      <div className="relative">
        <div className="-z-1 pointer-events-none absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-edge border-r"></div>
          <div className="border-edge border-l"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROFILE.sections.socialLinks.items.map((link) => {
            return <SocialLinkItem key={link.href} {...link} />;
          })}
        </div>
      </div>
    </Panel>
  );
}
