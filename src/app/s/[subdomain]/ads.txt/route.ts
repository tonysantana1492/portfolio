import { notFound } from "next/navigation";

export const dynamic = "force-static";

export function GET() {
  if (!process.env.ADS_TXT) {
    notFound();
  }

  return new Response(process.env.ADS_TXT, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
