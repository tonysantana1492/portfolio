"use client";

import { useRouter } from "next/navigation";

import { useHotkeys } from "react-hotkeys-hook";
import type { Post } from "@/types/post";

export function PostKeyboardShortcuts({
  basePath,
  previous,
  next,
}: {
  basePath: string;
  previous: Post | null;
  next: Post | null;
}) {
  const router = useRouter();

  const navigate = (post: Post | null) => {
    if (post) {
      router.push(`${basePath}/${post.slug}`);
    }
  };

  useHotkeys("ArrowRight", () => navigate(next));
  useHotkeys("ArrowLeft", () => navigate(previous));

  return null;
}
