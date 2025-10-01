"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PROTOCOL, ROOT_DOMAIN } from "@/config/app.config";

export default function NotFound() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Extract subdomain from URL if we're on a subdomain page
    if (pathname?.startsWith("/subdomain/")) {
      const extractedSubdomain = pathname.split("/")[2];
      if (extractedSubdomain) {
        setSubdomain(extractedSubdomain);
      }
    } else {
      // Try to extract from hostname for direct subdomain access
      const hostname = window.location.hostname;
      if (hostname.includes(`.${ROOT_DOMAIN.split(":")[0]}`)) {
        const extractedSubdomain = hostname.split(".")[0];
        setSubdomain(extractedSubdomain);
      }
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <h1 className="font-bold text-4xl text-gray-900 tracking-tight">
          {subdomain ? (
            <>
              <span className="text-blue-600">{subdomain}</span>.{ROOT_DOMAIN}{" "}
              doesn't exist
            </>
          ) : (
            "Subdomain Not Found"
          )}
        </h1>
        <p className="mt-3 text-gray-600 text-lg">
          This subdomain hasn't been created yet.
        </p>
        <div className="mt-6">
          <Link
            href={`${PROTOCOL}://${ROOT_DOMAIN}`}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700"
          >
            {subdomain ? `Create ${subdomain}` : `Go to ${ROOT_DOMAIN}`}
          </Link>
        </div>
      </div>
    </div>
  );
}
