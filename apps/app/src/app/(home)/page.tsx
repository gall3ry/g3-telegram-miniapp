"use client";
import { Box, Flex, Spinner } from "@radix-ui/themes";
import { api } from "../../trpc/react";
import { LoggedUserUI } from "./_components/LoggedUserUI";

export default function Home() {
  const { isError, isFetching } = api.auth.getAuthTestText.useQuery();
  return (
    <>
      <Box py="4">
        {isFetching ? (
          <Flex justify="center">
            <Spinner size="3" />
          </Flex>
        ) : isError ? (
          "Unauthenticated"
        ) : (
          <LoggedUserUI />
        )}
      </Box>
    </>
  );
}
