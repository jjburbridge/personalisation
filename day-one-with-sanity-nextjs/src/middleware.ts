import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setCookiesValue } from "./lib/experiments";

export function middleware(request: NextRequest) {
  console.log("dest header", request.headers.get("sec-fetch-dest"));
  if (request.headers.get("sec-fetch-dest") !== "document") {
    console.log("middleware not document");
    return;
  }
  let response = NextResponse.next();
  console.log("middleware", request.url);
  response = setCookiesValue(request, response);

  return response;
}

export const config = {
  //only run the middleware on the events pages
  matcher: ["/events/:path*", "/form"],
};
