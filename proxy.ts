import { getIronSession, nextProxyCookies } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { SessionData, sessionOptions } from "./lib/session";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(
    nextProxyCookies(request, response),
    sessionOptions,
  );

  if (!session.is_logged_in) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  session.last_seen = Date.now();
  await session.save();

  return response;
}

export const config = {
  matcher: ["/protected/:path*"],
};
