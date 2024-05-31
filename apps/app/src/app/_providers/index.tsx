"use client";

import { SDKProvider } from "@tma.js/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { env } from "../../env";
import { TRPCReactProvider } from "../../trpc/react";
import { BackendAuthProvider } from "./BackendAuthProvider";

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
    <TRPCReactProvider>
      <TonConnectUIProvider
        manifestUrl={env.NEXT_PUBLIC_TWA_MANIFEST_URL}
        actionsConfiguration={{
          twaReturnUrl:
            env.NEXT_PUBLIC_TWA_RETURN_URL as `${string}://${string}`,
        }}
      >
        <SDKProvider acceptCustomStyles debug>
          <BackendAuthProvider>{children}</BackendAuthProvider>
        </SDKProvider>
      </TonConnectUIProvider>
    </TRPCReactProvider>
  );
};
