"use client";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback, useEffect, useRef } from "react";
import { api } from "../../trpc/react";
import useInterval from "../_hooks/useInterval";
import { useAuth } from "./useAuth";

const payloadTTLMS = 1000 * 60 * 9;

export const BackendAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const firstProofLoading = useRef<boolean>(true);

  const [tonConnectUI] = useTonConnectUI();
  const { reset, accessToken, setAccessToken } = useAuth();
  const { refetch: fetchPayload } = api.auth.generatePayload.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
  const { mutateAsync: checkProof } = api.auth.checkProof.useMutation();

  const recreateProofPayload = useCallback(async () => {
    if (!tonConnectUI) {
      return;
    }

    if (firstProofLoading.current) {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });
      firstProofLoading.current = false;
    }

    const data = (await fetchPayload()).data;
    if (!data) {
      throw new Error("Payload is missing");
    }

    if (data) {
      tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: data,
      });
    } else {
      tonConnectUI.setConnectRequestParameters(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonConnectUI, firstProofLoading]);

  if (firstProofLoading.current) {
    void recreateProofPayload();
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useInterval(recreateProofPayload, payloadTTLMS);

  useEffect(() => {
    if (!tonConnectUI || !setAccessToken) {
      // check setAccessToken is to make sure store is initialized
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    tonConnectUI.onStatusChange(async (w) => {
      if (!w) {
        reset();
        return;
      }

      let _accessToken;

      if (w.connectItems?.tonProof && "proof" in w.connectItems.tonProof) {
        // await checkProof(w.connectItems.tonProof.proof, w.account);
        if (!w.account.publicKey) {
          throw new Error("Public key is missing");
        }

        const { token } = await checkProof({
          address: w.account.address,
          network: w.account.chain,
          public_key: w.account.publicKey,
          proof: {
            ...w.connectItems.tonProof.proof,
            state_init: w.account.walletStateInit,
          },
        });

        _accessToken = token;
        setAccessToken(_accessToken);
      }

      if (!_accessToken) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        tonConnectUI.disconnect();
        console.log("Disconnecting");
        return;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonConnectUI, setAccessToken]);

  return <>{children}</>;
};
