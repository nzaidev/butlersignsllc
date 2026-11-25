import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * CMS accounts and signed session tokens.
 *
 * Accounts come from the CMS_USERS environment variable:
 *   CMS_USERS="nick:<long-password>,seo:<long-password>"
 * Sessions are HMAC-signed with a key derived from CMS_SESSION_SECRET and the
 * user's password, so removing a user or changing their password immediately
 * signs them out everywhere.
 *
 * Kept free of next/headers so the proxy can use it too.
 */

export const SESSION_COOKIE = "bs_cms_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

const USERNAME = /^[a-z0-9]{2,32}$/;
const MIN_PASSWORD = 12;
const MIN_SECRET = 32;

type CmsUser = { name: string; password: string };

export type CmsConfig = { users: CmsUser[]; secret: string | null; problems: string[] };

export function readCmsConfig(): CmsConfig {
  const problems: string[] = [];
  const users: CmsUser[] = [];

  for (const entry of (process.env.CMS_USERS ?? "").split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const sep = trimmed.indexOf(":");
    const name = sep > 0 ? trimmed.slice(0, sep).trim().toLowerCase() : "";
    const password = sep > 0 ? trimmed.slice(sep + 1) : "";
    if (!USERNAME.test(name)) {
      problems.push(`A CMS_USERS entry has an invalid username (use 2–32 lowercase letters or digits).`);
    } else if (password.length < MIN_PASSWORD) {
      problems.push(`The password for "${name}" is shorter than ${MIN_PASSWORD} characters, so that account is disabled.`);
    } else if (users.some((u) => u.name === name)) {
      problems.push(`"${name}" appears more than once in CMS_USERS.`);
    } else {
      users.push({ name, password });
    }
  }
  if (users.length === 0) problems.push("No CMS accounts are configured (CMS_USERS).");

  const secret = process.env.CMS_SESSION_SECRET ?? "";
  if (secret.length < MIN_SECRET) {
    problems.push(`CMS_SESSION_SECRET must be at least ${MIN_SECRET} characters.`);
  }

  return { users, secret: secret.length >= MIN_SECRET ? secret : null, problems };
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function sign(secret: string, user: CmsUser, payload: string): string {
  const key = createHmac("sha256", secret).update(`session-key\0${user.name}\0${user.password}`).digest();
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/** Returns the username if the credentials are valid. */
export function checkCredentials(name: string, password: string): string | null {
  const { users, secret } = readCmsConfig();
  if (!secret) return null;
  const user = users.find((u) => u.name === name.trim().toLowerCase());
  // Compare against something even when the user doesn't exist, so response
  // timing doesn't reveal which usernames are valid.
  const expected = digest(user?.password ?? `\0no-such-user\0${secret}`);
  const ok = timingSafeEqual(expected, digest(password));
  return ok && user ? user.name : null;
}

export function createSessionToken(name: string): string {
  const { users, secret } = readCmsConfig();
  const user = users.find((u) => u.name === name);
  if (!user || !secret) throw new Error("Cannot create a session for an unknown user.");
  const payload = `${user.name}.${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}`;
  return `${payload}.${sign(secret, user, payload)}`;
}

/** Returns the username for a valid, unexpired token; otherwise null. */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [name, exp, signature] = parts;
  if (!USERNAME.test(name) || !/^\d+$/.test(exp)) return null;
  if (Number(exp) < Date.now() / 1000) return null;

  const { users, secret } = readCmsConfig();
  const user = users.find((u) => u.name === name);
  if (!user || !secret) return null;

  const expected = Buffer.from(sign(secret, user, `${name}.${exp}`));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return user.name;
}
