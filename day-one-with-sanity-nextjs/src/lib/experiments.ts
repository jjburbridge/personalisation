import { v4 } from "uuid";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";

type Experiment = Record<
  string,
  { label: string; variants: { id: string; label: string }[] }
>;

const getExperiments = async () => {
  const mappedExperiments: Experiment = {};
  const experiments = await client.fetch('*[_type == "experiments"]');
  experiments.map((experiment: any) => {
    mappedExperiments[experiment.id] = {
      label: experiment.label,
      variants: experiment.variants.map((variant: any) => ({
        id: variant.id,
        label: variant.label,
      })),
    };
  });
  return mappedExperiments;
};

const EXPERIMENTS: Experiment = await getExperiments();

const getTestCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("ab-test")?.value;
};

export const getUserGroup = async () => {
  const testCookie = await getTestCookie();
  return testCookie ? JSON.parse(testCookie)?.userGroups : undefined;
};

export const getUserId = async () => {
  const testCookie = await getTestCookie();
  return testCookie ? JSON.parse(testCookie)?.userId : undefined;
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

export const getExperimentValueFromResponse = async (
  experimentName: string,
  response: NextResponse
) => {
  const { cookies } = response;
  const testCookie = cookies.get("ab-test")?.value;
  const userGroups = testCookie ? JSON.parse(testCookie).userGroups : undefined;

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

    const userId = v4();
    // Setting cookies on the response using the `ResponseCookies` API
    response.cookies.set("ab-test", JSON.stringify({ userGroups, userId }));
  }

  return response;
};

export const setCookiesValueFromResponse = (
  response: NextResponse,
  rewrite: NextResponse
) => {
  const { cookies } = response;
  console.log("setCookiesValueFromResponse cookies", cookies);
  const testCookie = cookies.get("ab-test")?.value;
  if (testCookie) {
    rewrite.cookies.set("ab-test", testCookie);
  }
  return rewrite;
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
