'use client';
import { decodeFont, decodeImage } from '@rive-app/canvas';
import { LRUCache } from 'lru-cache';

const imageCache = new LRUCache<
  string,
  Awaited<ReturnType<typeof decodeImage>>
>({
  max: 100, // cache size limit
  ttl: 1000 * 60 * 30, // cache items expire after 30 minutes
});

export const loadAndDecodeImg = async (
  url: string,
  size?: {
    width: number;
    height: number;
  }
) => {
  // Check if the result is already cached
  const cachedResult = imageCache.get(JSON.stringify({ url, size }));
  if (cachedResult) {
    return cachedResult;
  }

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

  const result = await decodeImage(new Uint8Array(arrBuffer));

  imageCache.set(JSON.stringify({ url, size }), result);

  return result;
};

export const loadAndDecodeFont = async (url: string) => {
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  return await decodeFont(new Uint8Array(data));
};
