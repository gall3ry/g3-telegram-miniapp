import { createCanvas, Image } from "canvas";
import GIFEncoder from "gifencoder";

const width = 1278;
const height = 1278;
export function getGif(images: string[]) {
  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(Math.ceil(images.length / 2000)); // frame delay in ms (2000 / 60 = 33.33ms)
  encoder.setQuality(10); // image quality. 10 is highest and default.
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  images.forEach((url) => {
    const image = new Image();
    image.src = url;
    ctx.fillStyle = "##ff9505"; // fill with black before drawing image
    ctx.fillRect(0, 0, width, height); // fill the entire canvas
    ctx.drawImage(image, 0, 0, width, height);

    encoder.addFrame(ctx);
  });
  encoder.finish();
  const data = encoder.out.getData();
  return `data:image/gif;base64,${data.toString("base64")}`;
}
