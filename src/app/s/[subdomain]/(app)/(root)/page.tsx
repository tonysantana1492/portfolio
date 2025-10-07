import { notFound } from "next/navigation";

import dayjs from "dayjs";
import type { ProfilePage, WithContext } from "schema-dts";

import { About } from "@/app/s/[subdomain]/(app)/(root)/_components/about";
import { Awards } from "@/app/s/[subdomain]/(app)/(root)/_components/awards";
import { Blog } from "@/app/s/[subdomain]/(app)/(root)/_components/blog";
import { Certifications } from "@/app/s/[subdomain]/(app)/(root)/_components/certifications";
import { Educations } from "@/app/s/[subdomain]/(app)/(root)/_components/educations";
import { Experiences } from "@/app/s/[subdomain]/(app)/(root)/_components/experiences";
import { GitHubContributions } from "@/app/s/[subdomain]/(app)/(root)/_components/github-contributions";
import { HeroSeparator } from "@/app/s/[subdomain]/(app)/(root)/_components/hero-separator";
import { Overview } from "@/app/s/[subdomain]/(app)/(root)/_components/overview";
import { ProfileHeader } from "@/app/s/[subdomain]/(app)/(root)/_components/profile-header";
import { Projects } from "@/app/s/[subdomain]/(app)/(root)/_components/projects";
import { SocialLinks } from "@/app/s/[subdomain]/(app)/(root)/_components/social-links";
import { TeckStack } from "@/app/s/[subdomain]/(app)/(root)/_components/teck-stack";
import type { Profile } from "@/dtos/profile.dto";
import { profileRepository } from "@/repository/profile.repository";

function getPageJsonLd(profile: Profile): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: dayjs(profile.createdAt).toISOString(),
    dateModified: dayjs().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: profile.displayName,
      identifier: profile.username,
      image: profile.avatar,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  // Validate subdomain parameter
  if (!subdomain || typeof subdomain !== "string" || subdomain.trim() === "") {
    notFound();
  }

  const profile = await profileRepository.getProfileBySubdomain(subdomain);

  if (!profile) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(profile)).replace(
            /</g,
            "\\u003c",
          ),
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

        {profile.sections.about && (
          <>
            <About profile={profile} />
            <HeroSeparator />
          </>
        )}

        {profile.githubUserName && (
          <>
            <GitHubContributions profile={profile} />
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
