import type { Metadata } from "next";
import Link from "next/link";
import { Gallery } from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "A working gallery of signs, banners, wraps and lettering from Butler Signs.",
};

export default function OurWorkPage() {
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
              <span className="split-line reveal">
                <span>Our work,</span>
              </span>
              <span className="split-line reveal" style={{ "--reveal-delay": "0.1s" }}>
                <span>
                  <em>street by street.</em>
                </span>
              </span>
            </h1>
            <p className="lede reveal" style={{ "--reveal-delay": "0.2s" }}>
              A working gallery of signs, banners, wraps and lettering Butler
              has shipped — vehicle graphics, storefronts, and custom signs
              across Maryland, DC and Virginia.
            </p>
          </div>
        </div>
      </section>
      <Gallery />
    </main>
  );
}
