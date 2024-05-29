"use client";
import { Code, Heading, Text } from "@radix-ui/themes";
import { useInitData } from "@tma.js/sdk-react";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { MyOCC } from "./MyOCC";
import { OCCCreation } from "./OCCCreation";

export function LoggedUserUI() {
  const { isAuthenticated } = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Text>Unauthenticated</Text>;
  }

  return (
    <div>
      {/* <RewardLogList /> */}
      {/* <FormAnimate /> */}
      <OCCCreation />
      <TelegramTest />
      <MyOCC />
    </div>
  );
}

export const TelegramTest = () => {
  const initData = useInitData();

  return (
    <>
      <Heading>Telegram Test</Heading>

      {initData && <Code>{JSON.stringify(initData, null, 2)}</Code>}
    </>
  );
};
