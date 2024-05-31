"use client";
import { Button, Heading } from "@radix-ui/themes";
import { postEvent } from "@tma.js/sdk";

export const TelegramTest = () => {
  return (
    <>
      <Heading>Telegram Test</Heading>

      <Button
        onClick={async () => {
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
