'use client';
import { stickerTypeRecord } from '@gall3ry/g3-miniapp-sticker-templates-constants';
import { Spinner } from '@radix-ui/themes';
import { Alignment, Fit, Layout, type ImageAsset } from '@rive-app/canvas';
import { useRive } from '@rive-app/react-canvas';
import { format } from 'date-fns';
import { Suspense, memo, useEffect, useState } from 'react';
import { z } from 'zod';
import { useRiveRecording } from '../hooks/useRiveRecording';
import { loadAndDecodeImg } from '../loadAndDecodeFont';

const convertToOrdinal = (number: number) => {
  const j = number % 10;
  const k = number % 100;

  if (j === 1 && k !== 11) {
    return number + 'ST';
  }
  if (j === 2 && k !== 12) {
    return number + 'ND';
  }
  if (j === 3 && k !== 13) {
    return number + 'RD';
  }
  return number + 'TH';
};

type GM2Props = z.infer<(typeof stickerTypeRecord)['GM2']>;

export const GM2 = memo((props: GM2Props) => {
  return (
    <Suspense>
      <GM2Inner {...props} />
    </Suspense>
  );
});

const GM2Inner = ({
  imageUrl,
  shouldRecord,
  epicSaved,
  nftId,
  nftName,
  ownerName,
  price,
  stickerCreatedDate,
  stickerId,
  type,
}: Parameters<typeof GM2>[0]) => {
  const [nftAsset, setNftAsset] = useState<ImageAsset | null>(null);

  const { RiveComponent, canvas, rive } = useRive({
    src: '/rive/gm/gm_template.riv',
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
    onLoop: () => {
      if (interval.current) {
        clearInterval(interval.current);

        setRecording('done');
      }
    },
    artboard: 'GM2',
  });

  useEffect(() => {
    if (imageUrl && nftAsset && rive) {
      try {
        rive.setTextRunValue('NFT NAME', nftName);
        rive.setTextRunValue('PRICE 2', `${price} TODAY`);
        rive.setTextRunValue(
          'TIME 2',
          format(new Date(stickerCreatedDate), 'hh:mma MMMM do, yyyy')
        );
        rive.setTextRunValue('33RD 2', convertToOrdinal(stickerId));
        rive.setTextRunValue('CODE 2', `#${nftId}`);
        rive.setTextRunValue('NAME 2', ownerName || 'Unknown');
      } catch (error) {
        // remove it later
      }

      loadAndDecodeImg(imageUrl, {
        width: 1000,
        height: 1000,
      })
        .then((image) => {
          nftAsset.setRenderImage(image);
          rive.play();

          if (shouldRecord) {
            setTimeout(() => {
              setRecording('recording');
            }, 1000);
          }
          return image;
        })
        .catch((e) => {
          console.error(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, nftAsset?.name, rive]);

  const { interval, setRecording } = useRiveRecording({
    rive,
    shouldRecord,
    canvas,
  });

  return (
    <div className="relative overflow-hidden rounded-xl border-2">
      <RiveComponent width="100%" className="aspect-square" />

      {!nftAsset && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-white">
          <Spinner />
        </div>
      )}
    </div>
  );
};

GM2.displayName = 'GM2';
