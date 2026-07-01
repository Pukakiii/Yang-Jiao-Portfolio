import type { FlowerEntry } from "@/constants/flowers";
import Image from "next/image";

type FloralImageProps = {
  flower: FlowerEntry;
  widthClass: string;
  sizes?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  wrapperClassName?: string;
  imageClassName?: string;
};

export default function FloralImage({
  flower,
  widthClass,
  sizes = "50vw",
  priority,
  loading,
  wrapperClassName = "",
  imageClassName = "",
}: FloralImageProps) {
  return (
    <div
      className={
        "relative transform-gpu will-change-transform " +
        widthClass +
        " " +
        wrapperClassName
      }
      style={{
        aspectRatio: `${flower.nativeWidth} / ${flower.nativeHeight}`,
      }}
    >
      <Image
        src={`/images/flowers/${flower.file}`}
        alt=""
        fill
        sizes={sizes}
        className={
          "object-contain mix-blend-multiply " +
          imageClassName
        }
        priority={priority}
        loading={loading}
      />
    </div>
  );
}
