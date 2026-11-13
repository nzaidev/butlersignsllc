"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const revealEls = document.querySelectorAll(
      ".reveal, .reveal-fade, .reveal-clip, .reveal-img, .split-line, .underline",
    );

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));

    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.count || "0");
          const suffix = el.dataset.suffix || "";
          const duration = parseInt(el.dataset.duration || "1400", 10);
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const val = Math.round(target * eased);
            el.textContent = val.toLocaleString() + suffix;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          co.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((el) => co.observe(el));

    return () => {
      io.disconnect();
      co.disconnect();
    };
  }, [pathname]);

  return null;
}
