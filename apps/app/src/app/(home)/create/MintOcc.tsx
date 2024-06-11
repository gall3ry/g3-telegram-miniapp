"use client";
import { Button, Spinner, Text } from "@radix-ui/themes";
import { postEvent } from "@tma.js/sdk";
import { useInitData } from "@tma.js/sdk-react";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { env } from "../../../env";
import { OccType } from "../../../server/api/routers/occ/OccType";
import { api } from "../../../trpc/react";
import { useNftContract } from "../../_hooks/useNftContract";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { IconLock } from "../templates/[id]/_components/IconLock";
import { MOCK_TX_HASH } from "./MOCK_TX_HASH";

export const MintOCC = () => {
  const { sendMintNftFromFaucet } = useNftContract();
  const router = useRouter();
  const { mutateAsync } = api.occ.createOCC.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useIsAuthenticated();
  const { data: occ, isPending } = api.occ.getOcc.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { mutateAsync: unlockSticker } =
    api.sticker.unlockSticker.useMutation();
  const { data: stickers } = api.sticker.getStickers.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const initData = useInitData(true);

  if (isPending) return <Spinner mx="auto" />;

  return occ ? (
    <div>
      <Text>You are already minted OCC ({occ.id})</Text>
      <br />

      <Button
        onClick={() => {
          return toast.promise(
            unlockSticker({
              stickerType: "Sample1",
              occId: occ.id,
            }),
            {
              error: (e) => {
                console.log(`Failed to unlock sticker:`, e);
                return "Failed to unlock sticker";
              },
              loading: "Unlocking sticker...",
              success: () => "Sticker unlocked",
            },
          );
        }}
      >
        Unlock Sample1 Sticker
      </Button>

      {stickers && stickers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {stickers.map((sticker) => (
            <div key={sticker.id} className="flex flex-col items-center gap-2">
              <div className="flex aspect-square w-20 items-center justify-center rounded-xl border bg-gray-200">
                <Text>{sticker.stickerType}</Text>
              </div>

              <Button
                onClick={() => {
                  const { id, telegramUserId } = z
                    .object({
                      id: z.string(),
                      telegramUserId: z.coerce.number(),
                    })
                    .parse({
                      id: sticker.id,
                      telegramUserId: initData?.user?.id,
                    });

                  postEvent("web_app_switch_inline_query", {
                    query: `${id} ${telegramUserId}`,
                    chat_types: ["channels", "groups", "users"],
                  });
                }}
              >
                Share
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <Button
      radius="large"
      size="4"
      className="flex-1"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const txHash =
            env.NODE_ENV === "development"
              ? MOCK_TX_HASH
              : await sendMintNftFromFaucet({
                  name: "Name Of NFT #6",
                  description: "NFT Description",
                  image:
                    "ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg",
                });

          await toast.promise(
            mutateAsync({
              type: OccType.GMSymbolOCC,
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
