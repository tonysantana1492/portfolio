import { notFound } from "next/navigation";

import { getLLMText } from "@/lib/get-llm-text";
import { getPosts } from "@/services/blog";

export async function generateStaticParams() {
  const posts = getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const allPosts = getPosts();
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return new Response(await getLLMText(post), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
