import dayjs from "dayjs";
import type { ProfilePage, WithContext } from "schema-dts";

import { About } from "@/app/(app)/(root)/_components/about";
import { Awards } from "@/app/(app)/(root)/_components/awards";
import { Blog } from "@/app/(app)/(root)/_components/blog";
import { Certifications } from "@/app/(app)/(root)/_components/certifications";
import { Educations } from "@/app/(app)/(root)/_components/educations";
import { Experiences } from "@/app/(app)/(root)/_components/experiences";
import { HeroSeparator } from "@/app/(app)/(root)/_components/hero-separator";
import { Overview } from "@/app/(app)/(root)/_components/overview";
import { ProfileHeader } from "@/app/(app)/(root)/_components/profile-header";
import { Projects } from "@/app/(app)/(root)/_components/projects";
import { SocialLinks } from "@/app/(app)/(root)/_components/social-links";
import { TeckStack } from "@/app/(app)/(root)/_components/teck-stack";
import { PROFILE } from "@/content/profile";

function getPageJsonLd(): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: dayjs(PROFILE.dateCreated).toISOString(),
    dateModified: dayjs().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: PROFILE.displayName,
      identifier: PROFILE.username,
      image: PROFILE.avatar,
    },
  };
}

export default function Page() {
  const profile = PROFILE;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto md:max-w-3xl">
        <ProfileHeader profile={profile} />
        <HeroSeparator />
        <Overview profile={profile} />
        <HeroSeparator />

        {profile.sections.socialLinks && (
          <>
            <SocialLinks profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.about && (
          <>
            <About profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.sections.techStack && (
          <>
            <TeckStack profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.sections.experiences && (
          <>
            <Experiences profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.sections.educations && (
          <>
            <Educations profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.sections.projects && (
          <>
            <Projects profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.sections.certifications && (
          <>
            <Certifications profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.sections.awards && (
          <>
            <Awards profile={profile} />
            <HeroSeparator />
          </>
        )}

        <Blog />
        <HeroSeparator />
      </div>
    </>
  );
}
