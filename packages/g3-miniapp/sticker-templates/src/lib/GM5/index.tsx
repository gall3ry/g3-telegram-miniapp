'use client';
import { Spinner } from '@radix-ui/themes';
import { type ImageAsset } from '@rive-app/canvas';
import { useRive } from '@rive-app/react-canvas';
import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { loadAndDecodeImg } from '../loadAndDecodeFont';
import { getGifFromImages } from '../utils/getGifFromImages';

type GM5Props = {
  shouldRecord?: boolean;
  imageUrl: string;
};

export const GM5 = memo((props: GM5Props) => {
  return (
    <Suspense>
      <GM5Inner {...props} />
    </Suspense>
  );
});

const GM5Inner = ({ imageUrl, shouldRecord }: Parameters<typeof GM5>[0]) => {
  const [images, setImages] = useState<string[]>([]);
  const interval = useRef<ReturnType<typeof setInterval>>();
  const [recording, setRecording] = useState<
    'idle' | 'recording' | 'done' | 'done_capturing_static_template'
  >('idle');
  const [nftAsset, setNftAsset] = useState<ImageAsset | null>(null);
  const { RiveComponent, canvas, rive } = useRive({
    src: '/rive/gm5/untitled.riv',
    autoplay: true,
    assetLoader: (_asset, bytes) => {
      const asset = _asset;
      console.log(asset.name, imageUrl);

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
        // case _asset.isFont: {
        //   const asset = _asset as FontAsset;

        //   // Bebas Neue-593220.ttf
        //   if (asset.name === 'Bebas Neue') {
        //     loadAndDecodeFont('/rive/gm5/Bebas Neue-593220.ttf')
        //       .then((font) => {
        //         asset.setFont(font);
        //       })
        //       .catch((e) => {
        //         console.error(e);
        //       });

        //     return true;
        //   }
        //   break;
        // }
      }

      return false;
    },
    onLoop: () => {
      if (interval.current) {
        clearInterval(interval.current);

        setRecording('done');
      }
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

GM5.displayName = 'GM5';
