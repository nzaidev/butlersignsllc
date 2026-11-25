"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, getCurrentUser, startSession } from "@/cms/auth";
import { CONTENT_TAG, publishPage, restoreRevision, type EditorState } from "@/cms/content";
import { isPageId, type PageId } from "@/cms/schema";
import { checkCredentials } from "@/cms/session";
import { getStore, StoreNotConfiguredError } from "@/cms/store";
import { IMAGE_URLS } from "@/data/images";

const SESSION_EXPIRED =
  "Your session has expired. Sign in again in a new tab (keep this one open), then try again.";

function storageMessage(error: unknown, fallback: string): string {
  if (error instanceof StoreNotConfiguredError) return error.message;
  console.error("[cms]", error);
  return fallback;
}

function invalidateSite() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/* --------------------------------- Session -------------------------------- */

export type LoginState = { error?: string; username?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const name = String(formData.get("username") ?? "").slice(0, 64);
  const password = String(formData.get("password") ?? "").slice(0, 256);
  const next = String(formData.get("next") ?? "");

  const user = checkCredentials(name, password);
  if (!user) {
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500));
    return { error: "That username and password don't match.", username: name };
  }

  await startSession(user);
  const safeNext = /^\/admin(\/[\w\-/]*)?$/.test(next) && next !== "/admin/login" ? next : "/admin";
  redirect(safeNext);
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

/* --------------------------------- Content -------------------------------- */

export type PublishResponse =
  | { ok: true; changed: boolean; state: EditorState }
  | { ok: false; error: string };

export async function publishAction(
  page: string,
  json: string,
  baseHash: string,
): Promise<PublishResponse> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };
  if (!isPageId(page)) return { ok: false, error: "Unknown page." };

  let input: unknown;
  try {
    input = JSON.parse(json);
  } catch {
    return { ok: false, error: "The changes couldn't be read. Reload the page and try again." };
  }

  try {
    const result = await publishPage(page as PageId, input, String(baseHash), user);
    if (!result.ok) {
      const who = result.lastRevision ? ` by ${result.lastRevision.author}` : "";
      return {
        ok: false,
        error: `This page was changed${who} after you opened it. Copy anything you want to keep, reload the page, and make your edits again.`,
      };
    }
    if (result.changed) invalidateSite();
    return { ok: true, changed: result.changed, state: result.state };
  } catch (error) {
    return { ok: false, error: storageMessage(error, "Publishing failed because of a storage error. Please try again.") };
  }
}

export async function restoreAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };
  try {
    await restoreRevision(String(id), user);
    invalidateSite();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: storageMessage(error, "That version couldn't be restored. Please try again.") };
  }
}

/* ---------------------------------- Media --------------------------------- */

export type MediaItem = { src: string; name: string };
export type MediaLibrary = { uploaded: MediaItem[]; builtIn: MediaItem[]; error?: string };

export async function listMediaAction(): Promise<MediaLibrary> {
  const builtIn = Object.entries(IMAGE_URLS).map(([name, src]) => ({ name, src }));
  const user = await getCurrentUser();
  if (!user) return { uploaded: [], builtIn: [], error: SESSION_EXPIRED };
  try {
    const uploaded = (await getStore().listImages()).map(({ src, name }) => ({ src, name }));
    return { uploaded, builtIn };
  } catch (error) {
    return { uploaded: [], builtIn, error: storageMessage(error, "Uploaded images couldn't be loaded.") };
  }
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Identify the image type from its bytes; the browser-supplied type isn't trusted. */
function sniffImage(bytes: Uint8Array): { ext: string; type: string } | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (ascii(0, 8) === "\x89PNG\r\n\x1a\n") return { ext: "png", type: "image/png" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return { ext: "avif", type: "image/avif" };
  return null;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[a-z0-9]{2,5}$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

export async function uploadImageAction(
  formData: FormData,
): Promise<{ ok: true; src: string } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image to upload." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "That image is too large (4 MB max)." };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) return { ok: false, error: "Only JPEG, PNG, WebP and AVIF images can be uploaded." };

  const base = slugify(String(formData.get("name") ?? "")) || slugify(file.name) || "image";
  try {
    const image = await getStore().putImage(`${base}.${kind.ext}`, bytes, kind.type);
    return { ok: true, src: image.src };
  } catch (error) {
    return { ok: false, error: storageMessage(error, "The upload failed. Please try again.") };
  }
}
