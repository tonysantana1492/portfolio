import { Suspense } from "react";

import type { Metadata } from "next";

import { PostList } from "@/app/(app)/(docs)/blog/[slug]/_components/post-list";
import { PostListWithSearch } from "@/app/(app)/(docs)/blog/[slug]/_components/post-list-with-search";
import { PostSearchInput } from "@/app/(app)/(docs)/blog/[slug]/_components/post-search-input";
import { SITE_INFO } from "@/config/site.config";
import { getAllPosts } from "@/services/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on development, design, and ideas.",
  alternates: {
    canonical: `${SITE_INFO.url}/blog`,
  },
};

export default function Page() {
  const allPosts = getAllPosts();

  return (
    <>
      <div className="screen-line-after px-4">
        <h1 className="font-semibold text-3xl">Blog</h1>
      </div>

      <div className="screen-line-after p-4">
        <p className="text-balance font-mono text-muted-foreground text-sm">
          {metadata.description}
        </p>
      </div>

      <div className="screen-line-before screen-line-after p-2">
        <Suspense
          fallback={
            <div className="flex h-9 w-full rounded-lg border border-input shadow-xs dark:bg-input/30" />
          }
        >
          <PostSearchInput />
        </Suspense>
      </div>

      <Suspense fallback={<PostList posts={allPosts} />}>
        <PostListWithSearch posts={allPosts} />
      </Suspense>
      <div className="h-4" />
    </>
  );
}
