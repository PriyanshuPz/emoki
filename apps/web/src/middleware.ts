import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    if (nextUrl.pathname === "/auth/logout") {
      return Response.redirect(new URL(`/enter?callbackUrl=%2F`, nextUrl));
    }

    return Response.redirect(
      new URL(`/enter?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return;
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
