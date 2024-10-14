import CustomButtom from "@/components/CustomButtom";
import cropimage from "@/public/images/image.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" h-full w-full  ">
      <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2">
        <div className=" flex flex-col justify-center items-center p-20">
          <h1 className="text-xm text-gray-100">
            An intuitive and user-friendly image cropping tool that allows you
            to effortlessly adjust, rotate, and crop your photos to perfection.
            Whether for social media, design projects, or personal use, get the
            perfect cut every time in just a few clicks.
          </h1>
          <br />
          <p className="font-bold text-xm">
            Perfectly Crop Your Images – Fast and User-Friendly.
          </p>
          <div className="w-full">
            <CustomButtom label="Get Started" path={"/cropimage"} />
          </div>
        </div>
        <div className=" flex items-center justify-center  p-4">
          <div className="bg-blue-900 p-4 rounded-3xl">
            <Image src={cropimage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
