"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation >
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    document.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
          if (
            (e.target instanceof HTMLElement && e.target.isContentEditable) ||
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
          ) {
            return;
          }

          e.preventDefault();

          if (e.key === "ArrowRight") {
            navigate(next);
          } else {
            navigate(previous);
          }
        }
      },
      { signal }
    );

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
