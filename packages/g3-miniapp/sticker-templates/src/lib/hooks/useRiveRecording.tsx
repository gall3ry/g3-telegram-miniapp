'use client';
import { useRive } from '@rive-app/react-canvas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getGifFromImages } from '../utils/getGifFromImages';

export const useRiveRecording = ({
  rive,
  shouldRecord = false,
  canvas,
}: {
  rive: ReturnType<typeof useRive>['rive'];
  shouldRecord?: boolean;
  canvas: HTMLCanvasElement | null;
}) => {
  const [images, setImages] = useState<string[]>([]);

  const interval = useRef<ReturnType<typeof setInterval>>();
  const [recording, setRecording] = useState<
    'idle' | 'recording' | 'done' | 'done_capturing_static_template'
  >('idle');

  // const isInitialPlaying =
  //   shouldRecord && recording === 'idle' && rive?.isPlaying;

  const dispatchEvent = useCallback((image: string) => {
    const event = new CustomEvent('gif', { detail: image });
    window.dispatchEvent(event);
  }, []);

  // useEffect(() => {
  //   if (isInitialPlaying) {
  //     setRecording('recording');

  //     interval.current = setInterval(() => {
  //       // we dont check canvas here for performance reasons
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //       setImages((prev) => [...prev, canvas!.toDataURL()]);
  //     }, 100);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isInitialPlaying]);

  const dispatchPngEvent = useCallback((image: string) => {
    const event = new CustomEvent('png', { detail: image });
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
          dispatchPngEvent(image);
          // void getGifFromImages(Array.from({ length: 20 }, () => image)).then(
          //   (image) => {
          //     // throw event
          //     dispatchEvent(image);

          //     return Promise.resolve();
          //   }
          // );
        }, 1000);
        break;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  useEffect(() => {
    // clear interval
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return {
    interval,
    setRecording,
  };
};
