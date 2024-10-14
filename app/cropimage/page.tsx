"use client";

import { useRef, useState } from "react";
import ImageCropper from "@/components/ImageCropper";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Cropimage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl);
  };

  const downloadCroppedImage = () => {
    if (croppedImage) {
      const link = document.createElement("a");
      link.href = croppedImage;
      link.download = "cropped_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center p-8">
      <div className="bg-white w-3/4 rounded-xl grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 min-h-96">
        <div>
          {selectedImage ? (
            <div className="flex flex-col justify-center items-center h-full">
              <div className="">
                <h1 className="text-3xl">Selected Image</h1>
                <div className="relative inline-block">
                  <Trash2Icon
                    className="absolute  top-2 right-2  bg-transparent font-extrabold hover:bg-slate-200 hover:text-red-500 duration-100 ease-out rounded-sm"
                    size={30}
                    onClick={() => setSelectedImage(null)}
                  />

                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={320}
                    height={320}
                    className=""
                  />
                </div>
              </div>
              <ImageCropper
                imageSrc={selectedImage}
                onCropComplete={handleCropComplete}
                dialogOpen={isDialogOpen}
                setDialogOpen={setDialogOpen}
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <Label> Select an image from your local directory</Label>
              <br />
              <Button onClick={triggerFileInput}>Select Image</Button>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          {croppedImage && (
            <div className="flex flex-col justify-center">
              <h2>Cropped Image:</h2>
              <Image
                src={croppedImage}
                alt="Cropped"
                width={320}
                height={320}
                className=""
              />
              <Button onClick={downloadCroppedImage}>Download</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
