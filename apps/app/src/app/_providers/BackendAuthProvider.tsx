"use client";
import { useQuery } from "@tanstack/react-query";
import { useInitData } from "@tma.js/sdk-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { useUser } from "../(home)/useUser";
import { api, type RouterInputs } from "../../trpc/react";
import { useAuth, useAuthHydrated, useIsAuthenticated } from "./useAuth";

const payloadTTLMS = 1000 * 60 * 9; // 9 minutes

export const BackendAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const { reset, setAccessToken, accessToken } = useAuth();
  const utils = api.useUtils();
  const isHydrated = useAuthHydrated();

  const { refetch: fetchPayload } = api.auth.generatePayload.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
  const { data, isSuccess } = useUser();
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  const { mutateAsync: checkProof } = api.auth.checkProof.useMutation();
  const { mutateAsync: updateDisplayName } =
    api.auth.updateDisplayName.useMutation();
  const initData = useInitData(true);

  // Reset session
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  // Update display name
  useEffect(() => {
    if (isSuccess && initData) {
      if (!initData?.user?.username) {
        throw new Error("Username is missing");
      }

      const _data = {
        displayName: initData.user.username,
        telegramId: initData.user.id,
      } satisfies RouterInputs["auth"]["updateDisplayName"] as RouterInputs["auth"]["updateDisplayName"];

      if (data.displayName) {
        delete _data.displayName;
      }

      void updateDisplayName(_data).then(() => utils.auth.invalidate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, initData]);

  // Fetch proof payload
  useQuery({
    queryKey: [
      "custom",
      "recreateProofPayload",
      {
        isHydrated,
      },
    ],
    queryFn: async () => {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });
      const { data } = await fetchPayload();
      if (!data) {
        throw new Error("Payload is missing");
      }

      if (data) {
        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: {
            tonProof: data.tonProof,
          },
        });
      } else {
        tonConnectUI.setConnectRequestParameters(null);
      }

      return data;
    },
    enabled: isHydrated,
    refetchInterval: payloadTTLMS,
  });

  // On login success, check proof and set access token
  useEffect(() => {
    if (!tonConnectUI || !isHydrated) {
      // check setAccessToken is to make sure store is initialized
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    tonConnectUI.onStatusChange(async (w) => {
      if (!w) {
        reset();
        void utils.invalidate();

        return;
      }

      let _accessToken = accessToken;

      if (w.connectItems?.tonProof && "proof" in w.connectItems.tonProof) {
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
        void utils.invalidate();
      }

      if (!_accessToken) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        tonConnectUI.disconnect();
        void utils.invalidate();
        return;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonConnectUI, isHydrated]);

  return <>{children}</>;
};
