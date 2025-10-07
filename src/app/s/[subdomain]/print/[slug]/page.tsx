import "./print.css";

import { MDX } from "@/components/shared/mdx";
import { cvToMdx } from "@/lib/cv-to-mdx";
import { profileRepository } from "@/repository/profile.repository";

export const dynamic = "force-dynamic";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const profile = await profileRepository.getProfileBySubdomain(slug);

  if (!profile) {
    return null;
  }

  const mdx = cvToMdx(profile);

  return (
    <div className="print-container">
      <MDX code={mdx} />
    </div>
  );
}
