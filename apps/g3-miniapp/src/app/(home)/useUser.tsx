"use client";
import { api } from "../../trpc/react";
import { useIsAuthenticated } from "../_providers/useAuth";

export const useUser = () => {
  const { isAuthenticated } = useIsAuthenticated();

  return api.auth.getCurrentUser.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    select: (data) => {
      return {
        ...data,
        tonProvider: data.Provider.find((p) => p.type === "TON_WALLET"),
      };
    },
  });
};
