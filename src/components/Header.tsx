"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asset } from "@/data/images";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/we-deliver", label: "Our Work" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="container nav">
          <Link href="/" className="brand" aria-label="Butler Signs home">
            <img
              src={asset("1777591824617-ttsuws.png")}
              alt=""
              className="brand-logo"
            />
            <span className="brand-text">
              <span className="name">Butler Signs</span>
              <span className="since">Suitland, MD · Est. 1943</span>
            </span>
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? "active" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/#contact" className="btn btn-primary nav-cta">
            Get a quote <span className="arrow">→</span>
          </Link>
          <button
            className="nav-toggle"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
        </div>
      </header>

      <aside
        className={`mobile-drawer${open ? " open" : ""}`}
        aria-label="Mobile menu"
      >
        <div className="mobile-drawer-top">
          <span className="brand-text">
            <span className="name">Butler Signs</span>
          </span>
          <button
            className="nav-toggle"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <div className="drawer-cta">
          <Link
            href="/#contact"
            className="btn btn-red"
            style={{ width: "100%" }}
            onClick={() => setOpen(false)}
          >
            Get a quote
          </Link>
        </div>
      </aside>
    </>
  );
}
