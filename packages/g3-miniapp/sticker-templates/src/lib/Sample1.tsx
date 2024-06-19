'use client';
import { Spinner } from '@radix-ui/themes';
import {
  decodeFont,
  decodeImage,
  type FontAsset,
  type ImageAsset,
} from '@rive-app/canvas';
import { useRive } from '@rive-app/react-canvas';
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getGifFromImages } from './utils/getGifFromImages';

const loadAndDecodeImg = async (
  url: string,
  size?: {
    width: number;
    height: number;
  }
) => {
  const res = await fetch(url);

  const data = await res.arrayBuffer();

  // resize
  const { width, height } = size ?? { width: 1000, height: 1000 };
  // convert Uint8Array to ImageBitmap
  const image = await createImageBitmap(new Blob([new Uint8Array(data)]));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(image, 0, 0, width, height);

  const arrBuffer = await new Promise<ArrayBuffer>((resolve) => {
    canvas.toBlob((blob) => {
      void blob?.arrayBuffer().then((arrBuffer) => {
        resolve(arrBuffer);
      });
    });
  });

  return await decodeImage(new Uint8Array(arrBuffer));
};
const loadAndDecodeFont = async (url: string) => {
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  return await decodeFont(new Uint8Array(data));
};

type Sample1Props = {
  shouldRecord?: boolean;
  imageUrl: string;
  stickerTitle: string;
};

export const Sample1 = memo(
  ({ shouldRecord = false, imageUrl, stickerTitle }: Sample1Props) => {
    return (
      <Suspense fallback={<></>}>
        <Sample1Inner {...{ shouldRecord, imageUrl, stickerTitle }} />
      </Suspense>
    );
  }
);

const Sample1Inner = ({
  imageUrl,
  stickerTitle,
  shouldRecord,
}: Parameters<typeof Sample1>[0]) => {
  const [images, setImages] = useState<string[]>([]);
  const interval = useRef<ReturnType<typeof setInterval>>();
  const [recording, setRecording] = useState<
    'idle' | 'recording' | 'done' | 'done_capturing_static_template'
  >('idle');
  const [nftAsset, setNftAsset] = useState<ImageAsset | null>(null);

  const { RiveComponent, canvas, rive } = useRive({
    src: '/rive/sample1/untitled.riv',
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

          if (asset.name === 'NFT') {
            setNftAsset(asset);

            return true;
          }

          break;
        }
        case _asset.isFont: {
          const asset = _asset as FontAsset;

          // Bebas Neue-593220.ttf
          if (asset.name === 'Bebas Neue') {
            loadAndDecodeFont('/rive/sample1/Bebas Neue-593220.ttf')
              .then((font) => {
                asset.setFont(font);
              })
              .catch((e) => {
                console.error(e);
              });

            return true;
          }
          break;
        }
      }

      return false;
    },

    onLoop: () => {
      if (interval.current) {
        clearInterval(interval.current);

        setRecording('done');
      }
    },
    onLoad: () => {
      // Prevent a blurry canvas by using the device pixel ratio
      rive?.resizeDrawingSurfaceToCanvas();
    },
  });

  const isInitialPlaying =
    recording === 'idle' && rive?.isPlaying && shouldRecord;

  useEffect(() => {
    if (isInitialPlaying) {
      setRecording('recording');

      interval.current = setInterval(() => {
        // we dont check canvas here for performance reasons
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setImages((prev) => [...prev, canvas!.toDataURL()]);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialPlaying]);

  useEffect(() => {
    // clear interval

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  const dispatchEvent = useCallback((image: string) => {
    const event = new CustomEvent('gif', { detail: image });
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    switch (recording) {
      case 'recording': {
        if (rive?.playingStateMachineNames.length === 0) {
          setRecording('done_capturing_static_template');
        }
        break;
      }
      case 'done': {
        void getGifFromImages(images).then((image) => {
          // throw event
          dispatchEvent(image);
          return Promise.resolve();
        });
        break;
      }
      case 'done_capturing_static_template': {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const image = canvas!.toDataURL();

          void getGifFromImages(Array.from({ length: 20 }, () => image)).then(
            (image) => {
              // throw event
              dispatchEvent(image);

              return Promise.resolve();
            }
          );
        }, 1000);
        break;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  useEffect(() => {
    if (imageUrl && nftAsset && rive) {
      rive.setTextRunValue('STICKER_TITLE', stickerTitle);

      loadAndDecodeImg(imageUrl, {
        width: 1000,
        height: 1000,
      })
        .then((image) => {
          nftAsset.setRenderImage(image);
          rive.play();
        })
        .catch((e) => {
          console.error(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, nftAsset?.name, rive]);

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

Sample1.displayName = 'Sample1';
