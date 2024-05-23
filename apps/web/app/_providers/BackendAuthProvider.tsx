import {
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import axios from "axios";
import { useEffect, useRef } from "react";
import { create } from "zustand";
import { TonProofService } from "../api/_services/ton-proof-service";

const useAuth = create<{
  token: string | null;
  setToken: (token: string | null) => void;
}>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));

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
  const { token, setToken } = useAuth();

  useEffect(() => {
    if (!isConnectionRestored || !setToken) {
      return;
    }

    clearInterval(interval.current);

    if (!wallet) {
      localStorage.removeItem(localStorageKey);
      setToken(null);

      const refreshPayload = async () => {
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

      refreshPayload();
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
      console.log(wallet);

      axios.post("/api/auth/check-proof", {});

      //   backendAuth
      //     .checkProof(wallet.connectItems.tonProof.proof, wallet.account)
      //     .then((result) => {
      //       if (result) {
      //         setToken(result);
      //         localStorage.setItem(localStorageKey, result);
      //       } else {
      //         alert("Please try another wallet");
      //         tonConnectUI.disconnect();
      //       }
      //     });
    } else {
      alert("Please try another wallet");
      tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored, setToken]);

  return <>{children}</>;
};
