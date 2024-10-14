"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function CustomButtom({
  label,
  path = "/",
}: {
  label: string;
  path?: string;
}) {
  const router = useRouter();
  return (
    <Button
      variant={"secondary"}
      className="bg-indigo-600 text-white hover:text-black"
      onClick={() => router.push(path)}
    >
      {" "}
      {label}
    </Button>
  );
}
