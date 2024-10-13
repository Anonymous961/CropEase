"use client";

import { useState } from "react";
import ImageCropper from "@/components/ImageCropper";
import { Trash2Icon } from "lucide-react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

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

  return (
    <div className="h-screen w-full flex flex-col items-center">
      {selectedImage ? (
        <>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl">Selected Image</h1>
            <div className="relative inline-block">
              <Trash2Icon
                className="absolute  top-2 right-2  bg-transparent font-extrabold hover:bg-slate-200 hover:text-red-500 duration-100 ease-out rounded-sm"
                size={30}
                onClick={() => setSelectedImage(null)}
              />

              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-80 max-h-80"
              />
            </div>
          </div>
          <ImageCropper
            imageSrc={selectedImage}
            onCropComplete={handleCropComplete}
            dialogOpen={isDialogOpen}
            setDialogOpen={setDialogOpen}
          />
        </>
      ) : (
        <input type="file" onChange={handleImageChange} />
      )}

      {croppedImage && (
        <div className="max-w-80 max-h-80">
          <h2>Cropped Image:</h2>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
    </div>
  );
}
