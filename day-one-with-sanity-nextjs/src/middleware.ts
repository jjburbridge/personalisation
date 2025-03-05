import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getExperimentValue,
  getExperimentValueFromResponse,
  setCookiesValue,
  setCookiesValueFromResponse,
} from "./lib/experiments";
import { defineQuery } from "next-sanity";
import { client } from "./sanity/client";

const ROUTING_QUERY = defineQuery(`*[
  _type == "growthbookSettings" &&
  growthExperiment.default == $path
][0]{
  "route": coalesce(growthExperiment.variants[experimentId == $experimentId && variantId == $variantId][0].value, growthExperiment.default)
}`);

export async function middleware(request: NextRequest) {
  if (request.headers.get("sec-fetch-dest") !== "document") {
    return;
  }
  let response = NextResponse.next();

  let cookie = request.cookies.get("ab-test")?.value;
  let variant;
  if (!cookie) {
    response = setCookiesValue(request, response);
    const data = await getExperimentValueFromResponse("event-name", response);
    variant = data.variant;
  } else {
    const data = await getExperimentValue("event-name");
    variant = data.variant;
  }
  const path = request.nextUrl.pathname;
  console.log("Middleware path", path);

  const queryParams = {
    path,
    experimentId: "event-name",
    variantId: variant?.id || "",
  };

  const data = await client.fetch(ROUTING_QUERY, queryParams);
  console.log("Middleware data", data, queryParams);
  if (data?.route) {
    const url = request.nextUrl.clone();
    url.pathname = data.route;
    let rewrite = NextResponse.rewrite(url);
    rewrite = setCookiesValueFromResponse(response, rewrite);
    return rewrite;
  }

  return response;
}

export const config = {
  //only run the middleware on the events pages
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
