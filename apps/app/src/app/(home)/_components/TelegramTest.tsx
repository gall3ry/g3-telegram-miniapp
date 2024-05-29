"use client";
import { Button, Code, Heading } from "@radix-ui/themes";
import { useInitData, useMiniApp } from "@tma.js/sdk-react";

export const TelegramTest = () => {
  const initData = useInitData();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { switchInlineQuery } = useMiniApp();

  return (
    <>
      <Heading>Telegram Test</Heading>

      {initData && <Code>{JSON.stringify(initData, null, 2)}</Code>}

      <Button
        onClick={() => {
          switchInlineQuery("hello_tin", ["groups", "users"]);
        }}
      >
        Click me to share
      </Button>
    </>
  );
};
