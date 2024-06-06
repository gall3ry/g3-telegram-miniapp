import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    JWT_SECRET: z.string(),
    BOT_TOKEN: z.string(),
    TON_API_KEY: z
      .string()
      .default(
        "AF6GGCODMULLAEYAAAAEE6TZ6PWQRJIDMH4MAPBEOJGLQMAFGQS7C7UZRG7NZT64PL4SRMQ",
      ),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_G3_ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
    NEXT_PUBLIC_TWA_RETURN_URL: z
      .string()
      .url()
      .regex(/t.me\/.+/)
      .default("https://t.me/g3stg1bot/test"),
    NEXT_PUBLIC_TWA_MANIFEST_URL: z
      .string()
      .url()
      .default("https://staging.miniapp.gall3ry.io/tonconnect-manifest.json"),
    NEXT_PUBLIC_POSTHOG_KEY: z
      .string()
      .default("phc_iWwszv1jODV18AKPZcqRmXql2B5B4eOqJ3gmnRWMZmC"),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().default("https://us.i.posthog.com"),
    NEXT_PUBLIC_COMMUNITY_CHAT_ID: z
      .string()
      .regex(/@.+/)
      .default("@testabc1234578"),
    NEXT_PUBLIC_TON_API_KEY_FRONTEND: z
      .string()
      .default(
        "AF6GGCODOGMETNQAAAAM75NIXLA466TL7EESFD7Q7JBZH6DPK3AZYQOUAABLCI4ONMZFL2Y",
      ),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_G3_ENV: process.env.NEXT_PUBLIC_G3_ENV,
    NEXT_PUBLIC_TWA_RETURN_URL: process.env.NEXT_PUBLIC_TWA_RETURN_URL,
    NEXT_PUBLIC_TWA_MANIFEST_URL: process.env.NEXT_PUBLIC_TWA_MANIFEST_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    BOT_TOKEN: process.env.BOT_TOKEN,
    NEXT_PUBLIC_COMMUNITY_CHAT_ID: process.env.NEXT_PUBLIC_COMMUNITY_CHAT_ID,
    NEXT_PUBLIC_TON_API_KEY_FRONTEND:
      process.env.NEXT_PUBLIC_TON_API_KEY_FRONTEND,
    TON_API_KEY: process.env.TON_API_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
