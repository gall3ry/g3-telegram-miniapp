"use client";
import { Spinner } from "@radix-ui/themes";
import Image from "next/image";
import { api } from "../../../trpc/react";
import { IMAGES } from "../../_constants/image";
import { useSelectAssetsForGMDrawer } from "./MintOcc";

export const SelectedAssets = () => {
  const [, setSelectAssetsDrawer] = useSelectAssetsForGMDrawer();
  const { data: gmNFTs, isSuccess } = api.sticker.getGMNFTs.useQuery(
    undefined,
    {
      enabled: true,
    },
  );

  const NUMBER_ELEMENTS = 5;
  const firstFive = gmNFTs?.slice(0, NUMBER_ELEMENTS);
  const moreThanFive = gmNFTs && gmNFTs?.length > NUMBER_ELEMENTS;
  const last = gmNFTs?.[NUMBER_ELEMENTS - 1];

  const renderNFT = (nft: NonNullable<typeof gmNFTs>[number]) => {
    return (
      <div className="relative">
        <div
          className="aspect-square w-full rounded-xl bg-cover"
          style={{
            backgroundImage: `url(${nft.imageUrl})`,
          }}
        ></div>
        <div className="absolute right-1 top-1">
          <Image
            src={IMAGES.create.ton_logo}
            alt="ton-logo"
            width="20"
            height="20"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-5 flex items-center justify-between">
        <div className="text-xl font-bold leading-7 text-slate-900">
          GM Stickers
        </div>
        <button
          className="cursor-pointer text-right text-base font-medium leading-normal tracking-tight text-blue-400"
          onClick={() => {
            void setSelectAssetsDrawer(true);
          }}
        >
          Edit assets
        </button>
      </div>

      <div className="mt-3">
        <Spinner loading={!isSuccess}>
          <div className="grid grid-cols-5 gap-2">
            {firstFive?.slice(0, NUMBER_ELEMENTS - 1)?.map(renderNFT)}

            {last && (
              <div className="relative overflow-hidden rounded-lg">
                {moreThanFive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white opacity-50">
                    <div className="text-center text-base font-bold leading-normal text-white">
                      +{gmNFTs?.length - (firstFive?.length ?? 0)}
                    </div>
                  </div>
                )}

                {renderNFT(last)}
              </div>
            )}
          </div>
        </Spinner>
      </div>
    </>
  );
};
