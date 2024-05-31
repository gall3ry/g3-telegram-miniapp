"use client";
import { Text } from "@radix-ui/themes";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { MyOCC } from "./MyOCC";
import { OCCCreation } from "./OCCCreation";
import { TelegramTest } from "./TelegramTest";
import { MintOCC } from "./MintOCC";

export function LoggedUserUI() {
  const { isAuthenticated } = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Text>Unauthenticated</Text>;
  }

  return (
    <div>
      {/* <RewardLogList /> */}
      {/* <FormAnimate /> */}
      <MintOCC />
      <OCCCreation />
      <TelegramTest />
      <MyOCC />
    </div>
  );
}
