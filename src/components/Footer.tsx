import Link from "next/link";
import type { ReactNode } from "react";
import { CONTACT } from "@/data/contact";

export function Footer({
  headline = (
    <>
      Make your business <em>impossible</em> to miss.
    </>
  ),
}: {
  headline?: ReactNode;
}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <h2 className="footer-headline">{headline}</h2>
          <div className="footer-meta">
            <div className="footer-col">
              <span className="label">Visit</span>
              <p>Suitland, Maryland</p>
              <p>Mon–Fri · 8a–5p</p>
            </div>
            <div className="footer-col">
              <span className="label">Contact</span>
              <p>{CONTACT.name}</p>
              <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div className="footer-col">
              <span className="label">Pages</span>
              <Link href="/">Home</Link>
              <Link href="/our-story">Our Story</Link>
              <Link href="/we-deliver">Our Work</Link>
              <Link href="/book">Book</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Butler Signs · Est. 1943</span>
          <span>Crafted in Suitland, MD</span>
        </div>
      </div>
    </footer>
  );
}
