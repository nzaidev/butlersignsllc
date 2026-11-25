/**
 * The CMS content model.
 *
 * Every editable thing on the site is declared here. The admin editor renders
 * its forms from these declarations, and the server uses them to validate
 * whatever an editor submits. Anything not declared here cannot be changed
 * from the CMS — layout, styling, code, contact details and links stay in the
 * codebase.
 *
 * This module is shared by server and client code, so it must stay free of
 * server-only imports.
 */

export type ImageValue = { src: string; alt: string };

type Base = { label: string; help?: string };

export type TextField = Base & {
  kind: "text";
  /** Allow line breaks (rendered as new lines or paragraphs). */
  multiline?: boolean;
  /** Supports *emphasis* markup. Only affects the help text shown. */
  rich?: boolean;
  /** Hard cap enforced on save. */
  max?: number;
  /** Soft target shown as a character counter (e.g. SEO titles). */
  recommended?: number;
};
export type ImageField = Base & { kind: "image"; optional?: boolean };
export type SelectField = Base & {
  kind: "select";
  options: readonly { value: string; label: string }[];
};
export type BooleanField = Base & { kind: "boolean" };
export type ListField = Base & {
  kind: "list";
  of: Field;
  itemLabel: string;
  min?: number;
  max?: number;
  /** Start with items folded up (for long lists like the gallery). */
  collapsed?: boolean;
};
export type GroupField = Base & {
  kind: "group";
  fields: Record<string, Field>;
  /** Render a Google search-result preview from `title` + `description`. */
  serp?: boolean;
};
export type Field =
  | TextField
  | ImageField
  | SelectField
  | BooleanField
  | ListField
  | GroupField;

export type ValueOf<F> = F extends TextField
  ? string
  : F extends ImageField
    ? ImageValue
    : F extends { kind: "select"; options: readonly { value: infer V }[] }
      ? V
      : F extends BooleanField
        ? boolean
        : F extends { kind: "list"; of: infer O }
          ? ValueOf<O>[]
          : F extends { kind: "group"; fields: infer G }
            ? { [K in keyof G]: ValueOf<G[K]> }
            : never;

const RICH_HELP =
  "Put *asterisks* around words to show them in the red script style.";

const text = (label: string, opts: Omit<TextField, "kind" | "label"> = {}): TextField => ({
  kind: "text",
  label,
  ...opts,
});
const rich = (label: string, opts: Omit<TextField, "kind" | "label"> = {}): TextField =>
  text(label, {
    rich: true,
    ...opts,
    help: [opts.help, RICH_HELP].filter(Boolean).join(" "),
  });
const lines = (label: string, opts: Omit<TextField, "kind" | "label"> = {}): TextField =>
  rich(label, {
    multiline: true,
    max: 400,
    ...opts,
    help: ["Each line in the box is its own line on the page.", opts.help]
      .filter(Boolean)
      .join(" "),
  });
const paragraphs = (label: string, opts: Omit<TextField, "kind" | "label"> = {}): TextField =>
  text(label, {
    multiline: true,
    ...opts,
    help: [opts.help, "Leave a blank line between paragraphs."].filter(Boolean).join(" "),
  });
const image = (label: string, opts: Omit<ImageField, "kind" | "label"> = {}): ImageField => ({
  kind: "image",
  label,
  ...opts,
});
const bool = (label: string, opts: Omit<BooleanField, "kind" | "label"> = {}): BooleanField => ({
  kind: "boolean",
  label,
  ...opts,
});
const select = <const O extends readonly { value: string; label: string }[]>(
  label: string,
  options: O,
  opts: Omit<SelectField, "kind" | "label" | "options"> = {},
) => ({ kind: "select" as const, label, options, ...opts });
const list = <const O extends Field>(
  label: string,
  of: O,
  opts: Omit<ListField, "kind" | "label" | "of">,
) => ({ kind: "list" as const, label, of, ...opts });
const group = <const G extends Record<string, Field>>(
  label: string,
  fields: G,
  opts: Omit<GroupField, "kind" | "label" | "fields"> = {},
) => ({ kind: "group" as const, label, fields, ...opts });

const seo = () =>
  group(
    "Search & sharing",
    {
      title: text("Page title", {
        max: 120,
        recommended: 60,
        help: "The blue headline in Google results and the browser tab.",
      }),
      description: text("Meta description", {
        multiline: true,
        max: 320,
        recommended: 155,
        help: "The grey summary under the title in Google results.",
      }),
      shareImage: image("Share image", {
        optional: true,
        help: "Shown when the page is shared on social media or in messages. 1200×630 works best. Leave empty to use the site-wide default.",
      }),
    },
    { serp: true },
  );

export const GALLERY_CATEGORIES = [
  { value: "vehicle", label: "Vehicle graphics" },
  { value: "storefront", label: "Storefronts" },
  { value: "graphics", label: "Signs and graphics" },
] as const;

export const SCHEMA = {
  site: group("Site-wide", {
    defaultShareImage: image("Default share image", {
      optional: true,
      help: "Used for any page that doesn't have its own share image.",
    }),
    footer: group("Footer", {
      headline: rich("Footer headline"),
      hours: text("Opening hours"),
      copyright: text("Bottom-left line"),
      credit: text("Bottom-right line"),
    }),
  }),

  home: group("Home", {
    seo: seo(),
    hero: group("Hero (top of the page)", {
      eyebrow: text("Small label above the headline"),
      headlineRed: text("Headline: red line"),
      headlineBlue: list("Headline: blue lines", text("Line"), {
        itemLabel: "line",
        min: 1,
        max: 6,
      }),
      scriptLead: text("Script line: lead-in words"),
      scriptStrong: text("Script line: bold words"),
      lede: text("Intro paragraph", { multiline: true, max: 600 }),
      primaryButton: text("Main button label"),
      secondaryButton: text("Second button label"),
      stats: list(
        "Stats",
        group("Stat", {
          value: text("Number", {
            help: "Digits only. It counts up when it scrolls into view.",
          }),
          suffix: text("Symbol after the number", { help: "For example +" }),
          unit: text("Word after the number", { help: "For example states" }),
          label: text("Caption"),
        }),
        { itemLabel: "stat", max: 4 },
      ),
      logo: image("Logo"),
      ringText: text("Text circling the logo", {
        max: 400,
        help: "Repeated twice around the circle.",
      }),
      badgeTop: text("Badge: top left"),
      badgeBottom: text("Badge: bottom right"),
    }),
    marquee: list("Scrolling ticker", text("Item"), { itemLabel: "item", max: 16 }),
    intro: group("Intro section", {
      eyebrow: text("Small label"),
      heading: rich("Heading"),
      body: paragraphs("Text"),
    }),
    services: group("Services", {
      eyebrow: text("Small label"),
      heading: lines("Heading"),
      lede: text("Intro paragraph", { multiline: true, max: 600 }),
      items: list(
        "Services",
        group("Service", {
          title: text("Service name"),
          description: text("Short description", { multiline: true, max: 400 }),
        }),
        { itemLabel: "service", min: 1, max: 12 },
      ),
    }),
    why: group("Why Butler Signs", {
      eyebrow: text("Small label"),
      heading: lines("Heading"),
      lede: text("Intro paragraph", { multiline: true, max: 600 }),
      cards: list(
        "Reasons",
        group("Reason", {
          title: text("Title"),
          body: text("Text", { multiline: true, max: 600 }),
        }),
        { itemLabel: "reason", min: 1, max: 6 },
      ),
    }),
    areas: group("Service areas", {
      label: text("Label"),
      cities: list("Cities", text("City"), { itemLabel: "city", max: 24 }),
    }),
    contact: group("Contact section", {
      eyebrow: text("Small label"),
      heading: lines("Heading"),
      body: text("Text", { multiline: true, max: 600 }),
      button: text("Button label"),
    }),
  }),

  "our-story": group("Our Story", {
    seo: seo(),
    hero: group("Hero", {
      heading: lines("Heading"),
      facts: list(
        "Quick facts",
        group("Fact", { label: text("Label"), value: text("Value") }),
        { itemLabel: "fact", max: 4 },
      ),
    }),
    chapters: list(
      "Chapters",
      group("Chapter", {
        heading: rich("Heading"),
        body: paragraphs("Text"),
        quote: text("Pull quote", { multiline: true, max: 300 }),
        image: image("Photo"),
        caption: text("Photo caption"),
      }),
      { itemLabel: "chapter", max: 8 },
    ),
    archive: group("From the archive", {
      eyebrow: text("Small label"),
      heading: rich("Heading"),
      intro: text("Intro", { multiline: true, max: 600 }),
      tiles: list(
        "Photos",
        group("Photo", { image: image("Photo"), label: text("Label") }),
        { itemLabel: "photo", max: 8 },
      ),
    }),
    timeline: group("Timeline", {
      heading: rich("Heading"),
      items: list(
        "Milestones",
        group("Milestone", {
          year: text("Year"),
          title: text("Title"),
          body: text("Text", { multiline: true, max: 600 }),
        }),
        { itemLabel: "milestone", max: 12 },
      ),
    }),
    values: group("What we believe", {
      eyebrow: text("Small label"),
      heading: rich("Heading"),
      items: list(
        "Values",
        group("Value", {
          heading: rich("Heading"),
          body: text("Text", { multiline: true, max: 600 }),
        }),
        { itemLabel: "value", max: 6 },
      ),
    }),
  }),

  "our-work": group("Our Work", {
    seo: seo(),
    hero: group("Hero", {
      heading: lines("Heading"),
      lede: text("Intro paragraph", { multiline: true, max: 600 }),
    }),
    gallery: list(
      "Gallery photos",
      group("Photo", {
        image: image("Photo", {
          help: "The alt text is also shown as the photo's caption.",
        }),
        category: select("Filter category", GALLERY_CATEGORIES),
        wide: bool("Show wide (spans two columns)"),
      }),
      { itemLabel: "photo", max: 300, collapsed: true },
    ),
  }),

  book: group("Book", {
    seo: seo(),
    heading: text("Heading"),
    lede: text("Intro paragraph", { multiline: true, max: 600 }),
    stepsHeading: text("Steps box: heading"),
    steps: list("Steps", text("Step"), { itemLabel: "step", max: 6 }),
    expectHeading: text("Expectations box: heading"),
    expectBody: text("Expectations box: text", { multiline: true, max: 600 }),
    formHeading: text("Form heading"),
    formIntro: text("Form intro", { multiline: true, max: 600 }),
  }),
} as const;

export type PageId = keyof typeof SCHEMA;
export type SiteContent = { [P in PageId]: ValueOf<(typeof SCHEMA)[P]> };
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["value"];
export type GalleryItem = SiteContent["our-work"]["gallery"][number];

export const PAGES: readonly {
  id: PageId;
  label: string;
  path: string;
  blurb: string;
}[] = [
  { id: "home", label: "Home", path: "/", blurb: "Hero, services, reasons, service areas and the contact section." },
  { id: "our-story", label: "Our Story", path: "/our-story", blurb: "Chapters, archive photos, timeline and values." },
  { id: "our-work", label: "Our Work", path: "/we-deliver", blurb: "Gallery photos, captions and categories." },
  { id: "book", label: "Book", path: "/book", blurb: "Booking page headings and copy." },
  { id: "site", label: "Site-wide", path: "/", blurb: "Footer text and the default share image." },
];

export const PAGE_IDS = PAGES.map((p) => p.id);

export function isPageId(value: unknown): value is PageId {
  return typeof value === "string" && (PAGE_IDS as string[]).includes(value);
}
