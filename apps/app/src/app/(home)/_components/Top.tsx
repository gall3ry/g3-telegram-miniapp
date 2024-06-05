import { Button, Flex } from "@radix-ui/themes";
import Image from "next/image";
import { IMAGES } from "../../_constants/image";
import { CurrentPoint } from "../quests/CurrentPoint";

export const Top = () => {
  return (
    <div>
      <div>
        <CurrentPoint />

        <Flex direction="column">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute inset-x-0 -mt-20 h-[80vh] select-none bg-cover"
            src={IMAGES.maze}
            alt="maze"
          />

          <div className="relative h-[50vh] w-full">
            <Image
              src={IMAGES["top-bg"]}
              alt="top-bg"
              fill
              objectFit="contain"
              className="aspect-[416/467] py-6"
            />
          </div>

          <div className="z-10">
            <div className="mt-8 flex flex-col items-center">
              <div className="flex h-12 items-center justify-start gap-3">
                <div className="h-4 w-4 rounded-full bg-[#DAF200]" />
                <div className="text-center text-4xl font-bold leading-[48px] text-slate-900">
                  Create your EPIC
                </div>
              </div>
              <div className="flex h-12 items-center justify-start gap-3">
                <div className="h-4 w-4 rounded-full bg-[#DAF200]" />
                <div className="text-center text-4xl font-bold leading-[48px] text-slate-900">
                  And get $EPIC
                </div>
              </div>
            </div>

            <div className="mt-2 text-center text-sm font-light leading-tight tracking-tight text-slate-700">
              More product details - No one shall be subjected to arbitrary
              arrest, detention or exile.
            </div>
          </div>
        </Flex>
      </div>

      <div>
        <div className="mt-6">
          <div className="text-center text-xl font-bold leading-7 text-slate-900">
            Hall of EPICs
          </div>
        </div>

        <div className="mt-3 flex justify-center gap-3">
          <Button size="3" variant="outline" color="gray">
            Coming soon
          </Button>
        </div>
      </div>

      <div className="my-4">
        <div className="relative h-[120px] rounded-xl bg-[#F3FF8A] px-5 py-2.5">
          <div className="text-4xl font-bold leading-[44px] text-slate-900">
            1,000 $TON
          </div>
          <div className="text-base font-medium leading-normal tracking-tight text-slate-900">
            FOR THE CHAMPIONS
          </div>
          <div className="inline-flex items-center justify-start gap-1.5">
            <div className="h-2 w-2 rounded-full bg-lime-700" />
            <div className="text-xs font-medium leading-[18px] tracking-tight text-lime-700">
              The leaders take it all
            </div>
          </div>

          <Image
            src={IMAGES.banner_right_image}
            alt="banner_right_image"
            width={117}
            height={106}
            className="absolute bottom-1.5 right-[14px]"
          />
        </div>
      </div>
    </div>
  );
};
