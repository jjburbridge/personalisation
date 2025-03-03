import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setCookiesValue } from "./lib/experiments";

export function middleware(request: NextRequest) {
  if (request.headers.get("sec-fetch-dest") !== "document") {
    return;
  }
  let response = NextResponse.next();
  response = setCookiesValue(request, response);

  return response;
}

export const config = {
  //only run the middleware on the events pages
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
