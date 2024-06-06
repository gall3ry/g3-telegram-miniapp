"use client";
import { Button } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import router from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../trpc/react";
import { useNftContract } from "../../../_hooks/useNftContract";
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
  const { sendMintNftFromFaucet } = useNftContract();
  const { mutateAsync, isPending: isCreatingOCC } =
    api.occ.createOCC.useMutation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="sticky inset-x-0 bottom-0 z-50 flex h-20 items-center gap-3 bg-white px-5 shadow-2xl">
      <Button
        radius="large"
        size="4"
        className="flex-1"
        loading={isCreatingOCC}
        onClick={async () => {
          const txHash = await sendMintNftFromFaucet({
            name: "Name Of NFT #6",
            description: "NFT Description",
            image:
              "ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg",
          });

          await toast.promise(
            mutateAsync({
              occTemplateId: +id,
              txHash,
            }),
            {
              loading: "Creating OCC...",
              success: (data) => {
                void router.push(`/occ/${data.id}`);

                return "OCC created";
              },
              error: "Failed to create OCC",
            },
          );
        }}
      >
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
