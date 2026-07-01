"use client";

import {
  FLOWER_WIDTH_CLASS,
  FLOWERS,
  ROUTE_FLOWERS,
} from "@/constants/flowers";
import useAppPathname from "@/shared/hooks/pathname";
import FloralImage from "./floral-image";

export default function PageFloralDecor() {
  const pathname = useAppPathname();
  const flowerId = ROUTE_FLOWERS[pathname];

  if (!flowerId) return null;

  const flower = FLOWERS[flowerId];
  if (!flower) return null;

  if (flower.placement === "top") {
    return (
      <div className="fixed top-0 left-1/2 z-0 -translate-x-1/2 overflow-visible opacity-75">
        <FloralImage
          flower={flower}
          widthClass={FLOWER_WIDTH_CLASS}
          sizes="50vw"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center overflow-visible opacity-75">
      <FloralImage
        flower={flower}
        widthClass={FLOWER_WIDTH_CLASS}
        sizes="50vw"
        loading="lazy"
      />
    </div>
  );
}
