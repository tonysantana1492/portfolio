"use client";

import { PostList } from "./post-list";
import { useFilteredPosts } from "@/app/(app)/(docs)/blog/[slug]/_hooks/use-filtered-posts";
import type { Post } from "@/types/post";

export function PostListWithSearch({ posts }: { posts: Post[] }) {
  const filteredPosts = useFilteredPosts(posts);
  return <PostList posts={filteredPosts} />;
}
