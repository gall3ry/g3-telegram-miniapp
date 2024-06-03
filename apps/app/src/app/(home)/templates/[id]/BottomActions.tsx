"use client";
import { Button } from "@radix-ui/themes";
import { useEffect } from "react";
import { useFooter } from "../../_components/Footer";
import { IconLock } from "./_components/IconLock";

export const BottomActions = () => {
  const { setFooter } = useFooter();
  useEffect(
    () => {
      setFooter(<Footer />);

      return () => {
        setFooter(null);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return null;
};

const Footer = () => {
  return (
    <div className="sticky inset-x-0 bottom-0 z-50 flex h-20 items-center gap-3 bg-white px-5 shadow-2xl">
      <Button radius="large" size="4" className="flex-1" onClick={() => {}}>
        <div className="flex items-center gap-2">
          <div className="size-6">
            <IconLock />
          </div>
          <div className="text-xl font-bold leading-7 text-slate-900">
            Unlock this EPIC
          </div>
        </div>

        <div className="grow text-right text-xl font-bold leading-7 text-slate-900">
          0.1 $TON
        </div>
      </Button>
    </div>
  );
};
