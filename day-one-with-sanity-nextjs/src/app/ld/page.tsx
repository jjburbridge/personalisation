import { getUserId } from "@/lib/experiments";
import { getVariation } from "@/lib/ld-server";
import { urlFor } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { defineQuery, PortableText } from "next-sanity";
import Link from "next/link";

const LD_QUERY = defineQuery(`*[
  _type == "article"
][0]{
...,
"featureImage": coalesce(featureImage.variants[experimentId == $experiment && variantId == $variant][0].value, featureImage.default),
}`);

export default async function LD() {
  //  let variant;

  const userId = await getUserId();

  const context = {
    kind: "user",
    key: userId,
  };

  const variation = await getVariation("image", context, "control");
  const otherVariation = await getVariation("other", context, true);
  console.log("otherVariation", otherVariation);

  const { data } = await sanityFetch({
    query: LD_QUERY,
    params: {
      variant: variation,
      experiment: "image",
    },
  });

  console.log(data);

  return (
    <main className="container mx-auto grid gap-12 p-12">
      <div className="mb-4">
        <Link href="/">← Back to events</Link>
      </div>
      <h2 className="text-xl font-bold">{data.title}</h2>
      <img width={400} src={urlFor(data.featureImage).url()} />
      <h6>{data.description}</h6>
      <PortableText value={data.content} />
    </main>
  );
}
