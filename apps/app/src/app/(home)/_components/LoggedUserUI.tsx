"use client";
import { Text } from "@radix-ui/themes";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { MintOCC } from "./MintOcc";
import { Top } from "./Top";

export function LoggedUserUI() {
  const { isAuthenticated } = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Text>Unauthenticated</Text>;
  }

  return (
    <div>
      <Top />
      <MintOCC />
    </div>
  );
}
