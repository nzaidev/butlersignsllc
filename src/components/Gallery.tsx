"use client";

import type { GalleryCategory, GalleryItem } from "@/cms/schema";
import { useEffect, useMemo, useState } from "react";

const FILTERS: { id: "all" | GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "storefront", label: "Storefronts" },
  { id: "vehicle", label: "Vehicle Graphics" },
  { id: "graphics", label: "Signs and graphics" },
];

const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  vehicle: "Vehicle",
  storefront: "Storefront",
  graphics: "Graphic",
};

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<"all" | GalleryCategory>("all");
  const [active, setActive] = useState<number | null>(null);

  const counts = useMemo(() => {
    return {
      all: items.length,
      storefront: items.filter((i) => i.category === "storefront").length,
      vehicle: items.filter((i) => i.category === "vehicle").length,
      graphics: items.filter((i) => i.category === "graphics").length,
    };
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = active === null ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const visible = useMemo(
    () =>
      items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => filter === "all" || item.category === filter),
    [filter, items],
  );

  const openIndex =
    active === null ? -1 : visible.findIndex(({ index }) => index === active);
  const current = openIndex >= 0 ? visible[openIndex] : null;

  return (
    <>
      <div className="container">
        <div className="gallery-toolbar reveal" style={{ "--reveal-delay": "0.3s" }}>
          <div className="filter-group">
            <span className="filter-label">Filter</span>
            {FILTERS.map((chip) => (
              <button
                key={chip.id}
                className={`filter-chip${filter === chip.id ? " active" : ""}`}
                onClick={() => setFilter(chip.id)}
                type="button"
              >
                {chip.label} <span className="count">{counts[chip.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="gallery">
        <div className="container">
          <div className="gallery-grid">
            {visible.map(({ item, index }) => (
              <button
                key={item.image.src + index}
                type="button"
                className={`gallery-item${item.wide ? " span-2" : ""}`}
                onClick={() => setActive(index)}
              >
                <img src={item.image.src} alt={item.image.alt} loading="lazy" />
                <div className="meta">
                  <span className="badge cat">{CATEGORY_LABEL[item.category]}</span>
                  {item.image.alt ? <span className="badge">{item.image.alt}</span> : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div
        className={`lightbox${current ? " open" : ""}`}
        aria-hidden={!current}
      >
        <button
          className="lightbox-close"
          aria-label="Close"
          onClick={() => setActive(null)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
        <button
          className="lightbox-prev"
          aria-label="Previous"
          onClick={() => {
            if (openIndex < 0) return;
            const next = visible[(openIndex - 1 + visible.length) % visible.length];
            setActive(next.index);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          className="lightbox-next"
          aria-label="Next"
          onClick={() => {
            if (openIndex < 0) return;
            const next = visible[(openIndex + 1) % visible.length];
            setActive(next.index);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        {current ? (
          <>
            <img className="lightbox-img" src={current.item.image.src} alt={current.item.image.alt} />
            <span className="lightbox-caption">{current.item.image.alt}</span>
          </>
        ) : null}
      </div>
    </>
  );
}
