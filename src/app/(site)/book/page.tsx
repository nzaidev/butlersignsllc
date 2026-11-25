import Link from "next/link";
import { BookForm } from "@/components/BookForm";
import { getPage, pageMetadata } from "@/cms/content";

export const generateMetadata = () => pageMetadata("book");

export default async function BookPage() {
  const c = await getPage("book");

  return (
    <main className="book-page">
      <div className="container">
        <p className="breadcrumb reveal-fade" style={{ marginBottom: 28 }}>
          <Link href="/">Home</Link>
          <span className="sep"> / </span>
          <span>Book</span>
        </p>
        <div className="book-grid">
          <div className="book-copy">
            <h1 className="reveal">{c.heading}</h1>
            <p className="lede reveal" style={{ "--reveal-delay": ".1s" }}>
              {c.lede}
            </p>
            <div className="book-card reveal" style={{ "--reveal-delay": ".15s" }}>
              <h3>{c.stepsHeading}</h3>
              <ul>
                {c.steps.map((step, i) => (
                  <li key={i}>
                    <span className="check">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="book-card book-expect reveal"
              style={{ "--reveal-delay": ".2s", marginTop: 20 }}
            >
              <h3>{c.expectHeading}</h3>
              <p>{c.expectBody}</p>
            </div>
          </div>
          <div className="book-card reveal" style={{ "--reveal-delay": ".1s" }}>
            <h2 style={{ fontSize: 32, marginBottom: 8 }}>{c.formHeading}</h2>
            <p style={{ color: "var(--ink-2)", marginBottom: 24 }}>{c.formIntro}</p>
            <BookForm />
          </div>
        </div>
      </div>
    </main>
  );
}
