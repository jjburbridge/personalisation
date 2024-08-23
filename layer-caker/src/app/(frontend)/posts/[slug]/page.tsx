import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { POST_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type PostIndexProps = { params: { slug: string } };

const options = { next: { revalidate: 60 } };

export default async function Page({ params }: PostIndexProps) {
  const post = await client.fetch(POST_QUERY, params, options);

  return (
    <main className="container mx-auto grid grid-cols-1 gap-6 py-12">
      {post?.mainImage ?
        <Image
          className="w-full aspect-[800/400]"
          src={urlFor(post.mainImage).width(800).height(400).quality(80).auto('format').url()}
          alt={post?.mainImage?.alt || ''}
          width="800"
          height="400"
        /> : null}
      <h1 className="text-4xl font-bold text-balance">{post?.title}</h1>
      <hr />
      <Link href="/posts">&larr; Return to index</Link>
    </main>
  );
}