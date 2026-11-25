import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { del, get, list, put } from "@vercel/blob";
import { isPageId, type PageId } from "./schema";

/**
 * Where CMS content lives. Content is never stored in the codebase.
 *
 * Every publish writes a new, immutable revision file per page:
 *   pages/<page>/<timestamp>.<author>.json
 * The live content of a page is its newest revision. Because files are never
 * overwritten, CDN caches can't serve stale content, and the full edit history
 * (who changed which page, when) comes for free.
 */

export type RevisionRef = {
  id: string;
  page: PageId;
  ts: number;
  author: string;
};

export type StoredImage = {
  src: string;
  name: string;
  size: number;
  uploadedAt: number;
};

export interface CmsStore {
  readonly kind: "blob" | "fs" | "none";
  listRevisions(): Promise<RevisionRef[]>;
  readRevision(id: string): Promise<unknown>;
  writeRevision(page: PageId, author: string, data: unknown): Promise<RevisionRef>;
  deleteRevisions(ids: string[]): Promise<void>;
  listImages(): Promise<StoredImage[]>;
  putImage(name: string, bytes: Uint8Array, contentType: string): Promise<StoredImage>;
}

export class StoreNotConfiguredError extends Error {
  constructor() {
    super(
      "Content storage isn't set up yet. Connect a Vercel Blob store to this project (see docs/CMS.md).",
    );
  }
}

const REVISION_ID = /^pages\/([a-z-]+)\/(\d{13})\.([a-z0-9]+)\.json$/;
const IMAGE_NAME = /^[a-z0-9-]+\.(jpg|png|webp|avif)$/;

/** Parse and validate a revision id. Returns null for anything malformed. */
export function parseRevisionId(id: string): RevisionRef | null {
  const m = REVISION_ID.exec(id);
  if (!m || !isPageId(m[1])) return null;
  return { id, page: m[1], ts: Number(m[2]), author: m[3] };
}

function revisionId(page: PageId, ts: number, author: string): string {
  return `pages/${page}/${String(ts).padStart(13, "0")}.${author}.json`;
}

function newestFirst(a: RevisionRef, b: RevisionRef) {
  return b.ts - a.ts;
}

function assertImageName(name: string) {
  if (!IMAGE_NAME.test(name)) throw new Error("Invalid image name.");
}

/* ------------------------------ Vercel Blob ------------------------------ */

const BLOB_ROOT = "cms/";

const blobStore: CmsStore = {
  kind: "blob",

  async listRevisions() {
    const refs: RevisionRef[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: `${BLOB_ROOT}pages/`, cursor, limit: 1000 });
      for (const blob of page.blobs) {
        const ref = parseRevisionId(blob.pathname.slice(BLOB_ROOT.length));
        if (ref) refs.push(ref);
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return refs.sort(newestFirst);
  },

  async readRevision(id) {
    if (!parseRevisionId(id)) throw new Error("Invalid revision id.");
    const result = await get(BLOB_ROOT + id, { access: "public" });
    if (!result || result.statusCode !== 200) throw new Error(`Revision not found: ${id}`);
    return new Response(result.stream).json();
  },

  async writeRevision(page, author, data) {
    const ts = Date.now();
    const id = revisionId(page, ts, author);
    await put(BLOB_ROOT + id, JSON.stringify(data), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return { id, page, ts, author };
  },

  async deleteRevisions(ids) {
    const valid = ids.filter((id) => parseRevisionId(id));
    if (valid.length) await del(valid.map((id) => BLOB_ROOT + id));
  },

  async listImages() {
    const images: StoredImage[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: `${BLOB_ROOT}images/`, cursor, limit: 1000 });
      for (const blob of page.blobs) {
        images.push({
          src: blob.url,
          name: blob.pathname.slice(`${BLOB_ROOT}images/`.length),
          size: blob.size,
          uploadedAt: blob.uploadedAt.getTime(),
        });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return images.sort((a, b) => b.uploadedAt - a.uploadedAt);
  },

  async putImage(name, bytes, contentType) {
    assertImageName(name);
    const blob = await put(`${BLOB_ROOT}images/${name}`, Buffer.from(bytes), {
      access: "public",
      contentType,
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return {
      src: blob.url,
      name: blob.pathname.slice(`${BLOB_ROOT}images/`.length),
      size: bytes.byteLength,
      uploadedAt: Date.now(),
    };
  },
};

/* --------------------------- Local folder (dev) --------------------------- */

const FS_ROOT = path.join(process.cwd(), ".cms");
const FS_IMAGES = path.join(process.cwd(), "public", "cms-uploads");

const fsStore: CmsStore = {
  kind: "fs",

  async listRevisions() {
    const refs: RevisionRef[] = [];
    const pagesDir = path.join(FS_ROOT, "pages");
    const dirs = await fs.readdir(pagesDir).catch(() => [] as string[]);
    for (const dir of dirs) {
      const files = await fs.readdir(path.join(pagesDir, dir)).catch(() => [] as string[]);
      for (const file of files) {
        const ref = parseRevisionId(`pages/${dir}/${file}`);
        if (ref) refs.push(ref);
      }
    }
    return refs.sort(newestFirst);
  },

  async readRevision(id) {
    if (!parseRevisionId(id)) throw new Error("Invalid revision id.");
    return JSON.parse(await fs.readFile(path.join(FS_ROOT, id), "utf8"));
  },

  async writeRevision(page, author, data) {
    const ts = Date.now();
    const id = revisionId(page, ts, author);
    const file = path.join(FS_ROOT, id);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2), { flag: "wx" });
    return { id, page, ts, author };
  },

  async deleteRevisions(ids) {
    for (const id of ids) {
      if (parseRevisionId(id)) await fs.rm(path.join(FS_ROOT, id), { force: true });
    }
  },

  async listImages() {
    const files = await fs.readdir(FS_IMAGES).catch(() => [] as string[]);
    const images = await Promise.all(
      files
        .filter((f) => IMAGE_NAME.test(f))
        .map(async (name) => {
          const stat = await fs.stat(path.join(FS_IMAGES, name));
          return { src: `/cms-uploads/${name}`, name, size: stat.size, uploadedAt: stat.mtimeMs };
        }),
    );
    return images.sort((a, b) => b.uploadedAt - a.uploadedAt);
  },

  async putImage(name, bytes) {
    assertImageName(name);
    const dot = name.lastIndexOf(".");
    const unique = `${name.slice(0, dot)}-${randomBytes(3).toString("hex")}${name.slice(dot)}`;
    await fs.mkdir(FS_IMAGES, { recursive: true });
    await fs.writeFile(path.join(FS_IMAGES, unique), bytes, { flag: "wx" });
    return { src: `/cms-uploads/${unique}`, name: unique, size: bytes.byteLength, uploadedAt: Date.now() };
  },
};

/* ------------------------------ Not configured ---------------------------- */

const noStore: CmsStore = {
  kind: "none",
  listRevisions: async () => [],
  readRevision: async () => {
    throw new StoreNotConfiguredError();
  },
  writeRevision: async () => {
    throw new StoreNotConfiguredError();
  },
  deleteRevisions: async () => {},
  listImages: async () => [],
  putImage: async () => {
    throw new StoreNotConfiguredError();
  },
};

export function getStore(): CmsStore {
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) return blobStore;
  if (process.env.CMS_STORAGE === "fs" || process.env.NODE_ENV !== "production") return fsStore;
  return noStore;
}
