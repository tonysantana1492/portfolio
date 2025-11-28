import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import dayjs from "dayjs";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { BlogPostSection } from "@/app/(app)/(docs)/blog/[slug]/_components/post-post-section";
import { SITE_INFO } from "@/config/site.config";
import { PROFILE } from "@/content/profile";
import {
  findNeighbour,
  getAllPosts,
  getAllPostsSlug,
  getPostBySlug,
  type Post,
} from "@/services/blog";

export async function generateStaticParams() {
  const posts = getAllPostsSlug();

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
  const fullPostUrl = `${SITE_INFO.url}${postUrl}`;
  const ogImage = image || `/og/simple?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical: fullPostUrl,
    },
    openGraph: {
      url: fullPostUrl,
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

function getPostUrl(post: Post) {
  return `/blog/${post.slug}`;
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
    datePublished: dayjs(post.metadata.createdAt).toISOString(),
    dateModified: dayjs(post.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: PROFILE.displayName,
      identifier: PROFILE.username,
      image: PROFILE.avatar,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const { previous, next } = findNeighbour(allPosts, slug);

  return (
    <>
      <Script type="application/ld+json">
        {JSON.stringify(getPageJsonLd(post)).replace(/</g, "\\u003c")}
      </Script>
      <BlogPostSection post={post} previous={previous} next={next} />
    </>
  );
}
