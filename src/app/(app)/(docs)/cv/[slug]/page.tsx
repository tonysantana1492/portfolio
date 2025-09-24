import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import dayjs from "dayjs";
import { getTableOfContents } from "fumadocs-core/server";
import { ArrowLeftIcon } from "lucide-react";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { LLMCopyButtonWithViewOptions } from "@/components/ai/page-actions";
import { InlineTOC } from "@/components/shared/inline-toc";
import { MDX } from "@/components/shared/mdx";
import { ShareMenu } from "@/components/shared/share-menu";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/typography";
import { SITE_INFO } from "@/config/site.config";
import { USER } from "@/config/user.config";
import { cn } from "@/lib/utils";
import { type Cv, getAllCVs, getCvBySlug } from "@/services/cv";

export async function generateStaticParams() {
  const cvs = getAllCVs();
  return cvs.map((cv) => ({
    slug: cv.slug,
  }));
}

function getCvUrl(cv: Cv) {
  return `/cv/${cv.slug}`;
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
    title,
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
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
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
  const slug = (await params).slug;
  const cv = getCvBySlug(slug);

  if (!cv) {
    notFound();
  }

  const toc = getTableOfContents(cv.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(cv)).replace(/</g, "\\u003c"),
        }}
      />

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

      <Prose className="px-12">
        <InlineTOC className="mt-2" items={toc} />

        <div>
          <MDX code={cv.content} />
        </div>
      </Prose>

      <div className="screen-line-before h-4 w-full" />
    </>
  );
}
