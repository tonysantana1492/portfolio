import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import { getTableOfContents } from "fumadocs-core/content/toc";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { PostShareMenu } from "@/app/(app)/(docs)/blog/[slug]/_components/post-share-menu";
import { LLMCopyButtonWithViewOptions } from "@/components/ai/page-actions";
import { InlineTOC } from "@/components/shared/inline-toc";
import { MDX } from "@/components/shared/mdx";
import { PostKeyboardShortcuts } from "@/components/shared/post-keyboard-shortcuts";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Prose } from "@/components/ui/typography";
import { SITE_INFO } from "@/config/site.config";
import { PROFILE } from "@/content/profile";
import { cn } from "@/lib/utils";
import { findNeighbour, getAllPosts, getPostBySlug } from "@/services/blog";
import type { Post } from "@/types/post";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const { title, description, image, createdAt, updatedAt } = post.metadata;

  const postUrl = getPostUrl(post);
  const ogImage = image || `/og/simple?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
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

function getPageJsonLd(post: Post): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    image:
      post.metadata.image ||
      `/og/simple?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${SITE_INFO.url}${getPostUrl(post)}`,
    datePublished: new Date(post.metadata.createdAt).toISOString(),
    dateModified: new Date(post.metadata.updatedAt).toISOString(),
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
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const toc = getTableOfContents(post.content);

  const allPosts = getAllPosts();
  const { previous, next } = findNeighbour(allPosts, slug);

  return (
    <>
      <Script type="application/ld+json">
        {JSON.stringify(getPageJsonLd(post)).replace(/</g, "\\u003c")}
      </Script>

      <PostKeyboardShortcuts basePath="/blog" previous={previous} next={next} />

      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 rounded-lg px-0 font-mono text-muted-foreground"
          variant="link"
          asChild
        >
          <Link href="/blog">
            <ArrowLeftIcon />
            Blog
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`${getPostUrl(post)}.mdx`}
            isComponent={post.metadata.category === "components"}
          />

          <PostShareMenu url={getPostUrl(post)} />

          {previous && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" asChild>
                  <Link href={`/blog/${previous.slug}`}>
                    <ArrowLeftIcon />
                    <span className="sr-only">Previous</span>
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Previous Post
                  <KbdGroup>
                    <Kbd>
                      <ArrowLeftIcon />
                    </Kbd>
                  </KbdGroup>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {next && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" asChild>
                  <Link href={`/blog/${next.slug}`}>
                    <span className="sr-only">Next</span>
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Next Post
                  <KbdGroup>
                    <Kbd>
                      <ArrowRightIcon />
                    </Kbd>
                  </KbdGroup>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
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

      <Prose className="px-4">
        <h1 className="screen-line-after font-semibold text-3xl">
          {post.metadata.title}
        </h1>

        <p className="text-muted-foreground">{post.metadata.description}</p>

        <InlineTOC items={toc} />

        <div>
          <MDX code={post.content} />
        </div>
      </Prose>

      <div className="screen-line-before h-4 w-full" />
    </>
  );
}

function getPostUrl(post: Post) {
  return `/blog/${post.slug}`;
}
