import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/footer/site-footer";
import { SiteHeader } from "@/components/header/site-header";
import { ScrollTop } from "@/components/shared/scroll-top";
import { generateDynamicMetadata } from "@/lib/metadata";
import { getProfileBySubdomain } from "@/lib/profile";

interface AppLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    subdomain: string;
  }>;
}

export async function generateMetadata({
  params,
}: AppLayoutProps): Promise<Metadata> {
  const { subdomain } = await params;
  const profile = await getProfileBySubdomain(subdomain);

  if (!profile) {
    return {};
  }

  return generateDynamicMetadata(profile);
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { subdomain } = await params;
  const profile = await getProfileBySubdomain(subdomain);

  if (!profile) {
    notFound();
  }

  return (
    <>
      <SiteHeader profile={profile} />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter profile={profile} />
      <ScrollTop />
    </>
  );
}
