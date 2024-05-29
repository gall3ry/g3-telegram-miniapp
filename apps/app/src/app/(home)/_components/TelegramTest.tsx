"use client";
import { Code, Heading } from "@radix-ui/themes";
import { useInitData } from "@tma.js/sdk-react";

export const TelegramTest = () => {
  const initData = useInitData();

  return (
    <>
      <Heading>Telegram Test</Heading>

      {initData && <Code>{JSON.stringify(initData, null, 2)}</Code>}
    </>
  );
};
