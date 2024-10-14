import { clsx, type ClassValue } from "clsx"
import type { Area } from "react-easy-crop";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getCroppedImg = async (
  imageSrc: string,
  cropArea: Area,
  rotation: number
): Promise<string> => {
  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });
  };

  const getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180;
  };

  const getCroppedCanvas = (
    image: HTMLImageElement,
    crop: Area,
    rotation: number
  ) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return canvas;

    const radianAngle = getRadianAngle(rotation);

    const { width, height } = crop;

    // Calculate rotated image dimensions
    const rotatedWidth =
      Math.abs(Math.cos(radianAngle) * width) + Math.abs(Math.sin(radianAngle) * height);
    const rotatedHeight =
      Math.abs(Math.sin(radianAngle) * width) + Math.abs(Math.cos(radianAngle) * height);

    // Set canvas size to the new rotated dimensions
    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;

    // Move the origin to the center of the canvas (to properly rotate)
    ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
    ctx.rotate(radianAngle);

    // Move the image back to the top-left corner after rotation
    ctx.translate(-crop.width / 2, -crop.height / 2);

    // Draw the rotated and cropped image
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas;
  };

  try {
    const image = await createImage(imageSrc);
    const canvas = getCroppedCanvas(image, cropArea, rotation);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to crop image"));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/jpeg");
    });
  } catch (error) {
    return Promise.reject(error);
  }
};