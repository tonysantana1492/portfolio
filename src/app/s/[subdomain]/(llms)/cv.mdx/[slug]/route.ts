import { notFound } from "next/navigation";

import { getLLMText } from "@/lib/get-llm-text";
import { getAllCVs } from "@/services/cv";

export async function generateStaticParams() {
  const cvs = getAllCVs();

  return cvs.map((cv) => ({
    slug: cv.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const allCVs = getAllCVs();
  const cv = allCVs.find((cv) => cv.slug === slug);

  if (!cv) {
    notFound();
  }

  return new Response(await getLLMText(cv), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
