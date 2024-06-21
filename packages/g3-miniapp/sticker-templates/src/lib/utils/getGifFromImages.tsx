'use client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import gifshot from 'gifshot';

export const getGifFromImages = (images: string[]) => {
  if (images.length === 0) {
    throw new Error('images is empty');
  }

  if (!gifshot.isSupported()) {
    throw new Error('gifshot is not supported');
  }
  console.log('Start gifshot');
  return new Promise<string>((resolve, reject) => {
    gifshot.createGIF(
      {
        images,
        gifWidth: 800,
        gifHeight: 800,
        numFrames: 20, // 2s
        frameDuration: 1,
        sampleInterval: 2,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function (obj: any) {
        if (!obj.error) {
          const image = obj.image;
          resolve(image as string);
        }

        reject(obj.error as Error);
      }
    );
  });
};
