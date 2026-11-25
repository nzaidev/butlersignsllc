import Link from "next/link";
import { Rich } from "@/cms/rich";
import type { SiteContent } from "@/cms/schema";
import { CONTACT } from "@/data/contact";

export function Footer({ content }: { content: SiteContent["site"]["footer"] }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <h2 className="footer-headline">
            <Rich text={content.headline} />
          </h2>
          <div className="footer-meta">
            <div className="footer-col">
              <span className="label">Visit</span>
              <p>{CONTACT.location}</p>
              {content.hours ? <p>{content.hours}</p> : null}
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
          <span>{content.copyright}</span>
          <span>{content.credit}</span>
        </div>
      </div>
    </footer>
  );
}
