import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { getPage, pageMetadata } from "@/cms/content";
import { inline, lines } from "@/cms/rich";

export const generateMetadata = () => pageMetadata("our-work");

export default async function OurWorkPage() {
  const { hero, gallery } = await getPage("our-work");

  return (
    <main>
      <section className="deliver-hero">
        <div className="container">
          <p className="breadcrumb reveal-fade">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Our Work</span>
          </p>
          <div className="deliver-hero-head">
            <h1>
              {lines(hero.heading).map((line, i) => (
                <span
                  className="split-line reveal"
                  style={i ? { "--reveal-delay": `${i * 0.1}s` } : undefined}
                  key={i}
                >
                  <span>{inline(line)}</span>
                </span>
              ))}
            </h1>
            <p className="lede reveal" style={{ "--reveal-delay": "0.2s" }}>
              {hero.lede}
            </p>
          </div>
        </div>
      </section>
      <Gallery items={gallery.filter((item) => item.image.src)} />
    </main>
  );
}
