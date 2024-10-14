"use client";
import CropEase from "@/public/images/CropEase.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();
  return (
    <div className="m-2 mx-4">
      <Image
        src={CropEase}
        height={80}
        alt=""
        className=""
        onClick={() => router.push("/")}
      />
    </div>
  );
}
