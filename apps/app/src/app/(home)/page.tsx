"use client";
import { Box, Flex } from "@radix-ui/themes";
import { TonConnectButton } from "@tonconnect/ui-react";
import { api } from "../../trpc/react";

export default function Home() {
  const { data, isError, isFetching } = api.auth.getAuthTestText.useQuery(
    undefined,
    {
      placeholderData: "Loading...",
    },
  );
  return (
    <>
      <Flex justify="end">
        <TonConnectButton />
      </Flex>

      <Box py="4">
        {isFetching ? "Loading..." : isError ? "Unauthenticated" : data}
      </Box>
    </>
  );
}
