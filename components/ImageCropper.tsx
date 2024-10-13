"use client";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

enum aspectType {
  square = 1,
  thumbnail = 16 / 9,
  portrait = 3 / 4,
}

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  dialogOpen,
  setDialogOpen,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspect, setAspect] = useState<aspectType>(1);
  const [round, setRound] = useState<boolean>(false);

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onCrop = async () => {
    if (!croppedAreaPixels) {
      console.error("No cropped area seleted");
      return;
    }
    const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImageUrl);
    setDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Crop Image</Button>
        </DialogTrigger>
        <DialogContent className="w-10/12">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex relative w-full h-72">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              cropShape={round ? "round" : "rect"}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteHandler}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="round"
              checked={round}
              onCheckedChange={() => setRound(!round)}
            />
            <Label htmlFor="round">Round</Label>
          </div>
          <div className="flex gap-4">
            <Button type="submit" onClick={() => setAspect(aspectType.square)}>
              Square
            </Button>
            <Button
              type="submit"
              onClick={() => setAspect(aspectType.portrait)}
            >
              Portrait
            </Button>
            <Button
              type="submit"
              onClick={() => setAspect(aspectType.thumbnail)}
            >
              Thumbnail
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="reset"
              variant={"link"}
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={onCrop}>
              Crop Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageCropper;
