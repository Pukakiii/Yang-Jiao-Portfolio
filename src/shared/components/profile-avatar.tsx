import { author } from "@/constants/strings";
import Image from "next/image";

const imageBySize = {
  sm: { src: "/me/avatar.png", width: 40, height: 50, size: 256 },
  md: { src: "/me/smile-square.png", width: 150, height: 150, size: 512 },
  lg: { src: "/me/smile-square.png", width: 160, height: 160, size: 512 },
};

export default function ProfileAvatar({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const img = imageBySize[size];

  return (
    <Image
      src={img.src}
      alt={author}
      width={img.size}
      height={img.size}
      className={
        "rounded-full object-cover bg-teal-100/40 dark:bg-slate-500/20 shrink-0 " +
        className
      }
      style={{ width: img.width, height: img.height }}
    />
  );
}
