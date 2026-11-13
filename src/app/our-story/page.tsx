import type { Metadata } from "next";
import Link from "next/link";
import { asset } from "@/data/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Three generations of Butler Signs — brushes, paint, and patience since 1943 in Suitland, Maryland.",
};

export default function OurStoryPage() {
  return (
    <main>
      <section className="story-hero">
        <div className="container">
          <p className="breadcrumb reveal-fade">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Our Story</span>
          </p>
          <h1>
            <span className="split-line reveal">
              <span>Three generations</span>
            </span>
            <span className="split-line reveal" style={{ "--reveal-delay": ".12s" }}>
              <span>
                of <em>letterwork.</em>
              </span>
            </span>
          </h1>
          <div className="meta-row">
            <div className="col reveal" style={{ "--reveal-delay": ".2s" }}>
              <span className="label">Founded</span>
              <span className="val">1943</span>
            </div>
            <div className="col reveal" style={{ "--reveal-delay": ".3s" }}>
              <span className="label">Hometown</span>
              <span className="val">Suitland, MD</span>
            </div>
            <div className="col reveal" style={{ "--reveal-delay": ".4s" }}>
              <span className="label">Generations</span>
              <span className="val">Three</span>
            </div>
            <div className="col reveal" style={{ "--reveal-delay": ".5s" }}>
              <span className="label">Trade</span>
              <span className="val">Signs & letters</span>
            </div>
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="container chapter-grid">
          <div className="chapter-text">
            <span className="num reveal-fade">Chapter 01</span>
            <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
              Brushes, paint, <em>and patience.</em>
            </h2>
            <p className="reveal" style={{ "--reveal-delay": ".2s" }}>
              Butler Signs began with a brush in one hand and a pencil sketch in
              the other. Long before vinyl plotters and digital prints, every
              letter was laid out by eye, pounced into place, and pulled with
              steady pressure on a sable.
            </p>
            <blockquote className="pull reveal" style={{ "--reveal-delay": ".3s" }}>
              &quot;If you can&apos;t measure it twice, paint it once.&quot;
            </blockquote>
          </div>
          <div className="chapter-image reveal-img">
            <img
              src={asset("1777591826699-iubdfo.jpg")}
              alt="A Butler Signs craftsman hand-painting lettering on a vehicle"
            />
            <span className="caption">c. 1974 · Hand-lettering a GTO</span>
          </div>
        </div>
      </section>

      <section className="chapter flip">
        <div className="container chapter-grid">
          <div className="chapter-text">
            <span className="num reveal-fade">Chapter 02</span>
            <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
              Out in the lot, <em>up on a ladder.</em>
            </h2>
            <p className="reveal" style={{ "--reveal-delay": ".2s" }}>
              Through the 80s and 90s, Butler took the trade onto the road —
              painting yard signs, billboards, and shop fronts across Maryland
              and DC. Wherever a business needed to be seen, we showed up with a
              ladder and a kit of one-shot enamel.
            </p>
            <blockquote className="pull reveal" style={{ "--reveal-delay": ".3s" }}>
              &quot;The job&apos;s not done until the customer&apos;s customers
              can read it from across the street.&quot;
            </blockquote>
          </div>
          <div className="chapter-image reveal-img">
            <img
              src={asset("1777591826188-0jw65y.jpg")}
              alt="A Butler Signs craftsman painting a large triangular sign"
            />
            <span className="caption">c. 1989 · Field install, brick & brush</span>
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="container chapter-grid">
          <div className="chapter-text">
            <span className="num reveal-fade">Chapter 03</span>
            <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
              Working <em>at height</em>, working with care.
            </h2>
            <p className="reveal" style={{ "--reveal-delay": ".2s" }}>
              Storefronts kept us climbing. Outlet signs, schools, bodegas,
              barber shops — if it had a roof and faced the road, it was a
              candidate for paint. Every bracket, panel and pole told us a
              little more about how to make a sign last.
            </p>
            <blockquote className="pull reveal" style={{ "--reveal-delay": ".3s" }}>
              &quot;A sign that fades in a year isn&apos;t a sign — it&apos;s an
              apology.&quot;
            </blockquote>
          </div>
          <div className="chapter-image reveal-img">
            <img
              src={asset("1777591825649-4tbd9i.jpg")}
              alt="A Butler Signs craftsman repainting a factory outlet storefront sign from a ladder"
            />
            <span className="caption">c. 1993 · Storefront refresh</span>
          </div>
        </div>
      </section>

      <section className="chapter flip">
        <div className="container chapter-grid">
          <div className="chapter-text">
            <span className="num reveal-fade">Chapter 04</span>
            <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
              Same name. <em>Same hands.</em> New tools.
            </h2>
            <p className="reveal" style={{ "--reveal-delay": ".2s" }}>
              Today the Butler Signs truck still rolls out of Suitland — only
              now it carries plotters, large-format printers and laminators
              alongside the brushes and chalk. Three generations on, our name
              still goes on every sign we deliver.
            </p>
            <blockquote className="pull reveal" style={{ "--reveal-delay": ".3s" }}>
              &quot;Since 1943 — and we&apos;re still answering the phone.&quot;
            </blockquote>
          </div>
          <div className="chapter-image reveal-img">
            <img
              src={asset("1777591823543-318dkr.jpg")}
              alt="The Butler Signs delivery truck with hand-painted lettering and 'Since 1943'"
            />
            <span className="caption">Today · The Butler Signs truck</span>
          </div>
        </div>
      </section>

      <section className="archive">
        <div className="container">
          <div className="archive-head">
            <span className="eyebrow reveal-fade">— From the archive</span>
            <h2 className="reveal" style={{ "--reveal-delay": ".05s" }}>
              A few <em>frames</em> from the road.
            </h2>
            <p className="reveal" style={{ "--reveal-delay": ".15s" }}>
              Snapshots from eight decades on the job — clipping in, climbing
              up, and pulling clean letters across panels, brick, and steel.
            </p>
          </div>
          <div className="archive-grid">
            <div className="archive-tile reveal-img">
              <img src={asset("1777591822953-oihn8g.jpg")} alt="Hand-lettering a 74 GTO" />
              <span className="label">&apos;74 · GTO lettering</span>
            </div>
            <div className="archive-tile reveal-img" style={{ "--reveal-delay": ".08s" }}>
              <img src={asset("1777591824081-n3jknl.jpg")} alt="Painting a triangular sign" />
              <span className="label">&apos;89 · Field install</span>
            </div>
            <div className="archive-tile reveal-img" style={{ "--reveal-delay": ".16s" }}>
              <img src={asset("1777591825102-z4offk.jpg")} alt="Repainting an outlet storefront" />
              <span className="label">&apos;93 · Storefront refresh</span>
            </div>
            <div className="archive-tile reveal-img" style={{ "--reveal-delay": ".24s" }}>
              <img src={asset("1777591822293-p3dquz9.jpg")} alt="Butler Signs delivery truck" />
              <span className="label">Today · The truck</span>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline">
        <div className="container">
          <h2 className="reveal">
            A short history of <em>showing up.</em>
          </h2>
          <div className="timeline-track">
            {[
              ["1943", "Doors open", "Butler Signs opens its first shop with a wooden bench, two brushes, and a customer list of three local stores."],
              ["1968", "Vehicle lettering", "The shop expands into car, truck and van lettering — a service still core to the business today."],
              ["1985", "Storefront installs", "Butler crews start handling full storefront installs across Maryland and DC, climbing every ladder in the metro."],
              ["2002", "Vinyl & large format", "The shop adds plotters, large-format printers and laminators — without setting the brushes down."],
              ["2018", "Third generation", "The third generation joins the shop, bringing fresh design eyes alongside decades of craft."],
              ["2026", "Still here", "83 years on, still independent, still local, still on a first-name basis with our customers."],
            ].map(([year, title, copy], i) => (
              <div
                className="timeline-item reveal"
                key={year}
                style={{ "--reveal-delay": `${i * 0.1}s` }}
              >
                <span className="year">{year}</span>
                <span className="title">{title}</span>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow reveal-fade">— What we believe</span>
              <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
                A small list. <em>Held tightly.</em>
              </h2>
            </div>
          </div>
          <div className="values-grid">
            <div className="value reveal">
              <span className="num">— 01</span>
              <h3>
                Make it <em>readable.</em>
              </h3>
              <p>
                A sign that doesn&apos;t read from across the street isn&apos;t
                doing its job. Letterforms come first, decoration second.
              </p>
            </div>
            <div className="value reveal" style={{ "--reveal-delay": ".1s" }}>
              <span className="num">— 02</span>
              <h3>
                Make it <em>last.</em>
              </h3>
              <p>
                We pick materials and finishes for the weather they&apos;ll
                meet. A Butler sign is meant to look right years in.
              </p>
            </div>
            <div className="value reveal" style={{ "--reveal-delay": ".2s" }}>
              <span className="num">— 03</span>
              <h3>
                Make it <em>local.</em>
              </h3>
              <p>
                We answer our own phones. We meet on site. We know the
                neighborhoods we work in by their first names.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
