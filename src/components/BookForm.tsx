"use client";

import { CONTACT } from "@/data/contact";
import { FormEvent, useState } from "react";

export function BookForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const address = String(data.get("address") || "");
    const city = String(data.get("city") || "");
    const state = String(data.get("state") || "");
    const zip = String(data.get("zip") || "");
    const scheduledAt = String(data.get("scheduledAt") || "");
    const note = String(data.get("note") || "");

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
      `City: ${city}`,
      `State: ${state}`,
      `Zip: ${zip}`,
      `Preferred date: ${scheduledAt}`,
      "",
      note,
    ].join("\n");

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Booking request from ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="book-success">
        <h2>Request sent</h2>
        <p className="lede" style={{ fontSize: 17, marginTop: 12 }}>
          If your email client opened, send the message and we will follow up
          within one business day. You can also call{" "}
          <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="book-form" onSubmit={onSubmit}>
      <label>
        Full Name *
        <input required name="name" placeholder="John Doe" />
      </label>
      <div className="row-2">
        <label>
          Email *
          <input type="email" required name="email" placeholder="john@company.com" />
        </label>
        <label>
          Phone
          <input name="phone" placeholder="(240) 304-8545" />
        </label>
      </div>
      <label>
        Address
        <input name="address" placeholder="123 Main St" />
      </label>
      <div className="row-2">
        <label>
          City
          <input name="city" placeholder="Suitland" />
        </label>
        <div className="row-2">
          <label>
            State
            <input name="state" placeholder="MD" />
          </label>
          <label>
            Zip
            <input name="zip" placeholder="20746" />
          </label>
        </div>
      </div>
      <label>
        Preferred Date & Time *
        <input type="datetime-local" required name="scheduledAt" />
      </label>
      <label>
        Provide additional info
        <textarea
          name="note"
          required
          rows={4}
          placeholder="What kind of sign do you need? Size, vehicle, storefront, timeline?"
        />
      </label>
      <button type="submit" className="btn btn-red">
        Request Consultation
      </button>
      <p className="book-note">
        By submitting this form, you agree that we may contact you about your
        consultation request.
      </p>
    </form>
  );
}
