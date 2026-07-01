"use client";

import {
  DEFAULT_PAGE_BACKGROUND,
  DEFAULT_PINK_PAGE_BACKGROUND,
  FLOWERS,
  ROUTE_FLOWERS,
} from "@/constants/flowers";
import useAppPathname from "@/shared/hooks/pathname";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function PageFloralBackground() {
  const pathname = useAppPathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const flowerId = ROUTE_FLOWERS[pathname];
  const flower = flowerId ? FLOWERS[flowerId] : null;

  const background =
    mounted && resolvedTheme === "pink"
      ? flower?.pageBackground ?? DEFAULT_PINK_PAGE_BACKGROUND
      : DEFAULT_PAGE_BACKGROUND;

  return (
    <div
      className="fixed inset-0 transition-colors duration-500 ease-out"
      style={{ backgroundColor: background }}
      aria-hidden="true"
    />
  );
}
