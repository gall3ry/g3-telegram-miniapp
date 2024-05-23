import {
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import axios from "axios";
import { useEffect, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TonProofService } from "../api/_services/ton-proof-service";

const useAuth = create<{
  token: string | null;
  setToken: (token: string | null) => void;
}>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: "miniapp-auth",
    },
  ),
);

const localStorageKey = "my-dapp-auth-token";
const payloadTTLMS = 1000 * 60 * 20;

export const BackendAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const interval = useRef<ReturnType<typeof setInterval> | undefined>();
  const { setToken } = useAuth();

  useEffect(() => {
    if (!isConnectionRestored || !setToken) {
      return;
    }

    clearInterval(interval.current);

    if (!wallet) {
      localStorage.removeItem(localStorageKey);
      setToken(null);

      const refreshPayload = () => {
        tonConnectUI.setConnectRequestParameters({ state: "loading" });

        const value = {
          tonProof: TonProofService.generatePayload(),
        };

        // await backendAuth.generatePayload();
        if (!value) {
          tonConnectUI.setConnectRequestParameters(null);
        } else {
          tonConnectUI.setConnectRequestParameters({ state: "ready", value });
        }
      };

      void refreshPayload();
      setInterval(refreshPayload, payloadTTLMS);
      return;
    }

    const token = localStorage.getItem(localStorageKey);
    if (token) {
      setToken(token);
      return;
    }

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      void axios
        .post<{
          token: string;
        }>("/api/auth/check-proof", {
          proof: wallet.connectItems.tonProof.proof,
        })
        .then((result) => {
          if (result) {
            setToken(result.data.token);
            localStorage.setItem(localStorageKey, result.data.token);
          } else {
            alert("Please try another wallet");
            void tonConnectUI.disconnect();
          }
        });
    } else {
      alert("Please try another wallet");
      void tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored, setToken, tonConnectUI]);

  return <>{children}</>;
};
