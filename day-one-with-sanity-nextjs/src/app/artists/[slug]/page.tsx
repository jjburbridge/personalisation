import {
  HubspotForm,
  MailchimpForm,
  SchemaFormExample,
} from "@/components/form";
import { sanityFetch } from "@/sanity/live";
import { defineQuery } from "next-sanity";
import Link from "next/link";

import React from "react";

const getForm = ({ variant, data }: { variant?: string; data: any }) => {
  if (variant === "hubspot") {
    return <HubspotForm formId={data} />;
  }
  if (variant === "mailchimp") {
    return <MailchimpForm url={data} />;
  }
  return <SchemaFormExample formData={data} />;
};

const ARTIST_QUERY =
  defineQuery(`*[_type == "artist" && slug.current == $slug][0]{
  ...,
  "form": {
    ...form,
    "native": form.native->
  }
}`);

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data } = await sanityFetch({
    query: ARTIST_QUERY,
    params: { slug },
  });

  let variant;

  if (data.form.mailchimp) {
    variant = "mailchimp";
  }

  if (data.form.hubspot) {
    variant = "hubspot";
  }

  if (data.form.native) {
    variant = "native";
  }

  return (
    <main className="container mx-auto grid gap-12 p-12">
      <div className="mb-4">
        <Link href="/">← Back to events</Link>
      </div>
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <h4 className="text-l font-bold">{variant} Form</h4>
      {variant && getForm({ variant: variant, data: data.form[variant] })}
    </main>
  );
}
