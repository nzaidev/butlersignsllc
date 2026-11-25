import Link from "next/link";
import { getPage, pageMetadata } from "@/cms/content";
import { inline, lines, Paragraphs, Rich } from "@/cms/rich";
import { CONTACT } from "@/data/contact";

export const generateMetadata = () => pageMetadata("home");

function delay(seconds: number) {
  return { "--reveal-delay": `${Math.round(seconds * 100) / 100}s` };
}

function StatNumber({ value, suffix }: { value: string; suffix: string }) {
  const n = Number(value.replace(/,/g, ""));
  if (!value || !Number.isFinite(n)) return <span>{value + suffix}</span>;
  return (
    <span data-count={n} data-suffix={suffix}>
      {n.toLocaleString("en-US") + suffix}
    </span>
  );
}

export default async function HomePage() {
  const { hero, marquee, intro, services, why, areas, contact } = await getPage("home");
  const scriptDelay = 0.18 + hero.headlineBlue.length * 0.1 + 0.07;

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow reveal-fade">
              <span className="pulse" /> {hero.eyebrow}
            </p>
            <h1 className="banner-h1">
              <span className="line line-red reveal" style={delay(0.05)}>
                {hero.headlineRed}
              </span>
              {hero.headlineBlue.map((line, i) => (
                <span className="line line-blue reveal" style={delay(0.18 + i * 0.1)} key={i}>
                  {line}
                </span>
              ))}
              {hero.scriptLead || hero.scriptStrong ? (
                <span className="line line-script reveal" style={delay(scriptDelay)}>
                  {hero.scriptLead ? <em>{hero.scriptLead}</em> : null}{" "}
                  {hero.scriptStrong ? <em className="thick">{hero.scriptStrong}</em> : null}
                </span>
              ) : null}
            </h1>
            <p className="lede reveal" style={delay(0.7)}>
              {hero.lede}
            </p>
            <div className="hero-cta-row reveal" style={delay(0.8)}>
              <a href="#contact" className="btn btn-red">
                {hero.primaryButton} <span className="arrow">→</span>
              </a>
              <Link href="/we-deliver" className="btn btn-ghost">
                {hero.secondaryButton}
              </Link>
            </div>
            {hero.stats.length ? (
              <div className="hero-meta reveal" style={delay(0.8)}>
                {hero.stats.map((stat, i) => (
                  <div className="stat" key={i}>
                    <span className="num">
                      <StatNumber value={stat.value} suffix={stat.suffix} />
                      {stat.unit ? <> {stat.unit}</> : null}
                    </span>
                    <span className="label">{stat.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hero-visual reveal-fade" style={delay(0.3)}>
            <svg className="ring-text" viewBox="0 0 540 540" aria-hidden="true">
              <defs>
                <path
                  id="ring"
                  d="M 270, 270 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0"
                />
              </defs>
              <text>
                <textPath href="#ring">{`${hero.ringText} ${hero.ringText}`}</textPath>
              </text>
            </svg>
            <div className="logo-plate">
              {hero.logo.src ? <img src={hero.logo.src} alt={hero.logo.alt} /> : null}
            </div>
            <div className="hero-badge tl">
              <span className="swatch gold" /> {hero.badgeTop}
            </div>
            <div className="hero-badge br">
              <span className="swatch" /> {hero.badgeBottom}
            </div>
          </div>
        </div>
      </section>

      {marquee.length ? (
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marquee, ...marquee].map((item, i) => (
              <span className="marquee-item" key={`${item}-${i}`}>
                {item} <span className="dot" />
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <section className="standout">
        <div className="container">
          <div className="standout-grid">
            <h2 className="reveal">
              <Rich text={intro.heading} />
            </h2>
            <div className="standout-side reveal" style={delay(0.15)}>
              <span className="eyebrow">{intro.eyebrow}</span>
              <Paragraphs text={intro.body} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow reveal-fade">{services.eyebrow}</span>
              <h2 className="reveal" style={delay(0.1)}>
                <Rich text={services.heading} />
              </h2>
            </div>
            <p className="lede reveal" style={delay(0.2)}>
              {services.lede}
            </p>
          </div>

          <div className="services-list">
            {services.items.map((item, i) => (
              <a className="service-row reveal" href="#contact" key={i}>
                <span className="service-num">{i + 1}</span>
                <span className="service-title">{item.title}</span>
                <span className="service-desc">{item.description}</span>
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
              <span className="eyebrow reveal-fade">{why.eyebrow}</span>
              <h2 className="reveal" style={delay(0.1)}>
                <Rich text={why.heading} />
              </h2>
            </div>
            <p className="lede reveal" style={delay(0.2)}>
              {why.lede}
            </p>
          </div>
          <div className="why-grid">
            {why.cards.map((card, i) => (
              <div className="why-card reveal" style={i ? delay(i * 0.1) : undefined} key={i}>
                <span className="num">{i + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {areas.cities.length ? (
        <section className="container">
          <div className="areas reveal">
            <span className="label">{areas.label}</span>
            <ul className="areas-list">
              {areas.cities.map((city, i) => (
                <li key={i}>{city}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section cta" id="contact">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow reveal-fade">{contact.eyebrow}</span>
            <h2 className="reveal" style={delay(0.1)}>
              {lines(contact.heading).map((line, i) => (
                <span className="split-line" key={i}>
                  <span>{inline(line)}</span>
                </span>
              ))}
            </h2>
          </div>
          <div className="cta-side reveal" style={delay(0.2)}>
            <p className="lede" style={{ fontSize: 17 }}>
              {contact.body}
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
              {contact.button} <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
