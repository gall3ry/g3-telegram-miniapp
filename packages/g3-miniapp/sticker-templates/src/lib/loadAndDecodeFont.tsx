'use client';
import { decodeFont, decodeImage } from '@rive-app/canvas';

export const loadAndDecodeImg = async (
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
export const loadAndDecodeFont = async (url: string) => {
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  return await decodeFont(new Uint8Array(data));
};
