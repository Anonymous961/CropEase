import { clsx, type ClassValue } from "clsx"
import type { Area } from "react-easy-crop";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getCroppedImg = (imageSrc: string, cropArea: Area): Promise<string> => {
  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });
  };

  const getCroppedCanvas = (image: HTMLImageElement, crop: Area) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { width, height } = crop;

    canvas.width = width;
    canvas.height = height;

    if (ctx) {

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        width,
        height
      );
    }

    return canvas;
  };

  // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
  return new Promise(async (resolve, reject) => {
    const image = await createImage(imageSrc);
    const canvas = getCroppedCanvas(image, cropArea);
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to crop image"));
        return;
      }
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, "image/jpeg");
  });
};
