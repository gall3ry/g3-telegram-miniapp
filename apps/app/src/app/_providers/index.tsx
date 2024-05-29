"use client";

import { SDKProvider } from "@tma.js/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TRPCReactProvider } from "../../trpc/react";
import { BackendAuthProvider } from "./BackendAuthProvider";

// Manifest URL must be https with a public domain
const MANIFEST_URL =
  "https://staging.miniapp.gall3ry.io/tonconnect-manifest.json";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCReactProvider>
      <TonConnectUIProvider
        manifestUrl={MANIFEST_URL}
        // actionsConfiguration={{
        //   twaReturnUrl: "https://t.me/g3stgbot",
        // }}
      >
        <SDKProvider acceptCustomStyles debug>
          <BackendAuthProvider>{children}</BackendAuthProvider>
        </SDKProvider>
      </TonConnectUIProvider>
    </TRPCReactProvider>
  );
};
