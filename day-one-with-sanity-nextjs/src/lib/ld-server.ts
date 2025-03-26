import {
  init,
  LDClient,
  LDContext,
  LDFlagValue,
} from "@launchdarkly/node-server-sdk";

let launchDarklyClient: LDClient | null = null;

async function initLaunchDarkly() {
  const client = init(process.env.LAUNCHDARKLY_API_KEY as string);
  await client.waitForInitialization({ timeout: 10 });
  return client;
}

export async function getClient() {
  if (!launchDarklyClient) {
    launchDarklyClient = await initLaunchDarkly();
  }
  return launchDarklyClient;
}

export async function getVariation(
  flagKey: string,
  context: LDContext,
  defaultValue: LDFlagValue
) {
  const client = await getClient();
  return client.variation(flagKey, context, defaultValue);
}
