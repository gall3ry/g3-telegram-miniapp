"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TRPCReactProvider } from "../trpc/react";
import { BackendAuthProvider } from "./_providers/BackendAuthProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCReactProvider>
      <TonConnectUIProvider
        manifestUrl="https://g3-miniapp.vercel.app/tonconnect-manifest.json"
        actionsConfiguration={{
          twaReturnUrl: "https://t.me/DemoDappWithTonConnectBot/demo",
        }}
      >
        <BackendAuthProvider>{children}</BackendAuthProvider>
      </TonConnectUIProvider>
    </TRPCReactProvider>
  );
};
