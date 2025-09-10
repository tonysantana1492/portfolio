import { Panel } from "../panel";
import { SocialLinkItem } from "./social-link-item";
import { SOCIAL_LINKS } from "@/config/social-links.config";

export function SocialLinks() {
  return (
    <Panel>
      <h2 className="sr-only">Social Links</h2>

      <div className="relative">
        <div className="-z-1 pointer-events-none absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-edge border-r"></div>
          <div className="border-edge border-l"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOCIAL_LINKS.map((link) => {
            return <SocialLinkItem key={link.href} {...link} />;
          })}
        </div>
      </div>
    </Panel>
  );
}
