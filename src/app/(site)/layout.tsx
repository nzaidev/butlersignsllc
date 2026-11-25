import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteAssistantLoader } from "@/components/SiteAssistantLoader";
import { SiteEffects } from "@/components/SiteEffects";
import { getPage } from "@/cms/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getPage("site");
  return (
    <>
      <Header />
      {children}
      <Footer content={site.footer} />
      <SiteAssistantLoader />
      <SiteEffects />
    </>
  );
}
