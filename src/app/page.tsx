import Link from "next/link";
import { CONTACT } from "@/data/contact";
import { asset } from "@/data/images";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow reveal-fade">
              <span className="pulse" /> Now booking · Spring 2026
            </p>
            <h1 className="banner-h1">
              <span className="line line-red reveal" style={{ "--reveal-delay": ".05s" }}>
                NEED SIGNS?
              </span>
              <span className="line line-blue reveal" style={{ "--reveal-delay": ".18s" }}>
                MAGNETICS
              </span>
              <span className="line line-blue reveal" style={{ "--reveal-delay": ".28s" }}>
                BANNERS
              </span>
              <span className="line line-blue reveal" style={{ "--reveal-delay": ".38s" }}>
                A‑FRAMES
              </span>
              <span className="line line-script reveal" style={{ "--reveal-delay": ".55s" }}>
                <em>Specializing in</em> <em className="thick">Truck Lettering</em>
              </span>
            </h1>
            <p className="lede reveal" style={{ "--reveal-delay": ".7s" }}>
              Three generations of Butler Signs — banners, magnetic vehicle
              signs, A‑frames, storefronts, custom truck lettering, and now
              window tint, hand-built and installed across Maryland, DC and
              Virginia.
            </p>
            <div className="hero-cta-row reveal" style={{ "--reveal-delay": ".8s" }}>
              <a href="#contact" className="btn btn-red">
                Call for a quote <span className="arrow">→</span>
              </a>
              <Link href="/we-deliver" className="btn btn-ghost">
                See our work
              </Link>
            </div>
            <div className="hero-meta reveal" style={{ "--reveal-delay": ".8s" }}>
              <div className="stat">
                <span className="num">
                  <span data-count="83" data-suffix="">
                    83
                  </span>
                </span>
                <span className="label">Years in the trade</span>
              </div>
              <div className="stat">
                <span className="num">
                  <span data-count="2400" data-suffix="+">
                    2,400+
                  </span>
                </span>
                <span className="label">Signs delivered</span>
              </div>
              <div className="stat">
                <span className="num">
                  <span data-count="3" data-suffix="">
                    3
                  </span>{" "}
                  states
                </span>
                <span className="label">MD · DC · VA</span>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal-fade" style={{ "--reveal-delay": ".3s" }}>
            <svg className="ring-text" viewBox="0 0 540 540" aria-hidden="true">
              <defs>
                <path
                  id="ring"
                  d="M 270, 270 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0"
                />
              </defs>
              <text>
                <textPath href="#ring">
                  Storefronts · Banners · Vehicle lettering · Yard signs · Window
                  tint · Custom graphics · Storefronts · Banners · Vehicle
                  lettering · Yard signs · Window tint · Custom graphics ·
                </textPath>
              </text>
            </svg>
            <div className="logo-plate">
              <img
                src={asset("1777591824617-ttsuws.png")}
                alt="Butler Signs logo"
              />
            </div>
            <div className="hero-badge tl">
              <span className="swatch gold" /> Hand crafted
            </div>
            <div className="hero-badge br">
              <span className="swatch" /> Since 1943
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[
            "Storefront signs",
            "Banners",
            "Vehicle lettering",
            "Yard signs",
            "Window tint",
            "Decals",
            "Custom graphics",
            "Storefront signs",
            "Banners",
            "Vehicle lettering",
            "Yard signs",
            "Window tint",
            "Decals",
            "Custom graphics",
          ].map((item, i) => (
            <span className="marquee-item" key={`${item}-${i}`}>
              {item} <span className="dot" />
            </span>
          ))}
        </div>
      </div>

      <section className="standout">
        <div className="container">
          <div className="standout-grid">
            <h2 className="reveal">
              Signs made for <em>local businesses.</em>
            </h2>
            <div className="standout-side reveal" style={{ "--reveal-delay": ".15s" }}>
              <span className="eyebrow">First impressions</span>
              <p>
                Your sign is often the first thing customers see. We create
                clean, eye-catching signage that helps your business get
                noticed, look professional, and attract more customers.
              </p>
              <p>
                From the sketch on a napkin to the install on your wall — we
                keep it simple, and we do it right.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow reveal-fade">— Our services</span>
              <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
                Six ways we make
                <br />
                your business <em>seen.</em>
              </h2>
            </div>
            <p className="lede reveal" style={{ "--reveal-delay": ".2s" }}>
              Every project starts with a conversation. Tell us what you need
              and we&apos;ll help you choose the right option, the right size,
              and the right materials.
            </p>
          </div>

          <div className="services-list">
            {[
              ["1", "Storefront signs", "Make your location easy to find and impossible to miss."],
              ["2", "Banners & event signs", "Perfect for grand openings, promotions, events, and special offers."],
              ["3", "Vehicle lettering", "Turn your car, truck, or van into a moving advertisement."],
              ["4", "Yard signs", "Affordable signs for real estate, contractors, campaigns, events, and local promotions."],
              ["5", "Custom graphics", "Need something unique? We can help bring your idea to life."],
              ["6", "Window tint", "Professional tint for cars, trucks, and storefronts — cooler interiors, more privacy, and a clean finished look."],
            ].map(([num, title, desc]) => (
              <a className="service-row reveal" href="#contact" key={num}>
                <span className="service-num">{num}</span>
                <span className="service-title">{title}</span>
                <span className="service-desc">{desc}</span>
                <span className="service-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section why">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow reveal-fade">— Why Butler Signs</span>
              <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
                Quality signs.
                <br />
                <em>No hassle.</em>
              </h2>
            </div>
            <p className="lede reveal" style={{ "--reveal-delay": ".2s" }}>
              We work with small businesses, organizations, and local
              professionals who need quality signs without the back-and-forth.
              You bring the idea — we handle the rest.
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card reveal">
              <span className="num">1</span>
              <h3>Designed with you</h3>
              <p>
                We sit down, sketch, and choose materials together. No mystery
                rounds of revisions — just clear conversation and good craft.
              </p>
            </div>
            <div className="why-card reveal" style={{ "--reveal-delay": ".1s" }}>
              <span className="num">2</span>
              <h3>Built to last</h3>
              <p>
                Three generations of sign-making experience. We pick the right
                materials so your sign holds up to weather, sun, and time.
              </p>
            </div>
            <div className="why-card reveal" style={{ "--reveal-delay": ".2s" }}>
              <span className="num">3</span>
              <h3>Delivered locally</h3>
              <p>
                Suitland-based, serving Maryland, Washington DC, and surrounding
                areas. Real people, fast turnaround, dependable installs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="areas reveal">
          <span className="label">Now serving</span>
          <ul className="areas-list">
            {[
              "Suitland",
              "Hyattsville",
              "Silver Spring",
              "Bethesda",
              "Washington DC",
              "Alexandria",
              "Arlington",
              "Bowie",
            ].map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section cta" id="contact">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow reveal-fade">— Ready to get started?</span>
            <h2 className="reveal" style={{ "--reveal-delay": ".1s" }}>
              <span className="split-line">
                <span>Tell us what</span>
              </span>
              <span className="split-line">
                <span>you need —</span>
              </span>
              <span className="split-line">
                <span>
                  we&apos;ll <em>handle it.</em>
                </span>
              </span>
            </h2>
          </div>
          <div className="cta-side reveal" style={{ "--reveal-delay": ".2s" }}>
            <p className="lede" style={{ fontSize: 17 }}>
              Call Butler Signs today for a quote. We&apos;ll help you choose
              the right option for your business — from a single yard sign to a
              full storefront install.
            </p>
            <div className="cta-contact">
              <div className="row">
                <span className="label">Contact</span>
                <span className="val">{CONTACT.name}</span>
              </div>
              <div className="row">
                <span className="label">Phone</span>
                <a href={`tel:${CONTACT.phoneTel}`} className="val">
                  {CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="row">
                <span className="label">Email</span>
                <a href={`mailto:${CONTACT.email}`} className="val">
                  {CONTACT.email}
                </a>
              </div>
              <div className="row">
                <span className="label">Location</span>
                <span className="val">{CONTACT.location}</span>
              </div>
              <div className="row">
                <span className="label">Serving</span>
                <span className="val">MD · DC · VA</span>
              </div>
            </div>
            <a href={`tel:${CONTACT.phoneTel}`} className="btn btn-red">
              Call for a quote <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
