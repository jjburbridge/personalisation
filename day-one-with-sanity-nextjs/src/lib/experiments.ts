import { v4 } from "uuid";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

type Experiment = Record<
  string,
  { label: string; variants: { id: string; label: string }[] }
>;

const EXPERIMENTS: Experiment = {
  "event-name": {
    label: "Event Name",
    variants: [
      {
        id: "control",
        label: "Control",
      },
      {
        id: "variant",
        label: "Variant",
      },
    ],
  },
  "artist-form": {
    label: "Artist Form",
    variants: [
      {
        id: "native",
        label: "Native",
      },
      {
        id: "hubspot",
        label: "Hubspot",
      },
      {
        id: "mailchimp",
        label: "mailchimp",
      },
    ],
  },
};

const getTestCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("ab-test")?.value;
};

export const getUserGroup = async () => {
  const testCookie = await getTestCookie();
  return testCookie ? JSON.parse(testCookie)?.userGroups : undefined;
};

// mocking a fetch to an external service for getting an experiment variant
export const getExperimentValue = async (experimentName: string) => {
  const userGroups = await getUserGroup();

  return {
    variant: EXPERIMENTS[experimentName].variants.find(
      (variant) => variant.id === userGroups[experimentName]
    ),
  };
};

export const setCookiesValue = (
  request: NextRequest,
  response: NextResponse
) => {
  if (!request.cookies.has("ab-test")) {
    // randomly assign a user to a group
    const random = Math.random();
    const userGroups: Record<string, string> = {};
    Object.keys(EXPERIMENTS).map((key) => {
      // get number of variants for each experiment
      const variantsCount = EXPERIMENTS[key].variants.length;
      const variantIndex = Math.floor(random * variantsCount);
      userGroups[key] = EXPERIMENTS[key].variants[variantIndex].id;
    });
    // const eventGroup = random > 0.5 ? "control" : "variant";
    // let formGroup = "mailchimp";
    // if (random > 0.33333) {
    //   formGroup = "native";
    // }
    // if (random > 0.66666) {
    //   formGroup = "hubspot";
    // }

    const userId = v4();
    // Setting cookies on the response using the `ResponseCookies` API
    response.cookies.set("ab-test", JSON.stringify({ userGroups, userId }));
  }

  return response;
};

// If use is part of any experiments, get the tracking call data
// This is passed into the <Tracking> client component
export const getDeferredTrackingData = async (): Promise<
  | {
      userGroup: string;
      formGroup: string;
      userId: string;
    }
  | undefined
> => {
  const testCookie = await getTestCookie();
  const data = testCookie ? JSON.parse(testCookie) : undefined;
  return data;
};
