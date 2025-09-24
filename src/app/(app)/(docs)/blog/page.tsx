import type { Metadata } from "next";

import dayjs from "dayjs";

import { PostItem } from "@/app/(app)/(root)/_components/post-item";
import { getAllPosts } from "@/services/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on development, design, and ideas.",
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

      <div className="relative pt-4">
        <div className="-z-1 absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-edge border-r"></div>
          <div className="border-edge border-l"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allPosts
            .slice()
            .sort((a, b) =>
              dayjs(b.metadata.createdAt).diff(dayjs(a.metadata.createdAt)),
            )
            .map((post, index) => (
              <PostItem
                key={post.slug}
                post={post}
                shouldPreloadImage={index <= 4}
              />
            ))}
        </div>
      </div>

      <div className="h-4" />
    </>
  );
}
