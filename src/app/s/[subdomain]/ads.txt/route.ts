import { notFound } from "next/navigation";

import { APP_CONFIG } from "@/config/app.config";

export const dynamic = "force-static";

export function GET() {
  if (!APP_CONFIG.ADS_TXT) {
    notFound();
  }

  return new Response(APP_CONFIG.ADS_TXT, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
