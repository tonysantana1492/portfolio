import { About } from "@/app/(app)/(root)/_components/about";
import { HeroSeparator } from "@/app/(app)/(root)/_components/hero-separator";
import { Overview } from "@/app/(app)/(root)/_components/overview";
import { ProfileHeader } from "@/app/(app)/(root)/_components/profile-header";
import { SocialLinks } from "@/app/(app)/(root)/_components/social-links";

export default function Page() {
  return (
    <div className="mx-auto md:max-w-3xl">
      <ProfileHeader />
      <HeroSeparator />
      <Overview />
      <HeroSeparator />
      <SocialLinks />
      <HeroSeparator />
      <About />
      <HeroSeparator />
    </div>
  );
}
