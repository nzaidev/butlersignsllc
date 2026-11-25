import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/cms/session";

/**
 * Gate for /admin. Signed-out visitors are sent to the login page. This is a
 * first line of defence only; every admin page and action checks the session
 * again on the server.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const user = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  // Only redirect page loads. Server Action POSTs go through so the action can
  // answer "session expired" without the editor losing unsaved work.
  const isPageLoad = request.method === "GET" || request.method === "HEAD";
  let response: NextResponse;
  if (!user && !isLogin && isPageLoad) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname + search);
    response = NextResponse.redirect(login);
  } else {
    response = NextResponse.next();
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
