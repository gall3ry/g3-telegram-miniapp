"use client";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { formatNumber } from "@repo/utils";
import { TonConnectButton } from "@tonconnect/ui-react";
import { api } from "../../../trpc/react";
import { useIsAuthenticated } from "../../_providers/useAuth";

export const Header = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data, isPending, isSuccess } = api.auth.getCurrentUser.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
    },
  );

  return (
    <>
      <Flex justify="end" gap="2" align="center">
        <Button size="3" variant="solid" color="lime" loading={isPending}>
          <StarFilledIcon />
          {isSuccess && <span>{formatNumber(data.point)}</span>}
        </Button>

        <TonConnectButton />
      </Flex>
    </>
  );
};
