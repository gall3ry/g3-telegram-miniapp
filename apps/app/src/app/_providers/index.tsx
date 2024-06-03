"use client";

import { SDKProvider } from "@tma.js/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { posthog } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "../../env";
import { TRPCReactProvider } from "../../trpc/react";
import { BackendAuthProvider } from "./BackendAuthProvider";

if (typeof window !== "undefined" && env.NEXT_PUBLIC_G3_ENV !== "development") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      env.NEXT_PUBLIC_G3_ENV !== "production"
    ) {
      void import("eruda").then(({ default: eruda }) => eruda.init());
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <TRPCReactProvider>
        <TonConnectUIProvider
          manifestUrl={env.NEXT_PUBLIC_TWA_MANIFEST_URL}
          actionsConfiguration={{
            twaReturnUrl:
              env.NEXT_PUBLIC_TWA_RETURN_URL as `${string}://${string}`,
          }}
        >
          <SDKProvider acceptCustomStyles debug>
            <BackendAuthProvider>
              {children}

              <ProgressBar color="#DAF200" />
            </BackendAuthProvider>
          </SDKProvider>
        </TonConnectUIProvider>
      </TRPCReactProvider>
    </PostHogProvider>
  );
};
