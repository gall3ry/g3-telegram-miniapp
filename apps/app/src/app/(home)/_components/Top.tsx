"use client";
import { Button, Flex } from "@radix-ui/themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "../../../trpc/react";
import { IMAGES } from "../../_constants/image";

export const Top = () => {
  const { mutateAsync, isPending } = api.occ.createOCC.useMutation();
  const router = useRouter();

  return (
    <Flex direction="column">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="absolute inset-x-0 -mt-20 h-[80vh] select-none"
        src={IMAGES.maze}
        alt="maze"
      />

      <div className="relative h-[50vh] w-full">
        <Image src={IMAGES["top-bg"]} alt="top-bg" fill className="py-6" />
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
          More product details - No one shall be subjected to arbitrary arrest,
          detention or exile.
        </div>

        <div className="mt-6">
          <div className="text-center text-xl font-bold leading-7 text-slate-900">
            Hall of EPICs
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <Button
            loading={isPending}
            onClick={async () => {
              await toast.promise(
                mutateAsync({
                  occTemplateId: 99999, // TODO: remove this whole component
                }),
                {
                  loading: "Creating OCC...",
                  success: (data) => {
                    router.push(`/occ/${data.id}`);

                    return "OCC created";
                  },
                  error: "Failed to create OCC",
                },
              );
            }}
            size="3"
          >
            Create OCC (Test)
          </Button>

          <Button size="3" variant="outline" color="gray">
            Coming soon
          </Button>
        </div>
      </div>
    </Flex>
  );
};
