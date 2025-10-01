import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PROTOCOL, ROOT_DOMAIN } from "@/config/app.config";
import { getSubdomainData } from "@/services/subdomains";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    return {
      title: ROOT_DOMAIN,
    };
  }

  return {
    title: `${subdomain}.${ROOT_DOMAIN}`,
    description: `Subdomain page for ${subdomain}.${ROOT_DOMAIN}`,
  };
}

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="absolute top-4 right-4">
        <Link
          href={`${PROTOCOL}://${ROOT_DOMAIN}`}
          className="text-gray-500 text-sm transition-colors hover:text-gray-700"
        >
          {ROOT_DOMAIN}
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-9xl">{subdomainData.emoji}</div>
          <h1 className="font-bold text-4xl text-gray-900 tracking-tight">
            Welcome to {subdomain}.{ROOT_DOMAIN}
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            This is your custom subdomain page
          </p>
        </div>
      </div>
    </div>
  );
}
