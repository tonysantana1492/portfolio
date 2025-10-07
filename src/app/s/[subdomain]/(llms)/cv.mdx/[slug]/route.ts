import { notFound } from "next/navigation";

import { getLLMText } from "@/lib/get-llm-text";
import { getCVs } from "@/services/cv.service";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const cvs = getCVs();

  return cvs.map((cv) => ({
    slug: cv.slug,
  }));
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const allCVs = getCVs();
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
