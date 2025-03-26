import { getUserId } from "@/lib/experiments";
import { getVariation } from "@/lib/ld-server";
import { urlFor } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { defineQuery, PortableText } from "next-sanity";
import Link from "next/link";

const LD_QUERY = defineQuery(`*[
  _type == "Article"
][0]{
...,
"FeatureImage": coalesce(FeatureImage.variants[experimentId == $experiment && variantId == $variant][0].value, FeatureImage.default),
}`);

export default async function LD() {
  //  let variant;

  const userId = await getUserId();

  const context = {
    kind: "user",
    key: userId,
  };

  const variation = await getVariation("image", context, "control");

  const { data } = await sanityFetch({
    query: LD_QUERY,
    params: {
      variant: variation,
      experiment: "image",
    },
  });

  return (
    <main className="container mx-auto grid gap-12 p-12">
      <div className="mb-4">
        <Link href="/">← Back to events</Link>
      </div>
      <h2 className="text-xl font-bold">{data.Title}</h2>
      <img width={400} src={urlFor(data.FeatureImage).url()} />
      <h6>{data.description}</h6>
      <PortableText value={data.Content} />
    </main>
  );
}
