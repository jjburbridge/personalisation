import {
  HubspotForm,
  MailchimpForm,
  SchemaFormExample,
} from "@/components/form";
import { getDeferredTrackingData, getExperimentValue } from "@/lib/experiments";
import { sanityFetch } from "@/sanity/live";
import { defineQuery } from "next-sanity";
import Link from "next/link";

import React, { type FC } from "react";

const getForm = ({ variant, data }: { variant?: string; data: any }) => {
  if (variant === "hubspot") {
    return <HubspotForm formId={data} />;
  }
  if (variant === "mailchimp") {
    return <MailchimpForm url={data} />;
  }
  if (variant === "native") {
    return <SchemaFormExample formData={data} />;
  }
};

const FORM_QUERY = defineQuery(`*[_type == "personalForm" && _id == $id][0]{
  "default": {
    ...form.default,
    "native": form.default.native->,
      },
    "variants":form.variants[experimentId == $experimentId && variantId == $variantId] {
        ...,
        "value": coalesce(value.native->, value.mailchimp, value.hubspot)
      },
}{
  ...,
  "form": coalesce(variants[0],default)
}`);

export default async function EventPage() {
  const { variant } = await getExperimentValue("artist-form");
  const trackingData = await getDeferredTrackingData();

  const queryParams = {
    experimentId: "artist-form",
    variantId: variant?.id || "",
    id: "894ec2c6-e4ff-4a0a-93b2-b8367695a8b9", // hardcoded id but would probable be stored in config
  };
  const { data } = await sanityFetch({
    query: FORM_QUERY,
    params: queryParams,
  });
  return (
    <main className="container mx-auto grid gap-12 p-12">
      <div className="mb-4">
        <Link href="/">← Back to events</Link>
      </div>
      <h4 className="text-2xl font-bold">{variant?.id} Form</h4>
      {getForm({ variant: variant?.id, data: data.form.value })}
    </main>
  );
}
