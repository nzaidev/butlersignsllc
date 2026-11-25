import { GALLERY } from "@/data/gallery";
import { asset } from "@/data/images";
import type { SiteContent } from "./schema";

/**
 * The site's built-in content. The CMS starts from this, and any field that is
 * missing or invalid in stored content falls back to the value here.
 */
export const DEFAULT_CONTENT: SiteContent = {
  site: {
    defaultShareImage: { src: "", alt: "" },
    footer: {
      headline: "Make your business *impossible* to miss.",
      hours: "Mon–Fri · 8a–5p",
      copyright: "© 2026 Butler Signs · Est. 1943",
      credit: "Crafted in Suitland, MD",
    },
  },

  home: {
    seo: {
      title: "Butler Signs",
      description:
        "Three generations of Butler Signs — banners, magnetic vehicle signs, A-frames, storefronts, custom truck lettering, and window tint across Maryland, DC and Virginia.",
      shareImage: { src: "", alt: "" },
    },
    hero: {
      eyebrow: "Now booking · Spring 2026",
      headlineRed: "NEED SIGNS?",
      headlineBlue: ["MAGNETICS", "BANNERS", "A‑FRAMES"],
      scriptLead: "Specializing in",
      scriptStrong: "Truck Lettering",
      lede: "Three generations of Butler Signs — banners, magnetic vehicle signs, A‑frames, storefronts, custom truck lettering, and now window tint, hand-built and installed across Maryland, DC and Virginia.",
      primaryButton: "Call for a quote",
      secondaryButton: "See our work",
      stats: [
        { value: "83", suffix: "", unit: "", label: "Years in the trade" },
        { value: "2400", suffix: "+", unit: "", label: "Signs delivered" },
        { value: "3", suffix: "", unit: "states", label: "MD · DC · VA" },
      ],
      logo: { src: asset("1777591824617-ttsuws.png"), alt: "Butler Signs logo" },
      ringText:
        "Storefronts · Banners · Vehicle lettering · Yard signs · Window tint · Custom graphics ·",
      badgeTop: "Hand crafted",
      badgeBottom: "Since 1943",
    },
    marquee: [
      "Storefront signs",
      "Banners",
      "Vehicle lettering",
      "Yard signs",
      "Window tint",
      "Decals",
      "Custom graphics",
    ],
    intro: {
      eyebrow: "First impressions",
      heading: "Signs made for *local businesses.*",
      body: "Your sign is often the first thing customers see. We create clean, eye-catching signage that helps your business get noticed, look professional, and attract more customers.\n\nFrom the sketch on a napkin to the install on your wall — we keep it simple, and we do it right.",
    },
    services: {
      eyebrow: "— Our services",
      heading: "Six ways we make\nyour business *seen.*",
      lede: "Every project starts with a conversation. Tell us what you need and we'll help you choose the right option, the right size, and the right materials.",
      items: [
        { title: "Storefront signs", description: "Make your location easy to find and impossible to miss." },
        { title: "Banners & event signs", description: "Perfect for grand openings, promotions, events, and special offers." },
        { title: "Vehicle lettering", description: "Turn your car, truck, or van into a moving advertisement." },
        { title: "Yard signs", description: "Affordable signs for real estate, contractors, campaigns, events, and local promotions." },
        { title: "Custom graphics", description: "Need something unique? We can help bring your idea to life." },
        { title: "Window tint", description: "Professional tint for cars, trucks, and storefronts — cooler interiors, more privacy, and a clean finished look." },
      ],
    },
    why: {
      eyebrow: "— Why Butler Signs",
      heading: "Quality signs.\n*No hassle.*",
      lede: "We work with small businesses, organizations, and local professionals who need quality signs without the back-and-forth. You bring the idea — we handle the rest.",
      cards: [
        {
          title: "Designed with you",
          body: "We sit down, sketch, and choose materials together. No mystery rounds of revisions — just clear conversation and good craft.",
        },
        {
          title: "Built to last",
          body: "Three generations of sign-making experience. We pick the right materials so your sign holds up to weather, sun, and time.",
        },
        {
          title: "Delivered locally",
          body: "Suitland-based, serving Maryland, Washington DC, and surrounding areas. Real people, fast turnaround, dependable installs.",
        },
      ],
    },
    areas: {
      label: "Now serving",
      cities: [
        "Suitland",
        "Hyattsville",
        "Silver Spring",
        "Bethesda",
        "Washington DC",
        "Alexandria",
        "Arlington",
        "Bowie",
      ],
    },
    contact: {
      eyebrow: "— Ready to get started?",
      heading: "Tell us what\nyou need —\nwe'll *handle it.*",
      body: "Call Butler Signs today for a quote. We'll help you choose the right option for your business — from a single yard sign to a full storefront install.",
      button: "Call for a quote",
    },
  },

  "our-story": {
    seo: {
      title: "Our Story | Butler Signs",
      description:
        "Three generations of Butler Signs — brushes, paint, and patience since 1943 in Suitland, Maryland.",
      shareImage: { src: "", alt: "" },
    },
    hero: {
      heading: "Three generations\nof *letterwork.*",
      facts: [
        { label: "Founded", value: "1943" },
        { label: "Hometown", value: "Suitland, MD" },
        { label: "Generations", value: "Three" },
        { label: "Trade", value: "Signs & letters" },
      ],
    },
    chapters: [
      {
        heading: "Brushes, paint, *and patience.*",
        body: "Butler Signs began with a brush in one hand and a pencil sketch in the other. Long before vinyl plotters and digital prints, every letter was laid out by eye, pounced into place, and pulled with steady pressure on a sable.",
        quote: "If you can't measure it twice, paint it once.",
        image: {
          src: asset("1777591826699-iubdfo.jpg"),
          alt: "A Butler Signs craftsman hand-painting lettering on a vehicle",
        },
        caption: "c. 1974 · Hand-lettering a GTO",
      },
      {
        heading: "Out in the lot, *up on a ladder.*",
        body: "Through the 80s and 90s, Butler took the trade onto the road — painting yard signs, billboards, and shop fronts across Maryland and DC. Wherever a business needed to be seen, we showed up with a ladder and a kit of one-shot enamel.",
        quote: "The job's not done until the customer's customers can read it from across the street.",
        image: {
          src: asset("1777591826188-0jw65y.jpg"),
          alt: "A Butler Signs craftsman painting a large triangular sign",
        },
        caption: "c. 1989 · Field install, brick & brush",
      },
      {
        heading: "Working *at height*, working with care.",
        body: "Storefronts kept us climbing. Outlet signs, schools, bodegas, barber shops — if it had a roof and faced the road, it was a candidate for paint. Every bracket, panel and pole told us a little more about how to make a sign last.",
        quote: "A sign that fades in a year isn't a sign — it's an apology.",
        image: {
          src: asset("1777591825649-4tbd9i.jpg"),
          alt: "A Butler Signs craftsman repainting a factory outlet storefront sign from a ladder",
        },
        caption: "c. 1993 · Storefront refresh",
      },
      {
        heading: "Same name. *Same hands.* New tools.",
        body: "Today the Butler Signs truck still rolls out of Suitland — only now it carries plotters, large-format printers and laminators alongside the brushes and chalk. Three generations on, our name still goes on every sign we deliver.",
        quote: "Since 1943 — and we're still answering the phone.",
        image: {
          src: asset("1777591823543-318dkr.jpg"),
          alt: "The Butler Signs delivery truck with hand-painted lettering and 'Since 1943'",
        },
        caption: "Today · The Butler Signs truck",
      },
    ],
    archive: {
      eyebrow: "— From the archive",
      heading: "A few *frames* from the road.",
      intro: "Snapshots from eight decades on the job — clipping in, climbing up, and pulling clean letters across panels, brick, and steel.",
      tiles: [
        { image: { src: asset("1777591822953-oihn8g.jpg"), alt: "Hand-lettering a 74 GTO" }, label: "'74 · GTO lettering" },
        { image: { src: asset("1777591824081-n3jknl.jpg"), alt: "Painting a triangular sign" }, label: "'89 · Field install" },
        { image: { src: asset("1777591825102-z4offk.jpg"), alt: "Repainting an outlet storefront" }, label: "'93 · Storefront refresh" },
        { image: { src: asset("1777591822293-p3dquz9.jpg"), alt: "Butler Signs delivery truck" }, label: "Today · The truck" },
      ],
    },
    timeline: {
      heading: "A short history of *showing up.*",
      items: [
        { year: "1943", title: "Doors open", body: "Butler Signs opens its first shop with a wooden bench, two brushes, and a customer list of three local stores." },
        { year: "1968", title: "Vehicle lettering", body: "The shop expands into car, truck and van lettering — a service still core to the business today." },
        { year: "1985", title: "Storefront installs", body: "Butler crews start handling full storefront installs across Maryland and DC, climbing every ladder in the metro." },
        { year: "2002", title: "Vinyl & large format", body: "The shop adds plotters, large-format printers and laminators — without setting the brushes down." },
        { year: "2018", title: "Third generation", body: "The third generation joins the shop, bringing fresh design eyes alongside decades of craft." },
        { year: "2026", title: "Still here", body: "83 years on, still independent, still local, still on a first-name basis with our customers." },
      ],
    },
    values: {
      eyebrow: "— What we believe",
      heading: "A small list. *Held tightly.*",
      items: [
        {
          heading: "Make it *readable.*",
          body: "A sign that doesn't read from across the street isn't doing its job. Letterforms come first, decoration second.",
        },
        {
          heading: "Make it *last.*",
          body: "We pick materials and finishes for the weather they'll meet. A Butler sign is meant to look right years in.",
        },
        {
          heading: "Make it *local.*",
          body: "We answer our own phones. We meet on site. We know the neighborhoods we work in by their first names.",
        },
      ],
    },
  },

  "our-work": {
    seo: {
      title: "Our Work | Butler Signs",
      description:
        "A working gallery of signs, banners, wraps and lettering from Butler Signs.",
      shareImage: { src: "", alt: "" },
    },
    hero: {
      heading: "Our work,\n*street by street.*",
      lede: "A working gallery of signs, banners, wraps and lettering Butler has shipped — vehicle graphics, storefronts, and custom signs across Maryland, DC and Virginia.",
    },
    gallery: GALLERY.map((item) => ({
      image: { src: item.src, alt: item.alt },
      category: item.category,
      wide: item.span2,
    })),
  },

  book: {
    seo: {
      title: "Book | Butler Signs",
      description:
        "Book a service with Butler Signs. Share a few details and we will confirm your appointment.",
      shareImage: { src: "", alt: "" },
    },
    heading: "Book a Service",
    lede: "Ready to get started? Choose a service below and we'll confirm your appointment as soon as possible.",
    stepsHeading: "What happens next?",
    steps: [
      "Submit your service request",
      "We review and confirm availability",
      "You receive a confirmation with your appointment details",
    ],
    expectHeading: "What to expect",
    expectBody:
      "Typical response time: within 1 business day. We will contact you by email or phone to confirm the final details.",
    formHeading: "Book your service",
    formIntro:
      "Share a few details and we will follow up quickly to confirm your booking.",
  },
};
