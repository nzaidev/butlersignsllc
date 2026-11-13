import type { Metadata } from "next";
import Link from "next/link";
import { BookForm } from "@/components/BookForm";

export const metadata: Metadata = {
  title: "Book",
  description:
    "Book a service with Butler Signs. Share a few details and we will confirm your appointment.",
};

export default function BookPage() {
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
            <h1 className="reveal">Book a Service</h1>
            <p className="lede reveal" style={{ "--reveal-delay": ".1s" }}>
              Ready to get started? Choose a service below and we&apos;ll
              confirm your appointment as soon as possible.
            </p>
            <div className="book-card reveal" style={{ "--reveal-delay": ".15s" }}>
              <h3>What happens next?</h3>
              <ul>
                {[
                  "Submit your service request",
                  "We review and confirm availability",
                  "You receive a confirmation with your appointment details",
                ].map((step) => (
                  <li key={step}>
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
              <h3>What to expect</h3>
              <p>
                Typical response time: within 1 business day. We will contact
                you by email or phone to confirm the final details.
              </p>
            </div>
          </div>
          <div className="book-card reveal" style={{ "--reveal-delay": ".1s" }}>
            <h2 style={{ fontSize: 32, marginBottom: 8 }}>Book your service</h2>
            <p style={{ color: "var(--ink-2)", marginBottom: 24 }}>
              Share a few details and we will follow up quickly to confirm your
              booking.
            </p>
            <BookForm />
          </div>
        </div>
      </div>
    </main>
  );
}
