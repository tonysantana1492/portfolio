import "./print.css";

import { MDX } from "@/components/shared/mdx";
import { PROFILE } from "@/content/profile";
import { cvToMdx } from "@/lib/cv-to-mdx";

export const dynamic = "force-dynamic";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // const slug = (await params).slug;

  const mdx = cvToMdx(PROFILE);

  return (
    <div className="print-container">
      <MDX code={mdx} />
    </div>
  );
}
