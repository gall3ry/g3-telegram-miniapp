"use client";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { TonConnectButton } from "@tonconnect/ui-react";

export default function Home() {
  return (
    <>
      <Flex justify="end">
        <TonConnectButton />
      </Flex>

      <Button size="3">
        <DashboardIcon />
        Click me
      </Button>
    </>
  );
}
