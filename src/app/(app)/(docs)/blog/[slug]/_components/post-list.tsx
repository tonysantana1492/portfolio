import { PostItem } from "./post-item";
import type { Post } from "@/types/post";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="relative pt-4">
      <div className="-z-1 absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
        <div className="border-edge border-r" />
        <div className="border-edge border-l" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post, index) => (
          <PostItem
            key={post.slug}
            post={post}
            shouldPreloadImage={index <= 4}
          />
        ))}

        {posts.length === 0 && (
          <div className="screen-line-before screen-line-after p-4">
            <p className="font-mono text-sm">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
