"use client";
import { Spinner } from "@radix-ui/themes";
import { api } from "../../../trpc/react";
import { useSelectAssetsForGMDrawer } from "./MintOcc";

export const SelectedAssets = () => {
  const [, setSelectAssetsDrawer] = useSelectAssetsForGMDrawer();
  const { data: gmNFTs, isSuccess } = api.sticker.getGMNFTs.useQuery(
    undefined,
    {
      enabled: true,
    },
  );

  const [first, second, third] = gmNFTs ?? [null, null, null];
  const moreThanThree = gmNFTs && gmNFTs?.length > 3;

  return (
    <div className="relative flex h-[70px] items-center justify-between gap-4 rounded-lg bg-white px-4 py-3">
      <div>
        <div className="text-base font-bold leading-normal text-slate-900">
          Selected assets
        </div>
        <button
          className="mt-0.5 text-sm font-medium leading-tight tracking-tight text-blue-400"
          onClick={() => {
            void setSelectAssetsDrawer(true);
          }}
        >
          Edit assets
        </button>
      </div>

      <Spinner loading={!isSuccess}>
        <div className="flex gap-1">
          {first?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="h-11 w-11 rounded-lg" src={first.imageUrl} alt="" />
          )}

          {second?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-11 w-11 rounded-lg"
              src={second.imageUrl}
              alt=""
            />
          )}

          <div className="relative overflow-hidden rounded-lg">
            {moreThanThree && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white opacity-50">
                <div className="text-center text-base font-bold leading-normal text-white">
                  +{gmNFTs?.length - 3}
                </div>
              </div>
            )}

            {third?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="h-11 w-11" src={third.imageUrl} alt="" />
            )}
          </div>
        </div>
      </Spinner>
    </div>
  );
};
