"use client";
import { Button, Spinner } from "@radix-ui/themes";
import { useRouter } from "next-nprogress-bar";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../trpc/react";
import { useNftContract } from "../../_hooks/useNftContract";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { IconLock } from "../templates/[id]/_components/IconLock";

const Page = () => {
  return (
    <div>
      <MintOCC />
    </div>
  );
};

export default function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Suspense fallback={<Spinner mx="auto" />}>
        <Page />
      </Suspense>
    </LoggedUserOnly>
  );
}

export const MintOCC = () => {
  const { sendMintNftFromFaucet } = useNftContract();
  const router = useRouter();
  const { mutateAsync } = api.occ.createOCC.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      radius="large"
      size="4"
      className="flex-1"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const txHash = await sendMintNftFromFaucet({
            name: "Name Of NFT #6",
            description: "NFT Description",
            image:
              "ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg",
          });

          await toast.promise(
            mutateAsync({
              txHash,
            }),
            {
              loading: "Creating OCC...",
              success: (data) => {
                void router.replace(`/occ/${data.id}`);

                return "OCC created";
              },
              error: (e) => {
                console.log(`Failed to create OCC:`, e);

                return "Failed to create OCC";
              },
            },
          );
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <Spinner loading={isLoading}>
          <div className="size-6">
            <IconLock />
          </div>
        </Spinner>
        <div className="text-xl font-bold leading-7 text-slate-900">
          Unlock this EPIC
        </div>
      </div>

      <div className="grow text-right text-xl font-bold leading-7 text-slate-900">
        0.1 $TON
      </div>
    </Button>
  );
};
