import Link from "next/link";
import { getPage, pageMetadata } from "@/cms/content";
import { inline, lines, Paragraphs, Rich } from "@/cms/rich";

export const generateMetadata = () => pageMetadata("our-story");

function delay(seconds: number) {
  return { "--reveal-delay": `${Math.round(seconds * 100) / 100}s` };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function OurStoryPage() {
  const { hero, chapters, archive, timeline, values } = await getPage("our-story");

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
            {lines(hero.heading).map((line, i) => (
              <span className="split-line reveal" style={i ? delay(i * 0.12) : undefined} key={i}>
                <span>{inline(line)}</span>
              </span>
            ))}
          </h1>
          <div className="meta-row">
            {hero.facts.map((fact, i) => (
              <div className="col reveal" style={delay(0.2 + i * 0.1)} key={i}>
                <span className="label">{fact.label}</span>
                <span className="val">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {chapters.map((chapter, i) => (
        <section className={`chapter${i % 2 ? " flip" : ""}`} key={i}>
          <div className="container chapter-grid">
            <div className="chapter-text">
              <span className="num reveal-fade">Chapter {pad(i + 1)}</span>
              <h2 className="reveal" style={delay(0.1)}>
                <Rich text={chapter.heading} />
              </h2>
              <Paragraphs text={chapter.body} className="reveal" style={delay(0.2)} />
              {chapter.quote ? (
                <blockquote className="pull reveal" style={delay(0.3)}>
                  &quot;{chapter.quote}&quot;
                </blockquote>
              ) : null}
            </div>
            {chapter.image.src ? (
              <div className="chapter-image reveal-img">
                <img src={chapter.image.src} alt={chapter.image.alt} />
                {chapter.caption ? <span className="caption">{chapter.caption}</span> : null}
              </div>
            ) : null}
          </div>
        </section>
      ))}

      <section className="archive">
        <div className="container">
          <div className="archive-head">
            <span className="eyebrow reveal-fade">{archive.eyebrow}</span>
            <h2 className="reveal" style={delay(0.05)}>
              <Rich text={archive.heading} />
            </h2>
            <p className="reveal" style={delay(0.15)}>
              {archive.intro}
            </p>
          </div>
          <div className="archive-grid">
            {archive.tiles
              .filter((tile) => tile.image.src)
              .map((tile, i) => (
                <div className="archive-tile reveal-img" style={i ? delay(i * 0.08) : undefined} key={i}>
                  <img src={tile.image.src} alt={tile.image.alt} />
                  <span className="label">{tile.label}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="timeline">
        <div className="container">
          <h2 className="reveal">
            <Rich text={timeline.heading} />
          </h2>
          <div className="timeline-track">
            {timeline.items.map((item, i) => (
              <div className="timeline-item reveal" key={i} style={delay(i * 0.1)}>
                <span className="year">{item.year}</span>
                <span className="title">{item.title}</span>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow reveal-fade">{values.eyebrow}</span>
              <h2 className="reveal" style={delay(0.1)}>
                <Rich text={values.heading} />
              </h2>
            </div>
          </div>
          <div className="values-grid">
            {values.items.map((value, i) => (
              <div className="value reveal" style={i ? delay(i * 0.1) : undefined} key={i}>
                <span className="num">— {pad(i + 1)}</span>
                <h3>
                  <Rich text={value.heading} />
                </h3>
                <p>{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
