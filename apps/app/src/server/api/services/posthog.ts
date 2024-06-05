// app/posthog.js
import { PostHog } from "posthog-node";
import { env } from "../../../env";

export enum Flag {
  join_g3_community = "join_g3_community",
}

export default function PostHogClient() {
  const posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}

export const capture = async (args: Parameters<PostHog["capture"]>[0]) => {
  const client = PostHogClient();

  client.capture(args);

  await client.shutdown();
};
