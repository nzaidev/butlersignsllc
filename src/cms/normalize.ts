import type { Field, ImageValue } from "./schema";

/**
 * Image hosts the site may render. Editors can only pick images that already
 * live on the site or that they uploaded through the CMS, so pages can't be
 * pointed at arbitrary third-party URLs.
 */
const ALLOWED_IMAGE_HOSTS = ["zdzxammcjnnhnksdkvln.supabase.co"];
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";
const LOCAL_UPLOAD_PREFIX = "/cms-uploads/";

export function isAllowedImageSrc(src: string): boolean {
  if (src.startsWith(LOCAL_UPLOAD_PREFIX)) return /^\/cms-uploads\/[a-z0-9-]+\.(jpg|png|webp|avif)$/.test(src);
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password) return false;
  return ALLOWED_IMAGE_HOSTS.includes(url.hostname) || url.hostname.endsWith(BLOB_HOST_SUFFIX);
}

function isImageValue(value: unknown): value is ImageValue {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.src === "string" && typeof v.alt === "string";
}

function cleanLine(value: string, max: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

/** The value a brand-new, blank instance of a field starts with. */
export function emptyValue(field: Field): unknown {
  switch (field.kind) {
    case "text":
      return "";
    case "image":
      return { src: "", alt: "" };
    case "select":
      return field.options[0]?.value ?? "";
    case "boolean":
      return false;
    case "list":
      return [];
    case "group":
      return Object.fromEntries(
        Object.entries(field.fields).map(([key, f]) => [key, emptyValue(f)]),
      );
  }
}

/**
 * Coerce untrusted input into exactly the shape `field` describes. Anything
 * missing, mistyped or disallowed is replaced by `fallback` (or a blank value).
 * Unknown keys are dropped. The result is safe to store and render.
 */
export function normalize(field: Field, input: unknown, fallback: unknown): unknown {
  switch (field.kind) {
    case "text": {
      const fb = typeof fallback === "string" ? fallback : "";
      if (typeof input !== "string") return fb;
      const max = field.max ?? (field.multiline ? 5000 : 300);
      if (!field.multiline) return cleanLine(input, max);
      return input
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map((line) => line.replace(/[^\S\n]+/g, " ").trimEnd())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, max);
    }
    case "image": {
      const fb: ImageValue = isImageValue(fallback) ? fallback : { src: "", alt: "" };
      if (!isImageValue(input)) return fb;
      const alt = cleanLine(input.alt, 300);
      const src = input.src.trim();
      if (src === "") return field.optional ? { src: "", alt } : { src: fb.src, alt };
      if (!isAllowedImageSrc(src)) return { src: fb.src, alt };
      return { src, alt };
    }
    case "select": {
      const allowed = (v: unknown) => field.options.some((o) => o.value === v);
      if (allowed(input)) return input;
      return allowed(fallback) ? fallback : emptyValue(field);
    }
    case "boolean":
      if (typeof input === "boolean") return input;
      return typeof fallback === "boolean" ? fallback : false;
    case "list": {
      if (!Array.isArray(input)) return Array.isArray(fallback) ? fallback : [];
      return input
        .slice(0, field.max ?? 100)
        .map((item) => normalize(field.of, item, emptyValue(field.of)));
    }
    case "group": {
      const src =
        input && typeof input === "object" && !Array.isArray(input)
          ? (input as Record<string, unknown>)
          : {};
      const fb =
        fallback && typeof fallback === "object" && !Array.isArray(fallback)
          ? (fallback as Record<string, unknown>)
          : {};
      return Object.fromEntries(
        Object.entries(field.fields).map(([key, f]) => [key, normalize(f, src[key], fb[key])]),
      );
    }
  }
}
