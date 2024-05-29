"use client";
import { Text } from "@radix-ui/themes";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { MyOCC } from "./MyOCC";
import { OCCCreation } from "./OCCCreation";
import { TelegramTest } from "./TelegramTest";

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
