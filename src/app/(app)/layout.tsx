import { SiteFooter } from "@/components/footer/site-footer";
import { SiteHeader } from "@/components/header/site-header";
import { ScrollTop } from "@/components/shared/scroll-top";
import { PROFILE } from "@/content/profile";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader profile={PROFILE} />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter profile={PROFILE} />
      <ScrollTop />
    </>
  );
}
