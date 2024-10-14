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
import { Slider } from "@/components/ui/slider";

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
  const [rotation, setRotation] = useState<number>(0);
  const [aspect, setAspect] = useState<aspectType>(1);
  const [round, setRound] = useState<boolean>(false);

  const handleRotation = (value: number[]) => {
    setRotation(value[0]);
  };

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
    const croppedImageUrl = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      rotation
    );
    onCropComplete(croppedImageUrl);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Crop Image</Button>
      </DialogTrigger>
      <DialogContent className="w-10/12">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Make changes to your image here. Click crop image when you&apos;re
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
            rotation={rotation}
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
        <div className="flex flex-col items-center space-y-2">
          <Label>Rotation</Label>
          <Slider
            value={[rotation]}
            max={360}
            onValueChange={handleRotation}
            step={1}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" onClick={() => setAspect(aspectType.square)}>
            Square 1:1
          </Button>
          <Button type="submit" onClick={() => setAspect(aspectType.portrait)}>
            Portrait 4:3
          </Button>
          <Button type="submit" onClick={() => setAspect(aspectType.thumbnail)}>
            Thumbnail 16:9
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
  );
};

export default ImageCropper;
