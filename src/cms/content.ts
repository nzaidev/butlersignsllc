import "server-only";
import { createHash } from "node:crypto";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { DEFAULT_CONTENT } from "./defaults";
import { normalize } from "./normalize";
import { PAGE_IDS, SCHEMA, type PageId, type SiteContent } from "./schema";
import { getStore, parseRevisionId, type RevisionRef } from "./store";

/** Cache tag for published content. Publishing invalidates it. */
export const CONTENT_TAG = "cms-content";

/** Revisions kept per page; older ones are pruned on publish. */
const KEEP_REVISIONS = 40;

type RawContent = Partial<Record<PageId, unknown>>;

function latestPerPage(revisions: RevisionRef[]): Partial<Record<PageId, RevisionRef>> {
  const latest: Partial<Record<PageId, RevisionRef>> = {};
  for (const rev of revisions) {
    const current = latest[rev.page];
    if (!current || rev.ts > current.ts) latest[rev.page] = rev;
  }
  return latest;
}

async function readLatestRaw(): Promise<RawContent> {
  const store = getStore();
  const latest = latestPerPage(await store.listRevisions());
  const entries = await Promise.all(
    Object.values(latest).map(async (rev) => [rev.page, await store.readRevision(rev.id)] as const),
  );
  return Object.fromEntries(entries);
}

function resolvePage<P extends PageId>(page: P, raw: unknown, fallback = DEFAULT_CONTENT[page]) {
  return normalize(SCHEMA[page], raw, fallback) as SiteContent[P];
}

function resolve(raw: RawContent): SiteContent {
  return Object.fromEntries(
    PAGE_IDS.map((page) => [page, resolvePage(page, raw[page])]),
  ) as SiteContent;
}

function hashOf(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 20);
}

/* ------------------------------ Public site ------------------------------- */

// Cached across requests until the next publish, so pages stay static and a
// page view never touches storage. If storage errors, the render fails and
// Next keeps serving the last good version instead of reverting to defaults.
const readPublished = unstable_cache(readLatestRaw, ["cms-published-content"], {
  tags: [CONTENT_TAG],
});

export const getSiteContent = cache(async (): Promise<SiteContent> => resolve(await readPublished()));

export async function getPage<P extends PageId>(page: P): Promise<SiteContent[P]> {
  return (await getSiteContent())[page];
}

export async function pageMetadata(page: Exclude<PageId, "site">): Promise<Metadata> {
  const content = await getSiteContent();
  const { seo } = content[page];
  const share = seo.shareImage.src ? seo.shareImage : content.site.defaultShareImage;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      siteName: "Butler Signs",
      ...(share.src ? { images: [{ url: share.src, alt: share.alt || undefined }] } : {}),
    },
  };
}

/* ---------------------------------- Admin --------------------------------- */

export type EditorState<P extends PageId = PageId> = {
  value: SiteContent[P];
  hash: string;
  lastRevision: RevisionRef | null;
};

/** Fresh (uncached) state of one page for the editor. */
export async function getEditorState<P extends PageId>(page: P): Promise<EditorState<P>> {
  const store = getStore();
  const rev = latestPerPage(await store.listRevisions())[page] ?? null;
  const raw = rev ? await store.readRevision(rev.id) : undefined;
  const value = resolvePage(page, raw);
  return { value, hash: hashOf(value), lastRevision: rev };
}

export async function getOverview() {
  const store = getStore();
  const revisions = await store.listRevisions();
  return {
    storage: store.kind,
    latest: latestPerPage(revisions),
    recent: revisions.slice(0, 30),
  };
}

export type PublishResult<P extends PageId = PageId> =
  | { ok: true; changed: boolean; state: EditorState<P> }
  | { ok: false; reason: "conflict"; lastRevision: RevisionRef | null };

/**
 * Publish a page. `baseHash` is the hash the editor started from: if someone
 * else published this page in the meantime, the publish is refused instead of
 * silently overwriting their work.
 */
export async function publishPage<P extends PageId>(
  page: P,
  input: unknown,
  baseHash: string,
  author: string,
): Promise<PublishResult<P>> {
  const current = await getEditorState(page);
  const next = resolvePage(page, input, current.value);
  const nextHash = hashOf(next);

  if (nextHash === current.hash) return { ok: true, changed: false, state: current };
  if (current.hash !== baseHash) {
    return { ok: false, reason: "conflict", lastRevision: current.lastRevision };
  }

  const store = getStore();
  const rev = await store.writeRevision(page, author, next);
  await prune(page);
  return { ok: true, changed: true, state: { value: next, hash: nextHash, lastRevision: rev } };
}

/** Make an old revision the live version of its page (as a new revision). */
export async function restoreRevision(id: string, author: string): Promise<RevisionRef> {
  const ref = parseRevisionId(id);
  if (!ref) throw new Error("Unknown version.");
  const store = getStore();
  // Resolve exactly as the public site did while that version was live.
  const restored = resolvePage(ref.page, await store.readRevision(ref.id));
  const rev = await store.writeRevision(ref.page, author, restored);
  await prune(ref.page);
  return rev;
}

async function prune(page: PageId) {
  const store = getStore();
  const revisions = (await store.listRevisions()).filter((r) => r.page === page);
  const stale = revisions.slice(KEEP_REVISIONS).map((r) => r.id);
  if (stale.length) await store.deleteRevisions(stale);
}
