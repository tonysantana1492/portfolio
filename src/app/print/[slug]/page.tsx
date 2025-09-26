import { notFound } from "next/navigation";

import "./print.css";

import { MDX } from "@/components/shared/mdx";
import { getCvBySlug } from "@/services/cv";

export const dynamic = "force-dynamic";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const cv = getCvBySlug(slug);

  if (!cv) {
    notFound();
  }

  return (
    <div className="print-container">
      <MDX code={cv.content} />
    </div>
  );
}
