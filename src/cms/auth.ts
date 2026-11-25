import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, verifySessionToken } from "./session";

/** The signed-in CMS user, or null. Call this inside every action and page. */
export async function getCurrentUser(): Promise<string | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** For admin pages: the signed-in user, or a redirect to the login page. */
export async function requireUser(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function startSession(name: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(name), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete({ name: SESSION_COOKIE, path: "/admin" });
}
