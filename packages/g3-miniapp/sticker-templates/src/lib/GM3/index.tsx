'use client';
import { Alignment, Fit, Layout, type ImageAsset } from '@rive-app/canvas';
import { useRive } from '@rive-app/react-canvas';
import { Suspense, memo, useState } from 'react';
import { useLogger } from 'react-use';

type GM3Props = {
  shouldRecord?: boolean;
  imageUrl: string;
};

export const GM3 = memo((props: GM3Props) => {
  return (
    <Suspense>
      <GM3Inner {...props} />
    </Suspense>
  );
});

const GM3Inner = ({ imageUrl, shouldRecord }: Parameters<typeof GM3>[0]) => {
  const [nftAsset, setNftAsset] = useState<ImageAsset | null>(null);
  const { RiveComponent, canvas, rive } = useRive({
    src: '/rive/gm/gm3.riv',
    autoplay: true,
    assetLoader: (_asset, bytes) => {
      const asset = _asset;

      // If the asset has a `cdnUuid`, return false to let the runtime handle
      // loading it in from a CDN. Or if there are bytes found for the asset
      // (aka, it was embedded), return false as there's no work needed here
      if (asset.cdnUuid.length > 0 || bytes.length > 0) {
        return false;
      }

      switch (true) {
        case _asset.isImage: {
          const asset = _asset as ImageAsset;

          if (asset.name === 'AVATAR') {
            setNftAsset(asset);

            return true;
          }

          break;
        }
      }

      return false;
    },
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.TopCenter,
    }),
    // onLoop: () => {
    //   if (interval.current) {
    //     clearInterval(interval.current);

    //     setRecording('done');
    //   }
    // },
    artboard: 'GM3',
  });

  // useEffect(() => {
  //   if (imageUrl && nftAsset && rive) {
  //     loadAndDecodeImg(imageUrl, {
  //       width: 1000,
  //       height: 1000,
  //     })
  //       .then((image) => {
  //         nftAsset.setRenderImage(image);
  //         rive.play();

  //         if (shouldRecord) {
  //           setTimeout(() => {
  //             setRecording('recording');
  //           }, 1000);
  //         }
  //         return image;
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //       });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [imageUrl, nftAsset?.name, rive]);

  useLogger('GM3', { imageUrl, nftAsset, rive });

  // const { interval, setRecording } = useRiveRecording({
  //   rive,
  //   shouldRecord,
  //   canvas,
  // });

  return (
    <div className="relative overflow-hidden rounded-xl border-2">
      <RiveComponent width="100%" className="aspect-square" />

      {/* {!nftAsset && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-white">
          <Spinner />
        </div>
      )} */}
    </div>
  );
};

GM3.displayName = 'GM3';
