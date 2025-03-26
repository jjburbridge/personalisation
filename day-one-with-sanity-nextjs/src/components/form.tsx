"use client";

import { FormDataProps, FormRenderer } from "@sanity/form-toolkit/form-schema";
import { FC, FormEvent, useEffect, useState } from "react";

interface UseStateExampleProps {
  formData: FormDataProps;
  onSubmit?: (data: Record<string, unknown>) => void;
}

interface FormField {
  label: string;
  name: string;
}

interface FormFieldState {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

interface FormComponentProps {
  error?: string;
  field?: FormField;
  fieldState?: FormFieldState;
}

const TextInput: FC<FormComponentProps> = ({ error, field, fieldState }) => {
  const {
    value = "",
    onChange = () => {},
    onBlur = () => {},
  } = fieldState || {};
  const { label = "", name = "" } = field || {};
  return (
    <div className="relative mb-4">
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
        placeholder=" "
      />
      <label
        htmlFor={name}
        className="absolute -top-2.5 left-0 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:-translate-y-4 peer-focus:scale-75"
      >
        {label}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 peer-focus:text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const EmailInput: FC<FormComponentProps> = ({ error, field, fieldState }) => {
  const {
    value = "",
    onChange = () => {},
    onBlur = () => {},
  } = fieldState || {};
  const { label = "", name = "" } = field || {};
  return (
    <div className="relative mb-4">
      <input
        type="email"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
        placeholder=" "
      />
      <label
        htmlFor={name}
        className="absolute -top-2.5 left-0 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:-translate-y-4 peer-focus:scale-75"
      >
        {label}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 peer-focus:text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const SubmitButton: FC<FormComponentProps> = ({ field }) => {
  const { label = "Submit" } = field || {};
  return (
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {label}
    </button>
  );
};

const formFieldsInputs = {
  text: TextInput,
  email: EmailInput,
  submit: SubmitButton,
};

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
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Subscribe to our Newsletter
      </h2>
      <FormRenderer
        formData={formData}
        onSubmit={handleSubmit}
        getFieldState={getFieldState}
        getFieldError={getFieldError}
        fieldComponents={formFieldsInputs}
        className="space-y-6 bg-white p-6 rounded-lg"
      />
    </div>
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
  const secureUrl = url.replace("http://", "https://");
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
        src={secureUrl}
      />
    </div>
  );
};
