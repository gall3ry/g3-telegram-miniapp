"use client";
import { IconButton } from "@radix-ui/themes";
import toast from "react-hot-toast";
import { IMAGES } from "../../_constants/image";
import { IconPoints } from "../_icons/IconPoints";
import { IconTime } from "./IconTime";

export const CurrentPoint = () => {
  return (
    <div
      className="relative rounded-xl bg-red-400 px-4 pb-[22px] pt-4"
      style={{
        backgroundImage: `url(${IMAGES.balance_bg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-base font-medium leading-normal tracking-tight text-white opacity-80">
          CURRENT POINTS
        </div>
        <IconButton
          variant="soft"
          radius="large"
          onClick={() => {
            toast("Coming soon!");
          }}
        >
          <div className="size-5">
            <IconTime />
          </div>
        </IconButton>
      </div>

      <div className="flex items-center">
        <div className="h-10 w-10">
          <IconPoints />
        </div>
        <div className="ml-4 text-5xl font-bold leading-[64px] text-white">
          6,789
        </div>
        <div className="mb-4 ml-3 text-right text-2xl font-medium leading-9 tracking-tight text-white opacity-80">
          EPIC
        </div>
      </div>
    </div>
  );
};
