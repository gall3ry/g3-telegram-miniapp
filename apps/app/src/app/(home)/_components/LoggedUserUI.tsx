"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CheckIcon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { RewardLogList } from "./RewardLogList";

export function LoggedUserUI() {
  const { isAuthenticated } = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Text>Unauthenticated</Text>;
  }

  return (
    <div>
      <RewardLogList />
      <FormAnimate />
    </div>
  );
}

export const FormAnimate = () => {
  const [parent] = useAutoAnimate(/* optional config */);

  const [items, setItems] = useState([0, 1, 2]);
  const add = () => setItems([...items, items.length]);
  const remove = (value: number) =>
    setItems(items.filter((key) => key !== value));

  return (
    <>
      <ul
        ref={parent}
        className="flex w-full space-x-4 overflow-x-auto rounded-xl bg-gray-400 p-3"
      >
        {items.map((item) => (
          <li className="shrink-0 rounded-xl bg-white p-3" key={item}>
            <Text>Log in to the app twice a day</Text>

            <div className="mb-4 mt-4 border-l-2 border-blue-500 pl-2">
              <Text>
                <span className="font-bold text-black">2 / </span>
                <span className="text-gray-400">2</span>
              </Text>
            </div>

            <div className="border-t border-gray-500 pt-4">
              <Button
                className="uppercase"
                onClick={() => {
                  remove(item);
                }}
              >
                <CheckIcon />
                Claim
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={add}>Add number</button>
    </>
  );
};
