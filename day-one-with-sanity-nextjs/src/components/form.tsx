"use client";

import { FormDataProps, FormRenderer } from "@sanity/form-toolkit";
import { FC, FormEvent, useEffect, useState } from "react";

interface UseStateExampleProps {
  formData: FormDataProps;
  onSubmit?: (data: Record<string, unknown>) => void;
}

export const SchemaFormExample: FC<UseStateExampleProps> = ({
  formData,
  onSubmit = console.log,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const getFieldState = (fieldName: string) => ({
    value: values[fieldName],
    onChange: (value: unknown) => {
      setValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      // Clear error when value changes
      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }
    },
    onBlur: () => {
      // Example validation on blur
      const field = formData.fields?.find((field) => field?.name === fieldName);

      if (field?.required && !values[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "This field is required",
        }));
      }
    },
  });

  const getFieldError = (fieldName: string) => errors[fieldName];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(JSON.stringify(values));
  };

  return (
    <FormRenderer
      formData={formData}
      onSubmit={handleSubmit}
      getFieldState={getFieldState}
      getFieldError={getFieldError}
    />
  );
};

declare global {
  interface Window {
    hbspt: {
      forms: {
        create: ({}) => void;
      };
    };
  }
}

export const HubspotForm = (props: { formId: string }) => {
  const { formId } = props;
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/shell.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "45779469",
          //   portalId: "your_portal_id",
          formId: formId,
          target: "#hubspotForm",
        });
      }
    });
  }, [formId]);

  return (
    <div>
      <div id="hubspotForm"></div>
    </div>
  );
};

export const MailchimpForm = ({ url }: { url: string }) => {
  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        frameBorder="0"
        allowFullScreen
        style={{
          position: "absolute",
          width: "100%",
          top: 0,
          left: 0,
          height: "110%",
        }}
        src={url}
      />
    </div>
  );
};
