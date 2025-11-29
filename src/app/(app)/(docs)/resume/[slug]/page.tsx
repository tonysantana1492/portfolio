import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import dayjs from "dayjs";
import { ArrowLeftIcon } from "lucide-react";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { ExportButton } from "@/app/(app)/(docs)/resume/[slug]/_components/export-button";
import { LLMCopyButtonWithViewOptions } from "@/components/ai/page-actions";
import { MDX } from "@/components/shared/mdx";
import { ShareMenu } from "@/components/shared/share-menu";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/typography";
import { SITE_INFO } from "@/config/site.config";
import { PROFILE } from "@/content/profile";
import { cvToMdx } from "@/lib/cv-to-mdx";
import { cn } from "@/lib/utils";
import { type Cv, getAllCVs, getCvBySlug } from "@/services/resume";

export async function generateStaticParams() {
  const cvs = getAllCVs();
  return cvs.map((cv) => ({
    slug: cv.slug,
  }));
}

function getCvUrl(cv: Cv) {
  return `/resume/${cv.slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const cv = getCvBySlug(slug);

  if (!cv) {
    return notFound();
  }

  const { title, description, image, createdAt, updatedAt } = cv.metadata;

  const cvUrl = getCvUrl(cv);
  const ogImage = image || `/og/simple?title=${encodeURIComponent(title)}`;

  return {
    title: "Resume",
    description,
    alternates: {
      canonical: cvUrl,
    },
    openGraph: {
      url: cvUrl,
      type: "article",
      publishedTime: dayjs(createdAt).toISOString(),
      modifiedTime: dayjs(updatedAt).toISOString(),
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

function getPageJsonLd(cv: Cv): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: cv.metadata.title,
    description: cv.metadata.description,
    image:
      cv.metadata.image ||
      `/og/simple?title=${encodeURIComponent(cv.metadata.title)}`,
    url: `${SITE_INFO.url}${getCvUrl(cv)}`,
    datePublished: dayjs(cv.metadata.createdAt).toISOString(),
    dateModified: dayjs(cv.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: PROFILE.displayName,
      identifier: PROFILE.username,
      image: PROFILE.avatar,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const cv = getCvBySlug(slug);

  if (!cv) {
    notFound();
  }

  const mdx = cvToMdx(PROFILE);

  return (
    <>
      <Script type="application/ld+json">
        {JSON.stringify(getPageJsonLd(cv)).replace(/</g, "\\u003c")}
      </Script>

      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 rounded-lg px-0 font-mono text-muted-foreground"
          variant="link"
          asChild
        >
          <Link href="/">
            <ArrowLeftIcon />
            Home
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <ExportButton
              size="icon:sm"
              slug={slug}
              fileName={cv.metadata.title}
            />
          </div>

          <LLMCopyButtonWithViewOptions
            markdownUrl={`${getCvUrl(cv)}.mdx`}
            isComponent={false}
          />

          <ShareMenu url={getCvUrl(cv)} />
        </div>
      </div>

      <div className="screen-line-before screen-line-after">
        <div
          className={cn(
            "h-8",
            "before:-left-[100vw] before:-z-1 before:absolute before:h-full before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"
          )}
        />
      </div>

      <Prose className="px-4 xl:px-16">
        <div id="mdx-print-root">
          <MDX code={mdx} />
        </div>
      </Prose>

      <div className="screen-line-before h-4 w-full" />
    </>
  );
}
