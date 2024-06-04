"use client";
import { useMemo } from "react";
import { api } from "../../trpc/react";
import { useIsAuthenticated } from "../_providers/useAuth";

export const useUser = () => {
  const { isAuthenticated } = useIsAuthenticated();

  const result = api.auth.getCurrentUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const tonProvider = useMemo(() => {
    return result.data?.Provider.find((p) => p.type === "TON_WALLET");
  }, [result.data?.Provider]);

  return {
    ...result,
    tonProvider,
  };
};
