"use client";
import { Button, Code, Heading } from "@radix-ui/themes";
import { postEvent } from "@tma.js/sdk";
import { useInitData } from "@tma.js/sdk-react";

export const TelegramTest = () => {
  const initData = useInitData(true);
  return (
    <>
      <Heading>Telegram Test</Heading>

      {<Code>{JSON.stringify(initData, null, 2)}</Code>}

      <Button
        onClick={async () => {
          // const WebApp = await import("@twa-dev/sdk").then((m) => m.default);
          // WebApp.switchInlineQuery("test", ["channels", "groups"]);

          postEvent("web_app_switch_inline_query", {
            query: "test",
            chat_types: ["channels", "groups"],
          });
        }}
      >
        Open link
      </Button>
    </>
  );
};
