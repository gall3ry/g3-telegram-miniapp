"use client";
import { Button } from "@radix-ui/themes";
import { Alignment, decodeImage, Fit, Layout } from "@rive-app/canvas";
import { useRive } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getGifFromImages } from "./getGifFromImages";

export const TestOccTemplate = ({
  shouldRecord = false,
}: {
  shouldRecord?: boolean;
}) => {
  const [images, setImages] = useState<string[]>([]);
  const interval = useRef<ReturnType<typeof setInterval>>();
  const setRenderImage = useRef<(imgUrl: string) => void>();
  const [recording, setRecording] = useState<"idle" | "recording" | "done">(
    "idle",
  );

  const { RiveComponent, canvas, rive } = useRive({
    src: "/rive/test/robobutton_bar.riv",
    animations: "idle",
    stateMachines: "idle",
    artboard: "mainboard",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    assetLoader: (asset) => {
      if (asset.isImage) {
        if (asset.name === "ghost") {
          void fetch("/rive/test/ghost-1579267.png")
            .then((res) => res.arrayBuffer())
            .then(async (buffer) => {
              //decode image
              const image = await decodeImage(new Uint8Array(buffer));

              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              setRenderImage.current = async (imgUrl: string) => {
                //set image to asset

                return toast.promise(
                  fetch(imgUrl)
                    .then((res) => res.arrayBuffer())
                    .then(async (buffer) => {
                      const image = await decodeImage(new Uint8Array(buffer));

                      return (asset as any).setRenderImage(image);
                    }),
                  {
                    loading: "Loading image",
                    success: "Image loaded",
                    error: "Failed to load image",
                  },
                );
              };

              //set image to asset
              return (asset as any).setRenderImage(image);
            });

          return true;
        }
        if (asset.name === "Su") {
          return false;
        }
      }

      return true;
    },
    onLoop: () => {
      if (interval.current) {
        clearInterval(interval.current);

        setRecording("done");
      }
    },
  });

  const isInitialPlaying =
    recording === "idle" && rive?.isPlaying && shouldRecord;

  useEffect(() => {
    if (isInitialPlaying) {
      setRecording("recording");

      interval.current = setInterval(() => {
        // we dont check canvas here for performance reasons
        setImages((prev) => [...prev, canvas!.toDataURL()]);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialPlaying]);

  useEffect(() => {
    if (recording === "done") {
      void getGifFromImages(images).then((image) => {
        // throw event
        const event = new CustomEvent("gif", { detail: image });
        window.dispatchEvent(event);

        return Promise.resolve();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  return (
    <div className="relative overflow-hidden rounded-xl border-2">
      <RiveComponent width="100%" className="aspect-square" />

      <div className="absolute bottom-2 right-2">
        <Button
          onClick={() => {
            if (setRenderImage.current) {
              // picsum
              setRenderImage.current(
                `https://picsum.photos/1400/1400?random=${Math.random()}`,
              );
            }
          }}
        >
          Click
        </Button>
      </div>
    </div>
  );
};
