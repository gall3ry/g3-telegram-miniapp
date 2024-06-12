"use client";
import {
  Badge,
  Button,
  Card,
  DataList,
  Dialog,
  Spinner,
} from "@radix-ui/themes";
import { useInitData } from "@tma.js/sdk-react";
import { useRouter } from "next-nprogress-bar";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { env } from "../../../env";
import { OccType } from "../../../server/api/routers/occ/OccType";
import { api } from "../../../trpc/react";
import { useNftContract } from "../../_hooks/useNftContract";
import { useIsAuthenticated } from "../../_providers/useAuth";
import { mapStickerTypeToTemplateComponent } from "../_components/_templates";
import { LeaderboardAvatar } from "../LeaderboardItem";
import { MOCK_TX_HASH } from "./MOCK_TX_HASH";
import { useWebAppSwitchInlineQuery } from "./useWebAppSwitchInlineQuery";

export const withProxy = (url: string) => {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

export const MintOCC = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data: occ, isPending } = api.occ.getOcc.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: stickers } = api.sticker.getStickers.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const initData = useInitData(true);
  const [stickerId, setStickerId] = useQueryState("stickerId", parseAsInteger);
  const { postSwitchInlineQuery } = useWebAppSwitchInlineQuery();

  if (isPending) return <Spinner mx="auto" />;

  return occ ? (
    <div>
      <Card>
        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Total share</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {occ.totalShare}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Total reactions</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {occ.totalReaction}
              </Badge>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Card>

      {stickers && stickers.length > 0 && (
        <div className="mt-2 grid ">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              onClick={() => {
                void setStickerId(sticker.id);
              }}
            >
              <div className="aspect-square cursor-pointer">
                {mapStickerTypeToTemplateComponent(sticker.stickerType, {
                  imageUrl: withProxy(
                    `https://s.getgems.io/nft/c/626e630d4c1921ba7a0e3b4e/2041/image.png`,
                  ),
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog.Root
        open={stickerId !== null}
        onOpenChange={(open) => {
          if (!open) {
            void setStickerId(null);
          }
        }}
      >
        <Dialog.Content className="container">
          <div className="flex justify-center">
            <Button
              mt="2"
              size="4"
              onClick={() => {
                const { telegramUserId } = z
                  .object({
                    telegramUserId: z.coerce.number(),
                  })
                  .parse({
                    telegramUserId: initData?.user?.id,
                  });

                postSwitchInlineQuery({
                  query: `${stickerId} ${telegramUserId}`,
                  chatTypes: ["channels", "groups", "users"],
                });
              }}
            >
              Share
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  ) : (
    <MintGMOCC />
  );
};

export const MintGMOCC = () => {
  const { sendMintNftFromFaucet } = useNftContract();
  const router = useRouter();
  const { mutateAsync } = api.occ.createOCC.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { data: topOccs } = api.occ.getTopOccs.useQuery({ limit: 5 });

  return (
    <div>
      <div className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Button>GM</Button>
          <Button disabled>PNL</Button>
          <Button disabled>IDCard</Button>
        </div>

        <div className="mt-6 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-[161px] w-[161px] rounded-full"
            src="https://via.placeholder.com/161x161"
            alt=""
          />
        </div>

        <div className="mt-5">
          <div className="text-center text-sm font-light leading-tight tracking-tight text-slate-700">
            Want your own epic GM like the famous below? Let&apos;s unlock the
            #GM now to awesomely show off your daily Web3 routine to community.
            Mint, customize, share, collect points, and level up for your chance
            to win the $EPIC AIRDROP (TBA){" "}
          </div>
        </div>

        <div className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="aspect-square w-full rounded-xl"
            src="https://via.placeholder.com/335x335"
            alt=""
          />
        </div>

        <div className="mt-5">
          <div className="text-center text-xl font-bold leading-7 text-slate-900">
            Top 5 GMs
          </div>
        </div>

        <div className="mt-4 flex">
          {topOccs?.occs.map(
            (item, index) =>
              item.imageUrl && (
                <LeaderboardAvatar
                  key={index}
                  occId={item.id}
                  occImageUrl={item.imageUrl}
                  rank={index + 1}
                />
              ),
          )}
        </div>
      </div>

      <div className="container sticky -left-4 -right-4 bottom-20 mt-7 bg-white px-5 py-3 shadow-xl">
        <Button
          className="w-full"
          size="4"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              const txHash =
                env.NEXT_PUBLIC_G3_ENV === "development"
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
          Mint GM
        </Button>
      </div>
    </div>
  );
};
